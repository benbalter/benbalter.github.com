#define args_t <%=func_name%>_args_t
#define func_p <%=func_name%>_p

typedef struct {
    int order;
    int itype;
    char jobz, uplo;
} args_t;

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t * const lp)
{
    dtype *a, *b;
    rtype *w;
    int   *info;
    int    n, lda, ldb;
    args_t *g;

    a = (dtype*)NDL_PTR(lp,0);
    b = (dtype*)NDL_PTR(lp,1);
    w = (rtype*)NDL_PTR(lp,2);
    info = (int*)NDL_PTR(lp,3);
    g = (args_t*)(lp->opt_ptr);

    n = NDL_SHAPE(lp,0)[1];
    lda = NDL_STEP(lp,0) / sizeof(dtype);
    ldb = NDL_STEP(lp,1) / sizeof(dtype);

    //printf("order=%d itype=%d jobz=%c uplo=%c n=%d lda=%d ldb=%d\n",g->order,g->itype,g->jobz,g->uplo,n,lda,ldb);

    *info = (*func_p)( g->order, g->itype, g->jobz, g->uplo, n, a, lda, b, ldb, w );
    CHECK_ERROR(*info);
}

/*<%
 params = [
   mat("a",:inplace),
   mat("b",:inplace),
   "@param [Integer] itype Specifies the problem type to be solved. If 1:  A*x = (lambda)*B*x, If 2:  A*B*x = (lambda)*x, If 3:  B*A*x = (lambda)*x.",
   jobe("jobz"),
   opt("uplo"),
   opt("order"),
 ].select{|x| x}.join("\n  ")
return_name="a, b, w, info"
%>
  @overload <%=name%>(a, b, [itype:1, jobz:'V', uplo:'U', order:'R'])
  <%=params%>
  @return [[<%=return_name%>]] Array<<%=real_class_name%>,<%=real_class_name%>,Integer>
<%=outparam(return_name)%>

<%=description%>

*/
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
    VALUE a, b, ans;
    int   n, nb;
    narray_t *na1, *na2;
    size_t shape[1];
    ndfunc_arg_in_t ain[2] = {{OVERWRITE,2},{OVERWRITE,2}};
    ndfunc_arg_out_t aout[2] = {{cRT,1,shape},{cInt,0}};
    ndfunc_t ndf = {&<%=c_iter%>, NO_LOOP|NDF_EXTRACT, 2, 2, ain, aout};

    args_t g;
    VALUE opts[4] = {Qundef,Qundef,Qundef,Qundef};
    VALUE kw_hash = Qnil;
    ID kw_table[4] = {id_order,id_jobz,id_uplo,id_itype};

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "2:", &a, &b, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 4, opts);
    g.order = option_order(opts[0]);
    g.jobz = option_job(opts[1],'V','N');
    g.uplo = option_uplo(opts[2]);
    g.itype = NUM2INT(option_value(opts[3],INT2FIX(1)));

    COPY_OR_CAST_TO(a,cT);
    GetNArray(a, na1);
    CHECK_DIM_GE(na1, 2);

    COPY_OR_CAST_TO(b,cT);
    GetNArray(b, na2);
    CHECK_DIM_GE(na2, 2);

    CHECK_SQUARE("matrix a",na1);
    n  = COL_SIZE(na1);
    CHECK_SQUARE("matrix b",na2);
    nb = COL_SIZE(na2);
    if (n != nb) {
        rb_raise(nary_eShapeError,"matrix a and b must have same size");
    }
    shape[0] = n;

    ans = na_ndloop3(&ndf, &g, 2, a, b);

    return rb_ary_new3(4, a, b, RARRAY_AREF(ans,0), RARRAY_AREF(ans,1));
}

#undef args_t
#undef func_p
