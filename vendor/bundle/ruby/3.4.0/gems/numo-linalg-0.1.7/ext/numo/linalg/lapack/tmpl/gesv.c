/*<%
 uplo = (/^?ge/=~name) ? nil : "g->uplo,"
 ipiv = (/^?po/=~name) ? nil : "ipiv,"
%>*/
<% %>
#define UPLO <%=(/^?ge/!~name) ? "1":"0"%>
#define IPIV <%=(/^?po/!~name) ? "1":"0"%>
#define args_t <%=func_name%>_args_t
#define func_p <%=func_name%>_p

typedef struct {
    int order;
    char uplo;
} args_t;

static <%=func_name%>_t <%=func_name%>_p = 0;

static void
<%=c_iter%>(na_loop_t * const lp)
{
    dtype *a, *b;
    int   *info;
    int    n, nrhs;
    int    lda, ldb;
    args_t *g;
#if IPIV
    int *ipiv;
    ipiv = (int*)NDL_PTR(lp,2);
    info = (int*)NDL_PTR(lp,3);
#else
    info = (int*)NDL_PTR(lp,2);
#endif
    a = (dtype*)NDL_PTR(lp,0);
    b = (dtype*)NDL_PTR(lp,1);
    g = (args_t*)(lp->opt_ptr);

    n = NDL_SHAPE(lp,0)[0];
    lda = NDL_STEP(lp,0) / sizeof(dtype);
    if (lp->args[1].ndim == 1) {
        nrhs = 1;
        ldb = (g->order==LAPACK_COL_MAJOR) ? n : 1;
    } else {
        nrhs = NDL_SHAPE(lp,1)[1];
        ldb = NDL_STEP(lp,1) / sizeof(dtype);
    }
    //printf("order=%d n=%d nrhs=%d lda=%d ldb=%d b.ndim=%d\n",
    //       g->order,n,nrhs,lda,ldb,lp->args[1].ndim);
    *info = (*func_p)( g->order, <%=uplo%>
                       n, nrhs, a, lda, <%=ipiv%> b, ldb );
    CHECK_ERROR(*info);
}

/*<%
 tp = class_name
 iary = "Numo::Int"
 iscal = "Integer"
 if uplo
   a = "a, b, [uplo:'U', order:'R']"
 else
   a = "a, b, [order:'R']"
 end
 if ipiv
   n = "a, b, ipiv, info"
   t = [tp,tp,iary,iscal]
 else
   n = "a, b, info"
   t = [tp,tp,iscal]
 end
 return_type = t.join(", ")
 return_name = n
 args_v = a

 params = [
   mat("a",:inplace,"output: lu"),
   vec("b",:inplace,"output: x"),
   uplo && opt("uplo"),
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
    narray_t *na1, *na2;
    size_t n, nb, nrhs;
    ndfunc_arg_in_t ain[2] = {{OVERWRITE,2},{OVERWRITE,2}};
    size_t shape[2];
    ndfunc_arg_out_t aout[2] = {{cInt,1,shape},{cInt,0}};
    ndfunc_t ndf = {&<%=c_iter%>, NO_LOOP|NDF_EXTRACT, 2,2, ain,aout};
    args_t g;
    VALUE kw_hash = Qnil;
    ID kw_table[2] = {id_order,id_uplo};
    VALUE opts[2] = {Qundef,Qundef};

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "2:", &a, &b, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 2, opts);
    g.order = option_order(opts[0]);
    g.uplo = option_uplo(opts[1]);

    COPY_OR_CAST_TO(a,cT);
    COPY_OR_CAST_TO(b,cT);
    GetNArray(a, na1);
    GetNArray(b, na2);
    CHECK_DIM_GE(na1, 2);
    CHECK_DIM_GE(na2, 1);
    CHECK_SQUARE("matrix a",na1);
    n = COL_SIZE(na1);
    if (NA_NDIM(na2) == 1) {
        ain[1].dim = 1;
        nb = COL_SIZE(na2);
        nrhs = 1;
    } else {
        nb = ROW_SIZE(na2);
        nrhs = COL_SIZE(na2);
    }
    if (n != nb) {
        rb_raise(nary_eShapeError, "matrix dimension mismatch: "
                 "a.col=a.row=%"SZF"u b.row=%"SZF"u", n, nb);
    }
    shape[0] = n;
    shape[1] = nrhs;
#if !IPIV
    ndf.aout++;
    ndf.nout--;
#endif

    ans = na_ndloop3(&ndf, &g, 2, a, b);

#if IPIV
    return rb_ary_concat(rb_assoc_new(a,b),ans);
#else
    return rb_ary_new3(3,a,b,ans);
#endif
}

#undef func_p
#undef args_t
#undef UPLO
#undef IPIV
