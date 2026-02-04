#define args_t <%=func_name%>_args_t
#define func_p <%=func_name%>_p

typedef struct {
    int order;
    char jobvl, jobvr;
} args_t;

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t * const lp)
{
    dtype *a, *vl, *vr;
#if IS_COMPLEX
    dtype *w;
#else
    dtype *wr, *wi;
#endif
    int   *info;
    int    n, lda, ldvl, ldvr;
    args_t *g;

    a = (dtype*)NDL_PTR(lp,0);
#if IS_COMPLEX
    w = (dtype*)NDL_PTR(lp,1);
#else
    wr = (dtype*)NDL_PTR(lp,1);
    wi = (dtype*)NDL_PTR(lp,2);
#endif
    vl = (dtype*)NDL_PTR(lp,3-CZ);
    vr = (dtype*)NDL_PTR(lp,4-CZ);
    info = (int*)NDL_PTR(lp,5-CZ);
    g = (args_t*)(lp->opt_ptr);

    n = NDL_SHAPE(lp,0)[1];
    lda = NDL_STEP(lp,0) / sizeof(dtype);
    ldvl = NDL_STEP(lp,3-CZ) / sizeof(dtype);
    if (ldvl == 0) { ldvl = n; } // jobvt == 'N'
    ldvr = NDL_STEP(lp,4-CZ) / sizeof(dtype);
    if (ldvr == 0) { ldvr = n; } // jobvt == 'N'

    //printf("order=%d jobvl=%c jobvr=%c n=%d lda=%d ldvl=%d ldvr=%d\n",g->order,g->jobvl, g->jobvr, n, lda,ldvl,ldvr);

    /*<% func_args = [
      "g->order, g->jobvl, g->jobvr, n, a, lda",
      is_complex ? "w" : "wr, wi",
      "vl, ldvl, vr, ldvr"
    ].join(",") %>*/
    *info = (*func_p)(<%=func_args%>);
    CHECK_ERROR(*info);
}

/*<%
 tp = class_name
 return_type = ([tp]*(is_complex ? 3 : 4) + ["Integer"]).join(", ")
 return_name = (is_complex ? "w,":"wr, wi,") + " vl, vr, info"
 params = [
   mat("a",:inplace),
   jobe("jobvl"),
   jobe("jobvr"),
   opt("order"),
 ].select{|x| x}.join("\n  ")
%>
  @overload <%=name%>( a,, [jobvl:'V', jobvr:'V', order:'R'] )
  <%=params%>
  @return [[<%=return_name%>]] Array<<%=return_type%>>
<%=outparam(return_name)%>

<%=description%>

*/
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
    VALUE a, ans;
    int   m, n;
    narray_t *na1;
    /*<%
    aout = [
      "{cT,1,shape}", !is_complex ? "{cT,1,shape}":nil,
      "{cT,2,shape},{cT,2,shape},{cInt,0}"
    ].compact.join(",")
    %>*/
    size_t shape[2];
    ndfunc_arg_in_t ain[1] = {{OVERWRITE,2}};
    ndfunc_arg_out_t aout[5-CZ] = {<%=aout%>};
    ndfunc_t ndf = {&<%=c_iter%>, NO_LOOP|NDF_EXTRACT, 1, 5-CZ, ain, aout};

    args_t g = {0,0,0};
    VALUE opts[3] = {Qundef,Qundef,Qundef};
    VALUE kw_hash = Qnil;
    ID kw_table[3] = {id_order,id_jobvl,id_jobvr};

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "1:", &a, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 3, opts);
    g.order = option_order(opts[0]);
    g.jobvl = option_job(opts[1],'V','N');
    g.jobvr = option_job(opts[2],'V','N');

    COPY_OR_CAST_TO(a,cT);
    GetNArray(a, na1);
    CHECK_DIM_GE(na1, 2);
    m = ROW_SIZE(na1);
    n = COL_SIZE(na1);
    if (m != n) {
        rb_raise(nary_eShapeError,"matrix must be square");
    }
    shape[0] = shape[1] = n;
    if (g.jobvl=='N') { aout[2-CZ].dim = 0; }
    if (g.jobvr=='N') { aout[3-CZ].dim = 0; }

    ans = na_ndloop3(&ndf, &g, 1, a);

    if (aout[3-CZ].dim == 0) { RARRAY_ASET(ans,3-CZ,Qnil); }
    if (aout[2-CZ].dim == 0) { RARRAY_ASET(ans,2-CZ,Qnil); }
    return ans;
}

#undef args_t
#undef func_p
