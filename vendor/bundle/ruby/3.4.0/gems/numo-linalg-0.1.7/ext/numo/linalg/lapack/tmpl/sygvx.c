#define args_t <%=func_name%>_args_t
#define func_p <%=func_name%>_p

typedef struct {
    int order;
    int itype;
    char jobz;
    char uplo;
    char range;
    int il;
    int iu;
} args_t;

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t * const lp)
{
    dtype *a, *b, *z;
    rtype *w;
    int   *ifail;
    int   *info;
    int    m, n, lda, ldb, ldz;
    rtype  vl = 0, vu = 0;
    rtype  abstol = 0;

    args_t *g;

    a = (dtype*)NDL_PTR(lp, 0);
    b = (dtype*)NDL_PTR(lp, 1);
    w = (rtype*)NDL_PTR(lp, 2);
    z = (dtype*)NDL_PTR(lp, 3);
    ifail = (int*)NDL_PTR(lp, 4);
    info = (int*)NDL_PTR(lp, 5);
    g = (args_t*)(lp->opt_ptr);

    n = NDL_SHAPE(lp, 0)[1];
    lda = NDL_STEP(lp, 0) / sizeof(dtype);
    ldb = NDL_STEP(lp, 1) / sizeof(dtype);
    ldz = NDL_SHAPE(lp, 3)[1];

    *info = (*func_p)( g->order, g->itype, g->jobz, g->range, g->uplo, n, a, lda, b, ldb,
                       vl, vu, g->il, g->iu, abstol, &m, w, z, ldz, ifail );

    CHECK_ERROR(*info);
}

/*
<%
params = [
  mat("a",:inplace),
  mat("b",:inplace),
  "@param [Integer] itype Specifies the problem type to be solved.  If 1:  A*x = (lambda)*B*x, If 2:  A*B*x = (lambda)*x, If 3:  B*A*x = (lambda)*x.",
  jobe("jobz"),
  opt("uplo"),
  opt("order"),
  "@param [String or Symbol] range If 'A': Compute all eigenvalues, if 'I': Compute eigenvalues with indices il to iu (default='A')",
  "@param [Integer] il Specifies the index of the smallest eigenvalue in ascending order to be returned. If range = 'A', il is not referenced.",
  "@param [Integer] iu Specifies the index of the largest eigenvalue in ascending order to be returned. Constraint: 1<=il<=iu<=N. If range = 'A', iu is not referenced.",
].select{|x| x}.join("\n  ")
return_name="a, b, w, z, ifail, info"
%>
  @overload <%=name%>(a, b, [itype:1, jobz:'V', uplo:'U', order:'R', range:'I', il: 1, il: 2])
  <%=params%>
  @return [[<%=return_name%>]]
    Array<<%=real_class_name%>,<%=real_class_name%>,<%=real_class_name%>,<%=real_class_name%>,<%=real_class_name%>,Integer>
<%=outparam(return_name)%>

<%=description%>
*/

static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
    VALUE a, b, ans;
    int   n, nb, m;
    narray_t *na1, *na2;
    size_t w_shape[1];
    size_t z_shape[2];
    size_t ifail_shape[1];

    ndfunc_arg_in_t ain[2] = {{OVERWRITE, 2}, {OVERWRITE, 2}};
    ndfunc_arg_out_t aout[4] = {{cRT, 1, w_shape}, {cT, 2, z_shape}, {cI, 1, ifail_shape}, {cInt, 0}};
    ndfunc_t ndf = {&<%=c_iter%>, NO_LOOP | NDF_EXTRACT, 2, 4, ain, aout};

    args_t g;
    VALUE opts[7] = {Qundef, Qundef, Qundef, Qundef, Qundef, Qundef, Qundef};
    VALUE kw_hash = Qnil;
    ID kw_table[7] = {id_order, id_jobz, id_uplo, id_itype, id_range, id_il, id_iu};

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "2:", &a, &b, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 7, opts);
    g.order = option_order(opts[0]);
    g.jobz = option_job(opts[1], 'V', 'N');
    g.uplo = option_uplo(opts[2]);
    g.itype = NUM2INT(option_value(opts[3], INT2FIX(1)));
    g.range = option_range(opts[4], 'A', 'I');
    g.il = NUM2INT(option_value(opts[5], INT2FIX(1)));
    g.iu = NUM2INT(option_value(opts[6], INT2FIX(1)));

    COPY_OR_CAST_TO(a, cT);
    GetNArray(a, na1);
    CHECK_DIM_GE(na1, 2);

    COPY_OR_CAST_TO(b, cT);
    GetNArray(b, na2);
    CHECK_DIM_GE(na2, 2);
    CHECK_SQUARE("matrix a", na1);
    n  = COL_SIZE(na1);
    CHECK_SQUARE("matrix b", na2);
    nb = COL_SIZE(na2);
    if (n != nb) {
        rb_raise(nary_eShapeError, "matrix a and b must have same size");
    }

    m = g.range == 'I' ? g.iu - g.il + 1 : n;
    w_shape[0] = m;
    z_shape[0] = n;
    z_shape[1] = m;
    ifail_shape[0] = m;

    ans = na_ndloop3(&ndf, &g, 2, a, b);

    return rb_ary_new3(6, a, b, RARRAY_AREF(ans, 0), RARRAY_AREF(ans, 1), RARRAY_AREF(ans, 2), RARRAY_AREF(ans, 3));
}

#undef args_t
#undef func_p
