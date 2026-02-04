/*<%
  is_ge = (/^.ge/ =~ name)
  is_tr = (/^.tr/ =~ name)
  is_tr = (/^.tr/ =~ name)
%>*/
<% %>
#define GE <%= is_ge ? "1":"0" %>
#define TR <%= is_tr ? "1":"0" %>
#define args_t <%=name%>_args_t

typedef struct {
  enum CBLAS_ORDER order;
  enum CBLAS_TRANSPOSE transa, transb;
  enum CBLAS_SIDE side;
  enum CBLAS_UPLO uplo;
  enum CBLAS_DIAG diag;
  dtype alpha, beta;
  blasint m, n, k;
} args_t;

#define func_p <%=func_name%>_p

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t *const lp)
{
    dtype *a, *b;
    int    lda, ldb;
#if !TR
    dtype *c;
    int    ldc;
#endif
    args_t *g;

    a = (dtype*)NDL_PTR(lp,0);
    b = (dtype*)NDL_PTR(lp,1);
#if !TR
    c = (dtype*)NDL_PTR(lp,2);
#endif
    g = (args_t*)(lp->opt_ptr);

    lda = NDL_STEP(lp,0) / sizeof(dtype);
    ldb = NDL_STEP(lp,1) / sizeof(dtype);
#if !TR
    ldc = NDL_STEP(lp,2) / sizeof(dtype);
#endif

    //printf("m=%d n=%d k=%d\n",g->m,g->n,g->k);

#if GE
    (*func_p)( g->order, g->transa, g->transb, g->m, g->n, g->k,
              DP(g->alpha), a, lda, b, ldb, DP(g->beta), c, ldc);
#elif TR
    (*func_p)( g->order, g->side, g->uplo, g->transa, g->diag, g->m, g->n,
               DP(g->alpha), a, lda, b, ldb);
#else // SY,HE
    (*func_p)( g->order, g->side, g->uplo, g->m, g->n,
               DP(g->alpha), a, lda, b, ldb, DP(g->beta), c, ldc);
#endif
}

/*
<%
 args_v =
  if is_ge
   "a, b, [c, alpha:1, beta:0, transa:'N', transb:'N'"
  elsif is_tr
   "a, b, [alpha:1, side:'L', uplo:'U', transa:'N', diag:'U'"
  else
   "a, b, [c, alpha:1, beta:0, side:'L', uplo:'U'"
  end + ", order:'R']"

 params = [
   mat("a"),
   mat("b"),
   !is_tr && mat("c","optional",:inplace),
   opt("alpha"),
   opt("beta"),
   !is_ge && opt("side"),
   !is_ge && opt("uplo"),
   (is_ge || is_tr) && opt("transa"),
   is_ge            && opt("transb"),
   opt("order")
 ].select{|x| x}.join("\n  ")
%>
  @overload <%=name%>(<%=args_v%>)
  <%=params%>
  @return [<%=class_name%>] returns c = alpha\*op( A )\*op( B ) + beta\*C.
<%=description%>

*/
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
    VALUE     a, b, c=Qnil, alpha, beta;
    narray_t *na1, *na2;
    blasint   ma, ka, kb, nb, tmp;
    size_t    shape[2];
    ndfunc_arg_in_t ain[3] = {{cT,2},{cT,2},{OVERWRITE,2}};
    ndfunc_arg_out_t aout[1] = {{cT,2,shape}};
    ndfunc_t ndf = {<%=c_iter%>, NO_LOOP, 3, 0, ain, aout};

    args_t g;
    VALUE kw_hash = Qnil;
#if GE
    ID kw_table[5] = {id_alpha,id_beta,id_order,id_transa,id_transb};
#elif TR
    ID kw_table[7] = {id_alpha,id_beta,id_order,id_side,id_uplo,id_transa,id_diag};
#else
    ID kw_table[5] = {id_alpha,id_beta,id_order,id_side,id_uplo};
#endif
    VALUE opts[7] = {Qundef,Qundef,Qundef,Qundef,Qundef,Qundef,Qundef};

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "21:", &a, &b, &c, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 5+TR*2, opts);
    alpha    = option_value(opts[0],Qnil);
    g.alpha  = RTEST(alpha) ? m_num_to_data(alpha) : m_one;
    beta     = option_value(opts[1],Qnil);
    g.beta   = RTEST(beta)  ? m_num_to_data(beta)  : m_zero;
    g.order  = option_order(opts[2]);
#if GE
    g.transa = option_trans(opts[3]);
    g.transb = option_trans(opts[4]);
#else
    g.side   = option_side(opts[3]);
    g.uplo   = option_uplo(opts[4]);
#endif
#if TR
    g.transa = option_trans(opts[5]);
    g.diag   = option_diag(opts[6]);
#endif

    GetNArray(a,na1);
    GetNArray(b,na2);
    CHECK_DIM_GE(na1,2);
    CHECK_DIM_GE(na2,2);
    ma = ROW_SIZE(na1); // m
    ka = COL_SIZE(na1); // k (lda)
    kb = ROW_SIZE(na2); // k
    nb = COL_SIZE(na2); // n (ldb)

#if GE
    SWAP_IFCOLTR(g.order,g.transa, ma,ka, tmp);
    SWAP_IFCOLTR(g.order,g.transb, kb,nb, tmp);
    CHECK_INT_EQ("ka",ka,"kb",kb);
    g.m = ma;
    g.n = nb;
    g.k = ka;
#else
    CHECK_SQUARE("a",na1); // ma == ka
    SWAP_IFCOL(g.order, kb,nb, tmp);
    // row major             L    R
    //ma = ROW_SIZE(na1); // m or n
    //ka = COL_SIZE(na1); // m or n (lda)
    g.m = kb; // m
    g.n = nb; // n (ldb)
    if (g.side == CblasLeft) {
        CHECK_SIZE_EQ(ka, g.m);
    } else {
        CHECK_SIZE_EQ(ka, g.n);
    }
#endif

    SWAP_IFROW(g.order, ma,nb, tmp);

#if TR
    if (c != Qnil) {
        rb_raise(rb_eArgError,"wrong number of arguments (3 for 2)");
    }
    COPY_OR_CAST_TO(b,cT);
    ndf.nin = 2;

    na_ndloop3(&ndf, &g, 2, a, b);
    return b;
#else

    if (c == Qnil) { // c is not given.
        ndfunc_arg_in_t ain_init = {sym_init,0};
        ain[2] = ain_init;
        ndf.nout = 1;
        c = INT2FIX(0);
        shape[0] = nb;
        shape[1] = ma;
    } else {
        narray_t *na3;
        int nc;
        COPY_OR_CAST_TO(c,cT);
        GetNArray(c,na3);
        CHECK_DIM_GE(na3,2);
        nc = ROW_SIZE(na3);
        if (nc < nb) {
            rb_raise(nary_eShapeError,"nc=%d must be >= nb=%d",nc,nb);
        }
        //CHECK_LEADING_GE("ldc",g.ldc,"m",ma);
    }
    {
        VALUE ans = na_ndloop3(&ndf, &g, 3, a, b, c);

        if (ndf.nout == 1) { // c is not given.
            return ans;
        } else {
            return c;
        }
    }
#endif
}

#undef func_p
#undef args_t
#undef GE
#undef TR
