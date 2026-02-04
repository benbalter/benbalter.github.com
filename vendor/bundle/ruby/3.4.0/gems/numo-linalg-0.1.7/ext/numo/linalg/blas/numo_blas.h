#include "cblas.h"
#include "cblas_t.h"
#include "../numo_linalg.h"

typedef int blasint;

#define option_value numo_cblas_option_value
extern VALUE numo_cblas_option_value(VALUE value, VALUE default_value);

#define option_order numo_cblas_option_order
extern enum CBLAS_ORDER numo_cblas_option_order(VALUE order);

#define option_trans numo_cblas_option_trans
extern enum CBLAS_TRANSPOSE numo_cblas_option_trans(VALUE trans);

#define option_uplo numo_cblas_option_uplo
extern enum CBLAS_UPLO numo_cblas_option_uplo(VALUE uplo);

#define option_diag numo_cblas_option_diag
extern enum CBLAS_DIAG numo_cblas_option_diag(VALUE diag);

#define option_side numo_cblas_option_side
extern enum CBLAS_SIDE numo_cblas_option_side(VALUE side);

#define check_func numo_cblas_check_func
extern void numo_cblas_check_func(void **func, const char *name);

#define SWAP_IFCOL(order,a,b,tmp)                               \
    { if ((order)==CblasColMajor) {(tmp)=(a);(a)=(b);(b)=(tmp);} }

#define SWAP_IFROW(order,a,b,tmp)                               \
    { if ((order)==CblasRowMajor) {(tmp)=(a);(a)=(b);(b)=(tmp);} }

#define SWAP_IFNOTRANS(trans,a,b,tmp)                           \
    { if ((trans)==CblasNoTrans) {(tmp)=(a);(a)=(b);(b)=(tmp);} }

#define SWAP_IFTRANS(trans,a,b,tmp)                           \
    { if ((trans)!=CblasNoTrans) {(tmp)=(a);(a)=(b);(b)=(tmp);} }

#define SWAP_IFCOLTR(order,trans,a,b,tmp)                       \
    { if (((order)==CblasRowMajor && (trans)!=CblasNoTrans) ||  \
          ((order)!=CblasRowMajor && (trans)==CblasNoTrans))    \
            {(tmp)=(a);(a)=(b);(b)=(tmp);}                      \
    }

#define CHECK_FUNC(fptr, fname)                                 \
    { if ((fptr)==0) { check_func((void*)(&(fptr)),fname); } }
