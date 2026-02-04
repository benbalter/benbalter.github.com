/*<%
 is_lss = (/gels(s|d|y)/ =~ name)
 is_lsd = (/gelsd/ =~ name)
 is_lsy = (/gelsy/ =~ name)
%>*/
<% %>
#define LSS <%=is_lss ? "1":"0"%>
#define LSD <%=is_lsd ? "1":"0"%>
#define LSY <%=is_lsy ? "1":"0"%>
#define args_t <%=func_name%>_args_t
#define func_p <%=func_name%>_p

typedef struct {
    int   order;
    char  trans;
    rtype rcond;
} args_t;

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t * const lp)
{
    dtype *a, *b;
    int   *info;
    int    m, n, nb, nrhs, lda, ldb, tmp;
    args_t *g;
#if LSS
    <% out_t = is_lsy ? "int" : "rtype" %>
    <%=out_t%> *s; // or jpvt
    int   *rank;
#endif

    a = (dtype*)NDL_PTR(lp,0);
    b = (dtype*)NDL_PTR(lp,1);
#if LSS
    s = (<%=out_t%>*)NDL_PTR(lp,2);
    rank = (int*)NDL_PTR(lp,3);
#endif
    info = (int*)NDL_PTR(lp,2+LSS*2);
    g = (args_t*)(lp->opt_ptr);

    m = NDL_SHAPE(lp,0)[0];
    n = NDL_SHAPE(lp,0)[1];
    SWAP_IFCOL(g->order,m,n);
    lda = NDL_STEP(lp,0) / sizeof(dtype);

    if (lp->args[1].ndim == 1) {
        nrhs = 1;
        nb = NDL_SHAPE(lp,1)[0];
        ldb = (g->order==LAPACK_COL_MAJOR) ? nb : 1;
    } else {
        nb = NDL_SHAPE(lp,1)[0];
        nrhs = NDL_SHAPE(lp,1)[1];
        ldb = nrhs;
        SWAP_IFCOL(g->order,nb,nrhs);
    }

    //printf("order=%d trans=%c m=%d n=%d nb=%d nrhs=%d lda=%d ldb=%d\n",g->order,g->trans,m,n,nb,nrhs,lda,ldb);

#if LSS
    *info = (*func_p)(g->order, m, n, nrhs, a, lda, b, ldb, s, g->rcond, rank);
#else
    *info = (*func_p)(g->order, g->trans, m, n, nrhs, a, lda, b, ldb);
#endif
    CHECK_ERROR(*info);
}

/*
<%
 tp = class_name
 iary = "Numo::Int"
 iscal = "Integer"
 if is_lsy
   a = "a, b, jpvt, rcond:-1, order:'R'"
   t = [tp,tp,iary,iscal,iscal]
   n = "a, b, jpvt, rank, info"
 elsif is_lsd
   a = "a, b, rcond:-1, order:'R'"
   t = [tp,tp,iscal,iscal]
   n = "b, s, rank, info"
 elsif is_lss
   a = "a, b, rcond:-1, order:'R'"
   t = [tp,tp,tp,iscal,iscal]
   n = "a, b, s, rank, info"
 else
   a = "a, b, trans:'N', order:'R'"
   t = [tp,tp,iscal]
   n = "a, b, info"
 end
 return_type = t.join(", ")
 return_name = n
 args_v = a
 params = [
   !is_lsd && mat("a",:inplace),
              mat("b",:inplace),
   is_lsy  && mat("jpvt",type:iary),
   is_lss  && "@param [Float] rcond "+
     " RCOND is used to determine the effective rank of A."+
     " Singular values S(i) <= RCOND*S(1) are treated as zero."+
     " If RCOND < 0, machine precision is used instead.",
   opt("order"),
 ].select{|x| x}.join("\n  ")
%>
  @overload <%=name%>(<%=args_v%>)
  <%=params%>
  @return [[<%=return_name%>]] Array<<%=return_type%>>
<%=outparam(return_name)%>

<%=description%>

*/
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
    VALUE a, b, ans;
    int   m, n, nb, nrhs, tmp;
    int   max_mn;
    narray_t *na1, *na2;
