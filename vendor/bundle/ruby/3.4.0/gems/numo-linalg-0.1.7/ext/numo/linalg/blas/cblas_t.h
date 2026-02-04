#ifndef NUMO_CBLAS_T_H
#define NUMO_CBLAS_T_H

#ifdef __cplusplus
extern "C" {
#endif

/*
 * ===========================================================================
 * Prototypes for level 1 BLAS functions (complex are recast as routines)
 * ===========================================================================
 */
typedef float (*sdsdot_t)(const int N, const float alpha, const float *X,
                    const int incX, const float *Y, const int incY);
typedef double (*dsdot_t)(const int N, const float *X, const int incX, const float *Y,
                   const int incY);
typedef float (*sdot_t)(const int N, const float  *X, const int incX,
                  const float  *Y, const int incY);
typedef double (*ddot_t)(const int N, const double *X, const int incX,
                  const double *Y, const int incY);

/*
 * Functions having prefixes Z and C only
 */
typedef void (*cdotu_sub_t)(const int N, const scomplex *X, const int incX,
                       const scomplex *Y, const int incY, scomplex *dotu);
typedef void (*cdotc_sub_t)(const int N, const scomplex *X, const int incX,
                       const scomplex *Y, const int incY, scomplex *dotc);

typedef void (*zdotu_sub_t)(const int N, const dcomplex *X, const int incX,
                       const dcomplex *Y, const int incY, dcomplex *dotu);
typedef void (*zdotc_sub_t)(const int N, const dcomplex *X, const int incX,
                       const dcomplex *Y, const int incY, dcomplex *dotc);


/*
 * Functions having prefixes S D SC DZ
 */
typedef float (*snrm2_t)(const int N, const float *X, const int incX);
typedef float (*sasum_t)(const int N, const float *X, const int incX);

typedef double (*dnrm2_t)(const int N, const double *X, const int incX);
typedef double (*dasum_t)(const int N, const double *X, const int incX);

typedef float (*scnrm2_t)(const int N, const scomplex *X, const int incX);
typedef float (*scasum_t)(const int N, const scomplex *X, const int incX);

typedef double (*dznrm2_t)(const int N, const dcomplex *X, const int incX);
typedef double (*dzasum_t)(const int N, const dcomplex *X, const int incX);


/*
 * Functions having standard 4 prefixes (S D C Z)
 */
typedef CBLAS_INDEX (*isamax_t)(const int N, const float  *X, const int incX);
typedef CBLAS_INDEX (*idamax_t)(const int N, const double *X, const int incX);
typedef CBLAS_INDEX (*icamax_t)(const int N, const scomplex *X, const int incX);
typedef CBLAS_INDEX (*izamax_t)(const int N, const dcomplex *X, const int incX);

/*
 * ===========================================================================
 * Prototypes for level 1 BLAS routines
 * ===========================================================================
 */

/* 
 * Routines with standard 4 prefixes (s, d, c, z)
 */
typedef void (*sswap_t)(const int N, float *X, const int incX, 
                 float *Y, const int incY);
typedef void (*scopy_t)(const int N, const float *X, const int incX, 
                 float *Y, const int incY);
typedef void (*saxpy_t)(const int N, const float alpha, const float *X,
                 const int incX, float *Y, const int incY);

typedef void (*dswap_t)(const int N, double *X, const int incX, 
                 double *Y, const int incY);
typedef void (*dcopy_t)(const int N, const double *X, const int incX, 
                 double *Y, const int incY);
typedef void (*daxpy_t)(const int N, const double alpha, const double *X,
                 const int incX, double *Y, const int incY);

typedef void (*cswap_t)(const int N, scomplex *X, const int incX, 
                 scomplex *Y, const int incY);
typedef void (*ccopy_t)(const int N, const scomplex *X, const int incX, 
                 scomplex *Y, const int incY);
typedef void (*caxpy_t)(const int N, const scomplex *alpha, const scomplex *X,
                 const int incX, scomplex *Y, const int incY);

typedef void (*zswap_t)(const int N, dcomplex *X, const int incX, 
                 dcomplex *Y, const int incY);
typedef void (*zcopy_t)(const int N, const dcomplex *X, const int incX, 
                 dcomplex *Y, const int incY);
typedef void (*zaxpy_t)(const int N, const dcomplex *alpha, const dcomplex *X,
                 const int incX, dcomplex *Y, const int incY);


/* 
 * Routines with S and D prefix only
 */
typedef void (*srotg_t)(float *a, float *b, float *c, float *s);
typedef void (*srotmg_t)(float *d1, float *d2, float *b1, const float b2, float *P);
typedef void (*srot_t)(const int N, float *X, const int incX,
                float *Y, const int incY, const float c, const float s);
typedef void (*srotm_t)(const int N, float *X, const int incX,
                float *Y, const int incY, const float *P);

typedef void (*drotg_t)(double *a, double *b, double *c, double *s);
typedef void (*drotmg_t)(double *d1, double *d2, double *b1, const double b2, double *P);
typedef void (*drot_t)(const int N, double *X, const int incX,
                double *Y, const int incY, const double c, const double  s);
typedef void (*drotm_t)(const int N, double *X, const int incX,
                double *Y, const int incY, const double *P);


/* 
 * Routines with S D C Z CS and ZD prefixes
 */
typedef void (*sscal_t)(const int N, const float alpha, float *X, const int incX);
typedef void (*dscal_t)(const int N, const double alpha, double *X, const int incX);
typedef void (*cscal_t)(const int N, const scomplex *alpha, scomplex *X, const int incX);
typedef void (*zscal_t)(const int N, const dcomplex *alpha, dcomplex *X, const int incX);
typedef void (*csscal_t)(const int N, const float alpha, scomplex *X, const int incX);
typedef void (*zdscal_t)(const int N, const double alpha, dcomplex *X, const int incX);

/*
 * ===========================================================================
 * Prototypes for level 2 BLAS
 * ===========================================================================
 */

/* 
 * Routines with standard 4 prefixes (S, D, C, Z)
 */
typedef void (*sgemv_t)(const enum CBLAS_ORDER order,
                 const enum CBLAS_TRANSPOSE TransA, const int M, const int N,
                 const float alpha, const float *A, const int lda,
                 const float *X, const int incX, const float beta,
                 float *Y, const int incY);
typedef void (*sgbmv_t)(const enum CBLAS_ORDER order,
                 const enum CBLAS_TRANSPOSE TransA, const int M, const int N,
                 const int KL, const int KU, const float alpha,
                 const float *A, const int lda, const float *X,
                 const int incX, const float beta, float *Y, const int incY);
typedef void (*strmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const float *A, const int lda, 
                 float *X, const int incX);
typedef void (*stbmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const int K, const float *A, const int lda, 
                 float *X, const int incX);
typedef void (*stpmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const float *Ap, float *X, const int incX);
typedef void (*strsv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const float *A, const int lda, float *X,
                 const int incX);
typedef void (*stbsv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const int K, const float *A, const int lda,
                 float *X, const int incX);
typedef void (*stpsv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const float *Ap, float *X, const int incX);

typedef void (*dgemv_t)(const enum CBLAS_ORDER order,
                 const enum CBLAS_TRANSPOSE TransA, const int M, const int N,
                 const double alpha, const double *A, const int lda,
                 const double *X, const int incX, const double beta,
                 double *Y, const int incY);
typedef void (*dgbmv_t)(const enum CBLAS_ORDER order,
                 const enum CBLAS_TRANSPOSE TransA, const int M, const int N,
                 const int KL, const int KU, const double alpha,
                 const double *A, const int lda, const double *X,
                 const int incX, const double beta, double *Y, const int incY);
typedef void (*dtrmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const double *A, const int lda, 
                 double *X, const int incX);
typedef void (*dtbmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const int K, const double *A, const int lda, 
                 double *X, const int incX);
typedef void (*dtpmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const double *Ap, double *X, const int incX);
typedef void (*dtrsv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const double *A, const int lda, double *X,
                 const int incX);
typedef void (*dtbsv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const int K, const double *A, const int lda,
                 double *X, const int incX);
typedef void (*dtpsv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const double *Ap, double *X, const int incX);

typedef void (*cgemv_t)(const enum CBLAS_ORDER order,
                 const enum CBLAS_TRANSPOSE TransA, const int M, const int N,
                 const scomplex *alpha, const scomplex *A, const int lda,
                 const scomplex *X, const int incX, const scomplex *beta,
                 scomplex *Y, const int incY);
typedef void (*cgbmv_t)(const enum CBLAS_ORDER order,
                 const enum CBLAS_TRANSPOSE TransA, const int M, const int N,
                 const int KL, const int KU, const scomplex *alpha,
                 const scomplex *A, const int lda, const scomplex *X,
                 const int incX, const scomplex *beta, scomplex *Y, const int incY);
typedef void (*ctrmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const scomplex *A, const int lda, 
                 scomplex *X, const int incX);
typedef void (*ctbmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const int K, const scomplex *A, const int lda, 
                 scomplex *X, const int incX);
typedef void (*ctpmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const scomplex *Ap, scomplex *X, const int incX);
typedef void (*ctrsv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const scomplex *A, const int lda, scomplex *X,
                 const int incX);
typedef void (*ctbsv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const int K, const scomplex *A, const int lda,
                 scomplex *X, const int incX);
typedef void (*ctpsv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const scomplex *Ap, scomplex *X, const int incX);

typedef void (*zgemv_t)(const enum CBLAS_ORDER order,
                 const enum CBLAS_TRANSPOSE TransA, const int M, const int N,
                 const dcomplex *alpha, const dcomplex *A, const int lda,
                 const dcomplex *X, const int incX, const dcomplex *beta,
                 dcomplex *Y, const int incY);
typedef void (*zgbmv_t)(const enum CBLAS_ORDER order,
                 const enum CBLAS_TRANSPOSE TransA, const int M, const int N,
                 const int KL, const int KU, const dcomplex *alpha,
                 const dcomplex *A, const int lda, const dcomplex *X,
                 const int incX, const dcomplex *beta, dcomplex *Y, const int incY);
typedef void (*ztrmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const dcomplex *A, const int lda, 
                 dcomplex *X, const int incX);
typedef void (*ztbmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const int K, const dcomplex *A, const int lda, 
                 dcomplex *X, const int incX);
typedef void (*ztpmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const dcomplex *Ap, dcomplex *X, const int incX);
typedef void (*ztrsv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const dcomplex *A, const int lda, dcomplex *X,
                 const int incX);
typedef void (*ztbsv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const int K, const dcomplex *A, const int lda,
                 dcomplex *X, const int incX);
typedef void (*ztpsv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE TransA, const enum CBLAS_DIAG Diag,
                 const int N, const dcomplex *Ap, dcomplex *X, const int incX);


/* 
 * Routines with S and D prefixes only
 */
typedef void (*ssymv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const int N, const float alpha, const float *A,
                 const int lda, const float *X, const int incX,
                 const float beta, float *Y, const int incY);
typedef void (*ssbmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const int N, const int K, const float alpha, const float *A,
                 const int lda, const float *X, const int incX,
                 const float beta, float *Y, const int incY);
typedef void (*sspmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const int N, const float alpha, const float *Ap,
                 const float *X, const int incX,
                 const float beta, float *Y, const int incY);
typedef void (*sger_t)(const enum CBLAS_ORDER order, const int M, const int N,
                const float alpha, const float *X, const int incX,
                const float *Y, const int incY, float *A, const int lda);
typedef void (*ssyr_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                const int N, const float alpha, const float *X,
                const int incX, float *A, const int lda);
typedef void (*sspr_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                const int N, const float alpha, const float *X,
                const int incX, float *Ap);
typedef void (*ssyr2_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                const int N, const float alpha, const float *X,
                const int incX, const float *Y, const int incY, float *A,
                const int lda);
typedef void (*sspr2_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                const int N, const float alpha, const float *X,
                const int incX, const float *Y, const int incY, float *A);

typedef void (*dsymv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const int N, const double alpha, const double *A,
                 const int lda, const double *X, const int incX,
                 const double beta, double *Y, const int incY);
typedef void (*dsbmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const int N, const int K, const double alpha, const double *A,
                 const int lda, const double *X, const int incX,
                 const double beta, double *Y, const int incY);
typedef void (*dspmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const int N, const double alpha, const double *Ap,
                 const double *X, const int incX,
                 const double beta, double *Y, const int incY);
typedef void (*dger_t)(const enum CBLAS_ORDER order, const int M, const int N,
                const double alpha, const double *X, const int incX,
                const double *Y, const int incY, double *A, const int lda);
typedef void (*dsyr_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                const int N, const double alpha, const double *X,
                const int incX, double *A, const int lda);
typedef void (*dspr_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                const int N, const double alpha, const double *X,
                const int incX, double *Ap);
typedef void (*dsyr2_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                const int N, const double alpha, const double *X,
                const int incX, const double *Y, const int incY, double *A,
                const int lda);
typedef void (*dspr2_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                const int N, const double alpha, const double *X,
                const int incX, const double *Y, const int incY, double *A);


/* 
 * Routines with C and Z prefixes only
 */
typedef void (*chemv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const int N, const scomplex *alpha, const scomplex *A,
                 const int lda, const scomplex *X, const int incX,
                 const scomplex *beta, scomplex *Y, const int incY);
typedef void (*chbmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const int N, const int K, const scomplex *alpha, const scomplex *A,
                 const int lda, const scomplex *X, const int incX,
                 const scomplex *beta, scomplex *Y, const int incY);
typedef void (*chpmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const int N, const scomplex *alpha, const scomplex *Ap,
                 const scomplex *X, const int incX,
                 const scomplex *beta, scomplex *Y, const int incY);
typedef void (*cgeru_t)(const enum CBLAS_ORDER order, const int M, const int N,
                 const scomplex *alpha, const scomplex *X, const int incX,
                 const scomplex *Y, const int incY, scomplex *A, const int lda);
typedef void (*cgerc_t)(const enum CBLAS_ORDER order, const int M, const int N,
                 const scomplex *alpha, const scomplex *X, const int incX,
                 const scomplex *Y, const int incY, scomplex *A, const int lda);
typedef void (*cher_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                const int N, const float alpha, const scomplex *X, const int incX,
                scomplex *A, const int lda);
typedef void (*chpr_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                const int N, const float alpha, const scomplex *X,
                const int incX, scomplex *A);
typedef void (*cher2_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo, const int N,
                const scomplex *alpha, const scomplex *X, const int incX,
                const scomplex *Y, const int incY, scomplex *A, const int lda);
typedef void (*chpr2_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo, const int N,
                const scomplex *alpha, const scomplex *X, const int incX,
                const scomplex *Y, const int incY, scomplex *Ap);

typedef void (*zhemv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const int N, const dcomplex *alpha, const dcomplex *A,
                 const int lda, const dcomplex *X, const int incX,
                 const dcomplex *beta, dcomplex *Y, const int incY);
typedef void (*zhbmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const int N, const int K, const dcomplex *alpha, const dcomplex *A,
                 const int lda, const dcomplex *X, const int incX,
                 const dcomplex *beta, dcomplex *Y, const int incY);
typedef void (*zhpmv_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                 const int N, const dcomplex *alpha, const dcomplex *Ap,
                 const dcomplex *X, const int incX,
                 const dcomplex *beta, dcomplex *Y, const int incY);
typedef void (*zgeru_t)(const enum CBLAS_ORDER order, const int M, const int N,
                 const dcomplex *alpha, const dcomplex *X, const int incX,
                 const dcomplex *Y, const int incY, dcomplex *A, const int lda);
typedef void (*zgerc_t)(const enum CBLAS_ORDER order, const int M, const int N,
                 const dcomplex *alpha, const dcomplex *X, const int incX,
                 const dcomplex *Y, const int incY, dcomplex *A, const int lda);
typedef void (*zher_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                const int N, const double alpha, const dcomplex *X, const int incX,
                dcomplex *A, const int lda);
typedef void (*zhpr_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo,
                const int N, const double alpha, const dcomplex *X,
                const int incX, dcomplex *A);
typedef void (*zher2_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo, const int N,
                const dcomplex *alpha, const dcomplex *X, const int incX,
                const dcomplex *Y, const int incY, dcomplex *A, const int lda);
typedef void (*zhpr2_t)(const enum CBLAS_ORDER order, const enum CBLAS_UPLO Uplo, const int N,
                const dcomplex *alpha, const dcomplex *X, const int incX,
                const dcomplex *Y, const int incY, dcomplex *Ap);

/*
 * ===========================================================================
 * Prototypes for level 3 BLAS
 * ===========================================================================
 */

/* 
 * Routines with standard 4 prefixes (S, D, C, Z)
 */
typedef void (*sgemm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_TRANSPOSE TransA,
                 const enum CBLAS_TRANSPOSE TransB, const int M, const int N,
                 const int K, const float alpha, const float *A,
                 const int lda, const float *B, const int ldb,
                 const float beta, float *C, const int ldc);
typedef void (*ssymm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_SIDE Side,
                 const enum CBLAS_UPLO Uplo, const int M, const int N,
                 const float alpha, const float *A, const int lda,
                 const float *B, const int ldb, const float beta,
                 float *C, const int ldc);
typedef void (*ssyrk_t)(const enum CBLAS_ORDER Order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE Trans, const int N, const int K,
                 const float alpha, const float *A, const int lda,
                 const float beta, float *C, const int ldc);
typedef void (*ssyr2k_t)(const enum CBLAS_ORDER Order, const enum CBLAS_UPLO Uplo,
                  const enum CBLAS_TRANSPOSE Trans, const int N, const int K,
                  const float alpha, const float *A, const int lda,
                  const float *B, const int ldb, const float beta,
                  float *C, const int ldc);
typedef void (*strmm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_SIDE Side,
                 const enum CBLAS_UPLO Uplo, const enum CBLAS_TRANSPOSE TransA,
                 const enum CBLAS_DIAG Diag, const int M, const int N,
                 const float alpha, const float *A, const int lda,
                 float *B, const int ldb);
typedef void (*strsm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_SIDE Side,
                 const enum CBLAS_UPLO Uplo, const enum CBLAS_TRANSPOSE TransA,
                 const enum CBLAS_DIAG Diag, const int M, const int N,
                 const float alpha, const float *A, const int lda,
                 float *B, const int ldb);

typedef void (*dgemm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_TRANSPOSE TransA,
                 const enum CBLAS_TRANSPOSE TransB, const int M, const int N,
                 const int K, const double alpha, const double *A,
                 const int lda, const double *B, const int ldb,
                 const double beta, double *C, const int ldc);
typedef void (*dsymm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_SIDE Side,
                 const enum CBLAS_UPLO Uplo, const int M, const int N,
                 const double alpha, const double *A, const int lda,
                 const double *B, const int ldb, const double beta,
                 double *C, const int ldc);
typedef void (*dsyrk_t)(const enum CBLAS_ORDER Order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE Trans, const int N, const int K,
                 const double alpha, const double *A, const int lda,
                 const double beta, double *C, const int ldc);
typedef void (*dsyr2k_t)(const enum CBLAS_ORDER Order, const enum CBLAS_UPLO Uplo,
                  const enum CBLAS_TRANSPOSE Trans, const int N, const int K,
                  const double alpha, const double *A, const int lda,
                  const double *B, const int ldb, const double beta,
                  double *C, const int ldc);
typedef void (*dtrmm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_SIDE Side,
                 const enum CBLAS_UPLO Uplo, const enum CBLAS_TRANSPOSE TransA,
                 const enum CBLAS_DIAG Diag, const int M, const int N,
                 const double alpha, const double *A, const int lda,
                 double *B, const int ldb);
typedef void (*dtrsm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_SIDE Side,
                 const enum CBLAS_UPLO Uplo, const enum CBLAS_TRANSPOSE TransA,
                 const enum CBLAS_DIAG Diag, const int M, const int N,
                 const double alpha, const double *A, const int lda,
                 double *B, const int ldb);

typedef void (*cgemm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_TRANSPOSE TransA,
                 const enum CBLAS_TRANSPOSE TransB, const int M, const int N,
                 const int K, const scomplex *alpha, const scomplex *A,
                 const int lda, const scomplex *B, const int ldb,
                 const scomplex *beta, scomplex *C, const int ldc);
typedef void (*csymm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_SIDE Side,
                 const enum CBLAS_UPLO Uplo, const int M, const int N,
                 const scomplex *alpha, const scomplex *A, const int lda,
                 const scomplex *B, const int ldb, const scomplex *beta,
                 scomplex *C, const int ldc);
typedef void (*csyrk_t)(const enum CBLAS_ORDER Order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE Trans, const int N, const int K,
                 const scomplex *alpha, const scomplex *A, const int lda,
                 const scomplex *beta, scomplex *C, const int ldc);
typedef void (*csyr2k_t)(const enum CBLAS_ORDER Order, const enum CBLAS_UPLO Uplo,
                  const enum CBLAS_TRANSPOSE Trans, const int N, const int K,
                  const scomplex *alpha, const scomplex *A, const int lda,
                  const scomplex *B, const int ldb, const scomplex *beta,
                  scomplex *C, const int ldc);
typedef void (*ctrmm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_SIDE Side,
                 const enum CBLAS_UPLO Uplo, const enum CBLAS_TRANSPOSE TransA,
                 const enum CBLAS_DIAG Diag, const int M, const int N,
                 const scomplex *alpha, const scomplex *A, const int lda,
                 scomplex *B, const int ldb);
typedef void (*ctrsm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_SIDE Side,
                 const enum CBLAS_UPLO Uplo, const enum CBLAS_TRANSPOSE TransA,
                 const enum CBLAS_DIAG Diag, const int M, const int N,
                 const scomplex *alpha, const scomplex *A, const int lda,
                 scomplex *B, const int ldb);

typedef void (*zgemm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_TRANSPOSE TransA,
                 const enum CBLAS_TRANSPOSE TransB, const int M, const int N,
                 const int K, const dcomplex *alpha, const dcomplex *A,
                 const int lda, const dcomplex *B, const int ldb,
                 const dcomplex *beta, dcomplex *C, const int ldc);
typedef void (*zsymm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_SIDE Side,
                 const enum CBLAS_UPLO Uplo, const int M, const int N,
                 const dcomplex *alpha, const dcomplex *A, const int lda,
                 const dcomplex *B, const int ldb, const dcomplex *beta,
                 dcomplex *C, const int ldc);
typedef void (*zsyrk_t)(const enum CBLAS_ORDER Order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE Trans, const int N, const int K,
                 const dcomplex *alpha, const dcomplex *A, const int lda,
                 const dcomplex *beta, dcomplex *C, const int ldc);
typedef void (*zsyr2k_t)(const enum CBLAS_ORDER Order, const enum CBLAS_UPLO Uplo,
                  const enum CBLAS_TRANSPOSE Trans, const int N, const int K,
                  const dcomplex *alpha, const dcomplex *A, const int lda,
                  const dcomplex *B, const int ldb, const dcomplex *beta,
                  dcomplex *C, const int ldc);
typedef void (*ztrmm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_SIDE Side,
                 const enum CBLAS_UPLO Uplo, const enum CBLAS_TRANSPOSE TransA,
                 const enum CBLAS_DIAG Diag, const int M, const int N,
                 const dcomplex *alpha, const dcomplex *A, const int lda,
                 dcomplex *B, const int ldb);
typedef void (*ztrsm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_SIDE Side,
                 const enum CBLAS_UPLO Uplo, const enum CBLAS_TRANSPOSE TransA,
                 const enum CBLAS_DIAG Diag, const int M, const int N,
                 const dcomplex *alpha, const dcomplex *A, const int lda,
                 dcomplex *B, const int ldb);


/* 
 * Routines with prefixes C and Z only
 */
typedef void (*chemm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_SIDE Side,
                 const enum CBLAS_UPLO Uplo, const int M, const int N,
                 const scomplex *alpha, const scomplex *A, const int lda,
                 const scomplex *B, const int ldb, const scomplex *beta,
                 scomplex *C, const int ldc);
typedef void (*cherk_t)(const enum CBLAS_ORDER Order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE Trans, const int N, const int K,
                 const float alpha, const scomplex *A, const int lda,
                 const float beta, scomplex *C, const int ldc);
typedef void (*cher2k_t)(const enum CBLAS_ORDER Order, const enum CBLAS_UPLO Uplo,
                  const enum CBLAS_TRANSPOSE Trans, const int N, const int K,
                  const scomplex *alpha, const scomplex *A, const int lda,
                  const scomplex *B, const int ldb, const float beta,
                  scomplex *C, const int ldc);

typedef void (*zhemm_t)(const enum CBLAS_ORDER Order, const enum CBLAS_SIDE Side,
                 const enum CBLAS_UPLO Uplo, const int M, const int N,
                 const dcomplex *alpha, const dcomplex *A, const int lda,
                 const dcomplex *B, const int ldb, const dcomplex *beta,
                 dcomplex *C, const int ldc);
typedef void (*zherk_t)(const enum CBLAS_ORDER Order, const enum CBLAS_UPLO Uplo,
                 const enum CBLAS_TRANSPOSE Trans, const int N, const int K,
                 const double alpha, const dcomplex *A, const int lda,
                 const double beta, dcomplex *C, const int ldc);
typedef void (*zher2k_t)(const enum CBLAS_ORDER Order, const enum CBLAS_UPLO Uplo,
                  const enum CBLAS_TRANSPOSE Trans, const int N, const int K,
                  const dcomplex *alpha, const dcomplex *A, const int lda,
                  const dcomplex *B, const int ldb, const double beta,
                  dcomplex *C, const int ldc);

typedef void (*xerbla_t)(int p, const char *rout, const char *form, ...);

#ifdef __cplusplus
}
#endif
#endif
