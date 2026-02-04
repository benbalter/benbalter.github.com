#define args_t <%=name%>_args_t

typedef struct {
    dtype alpha;
} args_t;

#define func_p <%=func_name%>_p
static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t *const lp)
{
    char   *p1, *p2;
    size_t  n;
    ssize_t s1, s2;
    dtype  *g;

    INIT_COUNTER(lp,n);
    INIT_PTR(lp,0,p1,s1);
    INIT_PTR(lp,1,p2,s2);
    g = (dtype*)(lp->opt_ptr);

    (*func_p)(n, DP(*g), (dtype*)p1, s1/sizeof(dtype),
                         (dtype*)p2, s2/sizeof(dtype));
}

/*<%
 params = [
   vec("x"),
   vec("y",:inplace),
   opt("alpha"),
 ].select{|x| x}.join("\n  ")
%>
  @overload <%=name%>( x, y, [alpha:1] )
  <%=params%>
  @return [<%=class_name%>] y = alpha * x + y

<%=description%>

*/
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
    VALUE x, y, alpha;
    narray_t *na1, *na2;
    ndfunc_arg_in_t ain[2] = {{cT,0},{OVERWRITE,0}};
    ndfunc_t ndf = {<%=c_iter%>, STRIDE_LOOP, 2, 0, ain, 0};

    dtype g;
    VALUE kw_hash = Qnil;
    ID kw_table[1] = {id_alpha};
    VALUE opts[1] = {Qundef};

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "2:", &x, &y, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 1, opts);
    alpha = option_value(opts[0],Qnil);
    g     = RTEST(alpha) ? m_num_to_data(alpha) : m_one;

    COPY_OR_CAST_TO(y,cT);
    GetNArray(x,na1);
    GetNArray(y,na2);
    CHECK_DIM_GE(na1,1);
    CHECK_DIM_GE(na2,1);
    CHECK_NON_EMPTY(na1);
    CHECK_NON_EMPTY(na2);
    CHECK_SAME_SHAPE(na1,na2);

    na_ndloop3(&ndf, &g, 2, x, y);
    return y;
}

#undef func_p
#undef args_t