#if LSY
    narray_t *na3;
    VALUE jpvt;
#endif
#if LSS
    size_t shape_s[1];
#endif
    /*<%
      ain = [
        "{OVERWRITE,2},{OVERWRITE,2}", is_lss ? "{cInt,1}":nil,
      ].compact.join(",")
      aout = [
        is_lss ? "{cT,1,shape_s},{cInt,0}":nil, "{cInt,0}",
      ].compact.join(",")
    %>*/
    ndfunc_arg_in_t ain[2+LSS] = {<%=ain%>};
    ndfunc_arg_out_t aout[1+LSS*2] = {<%=aout%>};
    ndfunc_t ndf = {&<%=c_iter%>, NO_LOOP|NDF_EXTRACT, 2, 1+LSS*2, ain, aout};

    args_t g;
    VALUE opts[3] = {Qundef,Qundef,Qundef};
    ID kw_table[3] = {id_order,id_trans,id_rcond};
    VALUE kw_hash = Qnil;

    CHECK_FUNC(func_p,"<%=func_name%>");

#if LSY
    rb_scan_args(argc, argv, "3:", &a, &b, &jpvt, &kw_hash);
#else
    rb_scan_args(argc, argv, "2:", &a, &b, &kw_hash);
#endif
    rb_get_kwargs(kw_hash, kw_table, 0, 3, opts);
    g.order = option_order(opts[0]);
#if LSS
    g.rcond = NUM2DBL(option_value(opts[2],DBL2NUM(-1)));
#else
    g.trans = option_trans(opts[1]);
#endif

    //A is DOUBLE PRECISION array, dimension (LDA,N)
    //On entry, the M-by-N matrix A.
    COPY_OR_CAST_TO(a,cT);
    GetNArray(a, na1);
    CHECK_DIM_GE(na1, 2);

    //B is DOUBLE PRECISION array, dimension (LDB,NRHS)
    //B is M-by-NRHS if TRANS = 'N'
    //     N-by-NRHS if TRANS = 'T'
    COPY_OR_CAST_TO(b,cT);
    GetNArray(b, na2);
    CHECK_DIM_GE(na2, 1);

    //The number of rows of the matrix A.
    m = ROW_SIZE(na1);
    //The number of columns of the matrix A.
    n = COL_SIZE(na1);
    max_mn = (m > n) ? m : n;
    SWAP_IFCOL(g.order,m,n);

#if LSY
    ndf.nin++;
    ndf.nout--;
    ndf.aout++;
    COPY_OR_CAST_TO(jpvt,cInt);
    GetNArray(jpvt, na3);
    CHECK_DIM_GE(na3, 1);
    { int jpvt_sz = COL_SIZE(na3);
      CHECK_INT_EQ("jpvt_size",jpvt_sz,"n",n);
    }
#elif LSS
    shape_s[0] = (m < n) ? m : n;
#endif

    //The number of columns of the matrix B.
    if (na2->ndim == 1) {
        ain[1].dim = 1; // reduce dimension
        nb = COL_SIZE(na2);
        nrhs = 1;
    } else {
        //The number of rows of the matrix B.
        nb = ROW_SIZE(na2);
        nrhs = COL_SIZE(na2);
        SWAP_IFCOL(g.order,nb,nrhs);
    }
    if (nb < max_mn) {
        rb_raise(nary_eShapeError,
                 "ldb should be >= max(m,n): ldb=%d m=%d n=%d",nb,m,n);
    }

    // ndloop
#if LSY
    ans = na_ndloop3(&ndf, &g, 3, a, b, jpvt);
#else
    ans = na_ndloop3(&ndf, &g, 2, a, b);
#endif

    // return
#if LSY
    return rb_ary_concat(rb_ary_new3(3,a,b,jpvt),ans);
#elif LSD
    rb_ary_unshift(ans,b); return ans;
#elif LSS
    return rb_ary_concat(rb_ary_new3(2,a,b),ans);
#else
    return rb_ary_new3(3,a,b,ans);
#endif
}

#undef func_p
#undef args_t
#undef LSS
#undef LSD
#undef LSY
