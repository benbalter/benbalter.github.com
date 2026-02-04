#define args_t <%=name%>_args_t

typedef struct {
    enum CBLAS_ORDER order;
    dtype alpha;
    blasint m, n;
} args_t;

#define func_p <%=func_name%>_p

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t *const lp)
{
    dtype *a;
    char *p1, *p2;
    ssize_t s1, s2;
    args_t *g;
    int lda;

    INIT_PTR(lp,0,p1,s1);
    INIT_PTR(lp,1,p2,s2);
    a = (dtype*)NDL_PTR(lp,2);
    g = (args_t*)(lp->opt_ptr);

    lda = NDL_STEP(lp,2) / sizeof(dtype);

    (*func_p)(g->order, g->m, g->n,
              DP(g->alpha), (dtype*)p1, s1/sizeof(dtype),
              (dtype*)p2, s2/sizeof(dtype), a, lda);
}

/*<%
 params = [
   vec("x"),
   vec("y"),
   mat("a","m-by-n symmetric matrix","optional",:inplace),
   opt("alpha"),
   opt("order"),
 ].select{|x| x}.join("\n  ")
%>
  @overload <%=name%>( x, y, [a, alpha:1, order:'R'] )
  <%=params%>
  @return [<%=class_name%>] returns a.

  <%=description%>

 */
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
    VALUE     ans;
    VALUE     x, y, a=Qnil, alpha;
    narray_t *na1, *na2;
    blasint   mx, ny, tmp;
    size_t    shape[2];
    ndfunc_arg_in_t ain[4] = {{cT,1},{cT,1},{OVERWRITE,2},{sym_init,0}};
    ndfunc_arg_out_t aout[1] = {{cT,2,shape}};
    ndfunc_t ndf = {<%=c_iter%>, NO_LOOP, 3, 0, ain, aout};

    args_t g;
    VALUE kw_hash = Qnil;
    ID kw_table[2] = {id_alpha,id_order};
    VALUE opts[2] = {Qundef};

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "21:", &x, &y, &a, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 2, opts);
    alpha   = option_value(opts[0],Qnil);
    g.alpha = RTEST(alpha) ? m_num_to_data(alpha) : m_one;
    g.order = option_order(opts[1]);

    GetNArray(x,na1);
    GetNArray(y,na2);
    CHECK_DIM_GE(na1,1);
    CHECK_DIM_GE(na2,1);
    mx = COL_SIZE(na1); // m
    ny = COL_SIZE(na2); // n
    g.m = mx;
    g.n = ny;

    SWAP_IFCOL(g.order, mx,ny, tmp);

    if (a == Qnil) { // c is not given.
        ndf.nout = 1;
        ain[2] = ain[3];
        a = INT2FIX(0);
        shape[0] = mx;
        shape[1] = ny;
    } else {
        narray_t  *na3;
        blasint    ma, na;
        COPY_OR_CAST_TO(a,cT);
        GetNArray(a,na3);
        CHECK_DIM_GE(na3,2);
        ma = ROW_SIZE(na3); // m
        na = COL_SIZE(na3); // n (lda)
        CHECK_SIZE_EQ(ma,mx);
        CHECK_SIZE_EQ(na,ny);
    }

    ans = na_ndloop3(&ndf, &g, 3, x, y, a);

    if (ndf.nout = 1) { // a is not given.
        return ans;
    } else {
        return a;
    }
}

#undef func_p
#undef args_t
