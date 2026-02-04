#define func_p <%=func_name%>_p

static <%=func_name%>_t func_p = 0;

#undef result_dtype
#define result_dtype <%=result_dtype%>

static void
<%=c_iter%>(na_loop_t *const lp)
{
    char *p1, *p2;
    size_t n;
    ssize_t s1;

    INIT_PTR(lp,0,p1,s1);
    p2 = NDL_PTR(lp,1);
    n  = NDL_SHAPE(lp,0)[0];

    *(result_dtype*)p2 = (*func_p)(n, (dtype*)p1, s1/sizeof(dtype));
}

/*
<%
 case name
 when /^dz/
   arg_class = "Numo::DComplex"
   retT = "cRT"
 when /^sc/
   arg_class = "Numo::SComplex"
   retT = "cRT"
 else
   arg_class = class_name
   retT = "cT"
 end
 params = [
   vec("x",type:arg_class),
   opt("keepdims"),
 ].select{|x| x}.join("\n  ")
%>
  @overload <%=name%>( x )
  <%=params%>
  @return [<%=class_name%>] euclidean norm of x

<%=description%>

*/
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
    VALUE     x, keepdims, ans;
    narray_t *na1;
    ndfunc_arg_in_t ain[1] = {{cT,1}};
    ndfunc_arg_out_t aout[1] = {{<%=retT%>,0}};
    ndfunc_t ndf = {<%=c_iter%>, NDF_EXTRACT, 1,1, ain,aout};

    VALUE opts[1] = {Qundef};
    ID    kw_table[1] = {id_keepdims};
    VALUE kw_hash = Qnil;

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "1:", &x, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 1, opts);
    keepdims = option_value(opts[0],Qfalse);

    if (RTEST(keepdims)) {
        ndf.flag |= NDF_KEEP_DIM;
    }

    GetNArray(x,na1);
    CHECK_DIM_GE(na1,1);
    CHECK_NON_EMPTY(na1);

    ans = na_ndloop(&ndf, 1, x);

    return ans;
}

#undef func_p
