#define func_p <%=func_name%>_p

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t *const lp)
{
    char *p1, *p2;
    size_t n;
    ssize_t s1, s2;

    INIT_COUNTER(lp,n);
    INIT_PTR(lp,0,p1,s1);
    INIT_PTR(lp,1,p2,s2);

    (*func_p)(n, (dtype*)p1, s1/sizeof(dtype),
                 (dtype*)p2, s2/sizeof(dtype));
}

/*<%
 params = [
   vec("x"),
   vec("y"),
 ].select{|x| x}.join("\n  ")
%>
  @overload <%=name%>( x, y )
  <%=params%>
  @return [nil]

<%=description%>

*/
static VALUE
<%=c_func(2)%>(VALUE UNUSED(mod), VALUE x, VALUE y)
{
    narray_t *na1, *na2;
    ndfunc_arg_in_t ain[2] = {{OVERWRITE,0},{OVERWRITE,0}};
    ndfunc_t ndf = {<%=c_iter%>, STRIDE_LOOP, 2,0, ain,0};

    CHECK_FUNC(func_p,"<%=func_name%>");

    CHECK_NARRAY_TYPE(x,cT);
    CHECK_NARRAY_TYPE(y,cT);
    GetNArray(x,na1);
    GetNArray(y,na2);
    CHECK_DIM_GE(na1,1);
    CHECK_DIM_GE(na2,1);
    CHECK_NON_EMPTY(na1);
    CHECK_NON_EMPTY(na2);
    CHECK_SAME_SHAPE(na1,na2);

    na_ndloop(&ndf, 2, x, y);

    return Qnil;
}

#undef func_p
