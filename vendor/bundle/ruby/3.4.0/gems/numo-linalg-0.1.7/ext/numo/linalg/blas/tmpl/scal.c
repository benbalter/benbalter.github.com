#define func_p <%=func_name%>_p

static <%=func_name%>_t func_p = 0;

<% if /^(cs|zd)scal/ =~ name %>
#define scal_t rtype
<% else %>
#define scal_t dtype
<% end %>

static void
<%=c_iter%>(na_loop_t *const lp)
{
    char *p1;
    size_t n;
    ssize_t s1;
    scal_t *g;

    INIT_COUNTER(lp,n);
    INIT_PTR(lp,0,p1,s1);
    g = (scal_t*)(lp->opt_ptr);

  <% if /^[cz]scal/ =~ name %>
    (*func_p)(n, g, (dtype*)p1, s1/sizeof(dtype));
  <% else %>
    (*func_p)(n, *g, (dtype*)p1, s1/sizeof(dtype));
  <% end %>
}

/*<%
 params = [
   vec("x"),
 ].select{|x| x}.join("\n  ")
%>
  @overload <%=name%>( a, x )
  @param [Float]        a  scale factor
  <%=params%>
  @return [<%=class_name%>] returns a*x.

<%=description%>

 */
static VALUE
<%=c_func(2)%>(VALUE mod, VALUE a, VALUE x)
{
    scal_t g[1];
    narray_t *na1;
    ndfunc_arg_in_t ain[1] = {{OVERWRITE,0}};
    ndfunc_t ndf = {<%=c_iter%>, STRIDE_LOOP, 1,0, ain,0};

    CHECK_FUNC(func_p,"<%=func_name%>");

  <% if /^(cs|zd)scal/ =~ name %>
    if (RTEST(a)) {g[0] = NUM2DBL(a);} else {g[0]=1;}
  <% else %>
    if (RTEST(a)) {g[0] = m_num_to_data(a);} else {g[0]=m_one;}
  <% end %>
    COPY_OR_CAST_TO(x,cT);
    GetNArray(x,na1);
    CHECK_DIM_GE(na1,1);
    CHECK_NON_EMPTY(na1);

    na_ndloop3(&ndf, g, 1, x);

    return x;
}

#undef func_p
#undef scal_t
