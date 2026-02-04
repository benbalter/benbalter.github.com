<%
 has_rhs  = (/trs$/ =~ name)
 has_trans = (/^.(g|l|t).trs$/ =~ name)
 has_uplo = (/^.(g|pt)/ !~ name)
 has_ipiv = (/p[bfopt]tr.$/ !~ name)
 ipiv_out = (has_ipiv && /trf$/ =~ name)
 ipiv_in  = (has_ipiv && /tr[is]$/ =~ name)
 is_sym   = (has_uplo || /getr[is]/=~name)
%>
#define RHS  <%= has_rhs ? "1":"0" %>
#define TRANS <%= has_trans ? "1":"0" %>
#define UPLO <%= has_uplo ? "1":"0" %>
#define IPIV <%= has_ipiv ? "1":"0" %>
#define IPIV_OUT <%= ipiv_out ? "1":"0" %>
#define IPIV_IN <%= ipiv_in ? "1":"0" %>
#define SYM  <%= is_sym ? "1":"0" %>
#define args_t <%=func_name%>_args_t
#define func_p <%=func_name%>_p

typedef struct {
    int order;
    char uplo;
    char trans;
} args_t;

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t * const lp)
{
    dtype *a;
#if RHS
    dtype *b;
    int    nb, nrhs, ldb;
#endif
#if IPIV
    int   *pv;
#endif
    int   *info;
    int    m, n, lda;
    args_t *g;

    a = (dtype*)NDL_PTR(lp,0);
#if IPIV
    pv = (int*)NDL_PTR(lp,1);
#endif
#if RHS
    b = (dtype*)NDL_PTR(lp,1+IPIV);
#endif
    info = (int*)NDL_PTR(lp,1+IPIV+RHS);
    g = (args_t*)(lp->opt_ptr);

    n = NDL_SHAPE(lp,0)[0];
    m = NDL_SHAPE(lp,0)[1];
    lda = NDL_STEP(lp,0) / sizeof(dtype);

#if RHS
    // same as gels.c
    if (lp->args[1+IPIV].ndim == 1) {
        nrhs = 1;
        nb = NDL_SHAPE(lp,1+IPIV)[0];
        ldb = (g->order==LAPACK_COL_MAJOR) ? nb : 1;
    } else {
        nb = NDL_SHAPE(lp,1+IPIV)[0];
        nrhs = NDL_SHAPE(lp,1+IPIV)[1];
        ldb = nrhs;
        { int tmp; SWAP_IFCOL(g->order,nb,nrhs); }
    }
    //printf("order=%d m=%d n=%d nb=%d nrhs=%d lda=%d ldb=%d\n",g->order,m,n,nb,nrhs,lda,ldb);
#else
    //printf("order=%d m=%d n=%d lda=%d \n",g->order,m,n,lda);
#endif

#if SYM
    n = min_(m,n);
#else
    { int tmp; SWAP_IFCOL(g->order,m,n); }
#endif

    <%
    func_args = [  "g->order",
      has_uplo  && "g->uplo",
      has_trans && "g->trans",
                   "n",
      has_rhs   ?  "nrhs" : (!is_sym && "m"),
                   "a, lda",
      has_ipiv  && "pv",
      has_rhs   && "b, ldb",
    ].select{|x| x}.join(", ")
    %>
    *info = (*func_p)(<%=func_args%>);
    CHECK_ERROR(*info);
}

/*<%
 args_v = [
   "a",
   ipiv_in && "ipiv",
   has_rhs && "b",
 ].select{|x| x}.join(", ")

 args_opt = [
   has_uplo && "uplo:'U'",
   has_trans && "trans:'N'",
   "order:'R'",
 ].select{|x| x}.join(", ")

 trf = name.sub(/.$/,"f")

 params = [
   has_rhs ? "@param a [#{class_name}] LU matrix computed by "+trf :
             mat("a",:inplace),
   ipiv_in && "@param ipiv [Numo::Int] pivot computed by "+trf,
   has_rhs && mat("b",:inplace),
   has_uplo && opt("uplo"),
   has_trans && opt("trans"),
   opt("order"),
 ].select{|x| x}.join("\n  ")

 return_type = [
   class_name,
   ipiv_out && "Numo::Int",
   "Integer"
 ].select{|x| x}.join(", ")

 return_name = [
   has_rhs  ?  "b" : "a",
   ipiv_out && "ipiv",
   "info"
 ].select{|x| x}.join(", ")
%>
  @overload <%=name%>(<%=args_v%>, [<%=args_opt%>])
  <%=params%>
  @return [[<%=return_name%>]] Array<<%=return_type%>>
<%=outparam(return_name)%>

<%=description%>

*/
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
<% %>
    VALUE a, ans;
