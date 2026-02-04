/*<%
is_he = (/^.he/=~name)
stype = is_he ? "rtype" : "dtype"
%>*/
<% if is_he %>
#define P(a) (a)
<% else %>
#define P(a) DP(a)
<% end %>

#define args_t <%=name%>_args_t

typedef struct {
    enum CBLAS_ORDER order;
    enum CBLAS_UPLO uplo;
    enum CBLAS_TRANSPOSE trans;
    <%=stype%> alpha, beta;
    blasint n, k;
} args_t;

#define func_p <%=func_name%>_p

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t *const lp)
{
    dtype *a, *c;
    args_t *g;
    blasint lda, ldc;

    a = (dtype*)NDL_PTR(lp,0);
    c = (dtype*)NDL_PTR(lp,1);
    g = (args_t*)(lp->opt_ptr);

    lda = NDL_STEP(lp,0) / sizeof(dtype);
    ldc = NDL_STEP(lp,1) / sizeof(dtype);

    (*func_p)(g->order, g->uplo, g->trans, g->n, g->k,
              P(g->alpha), a, lda, P(g->beta), c, ldc);
}

/*<%
 params = [
   mat("a","n-by-k",:inpace),
   mat("c","n-by-n, optional",:inpace),
   opt("alpha"),
   opt("beta"),
   opt("uplo"),
   opt("trans"),
   opt("order")
 ].select{|x| x}.join("\n  ")
%>
  @overload <%=name%>( a, [c, alpha:1, beta:0, uplo:'U', trans:'N', order:'R'] )
  <%=params%>
  @return [<%=class_name%>] returns c.

<%=description%>

 */
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
    VALUE     ans;
    VALUE     a, c, alpha, beta;
    narray_t *na1, *na3;
    blasint   na, ka, nc, tmp;
    size_t    shape[2];
    ndfunc_arg_in_t ain[3] = {{cT,2},{OVERWRITE,2},{sym_init,0}};
    ndfunc_arg_out_t aout[1] = {{cT,2,shape}};
    ndfunc_t ndf = {<%=c_iter%>, NO_LOOP, 2, 0, ain, aout};

    args_t g;
    VALUE kw_hash = Qnil;
    ID kw_table[5] = {id_alpha,id_beta,id_order,id_uplo,id_trans};
    VALUE opts[5] = {Qundef,Qundef,Qundef,Qundef,Qundef};

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "11:", &a, &c, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 5, opts);
    alpha   = option_value(opts[0],Qnil);
    beta    = option_value(opts[1],Qnil);
<% if is_he %>
    g.alpha = RTEST(alpha) ? DBL2NUM(alpha) : 1;
    g.beta  = RTEST(beta)  ? DBL2NUM(beta)  : 0;
<% else %>
    g.alpha = RTEST(alpha) ? m_num_to_data(alpha) : m_one;
    g.beta  = RTEST(beta)  ? m_num_to_data(beta)  : m_zero;
<% end %>
    g.order = option_order(opts[2]);
    g.uplo  = option_uplo(opts[3]);
    g.trans = option_trans(opts[4]);

    GetNArray(a,na1);
    CHECK_DIM_GE(na1,2);

    na = ROW_SIZE(na1); // n
    ka = COL_SIZE(na1); // k (lda)
    SWAP_IFCOLTR(g.order,g.trans, na,ka, tmp);
    g.n = na;
    g.k = ka;

    if (c == Qnil) { // c is not given.
        ndf.nout = 1;
        ain[1] = ain[2];
        c = INT2FIX(0);
        shape[0] = na;
        shape[1] = na;
    } else {
        COPY_OR_CAST_TO(c,cT);
        GetNArray(c,na3);
        CHECK_DIM_GE(na3,2);
        nc = ROW_SIZE(na3);
        if (nc < na) {
            rb_raise(nary_eShapeError,"nc=%d must be >= na=%d",nc,na);
        }
        //CHECK_LEADING_GE("ldc",g.ldc,"n",na);
    }

    ans = na_ndloop3(&ndf, &g, 2, a, c);

    if (ndf.nout == 1) { // c is not given.
        return ans;
    } else {
        return c;
    }
}

#undef func_p
#undef args_t
#undef P
