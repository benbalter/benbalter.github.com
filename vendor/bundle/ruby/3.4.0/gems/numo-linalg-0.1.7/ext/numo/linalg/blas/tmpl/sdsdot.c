#define func_p <%=func_name%>_p

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t *const lp)
{
    char *p1, *p2, *p3;
    size_t n;
    ssize_t s1, s2;
    dtype  *g;

    INIT_PTR(lp,0,p1,s1);
    INIT_PTR(lp,1,p2,s2);
    p3 = NDL_PTR(lp,2);
    n  = NDL_SHAPE(lp,0)[0];
    g  = (dtype*)(lp->opt_ptr);

    *(dtype*)p3 = (*func_p)(n, *g, (dtype*)p1, s1/sizeof(dtype),
                                   (dtype*)p2, s2/sizeof(dtype));
}

/*<%
 params = [
   vec("sx"),
   vec("sy",:inplace),
 ].select{|x| x}.join("\n  ")
%>
  @overload <%=name%>( sx, sy, [sb:0] )
  <%=params%>
  @param [Float] sb
  @return [<%=class_name%>] returns inner product.

  Compute the inner product of two vectors with extended
  precision accumulation.

  Returns S.P. result with dot product accumulated in D.P.
  SDSDOT = SB + sum for I = 0 to N-1 of SX(LX+I*INCX)*SY(LY+I*INCY),
  where LX = 1 if INCX .GE. 0, else LX = 1+(1-N)*INCX, and LY is
  defined in a similar way using INCY.

 */
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
    VALUE     x, y, sb;
    dtype     g[1];
    narray_t *na1, *na2;
    size_t    nx, ny;
    ndfunc_arg_in_t ain[2] = {{cT,1},{cT,1}};
    ndfunc_arg_out_t aout[1] = {{cT,0}};
    ndfunc_t ndf = {<%=c_iter%>, NDF_EXTRACT, 2,1, ain,aout};

    VALUE kw_hash = Qnil;
    ID kw_table[1] = {id_sb};
    VALUE opts[1] = {Qundef};

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "2:", &x, &y, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 1, opts);
    sb = option_value(opts[0],Qnil);
    g[0] = RTEST(sb) ? m_num_to_data(sb) : m_zero;

    GetNArray(x,na1);
    GetNArray(y,na2);
    CHECK_DIM_GE(na1,1);
    CHECK_DIM_GE(na2,1);
    CHECK_NON_EMPTY(na1);
    CHECK_NON_EMPTY(na2);
    nx = na1->shape[na1->ndim-1];
    ny = na2->shape[na2->ndim-1];
    CHECK_SIZE_EQ(nx,ny);

    return na_ndloop3(&ndf, g, 2, x, y);
}
#undef func_p
