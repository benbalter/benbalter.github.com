/*
  blas.c
  BLAS wrapper for Ruby/Numo
    (C) Copyright 2017 by Masahiro TANAKA

  This program is free software.
  NO WARRANTY.
*/
#include <assert.h>
#include <ruby.h>
#include "numo/narray.h"
#include "numo/template.h"
#include "cblas.h"

// from ruby/ext/fiddle/fiddle.h
#if defined(HAVE_DLFCN_H)
# include <dlfcn.h>
# /* some stranger systems may not define all of these */
#ifndef RTLD_LAZY
#define RTLD_LAZY 0
#endif
#ifndef RTLD_GLOBAL
#define RTLD_GLOBAL 0
#endif
#ifndef RTLD_NOW
#define RTLD_NOW 0
#endif
#else
# if defined(_WIN32)
#   include <windows.h>
#   define dlopen(name,flag) ((void*)LoadLibrary(name))
#   define dlerror() strerror(rb_w32_map_errno(GetLastError()))
#   define dlsym(handle,name) ((void*)GetProcAddress((handle),(name)))
#   define RTLD_LAZY -1
#   define RTLD_NOW  -1
#   define RTLD_GLOBAL -1
# endif
#endif

static void *blas_handle = 0;
static char *blas_prefix = 0;

VALUE
numo_cblas_option_value(VALUE order, VALUE default_value)
{
    switch(TYPE(order)) {
    case T_NIL:
    case T_UNDEF:
        return default_value;
    }
    return order;
}

enum CBLAS_ORDER
numo_cblas_option_order(VALUE order)
{
    int opt;
    char *ptr;

    switch(TYPE(order)) {
    case T_NIL:
    case T_UNDEF:
    case T_FALSE:
        return CblasRowMajor;
    case T_TRUE:
        return CblasColMajor;
    case T_FIXNUM:
        opt = FIX2INT(order);
        if (opt >= CblasRowMajor && opt <= CblasColMajor) {
            return opt;
        }
        break;
    case T_SYMBOL:
        order = rb_sym2str(order);
    case T_STRING:
        ptr = RSTRING_PTR(order);
        if (RSTRING_LEN(order) > 0) {
            switch(ptr[0]){
            case 'R': case 'r':
                return CblasRowMajor;
            case 'C': case 'c':
                return CblasColMajor;
            }
        }
        break;
    }
    rb_raise(rb_eArgError,"invalid value for CBLAS_ORDER");
    return 0;
}

enum CBLAS_TRANSPOSE
numo_cblas_option_trans(VALUE trans)
{
    int opt;
    char *ptr;

    switch(TYPE(trans)) {
    case T_NIL:
    case T_UNDEF:
    case T_FALSE:
        return CblasNoTrans;
    case T_TRUE:
        return CblasTrans;
    case T_FIXNUM:
        opt = FIX2INT(trans);
        if (opt >= CblasNoTrans && opt <= CblasConjTrans) {
            return opt;
        }
        break;
    case T_SYMBOL:
        trans = rb_sym2str(trans);
    case T_STRING:
        ptr = RSTRING_PTR(trans);
        if (RSTRING_LEN(trans) > 0) {
            switch(ptr[0]){
            case 'N': case 'n':
                return CblasNoTrans;
            case 'T': case 't':
                return CblasTrans;
            case 'C': case 'c':
                return CblasConjTrans;
            }
        }
        break;
    }
    rb_raise(rb_eArgError,"invalid value for CBLAS_TRANSPOSE");
    return 0;
}

enum CBLAS_UPLO
numo_cblas_option_uplo(VALUE uplo)
{
    int opt;
    char *ptr;

    switch(TYPE(uplo)) {
    case T_NIL:
    case T_UNDEF:
    case T_FALSE:
        return CblasUpper;
    case T_TRUE:
        return CblasLower;
    case T_FIXNUM:
        opt = FIX2INT(uplo);
        switch(opt){
        case CblasUpper:
        case CblasLower:
            return opt;
        }
        break;
    case T_SYMBOL:
        uplo = rb_sym2str(uplo);
    case T_STRING:
        ptr = RSTRING_PTR(uplo);
        if (RSTRING_LEN(uplo) > 0) {
            switch(ptr[0]){
            case 'U': case 'u':
                return CblasUpper;
            case 'L': case 'l':
                return CblasLower;
            }
        }
        break;
    }
    rb_raise(rb_eArgError,"invalid value for CBLAS_UPLO");
    return 0;
}

