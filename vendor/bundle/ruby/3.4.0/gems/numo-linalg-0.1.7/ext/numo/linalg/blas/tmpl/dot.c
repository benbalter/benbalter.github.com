#define func_p <%=func_name%>_p

static <%=func_name%>_t func_p = 0;

#undef result_dtype
#define result_dtype <%=result_dtype%>

static void
<%=c_iter%>(na_loop_t *const lp)
{
    char *p1, *p2, *p3;
    size_t n;
    ssize_t s1, s2;

    INIT_PTR(lp,0,p1,s1);
    INIT_PTR(lp,1,p2,s2);
    p3 = NDL_PTR(lp,2);
    n  = NDL_SHAPE(lp,0)[0];

  <% if /[cz]/ =~ blas_char %>
    (*func_p)(n, (dtype*)p1, s1/sizeof(dtype),
                 (dtype*)p2, s2/sizeof(dtype), (result_dtype*)p3);
  <% else %>
    *(result_dtype*)p3 = (*func_p)(n, (dtype*)p1, s1/sizeof(dtype),
                                      (dtype*)p2, s2/sizeof(dtype));
  <% end %>
}

/*<%
 params = [
   vec("x"),
   vec("y"),
 ].select{|x| x}.join("\n  ")
%>
  @overload <%=name%>( x, y )
  <%=params%>
  @return [<%=class_name%>] op(x) dot y

<%=description%>

*/
static VALUE
<%=c_func(2)%>(VALUE mod, VALUE x, VALUE y)
{
    VALUE     ans;
    narray_t *na1, *na2;
    size_t    nx, ny, shape[1]={1};
    ndfunc_arg_in_t ain[2] = {{cT,1},{cT,1}};
    ndfunc_arg_out_t aout[1] = {{<%=result_class%>,0,shape}};
    ndfunc_t ndf = {<%=c_iter%>, NDF_EXTRACT, 2,1, ain,aout};

    CHECK_FUNC(func_p,"<%=func_name%>");

    GetNArray(x,na1);
    GetNArray(y,na2);
    CHECK_DIM_GE(na1,1);
    CHECK_DIM_GE(na2,1);
    CHECK_NON_EMPTY(na1);
    CHECK_NON_EMPTY(na2);
    nx = COL_SIZE(na1);
    ny = COL_SIZE(na2);
    CHECK_SIZE_EQ(nx,ny);

    ans = na_ndloop(&ndf, 2, x, y);

    return ans;
}
#undef func_p
