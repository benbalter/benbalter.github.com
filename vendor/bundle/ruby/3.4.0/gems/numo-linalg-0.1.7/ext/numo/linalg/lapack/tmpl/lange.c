#define args_t <%=func_name%>_args_t
#define func_p <%=func_name%>_p

typedef struct {
    int   order;
    char  norm;
} args_t;

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t * const lp)
{
    dtype *a;
    rtype *norm;
    int    m, n, lda, tmp;
    args_t *g;

    a = (dtype*)NDL_PTR(lp,0);
    norm = (rtype*)NDL_PTR(lp,1);
    g = (args_t*)(lp->opt_ptr);

    m = NDL_SHAPE(lp,0)[0];
    n = NDL_SHAPE(lp,0)[1];
    SWAP_IFCOL(g->order,m,n);
    lda = NDL_STEP(lp,0) / sizeof(dtype);

    //printf("order=%d norm=%c m=%d n=%d lda=%d\n",g->order,g->norm,m,n,lda);

    *norm = (*func_p)(g->order, g->norm, m, n, a, lda);
}

/*<%
 params = [
   mat("a"),
   "@param [String]  norm  Kind of norm: 'M',('1','O'),'I',('F','E')",
   opt("order"),
 ].select{|x| x}.join("\n  ")
%>
  @overload <%=name%>(a, norm, [order:'R'])
  <%=params%>
  @return [<%=real_class_name%>] returns <%=name%>.

<%=description%>

*/
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
    VALUE a, norm, ans;
    narray_t *na1;
    ndfunc_arg_in_t ain[1] = {{cT,2}};
    ndfunc_arg_out_t aout[1] = {{cRT,0}};
    ndfunc_t ndf = {&<%=c_iter%>, NO_LOOP|NDF_EXTRACT, 1, 1, ain, aout};

    args_t g;
    VALUE opts[1] = {Qundef};
    ID kw_table[1] = {id_order};
    VALUE kw_hash = Qnil;

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "2:", &a, &norm, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 1, opts);
    g.order = option_order(opts[0]);
    g.norm  = option_job(norm,'F','F');
    //reduce = nary_reduce_options(Qnil, &opts[1], 1, &a, &ndf);
    //A is DOUBLE PRECISION array, dimension (LDA,N)
    //On entry, the M-by-N matrix A.
    //COPY_OR_CAST_TO(a,cT); // not overwrite
    GetNArray(a, na1);
    CHECK_DIM_GE(na1, 2);

    ans = na_ndloop3(&ndf, &g, 1, a);
    return ans;
}

#undef func_p
#undef args_t