#if IPIV_IN
    VALUE ipiv;
#endif
#if RHS
    VALUE b;
    size_t n, nb, nrhs;
    narray_t *na2;
#endif
    narray_t *na1;
    <%
    aout = [
      ipiv_out && "{cInt,1,shape_piv}",
                  "{cInt,0}",
    ].select{|x| x}.join(",")
    %>
#if IPIV_OUT
    size_t shape_piv[1];
#endif
#if IPIV_IN
# if RHS
    ndfunc_arg_in_t ain[3] = {{cT,2},{cInt,1},{OVERWRITE,2}};
# else
    ndfunc_arg_in_t ain[2] = {{OVERWRITE,2},{cInt,1}};
# endif
#else
# if RHS
    ndfunc_arg_in_t ain[2] = {{cT,2},{OVERWRITE,2}};
# else
    ndfunc_arg_in_t ain[1] = {{OVERWRITE,2}};
# endif
#endif
    ndfunc_arg_out_t aout[1+IPIV_OUT] = {<%=aout%>};
    ndfunc_t ndf = {&<%=c_iter%>, NO_LOOP|NDF_EXTRACT,
                    1+IPIV_IN+RHS, IPIV_OUT+1, ain,aout};

    args_t g = {0,0};
    VALUE opts[2] = {Qundef,Qundef};
    VALUE kw_hash = Qnil;
    ID kw_table[2] = {id_order,id_uplo};

    CHECK_FUNC(func_p,"<%=func_name%>");

#if IPIV_IN
# if RHS
    rb_scan_args(argc, argv, "3:", &a, &ipiv, &b, &kw_hash);
# else
    rb_scan_args(argc, argv, "2:", &a, &ipiv, &kw_hash);
# endif
#else
# if RHS
    rb_scan_args(argc, argv, "2:", &a, &b, &kw_hash);
# else
    rb_scan_args(argc, argv, "1:", &a, &kw_hash);
# endif
#endif
#if TRANS
    kw_table[1] = id_trans;
    rb_get_kwargs(kw_hash, kw_table, 0, 2, opts);
    g.trans = option_trans(opts[1]);
#elif UPLO
    rb_get_kwargs(kw_hash, kw_table, 0, 2, opts);
    g.uplo = option_uplo(opts[1]);
#else
    rb_get_kwargs(kw_hash, kw_table, 0, 1, opts);
#endif
    g.order = option_order(opts[0]);

#if !RHS
    COPY_OR_CAST_TO(a,cT);
#endif
    GetNArray(a, na1);
    CHECK_DIM_GE(na1, 2);
#if IPIV_OUT
    shape_piv[0] = min_(ROW_SIZE(na1),COL_SIZE(na1));
#endif

#if RHS
    COPY_OR_CAST_TO(b,cT);
    GetNArray(b, na2);
    CHECK_DIM_GE(na2, 1);
    n = COL_SIZE(na1);
#if SYM
    n = min_(n,ROW_SIZE(na1));
#endif
    // same as gesv.c
    if (NA_NDIM(na2) == 1) {
        ain[1+IPIV_IN].dim = 1;
        nb = COL_SIZE(na2);
        nrhs = 1;
    } else {
        nb = ROW_SIZE(na2);
        nrhs = COL_SIZE(na2);
        { int tmp; SWAP_IFCOL(g.order,nb,nrhs); }
    }
    if (n != nb) {
        rb_raise(nary_eShapeError, "matrix dimension mismatch: "
                 "a.col(or a.row)=%"SZF"u b.row=%"SZF"u", n, nb);
    }
#endif

#if IPIV_IN
# if RHS
    ans = na_ndloop3(&ndf, &g, 3, a, ipiv, b);
    return rb_assoc_new(b, ans);
# else
    ans = na_ndloop3(&ndf, &g, 2, a, ipiv);
    return rb_assoc_new(a, ans);
# endif
#else
# if RHS
    ans = na_ndloop3(&ndf, &g, 2, a, b);
    return rb_assoc_new(b, ans);
# else
    ans = na_ndloop3(&ndf, &g, 1, a);
#  if IPIV_OUT
    return rb_ary_unshift(ans, a);
#  else
    return rb_assoc_new(a, ans);
#  endif
# endif
#endif
}

#undef args_t
#undef func_p
#undef RHS
#undef TRANS
#undef UPLO
#undef IPIV
#undef IPIV_OUT
#undef IPIV_IN
#undef SYM
