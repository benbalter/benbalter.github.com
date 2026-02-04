#define args_t <%=func_name%>_args_t
#define func_p <%=func_name%>_p

typedef struct {
    int order;
    char jobz, uplo;
} args_t;

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t * const lp)
{
    dtype *a;
    rtype *w;
    int   *info;
    int    n, lda;
    args_t *g;

    a = (dtype*)NDL_PTR(lp,0);
    w = (rtype*)NDL_PTR(lp,1);
    info = (int*)NDL_PTR(lp,2);
    g = (args_t*)(lp->opt_ptr);

    n = NDL_SHAPE(lp,0)[1];
    lda = NDL_STEP(lp,0) / sizeof(dtype);

    //printf("order=%d jobz=%c uplo=%c n=%d lda=%d\n",g->order,g->jobz,g->uplo,n,lda);

    *info = (*func_p)( g->order, g->jobz, g->uplo, n, a, lda, w );
    CHECK_ERROR(*info);
}

/*<%
 params = [
   mat("a",:inplace),
   jobe("jobz"),
   opt("uplo"),
   opt("order"),
 ].select{|x| x}.join("\n  ")
 return_name = "a, w, info"
%>
  @overload <%=name%>(a, [jobz:'V', uplo:'U', order:'R'])
  <%=params%>
  @return [[<%=return_name%>]]  Array<<%=real_class_name%>,<%=real_class_name%>,Integer>
<%=outparam(return_name)%>

<%=description%>

*/
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
    VALUE a, ans;
    int   m, n;
    narray_t *na1;
    size_t shape[1];
    ndfunc_arg_in_t ain[1] = {{OVERWRITE,2}};
    ndfunc_arg_out_t aout[2] = {{cRT,1,shape},{cInt,0}};
    ndfunc_t ndf = {&<%=c_iter%>, NO_LOOP|NDF_EXTRACT, 1, 2, ain, aout};

    args_t g = {0,0,0};
    VALUE opts[3] = {Qundef,Qundef,Qundef};
    VALUE kw_hash = Qnil;
    ID kw_table[3] = {id_order,id_jobz,id_uplo};

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "1:", &a, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 3, opts);
    g.order = option_order(opts[0]);
    g.jobz = option_job(opts[1],'V','N');
    g.uplo = option_uplo(opts[2]);

    COPY_OR_CAST_TO(a,cT);
    GetNArray(a, na1);
    CHECK_DIM_GE(na1, 2);
    m = ROW_SIZE(na1);
    n = COL_SIZE(na1);
    if (m != n) {
        rb_raise(nary_eShapeError,"matrix must be square");
    }
    shape[0] = n;

    ans = na_ndloop3(&ndf, &g, 1, a);

    return rb_ary_new3(3, a, RARRAY_AREF(ans,0), RARRAY_AREF(ans,1));
}

#undef args_t
#undef func_p
