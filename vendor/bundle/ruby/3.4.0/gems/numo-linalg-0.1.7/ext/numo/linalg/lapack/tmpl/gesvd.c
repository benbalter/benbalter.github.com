//<% is_sdd = (/gesdd/ =~ name) %>
#define SDD <%=is_sdd ? "1":"0"%>
#define args_t <%=func_name%>_args_t
#define func_p <%=func_name%>_p

typedef struct {
    int order;
    char jobu, jobvt, jobz;
    rtype *superb;
} args_t;

static <%=func_name%>_t func_p = 0;

static void
<%=c_iter%>(na_loop_t * const lp)
{
    dtype *a, *u=0, *vt=0;
    rtype *s;
    int   *info;
    int    m, n, lda, ldu, ldvt, tmp;
    args_t *g;

    a = (dtype*)NDL_PTR(lp,0);
    s = (rtype*)NDL_PTR(lp,1);
    u = (dtype*)NDL_PTR(lp,2);
    vt = (dtype*)NDL_PTR(lp,3);
    info = (int*)NDL_PTR(lp,4);
    g = (args_t*)(lp->opt_ptr);

    m = NDL_SHAPE(lp,0)[0];
    n = NDL_SHAPE(lp,0)[1];
    SWAP_IFCOL(g->order,m,n);
    lda = NDL_STEP(lp,0) / sizeof(dtype);
    ldu = NDL_STEP(lp,2) / sizeof(dtype);
    if (ldu == 0) { ldu = m; } // jobu == 'O' or 'N'
    ldvt = NDL_STEP(lp,3) / sizeof(dtype);
    if (ldvt == 0) { ldvt = n; } // jobvt == 'O' or 'N'

    //printf("order=%d jobu=%c jobvt=%c jobz=%c m=%d n=%d lda=%d ldu=%d ldvt=%d\n",g->order,g->jobu, g->jobvt,g->jobz, m,n,lda,ldu,ldvt);

    /*<%
    job = (is_sdd) ? "g->jobz" : "g->jobu, g->jobvt"
    spb = (is_sdd) ? "" : ", g->superb"
    %>*/
    *info = (*func_p)( g->order, <%=job%>, m, n, a, lda, s,
                       u, ldu, vt, ldvt <%=spb%> );
    CHECK_ERROR(*info);
}

/*<%
 tp = class_name
 iscal = "Integer"
 if is_sdd
   a = "a, [jobz:'A', order:'R']"
 else
   a = "a, [jobu:'A', jobvt:'A', order:'R']"
 end
 return_type = [tp,tp,tp,iscal].join(", ")
 return_name = "sigma, u, vt, info"
 args_v = a
 params = [
   mat("a","inplace allowed if job\\*=='O'"),
   *(is_sdd ? [jobs("jobz")] : [jobs("jobu"),jobs("jobvt")]),
   opt("order"),
 ].select{|x| x}.join("\n  ")
%>
  @overload <%=name%>(<%=args_v%>)
  <%=params%>
  @return [[<%=return_name%>]] Array<<%=return_type%>>
<%=outparam(return_name)%>

<%=description%>

*/
static VALUE
<%=c_func(-1)%>(int argc, VALUE const argv[], VALUE UNUSED(mod))
{
#if !SDD
    VALUE tmpbuf;
#endif
    VALUE a, ans;
    int   m, n, min_mn, tmp;
    narray_t *na1;
    size_t shape_s[1], shape_u[2], shape_vt[2];
    ndfunc_arg_in_t ain[1] = {{OVERWRITE,2}};
    ndfunc_arg_out_t aout[4] = {{cRT,1,shape_s},{cT,2,shape_u},
                                {cT,2,shape_vt},{cInt,0}};
    ndfunc_t ndf = {&<%=c_iter%>, NO_LOOP|NDF_EXTRACT, 1, 4, ain, aout};

    args_t g;
    VALUE opts[4] = {Qundef,Qundef,Qundef,Qundef};
    VALUE kw_hash = Qnil;
    ID kw_table[4] = {id_order,id_jobu,id_jobvt,id_jobz};

    CHECK_FUNC(func_p,"<%=func_name%>");

    rb_scan_args(argc, argv, "1:", &a, &kw_hash);
    rb_get_kwargs(kw_hash, kw_table, 0, 4, opts);
    g.order = option_order(opts[0]);
#if SDD
    g.jobz = option_job(opts[3],'A','N');
    g.jobu = g.jobvt = g.jobz;
#else
    g.jobu  = option_job(opts[1],'A','N');
    g.jobvt = option_job(opts[2],'A','N');
    if (g.jobu=='O' && g.jobvt=='O') {
        rb_raise(rb_eArgError,"JOBVT and JOBU cannot both be 'O'");
    }
#endif

    if (g.jobu=='O' || g.jobvt=='O') {
        if (CLASS_OF(a) != cT) {
            rb_raise(rb_eTypeError,"type of matrix a is invalid for overwrite");
        }
    } else {
        COPY_OR_CAST_TO(a,cT);
    }

    GetNArray(a, na1);
    CHECK_DIM_GE(na1, 2);
    m = ROW_SIZE(na1);
    n = COL_SIZE(na1);
    SWAP_IFCOL(g.order,m,n);

#if SDD
    if (g.jobz=='O') {
        if (m >= n) { g.jobvt='A';} else { g.jobu='A';}
    }
#endif

    // output S
    shape_s[0] = min_mn = min_(m,n);

    // output U
    switch(g.jobu){
    case 'A':
        shape_u[0] = m;
        shape_u[1] = m;
        break;
    case 'S':
        shape_u[0] = m;
        shape_u[1] = min_mn;
        SWAP_IFCOL(g.order,shape_u[0],shape_u[1]);
        break;
    case 'O':
    case 'N':
        aout[1].dim = 0; // dummy
        break;
    default:
        rb_raise(rb_eArgError,"invalid option: jobu='%c'",g.jobu);
    }
    // output VT
    switch(g.jobvt){
    case 'A':
        shape_vt[0] = n;
        shape_vt[1] = n;
        break;
    case 'S':
        shape_vt[0] = min_mn;
        shape_vt[1] = n;
        SWAP_IFCOL(g.order, shape_vt[0], shape_vt[1]);
        break;
    case 'O':
    case 'N':
        aout[2].dim = 0; // dummy
        break;
    default:
        rb_raise(rb_eArgError,"invalid option: jobvt='%c'",g.jobvt);
    }
#if !SDD
    g.superb = (rtype*)rb_alloc_tmp_buffer(&tmpbuf, min_mn*sizeof(rtype));
#endif

    ans = na_ndloop3(&ndf, &g, 1, a);

#if !SDD
    rb_free_tmp_buffer(&tmpbuf);
#endif

    if (g.jobu=='O')      { RARRAY_ASET(ans,1,a); } else
    if (aout[1].dim == 0) { RARRAY_ASET(ans,1,Qnil); }
    if (g.jobvt=='O')     { RARRAY_ASET(ans,2,a); } else
    if (aout[2].dim == 0) { RARRAY_ASET(ans,2,Qnil); }
    return ans;
}

#undef args_t
#undef func_p
#undef SDD