enum CBLAS_DIAG
numo_cblas_option_diag(VALUE diag)
{
    int opt;
    char *ptr;

    switch(TYPE(diag)) {
    case T_NIL:
    case T_UNDEF:
    case T_FALSE:
        return CblasNonUnit;
    case T_TRUE:
        return CblasUnit;
    case T_FIXNUM:
        opt = FIX2INT(diag);
        switch(opt){
        case CblasNonUnit:
        case CblasUnit:
            return opt;
        }
        break;
    case T_SYMBOL:
        diag = rb_sym2str(diag);
    case T_STRING:
        ptr = RSTRING_PTR(diag);
        if (RSTRING_LEN(diag) > 0) {
            switch(ptr[0]){
            case 'N': case 'n':
                return CblasNonUnit;
            case 'U': case 'u':
                return CblasUnit;
            }
        }
        break;
    }
    rb_raise(rb_eArgError,"invalid value for CBLAS_DIAG");
    return 0;
}

enum CBLAS_SIDE
numo_cblas_option_side(VALUE side)
{
    int opt;
    char *ptr;

    switch(TYPE(side)) {
    case T_NIL:
    case T_UNDEF:
    case T_FALSE:
        return CblasLeft;
    case T_TRUE:
        return CblasRight;
    case T_FIXNUM:
        opt = FIX2INT(side);
        switch(opt){
        case CblasLeft:
        case CblasRight:
            return opt;
        }
        break;
    case T_SYMBOL:
        side = rb_sym2str(side);
    case T_STRING:
        ptr = RSTRING_PTR(side);
        if (RSTRING_LEN(side) > 0) {
            switch(ptr[0]){
            case 'L': case 'l':
                return CblasLeft;
            case 'R': case 'r':
                return CblasRight;
            }
        }
        break;
    }
    rb_raise(rb_eArgError,"invalid value for CBLAS_SIDE");
    return 0;
}

void
numo_cblas_check_func(void **func, const char *name)
{
    char *s, *error;

    if (*func==0) {
        if (blas_handle==0) {
            rb_raise(rb_eRuntimeError,"BLAS library is not loaded");
        }
        if (blas_prefix==0) {
            rb_raise(rb_eRuntimeError,"CBLAS prefix is not set");
        }
        s = alloca(strlen(blas_prefix)+strlen(name)+1);
        strcpy(s,blas_prefix);
        strcat(s,name);
#if defined(HAVE_DLFCN_H)
        dlerror();
#endif
        *func = dlsym(blas_handle, s);
#if defined(HAVE_DLFCN_H)
        if ((error = dlerror()) != 0) {
            func = 0;
        }
#endif
        if ( !func ) {
            rb_raise(rb_eRuntimeError, "unknown symbol \"%s\"", s);
        }
    }
}

/*
  module definition: Numo::Linalg
*/
static VALUE mLinalg;

/*
  module definition: Numo::Linalg::Blas
*/
static VALUE mBlas;


static VALUE
blas_s_dlopen(int argc, VALUE *argv, VALUE mod)
{
    int i, f;
    VALUE lib, flag;
    char *error;
    void *handle;

    i = rb_scan_args(argc, argv, "11", &lib, &flag);
    if (i==2) {
        f = NUM2INT(flag);
    } else {
        f = RTLD_LAZY;
    }
#if defined(HAVE_DLFCN_H)
    dlerror();
#endif
    handle = dlopen(StringValueCStr(lib), f);
#if defined(HAVE_DLFCN_H)
    if ( !handle && (error = dlerror()) ) {
        rb_raise(rb_eRuntimeError, "%s", error);
    }
#else
    if ( !handle ) {
        error = dlerror();
        rb_raise(rb_eRuntimeError, "%s", error);
    }
#endif
    blas_handle = handle;
    return Qnil;
}


static VALUE
blas_s_prefix_set(VALUE mod, VALUE prefix)
{
    long len;

    if (TYPE(prefix) != T_STRING) {
        rb_raise(rb_eTypeError,"argument must be string");
    }
    if (blas_prefix) {
        free(blas_prefix);
    }
    len = RSTRING_LEN(prefix);
    blas_prefix = malloc(len+1);
    strcpy(blas_prefix, StringValueCStr(prefix));
    return prefix;
}


void Init_numo_linalg_blas_s();
void Init_numo_linalg_blas_d();
void Init_numo_linalg_blas_c();
void Init_numo_linalg_blas_z();

void
Init_blas(void)
{
    VALUE mN;

    mN = rb_define_module("Numo");
    /*
      Document-module: Numo::Linalg
    */
    mLinalg = rb_define_module_under(mN, "Linalg");
    mBlas = rb_define_module_under(mLinalg, "Blas");

    rb_define_module_function(mBlas, "dlopen", blas_s_dlopen, -1);
    rb_define_module_function(mBlas, "prefix=", blas_s_prefix_set, 1);

    blas_prefix = malloc(strlen("cblas_")+1); // default prefix
    strcpy(blas_prefix,"cblas_");

    Init_numo_linalg_blas_s();
    Init_numo_linalg_blas_d();
    Init_numo_linalg_blas_c();
    Init_numo_linalg_blas_z();
}
