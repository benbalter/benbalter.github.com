/*<%
%>*/
<% %>
#define args_t <%=func_name%>_args_t
#define func_p <%=func_name%>_p

typedef struct {
    int order;
} args_t;

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t * const lp)
{
    dtype *a;
    dtype *tau;
    int   *info;
    int    m, n, k, lda, tmp;
    args_t *g;

    a = (dtype*)NDL_PTR(lp,0);
    tau = (dtype*)NDL_PTR(lp,1);
    info = (int*)NDL_PTR(lp,2);
    g = (args_t*)(lp->opt_ptr);

    m = NDL_SHAPE(lp,0)[0];
    n = NDL_SHAPE(lp,0)[1];
    k = NDL_SHAPE(lp,1)[0];
    SWAP_IFCOL(g->order,m,n);
    lda = NDL_STEP(lp,0) / sizeof(dtype);

    //printf("order=%d m=%d n=%d k=%d lda=%d \n",g->order,m,n,k,lda);

    *info = (*func_p)(g->order, m, n, k, a, lda, tau);
    CHECK_ERROR(*info);
}

/*<%
 args_v = [
   "a",
   "tau",
 ].select{|x| x}.join(", ")

 args_opt = [
   "order:'R'",
 ].select{|x| x}.join(", ")

 params = [
   mat("a",:inplace),
   vec("tau"),
   opt("order"),
 ].select{|x| x}.join("\n  ")

 return_type = [
   class_name,
   "Integer"
 ].select{|x| x}.join(", ")

 return_name = [
   "a",
   "info"
 ].select{|x| x}.join(", ")
%>
  @overload <%=name%>(a, tau, order:'R')
  <%=params%>
  @return [[<%=return_name%>]] Array<<%=return_type%>>
<%=outparam(return_name)%>

<%=description%>

*/
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
    VALUE a, tau, ans;
    int   m, n, k, tmp;
    narray_t *na1, *na2;
    ndfunc_arg_in_t ain[2] = {{OVERWRITE,2},{cT,1}};
    ndfunc_arg_out_t aout[1] = {{cInt,0}};
    ndfunc_t ndf = {&<%=c_iter%>, NO_LOOP|NDF_EXTRACT, 2,1, ain,aout};

    args_t g = {0};
    VALUE opts[1] = {Qundef};
    VALUE kw_hash = Qnil;
    ID kw_table[1] = {id_order};

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "2:", &a, &tau, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 1, opts);
    g.order = option_order(opts[0]);

    COPY_OR_CAST_TO(a,cT);
    GetNArray(a, na1);
    CHECK_DIM_GE(na1, 2);
    m = ROW_SIZE(na1);
    n = COL_SIZE(na1);

    GetNArray(tau, na2);
    CHECK_DIM_GE(na2, 1);
    k = COL_SIZE(na2);
    if (m < n) {
        rb_raise(nary_eShapeError,
                 "a row length (m) must be >= a column length (n): m=%d n=%d",
                 m,n);
    }
    if (n < k) {
        rb_raise(nary_eShapeError,
                 "a column length (n) must be >= tau length (k): n=%d, k=%d",
                 k,n);
    }
    SWAP_IFCOL(g.order,m,n);

    ans = na_ndloop3(&ndf, &g, 2, a, tau);

    return rb_assoc_new(a, ans);
}

#undef args_t
#undef func_p
