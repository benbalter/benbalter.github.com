/*<%
  is_ge = (/^.ge/ =~ name)
  is_tr = (/^.tr/ =~ name)
%>*/
<% %>
#define GE <%= is_ge ? "1":"0" %>
#define TR <%= is_tr ? "1":"0" %>
#define args_t <%=name%>_args_t

typedef struct {
  enum CBLAS_ORDER order;
  enum CBLAS_TRANSPOSE trans;
  enum CBLAS_UPLO uplo;
  enum CBLAS_DIAG diag;
  dtype alpha, beta;
  blasint m, n;
} args_t;

#define func_p <%=func_name%>_p

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t *const lp)
{
    dtype *a;
    char *p1;
    ssize_t s1;
#if !TR
    char *p2;
    ssize_t s2;
#endif
#if !GE
    int n;
#endif
    int lda;
    args_t *g;

    a = (dtype*)NDL_PTR(lp,0);
    INIT_PTR(lp,1,p1,s1);
#if !TR
    INIT_PTR(lp,2,p2,s2);
#endif
    g = (args_t*)(lp->opt_ptr);

#if !GE
    n = NDL_SHAPE(lp,0)[1];
#endif
    lda = NDL_STEP(lp,0) / sizeof(dtype);

#if GE
    (*func_p)( g->order, g->trans, g->m, g->n,
        DP(g->alpha), a, lda, (dtype*)p1, s1/sizeof(dtype),
        DP(g->beta), (dtype*)p2, s2/sizeof(dtype) );
#elif TR
    (*func_p)( g->order, g->uplo, g->trans, g->diag, n, a, lda,
        (dtype*)p1, s1/sizeof(dtype) );
#else // SY,HE
    (*func_p)( g->order, g->uplo, n,
        DP(g->alpha), a, lda, (dtype*)p1, s1/sizeof(dtype),
        DP(g->beta), (dtype*)p2, s2/sizeof(dtype) );
#endif
}

/*<%
 args_v =
   if is_ge
    "a, x, [y, alpha:1, beta:0, trans:'N'"
   elsif is_tr
    "a, x, [uplo:'U', trans:'N', diag:'U'"
   else
    "a, x, [y, alpha:1, beta:0, uplo:'U'"
   end + ", order:'R']"
 params = [
   mat("a"),
   vec("x"),
   !is_tr && vec("y","optional",:inplace),
   opt("alpha"),
   opt("beta"),
   !is_ge && opt("side"),
   !is_ge && opt("uplo"),
   (is_ge || is_tr) && opt("trans"),
   opt("order")
 ].select{|x| x}.join("\n  ")
%>
  @overload <%=name%>(<%=args_v%>)
  <%=params%>
  @return [<%=class_name%>] returns y = alpha*op(A)\*x + beta\*y.

<%=description%>

*/
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
    VALUE     a, x, y=Qnil, alpha, beta;
    narray_t *na1, *na2;
    blasint   ma, na, nx;
#if GE
    blasint   tmp;
#endif
    size_t    shape[1];
    ndfunc_arg_in_t ain[4] = {{cT,2},{cT,1},{OVERWRITE,1},{sym_init,0}};
    ndfunc_arg_out_t aout[1] = {{cT,1,shape}};
    ndfunc_t ndf = {<%=c_iter%>, NO_LOOP, 3, 0, ain, aout};

    args_t g;
    VALUE kw_hash = Qnil;
#if GE
    ID kw_table[4] = {id_alpha,id_beta,id_order,id_trans};
#elif TR
    ID kw_table[6] = {id_alpha,id_beta,id_order,id_uplo,id_trans,id_diag};
#else
    ID kw_table[4] = {id_alpha,id_beta,id_order,id_uplo};
#endif
    VALUE opts[6] = {Qundef,Qundef,Qundef,Qundef,Qundef,Qundef};

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "21:", &a, &x, &y, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 4+2*TR, opts);
    alpha   = option_value(opts[0],Qnil);
    g.alpha = RTEST(alpha) ? m_num_to_data(alpha) : m_one;
    beta    = option_value(opts[1],Qnil);
    g.beta  = RTEST(beta)  ? m_num_to_data(beta)  : m_zero;
    g.order = option_order(opts[2]);
#if GE
    g.trans = option_trans(opts[3]);
#else
    g.uplo  = option_uplo(opts[3]);
#endif
#if TR
    g.trans = option_trans(opts[4]);
    g.diag  = option_diag(opts[5]);
#endif

    GetNArray(a,na1);
    CHECK_DIM_GE(na1,2);
    ma = ROW_SIZE(na1);
    na = COL_SIZE(na1);

    GetNArray(x,na2);
    CHECK_DIM_GE(na2,1);
    nx = COL_SIZE(na2);
#if GE
    SWAP_IFCOL(g.order, ma, na, tmp);
    g.m = ma;
    g.n = na;
    SWAP_IFTRANS(g.trans, ma, na, tmp);
#else
    CHECK_SQUARE("a",na1);
#endif
    CHECK_INT_EQ("na",na,"nx",nx);
    shape[0] = ma;

#if TR
    if (y != Qnil) {
        rb_raise(rb_eArgError,"wrong number of arguments (3 for 2)");
    }
    COPY_OR_CAST_TO(x,cT);
    ndf.nin = 2;
    na_ndloop3(&ndf, &g, 2, a, x);
    return x;

#else // GE,SY,HE

    if (y == Qnil) { // c is not given.
        ndf.nout = 1;
        ain[2] = ain[3];
        y = INT2FIX(0);
        shape[0] = ma;
    } else {
        narray_t *na3;
        COPY_OR_CAST_TO(y,cT);
        GetNArray(y,na3);
        CHECK_DIM_GE(na3,1);
        CHECK_SIZE_GE(na3,nx);
    }
    {
        VALUE ans;
        ans = na_ndloop3(&ndf, &g, 3, a, x, y);

        if (ndf.nout == 1) { // c is not given.
            return ans;
        } else {
            return y;
        }
    }
#endif
}

#undef func_p
#undef args_t
#undef GE
#undef TR
