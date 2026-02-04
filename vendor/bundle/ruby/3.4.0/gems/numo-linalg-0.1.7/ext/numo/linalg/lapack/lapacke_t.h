#ifndef NUMO_LAPACKE_T_H
#define NUMO_LAPACKE_T_H

/* C-LAPACK function prototypes */

typedef lapack_int (*sbdsdc_t)( int matrix_order, char uplo, char compq,
                           lapack_int n, float* d, float* e, float* u,
                           lapack_int ldu, float* vt, lapack_int ldvt, float* q,
                           lapack_int* iq );
typedef lapack_int (*dbdsdc_t)( int matrix_order, char uplo, char compq,
                           lapack_int n, double* d, double* e, double* u,
                           lapack_int ldu, double* vt, lapack_int ldvt,
                           double* q, lapack_int* iq );

typedef lapack_int (*sbdsqr_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int ncvt, lapack_int nru, lapack_int ncc,
                           float* d, float* e, float* vt, lapack_int ldvt,
                           float* u, lapack_int ldu, float* c, lapack_int ldc );
typedef lapack_int (*dbdsqr_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int ncvt, lapack_int nru, lapack_int ncc,
                           double* d, double* e, double* vt, lapack_int ldvt,
                           double* u, lapack_int ldu, double* c,
                           lapack_int ldc );
typedef lapack_int (*cbdsqr_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int ncvt, lapack_int nru, lapack_int ncc,
                           float* d, float* e, lapack_complex_float* vt,
                           lapack_int ldvt, lapack_complex_float* u,
                           lapack_int ldu, lapack_complex_float* c,
                           lapack_int ldc );
typedef lapack_int (*zbdsqr_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int ncvt, lapack_int nru, lapack_int ncc,
                           double* d, double* e, lapack_complex_double* vt,
                           lapack_int ldvt, lapack_complex_double* u,
                           lapack_int ldu, lapack_complex_double* c,
                           lapack_int ldc );

typedef lapack_int (*sdisna_t)( char job, lapack_int m, lapack_int n, const float* d,
                           float* sep );
typedef lapack_int (*ddisna_t)( char job, lapack_int m, lapack_int n,
                           const double* d, double* sep );

typedef lapack_int (*sgbbrd_t)( int matrix_order, char vect, lapack_int m,
                           lapack_int n, lapack_int ncc, lapack_int kl,
                           lapack_int ku, float* ab, lapack_int ldab, float* d,
                           float* e, float* q, lapack_int ldq, float* pt,
                           lapack_int ldpt, float* c, lapack_int ldc );
typedef lapack_int (*dgbbrd_t)( int matrix_order, char vect, lapack_int m,
                           lapack_int n, lapack_int ncc, lapack_int kl,
                           lapack_int ku, double* ab, lapack_int ldab,
                           double* d, double* e, double* q, lapack_int ldq,
                           double* pt, lapack_int ldpt, double* c,
                           lapack_int ldc );
typedef lapack_int (*cgbbrd_t)( int matrix_order, char vect, lapack_int m,
                           lapack_int n, lapack_int ncc, lapack_int kl,
                           lapack_int ku, lapack_complex_float* ab,
                           lapack_int ldab, float* d, float* e,
                           lapack_complex_float* q, lapack_int ldq,
                           lapack_complex_float* pt, lapack_int ldpt,
                           lapack_complex_float* c, lapack_int ldc );
typedef lapack_int (*zgbbrd_t)( int matrix_order, char vect, lapack_int m,
                           lapack_int n, lapack_int ncc, lapack_int kl,
                           lapack_int ku, lapack_complex_double* ab,
                           lapack_int ldab, double* d, double* e,
                           lapack_complex_double* q, lapack_int ldq,
                           lapack_complex_double* pt, lapack_int ldpt,
                           lapack_complex_double* c, lapack_int ldc );

typedef lapack_int (*sgbcon_t)( int matrix_order, char norm, lapack_int n,
                           lapack_int kl, lapack_int ku, const float* ab,
                           lapack_int ldab, const lapack_int* ipiv, float anorm,
                           float* rcond );
typedef lapack_int (*dgbcon_t)( int matrix_order, char norm, lapack_int n,
                           lapack_int kl, lapack_int ku, const double* ab,
                           lapack_int ldab, const lapack_int* ipiv,
                           double anorm, double* rcond );
typedef lapack_int (*cgbcon_t)( int matrix_order, char norm, lapack_int n,
                           lapack_int kl, lapack_int ku,
                           const lapack_complex_float* ab, lapack_int ldab,
                           const lapack_int* ipiv, float anorm, float* rcond );
typedef lapack_int (*zgbcon_t)( int matrix_order, char norm, lapack_int n,
                           lapack_int kl, lapack_int ku,
                           const lapack_complex_double* ab, lapack_int ldab,
                           const lapack_int* ipiv, double anorm,
                           double* rcond );

typedef lapack_int (*sgbequ_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int kl, lapack_int ku, const float* ab,
                           lapack_int ldab, float* r, float* c, float* rowcnd,
                           float* colcnd, float* amax );
typedef lapack_int (*dgbequ_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int kl, lapack_int ku, const double* ab,
                           lapack_int ldab, double* r, double* c,
                           double* rowcnd, double* colcnd, double* amax );
typedef lapack_int (*cgbequ_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int kl, lapack_int ku,
                           const lapack_complex_float* ab, lapack_int ldab,
                           float* r, float* c, float* rowcnd, float* colcnd,
                           float* amax );
typedef lapack_int (*zgbequ_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int kl, lapack_int ku,
                           const lapack_complex_double* ab, lapack_int ldab,
                           double* r, double* c, double* rowcnd, double* colcnd,
                           double* amax );

typedef lapack_int (*sgbequb_t)( int matrix_order, lapack_int m, lapack_int n,
                            lapack_int kl, lapack_int ku, const float* ab,
                            lapack_int ldab, float* r, float* c, float* rowcnd,
                            float* colcnd, float* amax );
typedef lapack_int (*dgbequb_t)( int matrix_order, lapack_int m, lapack_int n,
                            lapack_int kl, lapack_int ku, const double* ab,
                            lapack_int ldab, double* r, double* c,
                            double* rowcnd, double* colcnd, double* amax );
typedef lapack_int (*cgbequb_t)( int matrix_order, lapack_int m, lapack_int n,
                            lapack_int kl, lapack_int ku,
                            const lapack_complex_float* ab, lapack_int ldab,
                            float* r, float* c, float* rowcnd, float* colcnd,
                            float* amax );
typedef lapack_int (*zgbequb_t)( int matrix_order, lapack_int m, lapack_int n,
                            lapack_int kl, lapack_int ku,
                            const lapack_complex_double* ab, lapack_int ldab,
                            double* r, double* c, double* rowcnd,
                            double* colcnd, double* amax );

typedef lapack_int (*sgbrfs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int kl, lapack_int ku, lapack_int nrhs,
                           const float* ab, lapack_int ldab, const float* afb,
                           lapack_int ldafb, const lapack_int* ipiv,
                           const float* b, lapack_int ldb, float* x,
                           lapack_int ldx, float* ferr, float* berr );
typedef lapack_int (*dgbrfs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int kl, lapack_int ku, lapack_int nrhs,
                           const double* ab, lapack_int ldab, const double* afb,
                           lapack_int ldafb, const lapack_int* ipiv,
                           const double* b, lapack_int ldb, double* x,
                           lapack_int ldx, double* ferr, double* berr );
typedef lapack_int (*cgbrfs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int kl, lapack_int ku, lapack_int nrhs,
                           const lapack_complex_float* ab, lapack_int ldab,
                           const lapack_complex_float* afb, lapack_int ldafb,
                           const lapack_int* ipiv,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx, float* ferr,
                           float* berr );
typedef lapack_int (*zgbrfs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int kl, lapack_int ku, lapack_int nrhs,
                           const lapack_complex_double* ab, lapack_int ldab,
                           const lapack_complex_double* afb, lapack_int ldafb,
                           const lapack_int* ipiv,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* ferr, double* berr );

typedef lapack_int (*sgbrfsx_t)( int matrix_order, char trans, char equed,
                            lapack_int n, lapack_int kl, lapack_int ku,
                            lapack_int nrhs, const float* ab, lapack_int ldab,
                            const float* afb, lapack_int ldafb,
                            const lapack_int* ipiv, const float* r,
                            const float* c, const float* b, lapack_int ldb,
                            float* x, lapack_int ldx, float* rcond, float* berr,
                            lapack_int n_err_bnds, float* err_bnds_norm,
                            float* err_bnds_comp, lapack_int nparams,
                            float* params );
typedef lapack_int (*dgbrfsx_t)( int matrix_order, char trans, char equed,
                            lapack_int n, lapack_int kl, lapack_int ku,
                            lapack_int nrhs, const double* ab, lapack_int ldab,
                            const double* afb, lapack_int ldafb,
                            const lapack_int* ipiv, const double* r,
                            const double* c, const double* b, lapack_int ldb,
                            double* x, lapack_int ldx, double* rcond,
                            double* berr, lapack_int n_err_bnds,
                            double* err_bnds_norm, double* err_bnds_comp,
                            lapack_int nparams, double* params );
typedef lapack_int (*cgbrfsx_t)( int matrix_order, char trans, char equed,
                            lapack_int n, lapack_int kl, lapack_int ku,
                            lapack_int nrhs, const lapack_complex_float* ab,
                            lapack_int ldab, const lapack_complex_float* afb,
                            lapack_int ldafb, const lapack_int* ipiv,
                            const float* r, const float* c,
                            const lapack_complex_float* b, lapack_int ldb,
                            lapack_complex_float* x, lapack_int ldx,
                            float* rcond, float* berr, lapack_int n_err_bnds,
                            float* err_bnds_norm, float* err_bnds_comp,
                            lapack_int nparams, float* params );
typedef lapack_int (*zgbrfsx_t)( int matrix_order, char trans, char equed,
                            lapack_int n, lapack_int kl, lapack_int ku,
                            lapack_int nrhs, const lapack_complex_double* ab,
                            lapack_int ldab, const lapack_complex_double* afb,
                            lapack_int ldafb, const lapack_int* ipiv,
                            const double* r, const double* c,
                            const lapack_complex_double* b, lapack_int ldb,
                            lapack_complex_double* x, lapack_int ldx,
                            double* rcond, double* berr, lapack_int n_err_bnds,
                            double* err_bnds_norm, double* err_bnds_comp,
                            lapack_int nparams, double* params );

typedef lapack_int (*sgbsv_t)( int matrix_order, lapack_int n, lapack_int kl,
                          lapack_int ku, lapack_int nrhs, float* ab,
                          lapack_int ldab, lapack_int* ipiv, float* b,
                          lapack_int ldb );
typedef lapack_int (*dgbsv_t)( int matrix_order, lapack_int n, lapack_int kl,
                          lapack_int ku, lapack_int nrhs, double* ab,
                          lapack_int ldab, lapack_int* ipiv, double* b,
                          lapack_int ldb );
typedef lapack_int (*cgbsv_t)( int matrix_order, lapack_int n, lapack_int kl,
                          lapack_int ku, lapack_int nrhs,
                          lapack_complex_float* ab, lapack_int ldab,
                          lapack_int* ipiv, lapack_complex_float* b,
                          lapack_int ldb );
typedef lapack_int (*zgbsv_t)( int matrix_order, lapack_int n, lapack_int kl,
                          lapack_int ku, lapack_int nrhs,
                          lapack_complex_double* ab, lapack_int ldab,
                          lapack_int* ipiv, lapack_complex_double* b,
                          lapack_int ldb );

typedef lapack_int (*sgbsvx_t)( int matrix_order, char fact, char trans,
                           lapack_int n, lapack_int kl, lapack_int ku,
                           lapack_int nrhs, float* ab, lapack_int ldab,
                           float* afb, lapack_int ldafb, lapack_int* ipiv,
                           char* equed, float* r, float* c, float* b,
                           lapack_int ldb, float* x, lapack_int ldx,
                           float* rcond, float* ferr, float* berr,
                           float* rpivot );
typedef lapack_int (*dgbsvx_t)( int matrix_order, char fact, char trans,
                           lapack_int n, lapack_int kl, lapack_int ku,
                           lapack_int nrhs, double* ab, lapack_int ldab,
                           double* afb, lapack_int ldafb, lapack_int* ipiv,
                           char* equed, double* r, double* c, double* b,
                           lapack_int ldb, double* x, lapack_int ldx,
                           double* rcond, double* ferr, double* berr,
                           double* rpivot );
typedef lapack_int (*cgbsvx_t)( int matrix_order, char fact, char trans,
                           lapack_int n, lapack_int kl, lapack_int ku,
                           lapack_int nrhs, lapack_complex_float* ab,
                           lapack_int ldab, lapack_complex_float* afb,
                           lapack_int ldafb, lapack_int* ipiv, char* equed,
                           float* r, float* c, lapack_complex_float* b,
                           lapack_int ldb, lapack_complex_float* x,
                           lapack_int ldx, float* rcond, float* ferr,
                           float* berr, float* rpivot );
typedef lapack_int (*zgbsvx_t)( int matrix_order, char fact, char trans,
                           lapack_int n, lapack_int kl, lapack_int ku,
                           lapack_int nrhs, lapack_complex_double* ab,
                           lapack_int ldab, lapack_complex_double* afb,
                           lapack_int ldafb, lapack_int* ipiv, char* equed,
                           double* r, double* c, lapack_complex_double* b,
                           lapack_int ldb, lapack_complex_double* x,
                           lapack_int ldx, double* rcond, double* ferr,
                           double* berr, double* rpivot );

typedef lapack_int (*sgbsvxx_t)( int matrix_order, char fact, char trans,
                            lapack_int n, lapack_int kl, lapack_int ku,
                            lapack_int nrhs, float* ab, lapack_int ldab,
                            float* afb, lapack_int ldafb, lapack_int* ipiv,
                            char* equed, float* r, float* c, float* b,
                            lapack_int ldb, float* x, lapack_int ldx,
                            float* rcond, float* rpvgrw, float* berr,
                            lapack_int n_err_bnds, float* err_bnds_norm,
                            float* err_bnds_comp, lapack_int nparams,
                            float* params );
typedef lapack_int (*dgbsvxx_t)( int matrix_order, char fact, char trans,
                            lapack_int n, lapack_int kl, lapack_int ku,
                            lapack_int nrhs, double* ab, lapack_int ldab,
                            double* afb, lapack_int ldafb, lapack_int* ipiv,
                            char* equed, double* r, double* c, double* b,
                            lapack_int ldb, double* x, lapack_int ldx,
                            double* rcond, double* rpvgrw, double* berr,
                            lapack_int n_err_bnds, double* err_bnds_norm,
                            double* err_bnds_comp, lapack_int nparams,
                            double* params );
typedef lapack_int (*cgbsvxx_t)( int matrix_order, char fact, char trans,
                            lapack_int n, lapack_int kl, lapack_int ku,
                            lapack_int nrhs, lapack_complex_float* ab,
                            lapack_int ldab, lapack_complex_float* afb,
                            lapack_int ldafb, lapack_int* ipiv, char* equed,
                            float* r, float* c, lapack_complex_float* b,
                            lapack_int ldb, lapack_complex_float* x,
                            lapack_int ldx, float* rcond, float* rpvgrw,
                            float* berr, lapack_int n_err_bnds,
                            float* err_bnds_norm, float* err_bnds_comp,
                            lapack_int nparams, float* params );
typedef lapack_int (*zgbsvxx_t)( int matrix_order, char fact, char trans,
                            lapack_int n, lapack_int kl, lapack_int ku,
                            lapack_int nrhs, lapack_complex_double* ab,
                            lapack_int ldab, lapack_complex_double* afb,
                            lapack_int ldafb, lapack_int* ipiv, char* equed,
                            double* r, double* c, lapack_complex_double* b,
                            lapack_int ldb, lapack_complex_double* x,
                            lapack_int ldx, double* rcond, double* rpvgrw,
                            double* berr, lapack_int n_err_bnds,
                            double* err_bnds_norm, double* err_bnds_comp,
                            lapack_int nparams, double* params );

typedef lapack_int (*sgbtrf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int kl, lapack_int ku, float* ab,
                           lapack_int ldab, lapack_int* ipiv );
typedef lapack_int (*dgbtrf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int kl, lapack_int ku, double* ab,
                           lapack_int ldab, lapack_int* ipiv );
typedef lapack_int (*cgbtrf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int kl, lapack_int ku,
                           lapack_complex_float* ab, lapack_int ldab,
                           lapack_int* ipiv );
typedef lapack_int (*zgbtrf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int kl, lapack_int ku,
                           lapack_complex_double* ab, lapack_int ldab,
                           lapack_int* ipiv );

typedef lapack_int (*sgbtrs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int kl, lapack_int ku, lapack_int nrhs,
                           const float* ab, lapack_int ldab,
                           const lapack_int* ipiv, float* b, lapack_int ldb );
typedef lapack_int (*dgbtrs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int kl, lapack_int ku, lapack_int nrhs,
                           const double* ab, lapack_int ldab,
                           const lapack_int* ipiv, double* b, lapack_int ldb );
typedef lapack_int (*cgbtrs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int kl, lapack_int ku, lapack_int nrhs,
                           const lapack_complex_float* ab, lapack_int ldab,
                           const lapack_int* ipiv, lapack_complex_float* b,
                           lapack_int ldb );
typedef lapack_int (*zgbtrs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int kl, lapack_int ku, lapack_int nrhs,
                           const lapack_complex_double* ab, lapack_int ldab,
                           const lapack_int* ipiv, lapack_complex_double* b,
                           lapack_int ldb );

typedef lapack_int (*sgebak_t)( int matrix_order, char job, char side, lapack_int n,
                           lapack_int ilo, lapack_int ihi, const float* scale,
                           lapack_int m, float* v, lapack_int ldv );
typedef lapack_int (*dgebak_t)( int matrix_order, char job, char side, lapack_int n,
                           lapack_int ilo, lapack_int ihi, const double* scale,
                           lapack_int m, double* v, lapack_int ldv );
typedef lapack_int (*cgebak_t)( int matrix_order, char job, char side, lapack_int n,
                           lapack_int ilo, lapack_int ihi, const float* scale,
                           lapack_int m, lapack_complex_float* v,
                           lapack_int ldv );
typedef lapack_int (*zgebak_t)( int matrix_order, char job, char side, lapack_int n,
                           lapack_int ilo, lapack_int ihi, const double* scale,
                           lapack_int m, lapack_complex_double* v,
                           lapack_int ldv );

typedef lapack_int (*sgebal_t)( int matrix_order, char job, lapack_int n, float* a,
                           lapack_int lda, lapack_int* ilo, lapack_int* ihi,
                           float* scale );
typedef lapack_int (*dgebal_t)( int matrix_order, char job, lapack_int n, double* a,
                           lapack_int lda, lapack_int* ilo, lapack_int* ihi,
                           double* scale );
typedef lapack_int (*cgebal_t)( int matrix_order, char job, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_int* ilo, lapack_int* ihi, float* scale );
typedef lapack_int (*zgebal_t)( int matrix_order, char job, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_int* ilo, lapack_int* ihi, double* scale );

typedef lapack_int (*sgebrd_t)( int matrix_order, lapack_int m, lapack_int n,
                           float* a, lapack_int lda, float* d, float* e,
                           float* tauq, float* taup );
typedef lapack_int (*dgebrd_t)( int matrix_order, lapack_int m, lapack_int n,
                           double* a, lapack_int lda, double* d, double* e,
                           double* tauq, double* taup );
typedef lapack_int (*cgebrd_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_float* a, lapack_int lda, float* d,
                           float* e, lapack_complex_float* tauq,
                           lapack_complex_float* taup );
typedef lapack_int (*zgebrd_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_double* a, lapack_int lda, double* d,
                           double* e, lapack_complex_double* tauq,
                           lapack_complex_double* taup );

typedef lapack_int (*sgecon_t)( int matrix_order, char norm, lapack_int n,
                           const float* a, lapack_int lda, float anorm,
                           float* rcond );
typedef lapack_int (*dgecon_t)( int matrix_order, char norm, lapack_int n,
                           const double* a, lapack_int lda, double anorm,
                           double* rcond );
typedef lapack_int (*cgecon_t)( int matrix_order, char norm, lapack_int n,
                           const lapack_complex_float* a, lapack_int lda,
                           float anorm, float* rcond );
typedef lapack_int (*zgecon_t)( int matrix_order, char norm, lapack_int n,
                           const lapack_complex_double* a, lapack_int lda,
                           double anorm, double* rcond );

typedef lapack_int (*sgeequ_t)( int matrix_order, lapack_int m, lapack_int n,
                           const float* a, lapack_int lda, float* r, float* c,
                           float* rowcnd, float* colcnd, float* amax );
typedef lapack_int (*dgeequ_t)( int matrix_order, lapack_int m, lapack_int n,
                           const double* a, lapack_int lda, double* r,
                           double* c, double* rowcnd, double* colcnd,
                           double* amax );
typedef lapack_int (*cgeequ_t)( int matrix_order, lapack_int m, lapack_int n,
                           const lapack_complex_float* a, lapack_int lda,
                           float* r, float* c, float* rowcnd, float* colcnd,
                           float* amax );
typedef lapack_int (*zgeequ_t)( int matrix_order, lapack_int m, lapack_int n,
                           const lapack_complex_double* a, lapack_int lda,
                           double* r, double* c, double* rowcnd, double* colcnd,
                           double* amax );

typedef lapack_int (*sgeequb_t)( int matrix_order, lapack_int m, lapack_int n,
                            const float* a, lapack_int lda, float* r, float* c,
                            float* rowcnd, float* colcnd, float* amax );
typedef lapack_int (*dgeequb_t)( int matrix_order, lapack_int m, lapack_int n,
                            const double* a, lapack_int lda, double* r,
                            double* c, double* rowcnd, double* colcnd,
                            double* amax );
typedef lapack_int (*cgeequb_t)( int matrix_order, lapack_int m, lapack_int n,
                            const lapack_complex_float* a, lapack_int lda,
                            float* r, float* c, float* rowcnd, float* colcnd,
                            float* amax );
typedef lapack_int (*zgeequb_t)( int matrix_order, lapack_int m, lapack_int n,
                            const lapack_complex_double* a, lapack_int lda,
                            double* r, double* c, double* rowcnd,
                            double* colcnd, double* amax );

typedef lapack_int (*sgees_t)( int matrix_order, char jobvs, char sort,
                          LAPACK_S_SELECT2 select, lapack_int n, float* a,
                          lapack_int lda, lapack_int* sdim, float* wr,
                          float* wi, float* vs, lapack_int ldvs );
typedef lapack_int (*dgees_t)( int matrix_order, char jobvs, char sort,
                          LAPACK_D_SELECT2 select, lapack_int n, double* a,
                          lapack_int lda, lapack_int* sdim, double* wr,
                          double* wi, double* vs, lapack_int ldvs );
typedef lapack_int (*cgees_t)( int matrix_order, char jobvs, char sort,
                          LAPACK_C_SELECT1 select, lapack_int n,
                          lapack_complex_float* a, lapack_int lda,
                          lapack_int* sdim, lapack_complex_float* w,
                          lapack_complex_float* vs, lapack_int ldvs );
typedef lapack_int (*zgees_t)( int matrix_order, char jobvs, char sort,
                          LAPACK_Z_SELECT1 select, lapack_int n,
                          lapack_complex_double* a, lapack_int lda,
                          lapack_int* sdim, lapack_complex_double* w,
                          lapack_complex_double* vs, lapack_int ldvs );

typedef lapack_int (*sgeesx_t)( int matrix_order, char jobvs, char sort,
                           LAPACK_S_SELECT2 select, char sense, lapack_int n,
                           float* a, lapack_int lda, lapack_int* sdim,
                           float* wr, float* wi, float* vs, lapack_int ldvs,
                           float* rconde, float* rcondv );
typedef lapack_int (*dgeesx_t)( int matrix_order, char jobvs, char sort,
                           LAPACK_D_SELECT2 select, char sense, lapack_int n,
                           double* a, lapack_int lda, lapack_int* sdim,
                           double* wr, double* wi, double* vs, lapack_int ldvs,
                           double* rconde, double* rcondv );
typedef lapack_int (*cgeesx_t)( int matrix_order, char jobvs, char sort,
                           LAPACK_C_SELECT1 select, char sense, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_int* sdim, lapack_complex_float* w,
                           lapack_complex_float* vs, lapack_int ldvs,
                           float* rconde, float* rcondv );
typedef lapack_int (*zgeesx_t)( int matrix_order, char jobvs, char sort,
                           LAPACK_Z_SELECT1 select, char sense, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_int* sdim, lapack_complex_double* w,
                           lapack_complex_double* vs, lapack_int ldvs,
                           double* rconde, double* rcondv );

typedef lapack_int (*sgeev_t)( int matrix_order, char jobvl, char jobvr,
                          lapack_int n, float* a, lapack_int lda, float* wr,
                          float* wi, float* vl, lapack_int ldvl, float* vr,
                          lapack_int ldvr );
typedef lapack_int (*dgeev_t)( int matrix_order, char jobvl, char jobvr,
                          lapack_int n, double* a, lapack_int lda, double* wr,
                          double* wi, double* vl, lapack_int ldvl, double* vr,
                          lapack_int ldvr );
typedef lapack_int (*cgeev_t)( int matrix_order, char jobvl, char jobvr,
                          lapack_int n, lapack_complex_float* a, lapack_int lda,
                          lapack_complex_float* w, lapack_complex_float* vl,
                          lapack_int ldvl, lapack_complex_float* vr,
                          lapack_int ldvr );
typedef lapack_int (*zgeev_t)( int matrix_order, char jobvl, char jobvr,
                          lapack_int n, lapack_complex_double* a,
                          lapack_int lda, lapack_complex_double* w,
                          lapack_complex_double* vl, lapack_int ldvl,
                          lapack_complex_double* vr, lapack_int ldvr );

typedef lapack_int (*sgeevx_t)( int matrix_order, char balanc, char jobvl,
                           char jobvr, char sense, lapack_int n, float* a,
                           lapack_int lda, float* wr, float* wi, float* vl,
                           lapack_int ldvl, float* vr, lapack_int ldvr,
                           lapack_int* ilo, lapack_int* ihi, float* scale,
                           float* abnrm, float* rconde, float* rcondv );
typedef lapack_int (*dgeevx_t)( int matrix_order, char balanc, char jobvl,
                           char jobvr, char sense, lapack_int n, double* a,
                           lapack_int lda, double* wr, double* wi, double* vl,
                           lapack_int ldvl, double* vr, lapack_int ldvr,
                           lapack_int* ilo, lapack_int* ihi, double* scale,
                           double* abnrm, double* rconde, double* rcondv );
typedef lapack_int (*cgeevx_t)( int matrix_order, char balanc, char jobvl,
                           char jobvr, char sense, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* w, lapack_complex_float* vl,
                           lapack_int ldvl, lapack_complex_float* vr,
                           lapack_int ldvr, lapack_int* ilo, lapack_int* ihi,
                           float* scale, float* abnrm, float* rconde,
                           float* rcondv );
typedef lapack_int (*zgeevx_t)( int matrix_order, char balanc, char jobvl,
                           char jobvr, char sense, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* w, lapack_complex_double* vl,
                           lapack_int ldvl, lapack_complex_double* vr,
                           lapack_int ldvr, lapack_int* ilo, lapack_int* ihi,
                           double* scale, double* abnrm, double* rconde,
                           double* rcondv );

typedef lapack_int (*sgehrd_t)( int matrix_order, lapack_int n, lapack_int ilo,
                           lapack_int ihi, float* a, lapack_int lda,
                           float* tau );
typedef lapack_int (*dgehrd_t)( int matrix_order, lapack_int n, lapack_int ilo,
                           lapack_int ihi, double* a, lapack_int lda,
                           double* tau );
typedef lapack_int (*cgehrd_t)( int matrix_order, lapack_int n, lapack_int ilo,
                           lapack_int ihi, lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* tau );
typedef lapack_int (*zgehrd_t)( int matrix_order, lapack_int n, lapack_int ilo,
                           lapack_int ihi, lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* tau );

typedef lapack_int (*sgejsv_t)( int matrix_order, char joba, char jobu, char jobv,
                           char jobr, char jobt, char jobp, lapack_int m,
                           lapack_int n, float* a, lapack_int lda, float* sva,
                           float* u, lapack_int ldu, float* v, lapack_int ldv,
                           float* stat, lapack_int* istat );
typedef lapack_int (*dgejsv_t)( int matrix_order, char joba, char jobu, char jobv,
                           char jobr, char jobt, char jobp, lapack_int m,
                           lapack_int n, double* a, lapack_int lda, double* sva,
                           double* u, lapack_int ldu, double* v, lapack_int ldv,
                           double* stat, lapack_int* istat );

typedef lapack_int (*sgelq2_t)( int matrix_order, lapack_int m, lapack_int n,
                           float* a, lapack_int lda, float* tau );
typedef lapack_int (*dgelq2_t)( int matrix_order, lapack_int m, lapack_int n,
                           double* a, lapack_int lda, double* tau );
typedef lapack_int (*cgelq2_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* tau );
typedef lapack_int (*zgelq2_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* tau );

typedef lapack_int (*sgelqf_t)( int matrix_order, lapack_int m, lapack_int n,
                           float* a, lapack_int lda, float* tau );
typedef lapack_int (*dgelqf_t)( int matrix_order, lapack_int m, lapack_int n,
                           double* a, lapack_int lda, double* tau );
typedef lapack_int (*cgelqf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* tau );
typedef lapack_int (*zgelqf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* tau );

typedef lapack_int (*sgels_t)( int matrix_order, char trans, lapack_int m,
                          lapack_int n, lapack_int nrhs, float* a,
                          lapack_int lda, float* b, lapack_int ldb );
typedef lapack_int (*dgels_t)( int matrix_order, char trans, lapack_int m,
                          lapack_int n, lapack_int nrhs, double* a,
                          lapack_int lda, double* b, lapack_int ldb );
typedef lapack_int (*cgels_t)( int matrix_order, char trans, lapack_int m,
                          lapack_int n, lapack_int nrhs,
                          lapack_complex_float* a, lapack_int lda,
                          lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zgels_t)( int matrix_order, char trans, lapack_int m,
                          lapack_int n, lapack_int nrhs,
                          lapack_complex_double* a, lapack_int lda,
                          lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*sgelsd_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nrhs, float* a, lapack_int lda, float* b,
                           lapack_int ldb, float* s, float rcond,
                           lapack_int* rank );
typedef lapack_int (*dgelsd_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nrhs, double* a, lapack_int lda,
                           double* b, lapack_int ldb, double* s, double rcond,
                           lapack_int* rank );
typedef lapack_int (*cgelsd_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nrhs, lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* b,
                           lapack_int ldb, float* s, float rcond,
                           lapack_int* rank );
typedef lapack_int (*zgelsd_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nrhs, lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* b,
                           lapack_int ldb, double* s, double rcond,
                           lapack_int* rank );

typedef lapack_int (*sgelss_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nrhs, float* a, lapack_int lda, float* b,
                           lapack_int ldb, float* s, float rcond,
                           lapack_int* rank );
typedef lapack_int (*dgelss_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nrhs, double* a, lapack_int lda,
                           double* b, lapack_int ldb, double* s, double rcond,
                           lapack_int* rank );
typedef lapack_int (*cgelss_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nrhs, lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* b,
                           lapack_int ldb, float* s, float rcond,
                           lapack_int* rank );
typedef lapack_int (*zgelss_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nrhs, lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* b,
                           lapack_int ldb, double* s, double rcond,
                           lapack_int* rank );

typedef lapack_int (*sgelsy_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nrhs, float* a, lapack_int lda, float* b,
                           lapack_int ldb, lapack_int* jpvt, float rcond,
                           lapack_int* rank );
typedef lapack_int (*dgelsy_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nrhs, double* a, lapack_int lda,
                           double* b, lapack_int ldb, lapack_int* jpvt,
                           double rcond, lapack_int* rank );
typedef lapack_int (*cgelsy_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nrhs, lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* b,
                           lapack_int ldb, lapack_int* jpvt, float rcond,
                           lapack_int* rank );
typedef lapack_int (*zgelsy_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nrhs, lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* b,
                           lapack_int ldb, lapack_int* jpvt, double rcond,
                           lapack_int* rank );

typedef lapack_int (*sgeqlf_t)( int matrix_order, lapack_int m, lapack_int n,
                           float* a, lapack_int lda, float* tau );
typedef lapack_int (*dgeqlf_t)( int matrix_order, lapack_int m, lapack_int n,
                           double* a, lapack_int lda, double* tau );
typedef lapack_int (*cgeqlf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* tau );
typedef lapack_int (*zgeqlf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* tau );

typedef lapack_int (*sgeqp3_t)( int matrix_order, lapack_int m, lapack_int n,
                           float* a, lapack_int lda, lapack_int* jpvt,
                           float* tau );
typedef lapack_int (*dgeqp3_t)( int matrix_order, lapack_int m, lapack_int n,
                           double* a, lapack_int lda, lapack_int* jpvt,
                           double* tau );
typedef lapack_int (*cgeqp3_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_int* jpvt, lapack_complex_float* tau );
typedef lapack_int (*zgeqp3_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_int* jpvt, lapack_complex_double* tau );

typedef lapack_int (*sgeqpf_t)( int matrix_order, lapack_int m, lapack_int n,
                           float* a, lapack_int lda, lapack_int* jpvt,
                           float* tau );
typedef lapack_int (*dgeqpf_t)( int matrix_order, lapack_int m, lapack_int n,
                           double* a, lapack_int lda, lapack_int* jpvt,
                           double* tau );
typedef lapack_int (*cgeqpf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_int* jpvt, lapack_complex_float* tau );
typedef lapack_int (*zgeqpf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_int* jpvt, lapack_complex_double* tau );

typedef lapack_int (*sgeqr2_t)( int matrix_order, lapack_int m, lapack_int n,
                           float* a, lapack_int lda, float* tau );
typedef lapack_int (*dgeqr2_t)( int matrix_order, lapack_int m, lapack_int n,
                           double* a, lapack_int lda, double* tau );
typedef lapack_int (*cgeqr2_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* tau );
typedef lapack_int (*zgeqr2_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* tau );

typedef lapack_int (*sgeqrf_t)( int matrix_order, lapack_int m, lapack_int n,
                           float* a, lapack_int lda, float* tau );
typedef lapack_int (*dgeqrf_t)( int matrix_order, lapack_int m, lapack_int n,
                           double* a, lapack_int lda, double* tau );
typedef lapack_int (*cgeqrf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* tau );
typedef lapack_int (*zgeqrf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* tau );

typedef lapack_int (*sgeqrfp_t)( int matrix_order, lapack_int m, lapack_int n,
                            float* a, lapack_int lda, float* tau );
typedef lapack_int (*dgeqrfp_t)( int matrix_order, lapack_int m, lapack_int n,
                            double* a, lapack_int lda, double* tau );
typedef lapack_int (*cgeqrfp_t)( int matrix_order, lapack_int m, lapack_int n,
                            lapack_complex_float* a, lapack_int lda,
                            lapack_complex_float* tau );
typedef lapack_int (*zgeqrfp_t)( int matrix_order, lapack_int m, lapack_int n,
                            lapack_complex_double* a, lapack_int lda,
                            lapack_complex_double* tau );

typedef lapack_int (*sgerfs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const float* a, lapack_int lda,
                           const float* af, lapack_int ldaf,
                           const lapack_int* ipiv, const float* b,
                           lapack_int ldb, float* x, lapack_int ldx,
                           float* ferr, float* berr );
typedef lapack_int (*dgerfs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const double* a, lapack_int lda,
                           const double* af, lapack_int ldaf,
                           const lapack_int* ipiv, const double* b,
                           lapack_int ldb, double* x, lapack_int ldx,
                           double* ferr, double* berr );
typedef lapack_int (*cgerfs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* a,
                           lapack_int lda, const lapack_complex_float* af,
                           lapack_int ldaf, const lapack_int* ipiv,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx, float* ferr,
                           float* berr );
typedef lapack_int (*zgerfs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* a,
                           lapack_int lda, const lapack_complex_double* af,
                           lapack_int ldaf, const lapack_int* ipiv,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* ferr, double* berr );

typedef lapack_int (*sgerfsx_t)( int matrix_order, char trans, char equed,
                            lapack_int n, lapack_int nrhs, const float* a,
                            lapack_int lda, const float* af, lapack_int ldaf,
                            const lapack_int* ipiv, const float* r,
                            const float* c, const float* b, lapack_int ldb,
                            float* x, lapack_int ldx, float* rcond, float* berr,
                            lapack_int n_err_bnds, float* err_bnds_norm,
                            float* err_bnds_comp, lapack_int nparams,
                            float* params );
typedef lapack_int (*dgerfsx_t)( int matrix_order, char trans, char equed,
                            lapack_int n, lapack_int nrhs, const double* a,
                            lapack_int lda, const double* af, lapack_int ldaf,
                            const lapack_int* ipiv, const double* r,
                            const double* c, const double* b, lapack_int ldb,
                            double* x, lapack_int ldx, double* rcond,
                            double* berr, lapack_int n_err_bnds,
                            double* err_bnds_norm, double* err_bnds_comp,
                            lapack_int nparams, double* params );
typedef lapack_int (*cgerfsx_t)( int matrix_order, char trans, char equed,
                            lapack_int n, lapack_int nrhs,
                            const lapack_complex_float* a, lapack_int lda,
                            const lapack_complex_float* af, lapack_int ldaf,
                            const lapack_int* ipiv, const float* r,
                            const float* c, const lapack_complex_float* b,
                            lapack_int ldb, lapack_complex_float* x,
                            lapack_int ldx, float* rcond, float* berr,
                            lapack_int n_err_bnds, float* err_bnds_norm,
                            float* err_bnds_comp, lapack_int nparams,
                            float* params );
typedef lapack_int (*zgerfsx_t)( int matrix_order, char trans, char equed,
                            lapack_int n, lapack_int nrhs,
                            const lapack_complex_double* a, lapack_int lda,
                            const lapack_complex_double* af, lapack_int ldaf,
                            const lapack_int* ipiv, const double* r,
                            const double* c, const lapack_complex_double* b,
                            lapack_int ldb, lapack_complex_double* x,
                            lapack_int ldx, double* rcond, double* berr,
                            lapack_int n_err_bnds, double* err_bnds_norm,
                            double* err_bnds_comp, lapack_int nparams,
                            double* params );

typedef lapack_int (*sgerqf_t)( int matrix_order, lapack_int m, lapack_int n,
                           float* a, lapack_int lda, float* tau );
typedef lapack_int (*dgerqf_t)( int matrix_order, lapack_int m, lapack_int n,
                           double* a, lapack_int lda, double* tau );
typedef lapack_int (*cgerqf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* tau );
typedef lapack_int (*zgerqf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* tau );

typedef lapack_int (*sgesdd_t)( int matrix_order, char jobz, lapack_int m,
                           lapack_int n, float* a, lapack_int lda, float* s,
                           float* u, lapack_int ldu, float* vt,
                           lapack_int ldvt );
typedef lapack_int (*dgesdd_t)( int matrix_order, char jobz, lapack_int m,
                           lapack_int n, double* a, lapack_int lda, double* s,
                           double* u, lapack_int ldu, double* vt,
                           lapack_int ldvt );
typedef lapack_int (*cgesdd_t)( int matrix_order, char jobz, lapack_int m,
                           lapack_int n, lapack_complex_float* a,
                           lapack_int lda, float* s, lapack_complex_float* u,
                           lapack_int ldu, lapack_complex_float* vt,
                           lapack_int ldvt );
typedef lapack_int (*zgesdd_t)( int matrix_order, char jobz, lapack_int m,
                           lapack_int n, lapack_complex_double* a,
                           lapack_int lda, double* s, lapack_complex_double* u,
                           lapack_int ldu, lapack_complex_double* vt,
                           lapack_int ldvt );

typedef lapack_int (*sgesv_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                          float* a, lapack_int lda, lapack_int* ipiv, float* b,
                          lapack_int ldb );
typedef lapack_int (*dgesv_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                          double* a, lapack_int lda, lapack_int* ipiv,
                          double* b, lapack_int ldb );
typedef lapack_int (*cgesv_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                          lapack_complex_float* a, lapack_int lda,
                          lapack_int* ipiv, lapack_complex_float* b,
                          lapack_int ldb );
typedef lapack_int (*zgesv_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                          lapack_complex_double* a, lapack_int lda,
                          lapack_int* ipiv, lapack_complex_double* b,
                          lapack_int ldb );
typedef lapack_int (*dsgesv_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                           double* a, lapack_int lda, lapack_int* ipiv,
                           double* b, lapack_int ldb, double* x, lapack_int ldx,
                           lapack_int* iter );
typedef lapack_int (*zcgesv_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_int* ipiv, lapack_complex_double* b,
                           lapack_int ldb, lapack_complex_double* x,
                           lapack_int ldx, lapack_int* iter );

typedef lapack_int (*sgesvd_t)( int matrix_order, char jobu, char jobvt,
                           lapack_int m, lapack_int n, float* a, lapack_int lda,
                           float* s, float* u, lapack_int ldu, float* vt,
                           lapack_int ldvt, float* superb );
typedef lapack_int (*dgesvd_t)( int matrix_order, char jobu, char jobvt,
                           lapack_int m, lapack_int n, double* a,
                           lapack_int lda, double* s, double* u, lapack_int ldu,
                           double* vt, lapack_int ldvt, double* superb );
typedef lapack_int (*cgesvd_t)( int matrix_order, char jobu, char jobvt,
                           lapack_int m, lapack_int n, lapack_complex_float* a,
                           lapack_int lda, float* s, lapack_complex_float* u,
                           lapack_int ldu, lapack_complex_float* vt,
                           lapack_int ldvt, float* superb );
typedef lapack_int (*zgesvd_t)( int matrix_order, char jobu, char jobvt,
                           lapack_int m, lapack_int n, lapack_complex_double* a,
                           lapack_int lda, double* s, lapack_complex_double* u,
                           lapack_int ldu, lapack_complex_double* vt,
                           lapack_int ldvt, double* superb );

typedef lapack_int (*sgesvj_t)( int matrix_order, char joba, char jobu, char jobv,
                           lapack_int m, lapack_int n, float* a, lapack_int lda,
                           float* sva, lapack_int mv, float* v, lapack_int ldv,
                           float* stat );
typedef lapack_int (*dgesvj_t)( int matrix_order, char joba, char jobu, char jobv,
                           lapack_int m, lapack_int n, double* a,
                           lapack_int lda, double* sva, lapack_int mv,
                           double* v, lapack_int ldv, double* stat );

typedef lapack_int (*sgesvx_t)( int matrix_order, char fact, char trans,
                           lapack_int n, lapack_int nrhs, float* a,
                           lapack_int lda, float* af, lapack_int ldaf,
                           lapack_int* ipiv, char* equed, float* r, float* c,
                           float* b, lapack_int ldb, float* x, lapack_int ldx,
                           float* rcond, float* ferr, float* berr,
                           float* rpivot );
typedef lapack_int (*dgesvx_t)( int matrix_order, char fact, char trans,
                           lapack_int n, lapack_int nrhs, double* a,
                           lapack_int lda, double* af, lapack_int ldaf,
                           lapack_int* ipiv, char* equed, double* r, double* c,
                           double* b, lapack_int ldb, double* x, lapack_int ldx,
                           double* rcond, double* ferr, double* berr,
                           double* rpivot );
typedef lapack_int (*cgesvx_t)( int matrix_order, char fact, char trans,
                           lapack_int n, lapack_int nrhs,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* af, lapack_int ldaf,
                           lapack_int* ipiv, char* equed, float* r, float* c,
                           lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx,
                           float* rcond, float* ferr, float* berr,
                           float* rpivot );
typedef lapack_int (*zgesvx_t)( int matrix_order, char fact, char trans,
                           lapack_int n, lapack_int nrhs,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* af, lapack_int ldaf,
                           lapack_int* ipiv, char* equed, double* r, double* c,
                           lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* rcond, double* ferr, double* berr,
                           double* rpivot );

typedef lapack_int (*sgesvxx_t)( int matrix_order, char fact, char trans,
                            lapack_int n, lapack_int nrhs, float* a,
                            lapack_int lda, float* af, lapack_int ldaf,
                            lapack_int* ipiv, char* equed, float* r, float* c,
                            float* b, lapack_int ldb, float* x, lapack_int ldx,
                            float* rcond, float* rpvgrw, float* berr,
                            lapack_int n_err_bnds, float* err_bnds_norm,
                            float* err_bnds_comp, lapack_int nparams,
                            float* params );
typedef lapack_int (*dgesvxx_t)( int matrix_order, char fact, char trans,
                            lapack_int n, lapack_int nrhs, double* a,
                            lapack_int lda, double* af, lapack_int ldaf,
                            lapack_int* ipiv, char* equed, double* r, double* c,
                            double* b, lapack_int ldb, double* x,
                            lapack_int ldx, double* rcond, double* rpvgrw,
                            double* berr, lapack_int n_err_bnds,
                            double* err_bnds_norm, double* err_bnds_comp,
                            lapack_int nparams, double* params );
typedef lapack_int (*cgesvxx_t)( int matrix_order, char fact, char trans,
                            lapack_int n, lapack_int nrhs,
                            lapack_complex_float* a, lapack_int lda,
                            lapack_complex_float* af, lapack_int ldaf,
                            lapack_int* ipiv, char* equed, float* r, float* c,
                            lapack_complex_float* b, lapack_int ldb,
                            lapack_complex_float* x, lapack_int ldx,
                            float* rcond, float* rpvgrw, float* berr,
                            lapack_int n_err_bnds, float* err_bnds_norm,
                            float* err_bnds_comp, lapack_int nparams,
                            float* params );
typedef lapack_int (*zgesvxx_t)( int matrix_order, char fact, char trans,
                            lapack_int n, lapack_int nrhs,
                            lapack_complex_double* a, lapack_int lda,
                            lapack_complex_double* af, lapack_int ldaf,
                            lapack_int* ipiv, char* equed, double* r, double* c,
                            lapack_complex_double* b, lapack_int ldb,
                            lapack_complex_double* x, lapack_int ldx,
                            double* rcond, double* rpvgrw, double* berr,
                            lapack_int n_err_bnds, double* err_bnds_norm,
                            double* err_bnds_comp, lapack_int nparams,
                            double* params );

typedef lapack_int (*sgetf2_t)( int matrix_order, lapack_int m, lapack_int n,
                           float* a, lapack_int lda, lapack_int* ipiv );
typedef lapack_int (*dgetf2_t)( int matrix_order, lapack_int m, lapack_int n,
                           double* a, lapack_int lda, lapack_int* ipiv );
typedef lapack_int (*cgetf2_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_int* ipiv );
typedef lapack_int (*zgetf2_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_int* ipiv );

typedef lapack_int (*sgetrf_t)( int matrix_order, lapack_int m, lapack_int n,
                           float* a, lapack_int lda, lapack_int* ipiv );
typedef lapack_int (*dgetrf_t)( int matrix_order, lapack_int m, lapack_int n,
                           double* a, lapack_int lda, lapack_int* ipiv );
typedef lapack_int (*cgetrf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_int* ipiv );
typedef lapack_int (*zgetrf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_int* ipiv );

typedef lapack_int (*sgetri_t)( int matrix_order, lapack_int n, float* a,
                           lapack_int lda, const lapack_int* ipiv );
typedef lapack_int (*dgetri_t)( int matrix_order, lapack_int n, double* a,
                           lapack_int lda, const lapack_int* ipiv );
typedef lapack_int (*cgetri_t)( int matrix_order, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           const lapack_int* ipiv );
typedef lapack_int (*zgetri_t)( int matrix_order, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           const lapack_int* ipiv );

typedef lapack_int (*sgetrs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const float* a, lapack_int lda,
                           const lapack_int* ipiv, float* b, lapack_int ldb );
typedef lapack_int (*dgetrs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const double* a, lapack_int lda,
                           const lapack_int* ipiv, double* b, lapack_int ldb );
typedef lapack_int (*cgetrs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* a,
                           lapack_int lda, const lapack_int* ipiv,
                           lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zgetrs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* a,
                           lapack_int lda, const lapack_int* ipiv,
                           lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*sggbak_t)( int matrix_order, char job, char side, lapack_int n,
                           lapack_int ilo, lapack_int ihi, const float* lscale,
                           const float* rscale, lapack_int m, float* v,
                           lapack_int ldv );
typedef lapack_int (*dggbak_t)( int matrix_order, char job, char side, lapack_int n,
                           lapack_int ilo, lapack_int ihi, const double* lscale,
                           const double* rscale, lapack_int m, double* v,
                           lapack_int ldv );
typedef lapack_int (*cggbak_t)( int matrix_order, char job, char side, lapack_int n,
                           lapack_int ilo, lapack_int ihi, const float* lscale,
                           const float* rscale, lapack_int m,
                           lapack_complex_float* v, lapack_int ldv );
typedef lapack_int (*zggbak_t)( int matrix_order, char job, char side, lapack_int n,
                           lapack_int ilo, lapack_int ihi, const double* lscale,
                           const double* rscale, lapack_int m,
                           lapack_complex_double* v, lapack_int ldv );

typedef lapack_int (*sggbal_t)( int matrix_order, char job, lapack_int n, float* a,
                           lapack_int lda, float* b, lapack_int ldb,
                           lapack_int* ilo, lapack_int* ihi, float* lscale,
                           float* rscale );
typedef lapack_int (*dggbal_t)( int matrix_order, char job, lapack_int n, double* a,
                           lapack_int lda, double* b, lapack_int ldb,
                           lapack_int* ilo, lapack_int* ihi, double* lscale,
                           double* rscale );
typedef lapack_int (*cggbal_t)( int matrix_order, char job, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* b, lapack_int ldb,
                           lapack_int* ilo, lapack_int* ihi, float* lscale,
                           float* rscale );
typedef lapack_int (*zggbal_t)( int matrix_order, char job, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* b, lapack_int ldb,
                           lapack_int* ilo, lapack_int* ihi, double* lscale,
                           double* rscale );

typedef lapack_int (*sgges_t)( int matrix_order, char jobvsl, char jobvsr, char sort,
                          LAPACK_S_SELECT3 selctg, lapack_int n, float* a,
                          lapack_int lda, float* b, lapack_int ldb,
                          lapack_int* sdim, float* alphar, float* alphai,
                          float* beta, float* vsl, lapack_int ldvsl, float* vsr,
                          lapack_int ldvsr );
typedef lapack_int (*dgges_t)( int matrix_order, char jobvsl, char jobvsr, char sort,
                          LAPACK_D_SELECT3 selctg, lapack_int n, double* a,
                          lapack_int lda, double* b, lapack_int ldb,
                          lapack_int* sdim, double* alphar, double* alphai,
                          double* beta, double* vsl, lapack_int ldvsl,
                          double* vsr, lapack_int ldvsr );
typedef lapack_int (*cgges_t)( int matrix_order, char jobvsl, char jobvsr, char sort,
                          LAPACK_C_SELECT2 selctg, lapack_int n,
                          lapack_complex_float* a, lapack_int lda,
                          lapack_complex_float* b, lapack_int ldb,
                          lapack_int* sdim, lapack_complex_float* alpha,
                          lapack_complex_float* beta, lapack_complex_float* vsl,
                          lapack_int ldvsl, lapack_complex_float* vsr,
                          lapack_int ldvsr );
typedef lapack_int (*zgges_t)( int matrix_order, char jobvsl, char jobvsr, char sort,
                          LAPACK_Z_SELECT2 selctg, lapack_int n,
                          lapack_complex_double* a, lapack_int lda,
                          lapack_complex_double* b, lapack_int ldb,
                          lapack_int* sdim, lapack_complex_double* alpha,
                          lapack_complex_double* beta,
                          lapack_complex_double* vsl, lapack_int ldvsl,
                          lapack_complex_double* vsr, lapack_int ldvsr );

typedef lapack_int (*sggesx_t)( int matrix_order, char jobvsl, char jobvsr,
                           char sort, LAPACK_S_SELECT3 selctg, char sense,
                           lapack_int n, float* a, lapack_int lda, float* b,
                           lapack_int ldb, lapack_int* sdim, float* alphar,
                           float* alphai, float* beta, float* vsl,
                           lapack_int ldvsl, float* vsr, lapack_int ldvsr,
                           float* rconde, float* rcondv );
typedef lapack_int (*dggesx_t)( int matrix_order, char jobvsl, char jobvsr,
                           char sort, LAPACK_D_SELECT3 selctg, char sense,
                           lapack_int n, double* a, lapack_int lda, double* b,
                           lapack_int ldb, lapack_int* sdim, double* alphar,
                           double* alphai, double* beta, double* vsl,
                           lapack_int ldvsl, double* vsr, lapack_int ldvsr,
                           double* rconde, double* rcondv );
typedef lapack_int (*cggesx_t)( int matrix_order, char jobvsl, char jobvsr,
                           char sort, LAPACK_C_SELECT2 selctg, char sense,
                           lapack_int n, lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* b,
                           lapack_int ldb, lapack_int* sdim,
                           lapack_complex_float* alpha,
                           lapack_complex_float* beta,
                           lapack_complex_float* vsl, lapack_int ldvsl,
                           lapack_complex_float* vsr, lapack_int ldvsr,
                           float* rconde, float* rcondv );
typedef lapack_int (*zggesx_t)( int matrix_order, char jobvsl, char jobvsr,
                           char sort, LAPACK_Z_SELECT2 selctg, char sense,
                           lapack_int n, lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* b,
                           lapack_int ldb, lapack_int* sdim,
                           lapack_complex_double* alpha,
                           lapack_complex_double* beta,
                           lapack_complex_double* vsl, lapack_int ldvsl,
                           lapack_complex_double* vsr, lapack_int ldvsr,
                           double* rconde, double* rcondv );

typedef lapack_int (*sggev_t)( int matrix_order, char jobvl, char jobvr,
                          lapack_int n, float* a, lapack_int lda, float* b,
                          lapack_int ldb, float* alphar, float* alphai,
                          float* beta, float* vl, lapack_int ldvl, float* vr,
                          lapack_int ldvr );
typedef lapack_int (*dggev_t)( int matrix_order, char jobvl, char jobvr,
                          lapack_int n, double* a, lapack_int lda, double* b,
                          lapack_int ldb, double* alphar, double* alphai,
                          double* beta, double* vl, lapack_int ldvl, double* vr,
                          lapack_int ldvr );
typedef lapack_int (*cggev_t)( int matrix_order, char jobvl, char jobvr,
                          lapack_int n, lapack_complex_float* a, lapack_int lda,
                          lapack_complex_float* b, lapack_int ldb,
                          lapack_complex_float* alpha,
                          lapack_complex_float* beta, lapack_complex_float* vl,
                          lapack_int ldvl, lapack_complex_float* vr,
                          lapack_int ldvr );
typedef lapack_int (*zggev_t)( int matrix_order, char jobvl, char jobvr,
                          lapack_int n, lapack_complex_double* a,
                          lapack_int lda, lapack_complex_double* b,
                          lapack_int ldb, lapack_complex_double* alpha,
                          lapack_complex_double* beta,
                          lapack_complex_double* vl, lapack_int ldvl,
                          lapack_complex_double* vr, lapack_int ldvr );

typedef lapack_int (*sggevx_t)( int matrix_order, char balanc, char jobvl,
                           char jobvr, char sense, lapack_int n, float* a,
                           lapack_int lda, float* b, lapack_int ldb,
                           float* alphar, float* alphai, float* beta, float* vl,
                           lapack_int ldvl, float* vr, lapack_int ldvr,
                           lapack_int* ilo, lapack_int* ihi, float* lscale,
                           float* rscale, float* abnrm, float* bbnrm,
                           float* rconde, float* rcondv );
typedef lapack_int (*dggevx_t)( int matrix_order, char balanc, char jobvl,
                           char jobvr, char sense, lapack_int n, double* a,
                           lapack_int lda, double* b, lapack_int ldb,
                           double* alphar, double* alphai, double* beta,
                           double* vl, lapack_int ldvl, double* vr,
                           lapack_int ldvr, lapack_int* ilo, lapack_int* ihi,
                           double* lscale, double* rscale, double* abnrm,
                           double* bbnrm, double* rconde, double* rcondv );
typedef lapack_int (*cggevx_t)( int matrix_order, char balanc, char jobvl,
                           char jobvr, char sense, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* alpha,
                           lapack_complex_float* beta, lapack_complex_float* vl,
                           lapack_int ldvl, lapack_complex_float* vr,
                           lapack_int ldvr, lapack_int* ilo, lapack_int* ihi,
                           float* lscale, float* rscale, float* abnrm,
                           float* bbnrm, float* rconde, float* rcondv );
typedef lapack_int (*zggevx_t)( int matrix_order, char balanc, char jobvl,
                           char jobvr, char sense, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* alpha,
                           lapack_complex_double* beta,
                           lapack_complex_double* vl, lapack_int ldvl,
                           lapack_complex_double* vr, lapack_int ldvr,
                           lapack_int* ilo, lapack_int* ihi, double* lscale,
                           double* rscale, double* abnrm, double* bbnrm,
                           double* rconde, double* rcondv );

typedef lapack_int (*sggglm_t)( int matrix_order, lapack_int n, lapack_int m,
                           lapack_int p, float* a, lapack_int lda, float* b,
                           lapack_int ldb, float* d, float* x, float* y );
typedef lapack_int (*dggglm_t)( int matrix_order, lapack_int n, lapack_int m,
                           lapack_int p, double* a, lapack_int lda, double* b,
                           lapack_int ldb, double* d, double* x, double* y );
typedef lapack_int (*cggglm_t)( int matrix_order, lapack_int n, lapack_int m,
                           lapack_int p, lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* b,
                           lapack_int ldb, lapack_complex_float* d,
                           lapack_complex_float* x, lapack_complex_float* y );
typedef lapack_int (*zggglm_t)( int matrix_order, lapack_int n, lapack_int m,
                           lapack_int p, lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* b,
                           lapack_int ldb, lapack_complex_double* d,
                           lapack_complex_double* x, lapack_complex_double* y );

typedef lapack_int (*sgghrd_t)( int matrix_order, char compq, char compz,
                           lapack_int n, lapack_int ilo, lapack_int ihi,
                           float* a, lapack_int lda, float* b, lapack_int ldb,
                           float* q, lapack_int ldq, float* z, lapack_int ldz );
typedef lapack_int (*dgghrd_t)( int matrix_order, char compq, char compz,
                           lapack_int n, lapack_int ilo, lapack_int ihi,
                           double* a, lapack_int lda, double* b, lapack_int ldb,
                           double* q, lapack_int ldq, double* z,
                           lapack_int ldz );
typedef lapack_int (*cgghrd_t)( int matrix_order, char compq, char compz,
                           lapack_int n, lapack_int ilo, lapack_int ihi,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* q, lapack_int ldq,
                           lapack_complex_float* z, lapack_int ldz );
typedef lapack_int (*zgghrd_t)( int matrix_order, char compq, char compz,
                           lapack_int n, lapack_int ilo, lapack_int ihi,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* q, lapack_int ldq,
                           lapack_complex_double* z, lapack_int ldz );

typedef lapack_int (*sgglse_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int p, float* a, lapack_int lda, float* b,
                           lapack_int ldb, float* c, float* d, float* x );
typedef lapack_int (*dgglse_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int p, double* a, lapack_int lda, double* b,
                           lapack_int ldb, double* c, double* d, double* x );
typedef lapack_int (*cgglse_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int p, lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* b,
                           lapack_int ldb, lapack_complex_float* c,
                           lapack_complex_float* d, lapack_complex_float* x );
typedef lapack_int (*zgglse_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int p, lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* b,
                           lapack_int ldb, lapack_complex_double* c,
                           lapack_complex_double* d, lapack_complex_double* x );

typedef lapack_int (*sggqrf_t)( int matrix_order, lapack_int n, lapack_int m,
                           lapack_int p, float* a, lapack_int lda, float* taua,
                           float* b, lapack_int ldb, float* taub );
typedef lapack_int (*dggqrf_t)( int matrix_order, lapack_int n, lapack_int m,
                           lapack_int p, double* a, lapack_int lda,
                           double* taua, double* b, lapack_int ldb,
                           double* taub );
typedef lapack_int (*cggqrf_t)( int matrix_order, lapack_int n, lapack_int m,
                           lapack_int p, lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* taua,
                           lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* taub );
typedef lapack_int (*zggqrf_t)( int matrix_order, lapack_int n, lapack_int m,
                           lapack_int p, lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* taua,
                           lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* taub );

typedef lapack_int (*sggrqf_t)( int matrix_order, lapack_int m, lapack_int p,
                           lapack_int n, float* a, lapack_int lda, float* taua,
                           float* b, lapack_int ldb, float* taub );
typedef lapack_int (*dggrqf_t)( int matrix_order, lapack_int m, lapack_int p,
                           lapack_int n, double* a, lapack_int lda,
                           double* taua, double* b, lapack_int ldb,
                           double* taub );
typedef lapack_int (*cggrqf_t)( int matrix_order, lapack_int m, lapack_int p,
                           lapack_int n, lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* taua,
                           lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* taub );
typedef lapack_int (*zggrqf_t)( int matrix_order, lapack_int m, lapack_int p,
                           lapack_int n, lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* taua,
                           lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* taub );

typedef lapack_int (*sggsvd_t)( int matrix_order, char jobu, char jobv, char jobq,
                           lapack_int m, lapack_int n, lapack_int p,
                           lapack_int* k, lapack_int* l, float* a,
                           lapack_int lda, float* b, lapack_int ldb,
                           float* alpha, float* beta, float* u, lapack_int ldu,
                           float* v, lapack_int ldv, float* q, lapack_int ldq,
                           lapack_int* iwork );
typedef lapack_int (*dggsvd_t)( int matrix_order, char jobu, char jobv, char jobq,
                           lapack_int m, lapack_int n, lapack_int p,
                           lapack_int* k, lapack_int* l, double* a,
                           lapack_int lda, double* b, lapack_int ldb,
                           double* alpha, double* beta, double* u,
                           lapack_int ldu, double* v, lapack_int ldv, double* q,
                           lapack_int ldq, lapack_int* iwork );
typedef lapack_int (*cggsvd_t)( int matrix_order, char jobu, char jobv, char jobq,
                           lapack_int m, lapack_int n, lapack_int p,
                           lapack_int* k, lapack_int* l,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* b, lapack_int ldb,
                           float* alpha, float* beta, lapack_complex_float* u,
                           lapack_int ldu, lapack_complex_float* v,
                           lapack_int ldv, lapack_complex_float* q,
                           lapack_int ldq, lapack_int* iwork );
typedef lapack_int (*zggsvd_t)( int matrix_order, char jobu, char jobv, char jobq,
                           lapack_int m, lapack_int n, lapack_int p,
                           lapack_int* k, lapack_int* l,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* b, lapack_int ldb,
                           double* alpha, double* beta,
                           lapack_complex_double* u, lapack_int ldu,
                           lapack_complex_double* v, lapack_int ldv,
                           lapack_complex_double* q, lapack_int ldq,
                           lapack_int* iwork );

typedef lapack_int (*sggsvp_t)( int matrix_order, char jobu, char jobv, char jobq,
                           lapack_int m, lapack_int p, lapack_int n, float* a,
                           lapack_int lda, float* b, lapack_int ldb, float tola,
                           float tolb, lapack_int* k, lapack_int* l, float* u,
                           lapack_int ldu, float* v, lapack_int ldv, float* q,
                           lapack_int ldq );
typedef lapack_int (*dggsvp_t)( int matrix_order, char jobu, char jobv, char jobq,
                           lapack_int m, lapack_int p, lapack_int n, double* a,
                           lapack_int lda, double* b, lapack_int ldb,
                           double tola, double tolb, lapack_int* k,
                           lapack_int* l, double* u, lapack_int ldu, double* v,
                           lapack_int ldv, double* q, lapack_int ldq );
typedef lapack_int (*cggsvp_t)( int matrix_order, char jobu, char jobv, char jobq,
                           lapack_int m, lapack_int p, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* b, lapack_int ldb, float tola,
                           float tolb, lapack_int* k, lapack_int* l,
                           lapack_complex_float* u, lapack_int ldu,
                           lapack_complex_float* v, lapack_int ldv,
                           lapack_complex_float* q, lapack_int ldq );
typedef lapack_int (*zggsvp_t)( int matrix_order, char jobu, char jobv, char jobq,
                           lapack_int m, lapack_int p, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* b, lapack_int ldb,
                           double tola, double tolb, lapack_int* k,
                           lapack_int* l, lapack_complex_double* u,
                           lapack_int ldu, lapack_complex_double* v,
                           lapack_int ldv, lapack_complex_double* q,
                           lapack_int ldq );

typedef lapack_int (*sgtcon_t)( char norm, lapack_int n, const float* dl,
                           const float* d, const float* du, const float* du2,
                           const lapack_int* ipiv, float anorm, float* rcond );
typedef lapack_int (*dgtcon_t)( char norm, lapack_int n, const double* dl,
                           const double* d, const double* du, const double* du2,
                           const lapack_int* ipiv, double anorm,
                           double* rcond );
typedef lapack_int (*cgtcon_t)( char norm, lapack_int n,
                           const lapack_complex_float* dl,
                           const lapack_complex_float* d,
                           const lapack_complex_float* du,
                           const lapack_complex_float* du2,
                           const lapack_int* ipiv, float anorm, float* rcond );
typedef lapack_int (*zgtcon_t)( char norm, lapack_int n,
                           const lapack_complex_double* dl,
                           const lapack_complex_double* d,
                           const lapack_complex_double* du,
                           const lapack_complex_double* du2,
                           const lapack_int* ipiv, double anorm,
                           double* rcond );

typedef lapack_int (*sgtrfs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const float* dl, const float* d,
                           const float* du, const float* dlf, const float* df,
                           const float* duf, const float* du2,
                           const lapack_int* ipiv, const float* b,
                           lapack_int ldb, float* x, lapack_int ldx,
                           float* ferr, float* berr );
typedef lapack_int (*dgtrfs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const double* dl, const double* d,
                           const double* du, const double* dlf,
                           const double* df, const double* duf,
                           const double* du2, const lapack_int* ipiv,
                           const double* b, lapack_int ldb, double* x,
                           lapack_int ldx, double* ferr, double* berr );
typedef lapack_int (*cgtrfs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* dl,
                           const lapack_complex_float* d,
                           const lapack_complex_float* du,
                           const lapack_complex_float* dlf,
                           const lapack_complex_float* df,
                           const lapack_complex_float* duf,
                           const lapack_complex_float* du2,
                           const lapack_int* ipiv,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx, float* ferr,
                           float* berr );
typedef lapack_int (*zgtrfs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* dl,
                           const lapack_complex_double* d,
                           const lapack_complex_double* du,
                           const lapack_complex_double* dlf,
                           const lapack_complex_double* df,
                           const lapack_complex_double* duf,
                           const lapack_complex_double* du2,
                           const lapack_int* ipiv,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* ferr, double* berr );

typedef lapack_int (*sgtsv_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                          float* dl, float* d, float* du, float* b,
                          lapack_int ldb );
typedef lapack_int (*dgtsv_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                          double* dl, double* d, double* du, double* b,
                          lapack_int ldb );
typedef lapack_int (*cgtsv_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                          lapack_complex_float* dl, lapack_complex_float* d,
                          lapack_complex_float* du, lapack_complex_float* b,
                          lapack_int ldb );
typedef lapack_int (*zgtsv_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                          lapack_complex_double* dl, lapack_complex_double* d,
                          lapack_complex_double* du, lapack_complex_double* b,
                          lapack_int ldb );

typedef lapack_int (*sgtsvx_t)( int matrix_order, char fact, char trans,
                           lapack_int n, lapack_int nrhs, const float* dl,
                           const float* d, const float* du, float* dlf,
                           float* df, float* duf, float* du2, lapack_int* ipiv,
                           const float* b, lapack_int ldb, float* x,
                           lapack_int ldx, float* rcond, float* ferr,
                           float* berr );
typedef lapack_int (*dgtsvx_t)( int matrix_order, char fact, char trans,
                           lapack_int n, lapack_int nrhs, const double* dl,
                           const double* d, const double* du, double* dlf,
                           double* df, double* duf, double* du2,
                           lapack_int* ipiv, const double* b, lapack_int ldb,
                           double* x, lapack_int ldx, double* rcond,
                           double* ferr, double* berr );
typedef lapack_int (*cgtsvx_t)( int matrix_order, char fact, char trans,
                           lapack_int n, lapack_int nrhs,
                           const lapack_complex_float* dl,
                           const lapack_complex_float* d,
                           const lapack_complex_float* du,
                           lapack_complex_float* dlf, lapack_complex_float* df,
                           lapack_complex_float* duf, lapack_complex_float* du2,
                           lapack_int* ipiv, const lapack_complex_float* b,
                           lapack_int ldb, lapack_complex_float* x,
                           lapack_int ldx, float* rcond, float* ferr,
                           float* berr );
typedef lapack_int (*zgtsvx_t)( int matrix_order, char fact, char trans,
                           lapack_int n, lapack_int nrhs,
                           const lapack_complex_double* dl,
                           const lapack_complex_double* d,
                           const lapack_complex_double* du,
                           lapack_complex_double* dlf,
                           lapack_complex_double* df,
                           lapack_complex_double* duf,
                           lapack_complex_double* du2, lapack_int* ipiv,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* rcond, double* ferr, double* berr );

typedef lapack_int (*sgttrf_t)( lapack_int n, float* dl, float* d, float* du,
                           float* du2, lapack_int* ipiv );
typedef lapack_int (*dgttrf_t)( lapack_int n, double* dl, double* d, double* du,
                           double* du2, lapack_int* ipiv );
typedef lapack_int (*cgttrf_t)( lapack_int n, lapack_complex_float* dl,
                           lapack_complex_float* d, lapack_complex_float* du,
                           lapack_complex_float* du2, lapack_int* ipiv );
typedef lapack_int (*zgttrf_t)( lapack_int n, lapack_complex_double* dl,
                           lapack_complex_double* d, lapack_complex_double* du,
                           lapack_complex_double* du2, lapack_int* ipiv );

typedef lapack_int (*sgttrs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const float* dl, const float* d,
                           const float* du, const float* du2,
                           const lapack_int* ipiv, float* b, lapack_int ldb );
typedef lapack_int (*dgttrs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const double* dl, const double* d,
                           const double* du, const double* du2,
                           const lapack_int* ipiv, double* b, lapack_int ldb );
typedef lapack_int (*cgttrs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* dl,
                           const lapack_complex_float* d,
                           const lapack_complex_float* du,
                           const lapack_complex_float* du2,
                           const lapack_int* ipiv, lapack_complex_float* b,
                           lapack_int ldb );
typedef lapack_int (*zgttrs_t)( int matrix_order, char trans, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* dl,
                           const lapack_complex_double* d,
                           const lapack_complex_double* du,
                           const lapack_complex_double* du2,
                           const lapack_int* ipiv, lapack_complex_double* b,
                           lapack_int ldb );

typedef lapack_int (*chbev_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          lapack_int kd, lapack_complex_float* ab,
                          lapack_int ldab, float* w, lapack_complex_float* z,
                          lapack_int ldz );
typedef lapack_int (*zhbev_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          lapack_int kd, lapack_complex_double* ab,
                          lapack_int ldab, double* w, lapack_complex_double* z,
                          lapack_int ldz );

typedef lapack_int (*chbevd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           lapack_int kd, lapack_complex_float* ab,
                           lapack_int ldab, float* w, lapack_complex_float* z,
                           lapack_int ldz );
typedef lapack_int (*zhbevd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           lapack_int kd, lapack_complex_double* ab,
                           lapack_int ldab, double* w, lapack_complex_double* z,
                           lapack_int ldz );

typedef lapack_int (*chbevx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, lapack_int kd,
                           lapack_complex_float* ab, lapack_int ldab,
                           lapack_complex_float* q, lapack_int ldq, float vl,
                           float vu, lapack_int il, lapack_int iu, float abstol,
                           lapack_int* m, float* w, lapack_complex_float* z,
                           lapack_int ldz, lapack_int* ifail );
typedef lapack_int (*zhbevx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, lapack_int kd,
                           lapack_complex_double* ab, lapack_int ldab,
                           lapack_complex_double* q, lapack_int ldq, double vl,
                           double vu, lapack_int il, lapack_int iu,
                           double abstol, lapack_int* m, double* w,
                           lapack_complex_double* z, lapack_int ldz,
                           lapack_int* ifail );

typedef lapack_int (*chbgst_t)( int matrix_order, char vect, char uplo, lapack_int n,
                           lapack_int ka, lapack_int kb,
                           lapack_complex_float* ab, lapack_int ldab,
                           const lapack_complex_float* bb, lapack_int ldbb,
                           lapack_complex_float* x, lapack_int ldx );
typedef lapack_int (*zhbgst_t)( int matrix_order, char vect, char uplo, lapack_int n,
                           lapack_int ka, lapack_int kb,
                           lapack_complex_double* ab, lapack_int ldab,
                           const lapack_complex_double* bb, lapack_int ldbb,
                           lapack_complex_double* x, lapack_int ldx );

typedef lapack_int (*chbgv_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          lapack_int ka, lapack_int kb,
                          lapack_complex_float* ab, lapack_int ldab,
                          lapack_complex_float* bb, lapack_int ldbb, float* w,
                          lapack_complex_float* z, lapack_int ldz );
typedef lapack_int (*zhbgv_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          lapack_int ka, lapack_int kb,
                          lapack_complex_double* ab, lapack_int ldab,
                          lapack_complex_double* bb, lapack_int ldbb, double* w,
                          lapack_complex_double* z, lapack_int ldz );

typedef lapack_int (*chbgvd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           lapack_int ka, lapack_int kb,
                           lapack_complex_float* ab, lapack_int ldab,
                           lapack_complex_float* bb, lapack_int ldbb, float* w,
                           lapack_complex_float* z, lapack_int ldz );
typedef lapack_int (*zhbgvd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           lapack_int ka, lapack_int kb,
                           lapack_complex_double* ab, lapack_int ldab,
                           lapack_complex_double* bb, lapack_int ldbb,
                           double* w, lapack_complex_double* z,
                           lapack_int ldz );

typedef lapack_int (*chbgvx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, lapack_int ka, lapack_int kb,
                           lapack_complex_float* ab, lapack_int ldab,
                           lapack_complex_float* bb, lapack_int ldbb,
                           lapack_complex_float* q, lapack_int ldq, float vl,
                           float vu, lapack_int il, lapack_int iu, float abstol,
                           lapack_int* m, float* w, lapack_complex_float* z,
                           lapack_int ldz, lapack_int* ifail );
typedef lapack_int (*zhbgvx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, lapack_int ka, lapack_int kb,
                           lapack_complex_double* ab, lapack_int ldab,
                           lapack_complex_double* bb, lapack_int ldbb,
                           lapack_complex_double* q, lapack_int ldq, double vl,
                           double vu, lapack_int il, lapack_int iu,
                           double abstol, lapack_int* m, double* w,
                           lapack_complex_double* z, lapack_int ldz,
                           lapack_int* ifail );

typedef lapack_int (*chbtrd_t)( int matrix_order, char vect, char uplo, lapack_int n,
                           lapack_int kd, lapack_complex_float* ab,
                           lapack_int ldab, float* d, float* e,
                           lapack_complex_float* q, lapack_int ldq );
typedef lapack_int (*zhbtrd_t)( int matrix_order, char vect, char uplo, lapack_int n,
                           lapack_int kd, lapack_complex_double* ab,
                           lapack_int ldab, double* d, double* e,
                           lapack_complex_double* q, lapack_int ldq );

typedef lapack_int (*checon_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_float* a, lapack_int lda,
                           const lapack_int* ipiv, float anorm, float* rcond );
typedef lapack_int (*zhecon_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_double* a, lapack_int lda,
                           const lapack_int* ipiv, double anorm,
                           double* rcond );

typedef lapack_int (*cheequb_t)( int matrix_order, char uplo, lapack_int n,
                            const lapack_complex_float* a, lapack_int lda,
                            float* s, float* scond, float* amax );
typedef lapack_int (*zheequb_t)( int matrix_order, char uplo, lapack_int n,
                            const lapack_complex_double* a, lapack_int lda,
                            double* s, double* scond, double* amax );

typedef lapack_int (*cheev_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          lapack_complex_float* a, lapack_int lda, float* w );
typedef lapack_int (*zheev_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          lapack_complex_double* a, lapack_int lda, double* w );

typedef lapack_int (*cheevd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           lapack_complex_float* a, lapack_int lda, float* w );
typedef lapack_int (*zheevd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           double* w );

typedef lapack_int (*cheevr_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, lapack_complex_float* a,
                           lapack_int lda, float vl, float vu, lapack_int il,
                           lapack_int iu, float abstol, lapack_int* m, float* w,
                           lapack_complex_float* z, lapack_int ldz,
                           lapack_int* isuppz );
typedef lapack_int (*zheevr_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, lapack_complex_double* a,
                           lapack_int lda, double vl, double vu, lapack_int il,
                           lapack_int iu, double abstol, lapack_int* m,
                           double* w, lapack_complex_double* z, lapack_int ldz,
                           lapack_int* isuppz );

typedef lapack_int (*cheevx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, lapack_complex_float* a,
                           lapack_int lda, float vl, float vu, lapack_int il,
                           lapack_int iu, float abstol, lapack_int* m, float* w,
                           lapack_complex_float* z, lapack_int ldz,
                           lapack_int* ifail );
typedef lapack_int (*zheevx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, lapack_complex_double* a,
                           lapack_int lda, double vl, double vu, lapack_int il,
                           lapack_int iu, double abstol, lapack_int* m,
                           double* w, lapack_complex_double* z, lapack_int ldz,
                           lapack_int* ifail );

typedef lapack_int (*chegst_t)( int matrix_order, lapack_int itype, char uplo,
                           lapack_int n, lapack_complex_float* a,
                           lapack_int lda, const lapack_complex_float* b,
                           lapack_int ldb );
typedef lapack_int (*zhegst_t)( int matrix_order, lapack_int itype, char uplo,
                           lapack_int n, lapack_complex_double* a,
                           lapack_int lda, const lapack_complex_double* b,
                           lapack_int ldb );

typedef lapack_int (*chegv_t)( int matrix_order, lapack_int itype, char jobz,
                          char uplo, lapack_int n, lapack_complex_float* a,
                          lapack_int lda, lapack_complex_float* b,
                          lapack_int ldb, float* w );
typedef lapack_int (*zhegv_t)( int matrix_order, lapack_int itype, char jobz,
                          char uplo, lapack_int n, lapack_complex_double* a,
                          lapack_int lda, lapack_complex_double* b,
                          lapack_int ldb, double* w );

typedef lapack_int (*chegvd_t)( int matrix_order, lapack_int itype, char jobz,
                           char uplo, lapack_int n, lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* b,
                           lapack_int ldb, float* w );
typedef lapack_int (*zhegvd_t)( int matrix_order, lapack_int itype, char jobz,
                           char uplo, lapack_int n, lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* b,
                           lapack_int ldb, double* w );

typedef lapack_int (*chegvx_t)( int matrix_order, lapack_int itype, char jobz,
                           char range, char uplo, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* b, lapack_int ldb, float vl,
                           float vu, lapack_int il, lapack_int iu, float abstol,
                           lapack_int* m, float* w, lapack_complex_float* z,
                           lapack_int ldz, lapack_int* ifail );
typedef lapack_int (*zhegvx_t)( int matrix_order, lapack_int itype, char jobz,
                           char range, char uplo, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* b, lapack_int ldb, double vl,
                           double vu, lapack_int il, lapack_int iu,
                           double abstol, lapack_int* m, double* w,
                           lapack_complex_double* z, lapack_int ldz,
                           lapack_int* ifail );

typedef lapack_int (*cherfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* a,
                           lapack_int lda, const lapack_complex_float* af,
                           lapack_int ldaf, const lapack_int* ipiv,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx, float* ferr,
                           float* berr );
typedef lapack_int (*zherfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* a,
                           lapack_int lda, const lapack_complex_double* af,
                           lapack_int ldaf, const lapack_int* ipiv,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* ferr, double* berr );

typedef lapack_int (*cherfsx_t)( int matrix_order, char uplo, char equed,
                            lapack_int n, lapack_int nrhs,
                            const lapack_complex_float* a, lapack_int lda,
                            const lapack_complex_float* af, lapack_int ldaf,
                            const lapack_int* ipiv, const float* s,
                            const lapack_complex_float* b, lapack_int ldb,
                            lapack_complex_float* x, lapack_int ldx,
                            float* rcond, float* berr, lapack_int n_err_bnds,
                            float* err_bnds_norm, float* err_bnds_comp,
                            lapack_int nparams, float* params );
typedef lapack_int (*zherfsx_t)( int matrix_order, char uplo, char equed,
                            lapack_int n, lapack_int nrhs,
                            const lapack_complex_double* a, lapack_int lda,
                            const lapack_complex_double* af, lapack_int ldaf,
                            const lapack_int* ipiv, const double* s,
                            const lapack_complex_double* b, lapack_int ldb,
                            lapack_complex_double* x, lapack_int ldx,
                            double* rcond, double* berr, lapack_int n_err_bnds,
                            double* err_bnds_norm, double* err_bnds_comp,
                            lapack_int nparams, double* params );

typedef lapack_int (*chesv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, lapack_complex_float* a,
                          lapack_int lda, lapack_int* ipiv,
                          lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zhesv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, lapack_complex_double* a,
                          lapack_int lda, lapack_int* ipiv,
                          lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*chesvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* af,
                           lapack_int ldaf, lapack_int* ipiv,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx,
                           float* rcond, float* ferr, float* berr );
typedef lapack_int (*zhesvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* af,
                           lapack_int ldaf, lapack_int* ipiv,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* rcond, double* ferr, double* berr );

typedef lapack_int (*chesvxx_t)( int matrix_order, char fact, char uplo,
                            lapack_int n, lapack_int nrhs,
                            lapack_complex_float* a, lapack_int lda,
                            lapack_complex_float* af, lapack_int ldaf,
                            lapack_int* ipiv, char* equed, float* s,
                            lapack_complex_float* b, lapack_int ldb,
                            lapack_complex_float* x, lapack_int ldx,
                            float* rcond, float* rpvgrw, float* berr,
                            lapack_int n_err_bnds, float* err_bnds_norm,
                            float* err_bnds_comp, lapack_int nparams,
                            float* params );
typedef lapack_int (*zhesvxx_t)( int matrix_order, char fact, char uplo,
                            lapack_int n, lapack_int nrhs,
                            lapack_complex_double* a, lapack_int lda,
                            lapack_complex_double* af, lapack_int ldaf,
                            lapack_int* ipiv, char* equed, double* s,
                            lapack_complex_double* b, lapack_int ldb,
                            lapack_complex_double* x, lapack_int ldx,
                            double* rcond, double* rpvgrw, double* berr,
                            lapack_int n_err_bnds, double* err_bnds_norm,
                            double* err_bnds_comp, lapack_int nparams,
                            double* params );

typedef lapack_int (*chetrd_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* a, lapack_int lda, float* d,
                           float* e, lapack_complex_float* tau );
typedef lapack_int (*zhetrd_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* a, lapack_int lda, double* d,
                           double* e, lapack_complex_double* tau );

typedef lapack_int (*chetrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_int* ipiv );
typedef lapack_int (*zhetrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_int* ipiv );

typedef lapack_int (*chetri_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           const lapack_int* ipiv );
typedef lapack_int (*zhetri_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           const lapack_int* ipiv );

typedef lapack_int (*chetrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* a,
                           lapack_int lda, const lapack_int* ipiv,
                           lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zhetrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* a,
                           lapack_int lda, const lapack_int* ipiv,
                           lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*chfrk_t)( int matrix_order, char transr, char uplo, char trans,
                          lapack_int n, lapack_int k, float alpha,
                          const lapack_complex_float* a, lapack_int lda,
                          float beta, lapack_complex_float* c );
typedef lapack_int (*zhfrk_t)( int matrix_order, char transr, char uplo, char trans,
                          lapack_int n, lapack_int k, double alpha,
                          const lapack_complex_double* a, lapack_int lda,
                          double beta, lapack_complex_double* c );

typedef lapack_int (*shgeqz_t)( int matrix_order, char job, char compq, char compz,
                           lapack_int n, lapack_int ilo, lapack_int ihi,
                           float* h, lapack_int ldh, float* t, lapack_int ldt,
                           float* alphar, float* alphai, float* beta, float* q,
                           lapack_int ldq, float* z, lapack_int ldz );
typedef lapack_int (*dhgeqz_t)( int matrix_order, char job, char compq, char compz,
                           lapack_int n, lapack_int ilo, lapack_int ihi,
                           double* h, lapack_int ldh, double* t, lapack_int ldt,
                           double* alphar, double* alphai, double* beta,
                           double* q, lapack_int ldq, double* z,
                           lapack_int ldz );
typedef lapack_int (*chgeqz_t)( int matrix_order, char job, char compq, char compz,
                           lapack_int n, lapack_int ilo, lapack_int ihi,
                           lapack_complex_float* h, lapack_int ldh,
                           lapack_complex_float* t, lapack_int ldt,
                           lapack_complex_float* alpha,
                           lapack_complex_float* beta, lapack_complex_float* q,
                           lapack_int ldq, lapack_complex_float* z,
                           lapack_int ldz );
typedef lapack_int (*zhgeqz_t)( int matrix_order, char job, char compq, char compz,
                           lapack_int n, lapack_int ilo, lapack_int ihi,
                           lapack_complex_double* h, lapack_int ldh,
                           lapack_complex_double* t, lapack_int ldt,
                           lapack_complex_double* alpha,
                           lapack_complex_double* beta,
                           lapack_complex_double* q, lapack_int ldq,
                           lapack_complex_double* z, lapack_int ldz );

typedef lapack_int (*chpcon_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_float* ap,
                           const lapack_int* ipiv, float anorm, float* rcond );
typedef lapack_int (*zhpcon_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_double* ap,
                           const lapack_int* ipiv, double anorm,
                           double* rcond );

typedef lapack_int (*chpev_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          lapack_complex_float* ap, float* w,
                          lapack_complex_float* z, lapack_int ldz );
typedef lapack_int (*zhpev_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          lapack_complex_double* ap, double* w,
                          lapack_complex_double* z, lapack_int ldz );

typedef lapack_int (*chpevd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           lapack_complex_float* ap, float* w,
                           lapack_complex_float* z, lapack_int ldz );
typedef lapack_int (*zhpevd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           lapack_complex_double* ap, double* w,
                           lapack_complex_double* z, lapack_int ldz );

typedef lapack_int (*chpevx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, lapack_complex_float* ap, float vl,
                           float vu, lapack_int il, lapack_int iu, float abstol,
                           lapack_int* m, float* w, lapack_complex_float* z,
                           lapack_int ldz, lapack_int* ifail );
typedef lapack_int (*zhpevx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, lapack_complex_double* ap, double vl,
                           double vu, lapack_int il, lapack_int iu,
                           double abstol, lapack_int* m, double* w,
                           lapack_complex_double* z, lapack_int ldz,
                           lapack_int* ifail );

typedef lapack_int (*chpgst_t)( int matrix_order, lapack_int itype, char uplo,
                           lapack_int n, lapack_complex_float* ap,
                           const lapack_complex_float* bp );
typedef lapack_int (*zhpgst_t)( int matrix_order, lapack_int itype, char uplo,
                           lapack_int n, lapack_complex_double* ap,
                           const lapack_complex_double* bp );

typedef lapack_int (*chpgv_t)( int matrix_order, lapack_int itype, char jobz,
                          char uplo, lapack_int n, lapack_complex_float* ap,
                          lapack_complex_float* bp, float* w,
                          lapack_complex_float* z, lapack_int ldz );
typedef lapack_int (*zhpgv_t)( int matrix_order, lapack_int itype, char jobz,
                          char uplo, lapack_int n, lapack_complex_double* ap,
                          lapack_complex_double* bp, double* w,
                          lapack_complex_double* z, lapack_int ldz );

typedef lapack_int (*chpgvd_t)( int matrix_order, lapack_int itype, char jobz,
                           char uplo, lapack_int n, lapack_complex_float* ap,
                           lapack_complex_float* bp, float* w,
                           lapack_complex_float* z, lapack_int ldz );
typedef lapack_int (*zhpgvd_t)( int matrix_order, lapack_int itype, char jobz,
                           char uplo, lapack_int n, lapack_complex_double* ap,
                           lapack_complex_double* bp, double* w,
                           lapack_complex_double* z, lapack_int ldz );

typedef lapack_int (*chpgvx_t)( int matrix_order, lapack_int itype, char jobz,
                           char range, char uplo, lapack_int n,
                           lapack_complex_float* ap, lapack_complex_float* bp,
                           float vl, float vu, lapack_int il, lapack_int iu,
                           float abstol, lapack_int* m, float* w,
                           lapack_complex_float* z, lapack_int ldz,
                           lapack_int* ifail );
typedef lapack_int (*zhpgvx_t)( int matrix_order, lapack_int itype, char jobz,
                           char range, char uplo, lapack_int n,
                           lapack_complex_double* ap, lapack_complex_double* bp,
                           double vl, double vu, lapack_int il, lapack_int iu,
                           double abstol, lapack_int* m, double* w,
                           lapack_complex_double* z, lapack_int ldz,
                           lapack_int* ifail );

typedef lapack_int (*chprfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* ap,
                           const lapack_complex_float* afp,
                           const lapack_int* ipiv,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx, float* ferr,
                           float* berr );
typedef lapack_int (*zhprfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* ap,
                           const lapack_complex_double* afp,
                           const lapack_int* ipiv,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* ferr, double* berr );

typedef lapack_int (*chpsv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, lapack_complex_float* ap,
                          lapack_int* ipiv, lapack_complex_float* b,
                          lapack_int ldb );
typedef lapack_int (*zhpsv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, lapack_complex_double* ap,
                          lapack_int* ipiv, lapack_complex_double* b,
                          lapack_int ldb );

typedef lapack_int (*chpsvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* ap,
                           lapack_complex_float* afp, lapack_int* ipiv,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx,
                           float* rcond, float* ferr, float* berr );
typedef lapack_int (*zhpsvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* ap,
                           lapack_complex_double* afp, lapack_int* ipiv,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* rcond, double* ferr, double* berr );

typedef lapack_int (*chptrd_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* ap, float* d, float* e,
                           lapack_complex_float* tau );
typedef lapack_int (*zhptrd_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* ap, double* d, double* e,
                           lapack_complex_double* tau );

typedef lapack_int (*chptrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* ap, lapack_int* ipiv );
typedef lapack_int (*zhptrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* ap, lapack_int* ipiv );

typedef lapack_int (*chptri_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* ap, const lapack_int* ipiv );
typedef lapack_int (*zhptri_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* ap, const lapack_int* ipiv );

typedef lapack_int (*chptrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* ap,
                           const lapack_int* ipiv, lapack_complex_float* b,
                           lapack_int ldb );
typedef lapack_int (*zhptrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* ap,
                           const lapack_int* ipiv, lapack_complex_double* b,
                           lapack_int ldb );

typedef lapack_int (*shsein_t)( int matrix_order, char job, char eigsrc, char initv,
                           lapack_logical* select, lapack_int n, const float* h,
                           lapack_int ldh, float* wr, const float* wi,
                           float* vl, lapack_int ldvl, float* vr,
                           lapack_int ldvr, lapack_int mm, lapack_int* m,
                           lapack_int* ifaill, lapack_int* ifailr );
typedef lapack_int (*dhsein_t)( int matrix_order, char job, char eigsrc, char initv,
                           lapack_logical* select, lapack_int n,
                           const double* h, lapack_int ldh, double* wr,
                           const double* wi, double* vl, lapack_int ldvl,
                           double* vr, lapack_int ldvr, lapack_int mm,
                           lapack_int* m, lapack_int* ifaill,
                           lapack_int* ifailr );
typedef lapack_int (*chsein_t)( int matrix_order, char job, char eigsrc, char initv,
                           const lapack_logical* select, lapack_int n,
                           const lapack_complex_float* h, lapack_int ldh,
                           lapack_complex_float* w, lapack_complex_float* vl,
                           lapack_int ldvl, lapack_complex_float* vr,
                           lapack_int ldvr, lapack_int mm, lapack_int* m,
                           lapack_int* ifaill, lapack_int* ifailr );
typedef lapack_int (*zhsein_t)( int matrix_order, char job, char eigsrc, char initv,
                           const lapack_logical* select, lapack_int n,
                           const lapack_complex_double* h, lapack_int ldh,
                           lapack_complex_double* w, lapack_complex_double* vl,
                           lapack_int ldvl, lapack_complex_double* vr,
                           lapack_int ldvr, lapack_int mm, lapack_int* m,
                           lapack_int* ifaill, lapack_int* ifailr );

typedef lapack_int (*shseqr_t)( int matrix_order, char job, char compz, lapack_int n,
                           lapack_int ilo, lapack_int ihi, float* h,
                           lapack_int ldh, float* wr, float* wi, float* z,
                           lapack_int ldz );
typedef lapack_int (*dhseqr_t)( int matrix_order, char job, char compz, lapack_int n,
                           lapack_int ilo, lapack_int ihi, double* h,
                           lapack_int ldh, double* wr, double* wi, double* z,
                           lapack_int ldz );
typedef lapack_int (*chseqr_t)( int matrix_order, char job, char compz, lapack_int n,
                           lapack_int ilo, lapack_int ihi,
                           lapack_complex_float* h, lapack_int ldh,
                           lapack_complex_float* w, lapack_complex_float* z,
                           lapack_int ldz );
typedef lapack_int (*zhseqr_t)( int matrix_order, char job, char compz, lapack_int n,
                           lapack_int ilo, lapack_int ihi,
                           lapack_complex_double* h, lapack_int ldh,
                           lapack_complex_double* w, lapack_complex_double* z,
                           lapack_int ldz );

typedef lapack_int (*clacgv_t)( lapack_int n, lapack_complex_float* x,
                           lapack_int incx );
typedef lapack_int (*zlacgv_t)( lapack_int n, lapack_complex_double* x,
                           lapack_int incx );

typedef lapack_int (*slacn2_t)( lapack_int n, float* v, float* x, lapack_int* isgn,
                           float* est, lapack_int* kase, lapack_int* isave );
typedef lapack_int (*dlacn2_t)( lapack_int n, double* v, double* x, lapack_int* isgn,
                           double* est, lapack_int* kase, lapack_int* isave );
typedef lapack_int (*clacn2_t)( lapack_int n, lapack_complex_float* v,
                           lapack_complex_float* x,
                           float* est, lapack_int* kase, lapack_int* isave );
typedef lapack_int (*zlacn2_t)( lapack_int n, lapack_complex_double* v,
                           lapack_complex_double* x,
                           double* est, lapack_int* kase, lapack_int* isave );

typedef lapack_int (*slacpy_t)( int matrix_order, char uplo, lapack_int m,
                           lapack_int n, const float* a, lapack_int lda, float* b,
                           lapack_int ldb );
typedef lapack_int (*dlacpy_t)( int matrix_order, char uplo, lapack_int m,
                           lapack_int n, const double* a, lapack_int lda, double* b,
                           lapack_int ldb );
typedef lapack_int (*clacpy_t)( int matrix_order, char uplo, lapack_int m,
                           lapack_int n, const lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* b,
                           lapack_int ldb );
typedef lapack_int (*zlacpy_t)( int matrix_order, char uplo, lapack_int m,
                           lapack_int n, const lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* b,
                           lapack_int ldb );

typedef lapack_int (*clacp2_t)( int matrix_order, char uplo, lapack_int m,
                           lapack_int n, const float* a, lapack_int lda,
                           lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zlacp2_t)( int matrix_order, char uplo, lapack_int m,
                           lapack_int n, const double* a, lapack_int lda,
                           lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*zlag2c_t)( int matrix_order, lapack_int m, lapack_int n,
                           const lapack_complex_double* a, lapack_int lda,
                           lapack_complex_float* sa, lapack_int ldsa );

typedef lapack_int (*slag2d_t)( int matrix_order, lapack_int m, lapack_int n,
                           const float* sa, lapack_int ldsa, double* a,
                           lapack_int lda );

typedef lapack_int (*dlag2s_t)( int matrix_order, lapack_int m, lapack_int n,
                           const double* a, lapack_int lda, float* sa,
                           lapack_int ldsa );

typedef lapack_int (*clag2z_t)( int matrix_order, lapack_int m, lapack_int n,
                           const lapack_complex_float* sa, lapack_int ldsa,
                           lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*slagge_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int kl, lapack_int ku, const float* d,
                           float* a, lapack_int lda, lapack_int* iseed );
typedef lapack_int (*dlagge_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int kl, lapack_int ku, const double* d,
                           double* a, lapack_int lda, lapack_int* iseed );
typedef lapack_int (*clagge_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int kl, lapack_int ku, const float* d,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_int* iseed );
typedef lapack_int (*zlagge_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int kl, lapack_int ku, const double* d,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_int* iseed );

typedef float (*slamch_t)( char cmach );
typedef double (*dlamch_t)( char cmach );

typedef float (*slange_t)( int matrix_order, char norm, lapack_int m,
                           lapack_int n, const float* a, lapack_int lda );
typedef double (*dlange_t)( int matrix_order, char norm, lapack_int m,
                           lapack_int n, const double* a, lapack_int lda );
typedef float (*clange_t)( int matrix_order, char norm, lapack_int m,
                           lapack_int n, const lapack_complex_float* a,
                           lapack_int lda );
typedef double (*zlange_t)( int matrix_order, char norm, lapack_int m,
                           lapack_int n, const lapack_complex_double* a,
                           lapack_int lda );

typedef float (*clanhe_t)( int matrix_order, char norm, char uplo, lapack_int n,
                           const lapack_complex_float* a, lapack_int lda );
typedef double (*zlanhe_t)( int matrix_order, char norm, char uplo, lapack_int n,
                           const lapack_complex_double* a, lapack_int lda );

typedef float (*slansy_t)( int matrix_order, char norm, char uplo, lapack_int n,
                           const float* a, lapack_int lda );
typedef double (*dlansy_t)( int matrix_order, char norm, char uplo, lapack_int n,
                           const double* a, lapack_int lda );
typedef float (*clansy_t)( int matrix_order, char norm, char uplo, lapack_int n,
                           const lapack_complex_float* a, lapack_int lda );
typedef double (*zlansy_t)( int matrix_order, char norm, char uplo, lapack_int n,
                           const lapack_complex_double* a, lapack_int lda );

typedef float (*slantr_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int m, lapack_int n, const float* a,
                           lapack_int lda );
typedef double (*dlantr_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int m, lapack_int n, const double* a,
                           lapack_int lda );
typedef float (*clantr_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int m, lapack_int n, const lapack_complex_float* a,
                           lapack_int lda );
typedef double (*zlantr_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int m, lapack_int n, const lapack_complex_double* a,
                           lapack_int lda );


typedef lapack_int (*slarfb_t)( int matrix_order, char side, char trans, char direct,
                           char storev, lapack_int m, lapack_int n,
                           lapack_int k, const float* v, lapack_int ldv,
                           const float* t, lapack_int ldt, float* c,
                           lapack_int ldc );
typedef lapack_int (*dlarfb_t)( int matrix_order, char side, char trans, char direct,
                           char storev, lapack_int m, lapack_int n,
                           lapack_int k, const double* v, lapack_int ldv,
                           const double* t, lapack_int ldt, double* c,
                           lapack_int ldc );
typedef lapack_int (*clarfb_t)( int matrix_order, char side, char trans, char direct,
                           char storev, lapack_int m, lapack_int n,
                           lapack_int k, const lapack_complex_float* v,
                           lapack_int ldv, const lapack_complex_float* t,
                           lapack_int ldt, lapack_complex_float* c,
                           lapack_int ldc );
typedef lapack_int (*zlarfb_t)( int matrix_order, char side, char trans, char direct,
                           char storev, lapack_int m, lapack_int n,
                           lapack_int k, const lapack_complex_double* v,
                           lapack_int ldv, const lapack_complex_double* t,
                           lapack_int ldt, lapack_complex_double* c,
                           lapack_int ldc );

typedef lapack_int (*slarfg_t)( lapack_int n, float* alpha, float* x,
                           lapack_int incx, float* tau );
typedef lapack_int (*dlarfg_t)( lapack_int n, double* alpha, double* x,
                           lapack_int incx, double* tau );
typedef lapack_int (*clarfg_t)( lapack_int n, lapack_complex_float* alpha,
                           lapack_complex_float* x, lapack_int incx,
                           lapack_complex_float* tau );
typedef lapack_int (*zlarfg_t)( lapack_int n, lapack_complex_double* alpha,
                           lapack_complex_double* x, lapack_int incx,
                           lapack_complex_double* tau );

typedef lapack_int (*slarft_t)( int matrix_order, char direct, char storev,
                           lapack_int n, lapack_int k, const float* v,
                           lapack_int ldv, const float* tau, float* t,
                           lapack_int ldt );
typedef lapack_int (*dlarft_t)( int matrix_order, char direct, char storev,
                           lapack_int n, lapack_int k, const double* v,
                           lapack_int ldv, const double* tau, double* t,
                           lapack_int ldt );
typedef lapack_int (*clarft_t)( int matrix_order, char direct, char storev,
                           lapack_int n, lapack_int k,
                           const lapack_complex_float* v, lapack_int ldv,
                           const lapack_complex_float* tau,
                           lapack_complex_float* t, lapack_int ldt );
typedef lapack_int (*zlarft_t)( int matrix_order, char direct, char storev,
                           lapack_int n, lapack_int k,
                           const lapack_complex_double* v, lapack_int ldv,
                           const lapack_complex_double* tau,
                           lapack_complex_double* t, lapack_int ldt );

typedef lapack_int (*slarfx_t)( int matrix_order, char side, lapack_int m,
                           lapack_int n, const float* v, float tau, float* c,
                           lapack_int ldc, float* work );
typedef lapack_int (*dlarfx_t)( int matrix_order, char side, lapack_int m,
                           lapack_int n, const double* v, double tau, double* c,
                           lapack_int ldc, double* work );
typedef lapack_int (*clarfx_t)( int matrix_order, char side, lapack_int m,
                           lapack_int n, const lapack_complex_float* v,
                           lapack_complex_float tau, lapack_complex_float* c,
                           lapack_int ldc, lapack_complex_float* work );
typedef lapack_int (*zlarfx_t)( int matrix_order, char side, lapack_int m,
                           lapack_int n, const lapack_complex_double* v,
                           lapack_complex_double tau, lapack_complex_double* c,
                           lapack_int ldc, lapack_complex_double* work );

typedef lapack_int (*slarnv_t)( lapack_int idist, lapack_int* iseed, lapack_int n,
                           float* x );
typedef lapack_int (*dlarnv_t)( lapack_int idist, lapack_int* iseed, lapack_int n,
                           double* x );
typedef lapack_int (*clarnv_t)( lapack_int idist, lapack_int* iseed, lapack_int n,
                           lapack_complex_float* x );
typedef lapack_int (*zlarnv_t)( lapack_int idist, lapack_int* iseed, lapack_int n,
                           lapack_complex_double* x );

typedef lapack_int (*slaset_t)( int matrix_order, char uplo, lapack_int m,
                           lapack_int n, float alpha, float beta, float* a,
                           lapack_int lda );
typedef lapack_int (*dlaset_t)( int matrix_order, char uplo, lapack_int m,
                           lapack_int n, double alpha, double beta, double* a,
                           lapack_int lda );
typedef lapack_int (*claset_t)( int matrix_order, char uplo, lapack_int m,
                           lapack_int n, lapack_complex_float alpha,
                           lapack_complex_float beta, lapack_complex_float* a,
                           lapack_int lda );
typedef lapack_int (*zlaset_t)( int matrix_order, char uplo, lapack_int m,
                           lapack_int n, lapack_complex_double alpha,
                           lapack_complex_double beta, lapack_complex_double* a,
                           lapack_int lda );

typedef lapack_int (*slasrt_t)( char id, lapack_int n, float* d );
typedef lapack_int (*dlasrt_t)( char id, lapack_int n, double* d );

typedef lapack_int (*slaswp_t)( int matrix_order, lapack_int n, float* a,
                           lapack_int lda, lapack_int k1, lapack_int k2,
                           const lapack_int* ipiv, lapack_int incx );
typedef lapack_int (*dlaswp_t)( int matrix_order, lapack_int n, double* a,
                           lapack_int lda, lapack_int k1, lapack_int k2,
                           const lapack_int* ipiv, lapack_int incx );
typedef lapack_int (*claswp_t)( int matrix_order, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_int k1, lapack_int k2, const lapack_int* ipiv,
                           lapack_int incx );
typedef lapack_int (*zlaswp_t)( int matrix_order, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_int k1, lapack_int k2, const lapack_int* ipiv,
                           lapack_int incx );

typedef lapack_int (*slatms_t)( int matrix_order, lapack_int m, lapack_int n,
                           char dist, lapack_int* iseed, char sym, float* d,
                           lapack_int mode, float cond, float dmax,
                           lapack_int kl, lapack_int ku, char pack, float* a,
                           lapack_int lda );
typedef lapack_int (*dlatms_t)( int matrix_order, lapack_int m, lapack_int n,
                           char dist, lapack_int* iseed, char sym, double* d,
                           lapack_int mode, double cond, double dmax,
                           lapack_int kl, lapack_int ku, char pack, double* a,
                           lapack_int lda );
typedef lapack_int (*clatms_t)( int matrix_order, lapack_int m, lapack_int n,
                           char dist, lapack_int* iseed, char sym, float* d,
                           lapack_int mode, float cond, float dmax,
                           lapack_int kl, lapack_int ku, char pack,
                           lapack_complex_float* a, lapack_int lda );
typedef lapack_int (*zlatms_t)( int matrix_order, lapack_int m, lapack_int n,
                           char dist, lapack_int* iseed, char sym, double* d,
                           lapack_int mode, double cond, double dmax,
                           lapack_int kl, lapack_int ku, char pack,
                           lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*slauum_t)( int matrix_order, char uplo, lapack_int n, float* a,
                           lapack_int lda );
typedef lapack_int (*dlauum_t)( int matrix_order, char uplo, lapack_int n, double* a,
                           lapack_int lda );
typedef lapack_int (*clauum_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* a, lapack_int lda );
typedef lapack_int (*zlauum_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*sopgtr_t)( int matrix_order, char uplo, lapack_int n,
                           const float* ap, const float* tau, float* q,
                           lapack_int ldq );
typedef lapack_int (*dopgtr_t)( int matrix_order, char uplo, lapack_int n,
                           const double* ap, const double* tau, double* q,
                           lapack_int ldq );

typedef lapack_int (*sopmtr_t)( int matrix_order, char side, char uplo, char trans,
                           lapack_int m, lapack_int n, const float* ap,
                           const float* tau, float* c, lapack_int ldc );
typedef lapack_int (*dopmtr_t)( int matrix_order, char side, char uplo, char trans,
                           lapack_int m, lapack_int n, const double* ap,
                           const double* tau, double* c, lapack_int ldc );

typedef lapack_int (*sorgbr_t)( int matrix_order, char vect, lapack_int m,
                           lapack_int n, lapack_int k, float* a, lapack_int lda,
                           const float* tau );
typedef lapack_int (*dorgbr_t)( int matrix_order, char vect, lapack_int m,
                           lapack_int n, lapack_int k, double* a,
                           lapack_int lda, const double* tau );

typedef lapack_int (*sorghr_t)( int matrix_order, lapack_int n, lapack_int ilo,
                           lapack_int ihi, float* a, lapack_int lda,
                           const float* tau );
typedef lapack_int (*dorghr_t)( int matrix_order, lapack_int n, lapack_int ilo,
                           lapack_int ihi, double* a, lapack_int lda,
                           const double* tau );

typedef lapack_int (*sorglq_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, float* a, lapack_int lda,
                           const float* tau );
typedef lapack_int (*dorglq_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, double* a, lapack_int lda,
                           const double* tau );

typedef lapack_int (*sorgql_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, float* a, lapack_int lda,
                           const float* tau );
typedef lapack_int (*dorgql_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, double* a, lapack_int lda,
                           const double* tau );

typedef lapack_int (*sorgqr_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, float* a, lapack_int lda,
                           const float* tau );
typedef lapack_int (*dorgqr_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, double* a, lapack_int lda,
                           const double* tau );

typedef lapack_int (*sorgrq_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, float* a, lapack_int lda,
                           const float* tau );
typedef lapack_int (*dorgrq_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, double* a, lapack_int lda,
                           const double* tau );

typedef lapack_int (*sorgtr_t)( int matrix_order, char uplo, lapack_int n, float* a,
                           lapack_int lda, const float* tau );
typedef lapack_int (*dorgtr_t)( int matrix_order, char uplo, lapack_int n, double* a,
                           lapack_int lda, const double* tau );

typedef lapack_int (*sormbr_t)( int matrix_order, char vect, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const float* a, lapack_int lda, const float* tau,
                           float* c, lapack_int ldc );
typedef lapack_int (*dormbr_t)( int matrix_order, char vect, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const double* a, lapack_int lda, const double* tau,
                           double* c, lapack_int ldc );

typedef lapack_int (*sormhr_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int ilo,
                           lapack_int ihi, const float* a, lapack_int lda,
                           const float* tau, float* c, lapack_int ldc );
typedef lapack_int (*dormhr_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int ilo,
                           lapack_int ihi, const double* a, lapack_int lda,
                           const double* tau, double* c, lapack_int ldc );

typedef lapack_int (*sormlq_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const float* a, lapack_int lda, const float* tau,
                           float* c, lapack_int ldc );
typedef lapack_int (*dormlq_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const double* a, lapack_int lda, const double* tau,
                           double* c, lapack_int ldc );

typedef lapack_int (*sormql_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const float* a, lapack_int lda, const float* tau,
                           float* c, lapack_int ldc );
typedef lapack_int (*dormql_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const double* a, lapack_int lda, const double* tau,
                           double* c, lapack_int ldc );

typedef lapack_int (*sormqr_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const float* a, lapack_int lda, const float* tau,
                           float* c, lapack_int ldc );
typedef lapack_int (*dormqr_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const double* a, lapack_int lda, const double* tau,
                           double* c, lapack_int ldc );

typedef lapack_int (*sormrq_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const float* a, lapack_int lda, const float* tau,
                           float* c, lapack_int ldc );
typedef lapack_int (*dormrq_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const double* a, lapack_int lda, const double* tau,
                           double* c, lapack_int ldc );

typedef lapack_int (*sormrz_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           lapack_int l, const float* a, lapack_int lda,
                           const float* tau, float* c, lapack_int ldc );
typedef lapack_int (*dormrz_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           lapack_int l, const double* a, lapack_int lda,
                           const double* tau, double* c, lapack_int ldc );

typedef lapack_int (*sormtr_t)( int matrix_order, char side, char uplo, char trans,
                           lapack_int m, lapack_int n, const float* a,
                           lapack_int lda, const float* tau, float* c,
                           lapack_int ldc );
typedef lapack_int (*dormtr_t)( int matrix_order, char side, char uplo, char trans,
                           lapack_int m, lapack_int n, const double* a,
                           lapack_int lda, const double* tau, double* c,
                           lapack_int ldc );

typedef lapack_int (*spbcon_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, const float* ab, lapack_int ldab,
                           float anorm, float* rcond );
typedef lapack_int (*dpbcon_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, const double* ab, lapack_int ldab,
                           double anorm, double* rcond );
typedef lapack_int (*cpbcon_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, const lapack_complex_float* ab,
                           lapack_int ldab, float anorm, float* rcond );
typedef lapack_int (*zpbcon_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, const lapack_complex_double* ab,
                           lapack_int ldab, double anorm, double* rcond );

typedef lapack_int (*spbequ_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, const float* ab, lapack_int ldab,
                           float* s, float* scond, float* amax );
typedef lapack_int (*dpbequ_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, const double* ab, lapack_int ldab,
                           double* s, double* scond, double* amax );
typedef lapack_int (*cpbequ_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, const lapack_complex_float* ab,
                           lapack_int ldab, float* s, float* scond,
                           float* amax );
typedef lapack_int (*zpbequ_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, const lapack_complex_double* ab,
                           lapack_int ldab, double* s, double* scond,
                           double* amax );

typedef lapack_int (*spbrfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, lapack_int nrhs, const float* ab,
                           lapack_int ldab, const float* afb, lapack_int ldafb,
                           const float* b, lapack_int ldb, float* x,
                           lapack_int ldx, float* ferr, float* berr );
typedef lapack_int (*dpbrfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, lapack_int nrhs, const double* ab,
                           lapack_int ldab, const double* afb, lapack_int ldafb,
                           const double* b, lapack_int ldb, double* x,
                           lapack_int ldx, double* ferr, double* berr );
typedef lapack_int (*cpbrfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, lapack_int nrhs,
                           const lapack_complex_float* ab, lapack_int ldab,
                           const lapack_complex_float* afb, lapack_int ldafb,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx, float* ferr,
                           float* berr );
typedef lapack_int (*zpbrfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, lapack_int nrhs,
                           const lapack_complex_double* ab, lapack_int ldab,
                           const lapack_complex_double* afb, lapack_int ldafb,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* ferr, double* berr );

typedef lapack_int (*spbstf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kb, float* bb, lapack_int ldbb );
typedef lapack_int (*dpbstf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kb, double* bb, lapack_int ldbb );
typedef lapack_int (*cpbstf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kb, lapack_complex_float* bb,
                           lapack_int ldbb );
typedef lapack_int (*zpbstf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kb, lapack_complex_double* bb,
                           lapack_int ldbb );

typedef lapack_int (*spbsv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int kd, lapack_int nrhs, float* ab,
                          lapack_int ldab, float* b, lapack_int ldb );
typedef lapack_int (*dpbsv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int kd, lapack_int nrhs, double* ab,
                          lapack_int ldab, double* b, lapack_int ldb );
typedef lapack_int (*cpbsv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int kd, lapack_int nrhs,
                          lapack_complex_float* ab, lapack_int ldab,
                          lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zpbsv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int kd, lapack_int nrhs,
                          lapack_complex_double* ab, lapack_int ldab,
                          lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*spbsvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int kd, lapack_int nrhs, float* ab,
                           lapack_int ldab, float* afb, lapack_int ldafb,
                           char* equed, float* s, float* b, lapack_int ldb,
                           float* x, lapack_int ldx, float* rcond, float* ferr,
                           float* berr );
typedef lapack_int (*dpbsvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int kd, lapack_int nrhs, double* ab,
                           lapack_int ldab, double* afb, lapack_int ldafb,
                           char* equed, double* s, double* b, lapack_int ldb,
                           double* x, lapack_int ldx, double* rcond,
                           double* ferr, double* berr );
typedef lapack_int (*cpbsvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int kd, lapack_int nrhs,
                           lapack_complex_float* ab, lapack_int ldab,
                           lapack_complex_float* afb, lapack_int ldafb,
                           char* equed, float* s, lapack_complex_float* b,
                           lapack_int ldb, lapack_complex_float* x,
                           lapack_int ldx, float* rcond, float* ferr,
                           float* berr );
typedef lapack_int (*zpbsvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int kd, lapack_int nrhs,
                           lapack_complex_double* ab, lapack_int ldab,
                           lapack_complex_double* afb, lapack_int ldafb,
                           char* equed, double* s, lapack_complex_double* b,
                           lapack_int ldb, lapack_complex_double* x,
                           lapack_int ldx, double* rcond, double* ferr,
                           double* berr );

typedef lapack_int (*spbtrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, float* ab, lapack_int ldab );
typedef lapack_int (*dpbtrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, double* ab, lapack_int ldab );
typedef lapack_int (*cpbtrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, lapack_complex_float* ab,
                           lapack_int ldab );
typedef lapack_int (*zpbtrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, lapack_complex_double* ab,
                           lapack_int ldab );

typedef lapack_int (*spbtrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, lapack_int nrhs, const float* ab,
                           lapack_int ldab, float* b, lapack_int ldb );
typedef lapack_int (*dpbtrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, lapack_int nrhs, const double* ab,
                           lapack_int ldab, double* b, lapack_int ldb );
typedef lapack_int (*cpbtrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, lapack_int nrhs,
                           const lapack_complex_float* ab, lapack_int ldab,
                           lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zpbtrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int kd, lapack_int nrhs,
                           const lapack_complex_double* ab, lapack_int ldab,
                           lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*spftrf_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, float* a );
typedef lapack_int (*dpftrf_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, double* a );
typedef lapack_int (*cpftrf_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, lapack_complex_float* a );
typedef lapack_int (*zpftrf_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, lapack_complex_double* a );

typedef lapack_int (*spftri_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, float* a );
typedef lapack_int (*dpftri_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, double* a );
typedef lapack_int (*cpftri_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, lapack_complex_float* a );
typedef lapack_int (*zpftri_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, lapack_complex_double* a );

typedef lapack_int (*spftrs_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, lapack_int nrhs, const float* a,
                           float* b, lapack_int ldb );
typedef lapack_int (*dpftrs_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, lapack_int nrhs, const double* a,
                           double* b, lapack_int ldb );
typedef lapack_int (*cpftrs_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, lapack_int nrhs,
                           const lapack_complex_float* a,
                           lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zpftrs_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, lapack_int nrhs,
                           const lapack_complex_double* a,
                           lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*spocon_t)( int matrix_order, char uplo, lapack_int n,
                           const float* a, lapack_int lda, float anorm,
                           float* rcond );
typedef lapack_int (*dpocon_t)( int matrix_order, char uplo, lapack_int n,
                           const double* a, lapack_int lda, double anorm,
                           double* rcond );
typedef lapack_int (*cpocon_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_float* a, lapack_int lda,
                           float anorm, float* rcond );
typedef lapack_int (*zpocon_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_double* a, lapack_int lda,
                           double anorm, double* rcond );

typedef lapack_int (*spoequ_t)( int matrix_order, lapack_int n, const float* a,
                           lapack_int lda, float* s, float* scond,
                           float* amax );
typedef lapack_int (*dpoequ_t)( int matrix_order, lapack_int n, const double* a,
                           lapack_int lda, double* s, double* scond,
                           double* amax );
typedef lapack_int (*cpoequ_t)( int matrix_order, lapack_int n,
                           const lapack_complex_float* a, lapack_int lda,
                           float* s, float* scond, float* amax );
typedef lapack_int (*zpoequ_t)( int matrix_order, lapack_int n,
                           const lapack_complex_double* a, lapack_int lda,
                           double* s, double* scond, double* amax );

typedef lapack_int (*spoequb_t)( int matrix_order, lapack_int n, const float* a,
                            lapack_int lda, float* s, float* scond,
                            float* amax );
typedef lapack_int (*dpoequb_t)( int matrix_order, lapack_int n, const double* a,
                            lapack_int lda, double* s, double* scond,
                            double* amax );
typedef lapack_int (*cpoequb_t)( int matrix_order, lapack_int n,
                            const lapack_complex_float* a, lapack_int lda,
                            float* s, float* scond, float* amax );
typedef lapack_int (*zpoequb_t)( int matrix_order, lapack_int n,
                            const lapack_complex_double* a, lapack_int lda,
                            double* s, double* scond, double* amax );

typedef lapack_int (*sporfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const float* a, lapack_int lda,
                           const float* af, lapack_int ldaf, const float* b,
                           lapack_int ldb, float* x, lapack_int ldx,
                           float* ferr, float* berr );
typedef lapack_int (*dporfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const double* a, lapack_int lda,
                           const double* af, lapack_int ldaf, const double* b,
                           lapack_int ldb, double* x, lapack_int ldx,
                           double* ferr, double* berr );
typedef lapack_int (*cporfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* a,
                           lapack_int lda, const lapack_complex_float* af,
                           lapack_int ldaf, const lapack_complex_float* b,
                           lapack_int ldb, lapack_complex_float* x,
                           lapack_int ldx, float* ferr, float* berr );
typedef lapack_int (*zporfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* a,
                           lapack_int lda, const lapack_complex_double* af,
                           lapack_int ldaf, const lapack_complex_double* b,
                           lapack_int ldb, lapack_complex_double* x,
                           lapack_int ldx, double* ferr, double* berr );

typedef lapack_int (*sporfsx_t)( int matrix_order, char uplo, char equed,
                            lapack_int n, lapack_int nrhs, const float* a,
                            lapack_int lda, const float* af, lapack_int ldaf,
                            const float* s, const float* b, lapack_int ldb,
                            float* x, lapack_int ldx, float* rcond, float* berr,
                            lapack_int n_err_bnds, float* err_bnds_norm,
                            float* err_bnds_comp, lapack_int nparams,
                            float* params );
typedef lapack_int (*dporfsx_t)( int matrix_order, char uplo, char equed,
                            lapack_int n, lapack_int nrhs, const double* a,
                            lapack_int lda, const double* af, lapack_int ldaf,
                            const double* s, const double* b, lapack_int ldb,
                            double* x, lapack_int ldx, double* rcond,
                            double* berr, lapack_int n_err_bnds,
                            double* err_bnds_norm, double* err_bnds_comp,
                            lapack_int nparams, double* params );
typedef lapack_int (*cporfsx_t)( int matrix_order, char uplo, char equed,
                            lapack_int n, lapack_int nrhs,
                            const lapack_complex_float* a, lapack_int lda,
                            const lapack_complex_float* af, lapack_int ldaf,
                            const float* s, const lapack_complex_float* b,
                            lapack_int ldb, lapack_complex_float* x,
                            lapack_int ldx, float* rcond, float* berr,
                            lapack_int n_err_bnds, float* err_bnds_norm,
                            float* err_bnds_comp, lapack_int nparams,
                            float* params );
typedef lapack_int (*zporfsx_t)( int matrix_order, char uplo, char equed,
                            lapack_int n, lapack_int nrhs,
                            const lapack_complex_double* a, lapack_int lda,
                            const lapack_complex_double* af, lapack_int ldaf,
                            const double* s, const lapack_complex_double* b,
                            lapack_int ldb, lapack_complex_double* x,
                            lapack_int ldx, double* rcond, double* berr,
                            lapack_int n_err_bnds, double* err_bnds_norm,
                            double* err_bnds_comp, lapack_int nparams,
                            double* params );

typedef lapack_int (*sposv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, float* a, lapack_int lda, float* b,
                          lapack_int ldb );
typedef lapack_int (*dposv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, double* a, lapack_int lda, double* b,
                          lapack_int ldb );
typedef lapack_int (*cposv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, lapack_complex_float* a,
                          lapack_int lda, lapack_complex_float* b,
                          lapack_int ldb );
typedef lapack_int (*zposv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, lapack_complex_double* a,
                          lapack_int lda, lapack_complex_double* b,
                          lapack_int ldb );
typedef lapack_int (*dsposv_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, double* a, lapack_int lda,
                           double* b, lapack_int ldb, double* x, lapack_int ldx,
                           lapack_int* iter );
typedef lapack_int (*zcposv_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* b,
                           lapack_int ldb, lapack_complex_double* x,
                           lapack_int ldx, lapack_int* iter );

typedef lapack_int (*sposvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, float* a, lapack_int lda, float* af,
                           lapack_int ldaf, char* equed, float* s, float* b,
                           lapack_int ldb, float* x, lapack_int ldx,
                           float* rcond, float* ferr, float* berr );
typedef lapack_int (*dposvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, double* a, lapack_int lda,
                           double* af, lapack_int ldaf, char* equed, double* s,
                           double* b, lapack_int ldb, double* x, lapack_int ldx,
                           double* rcond, double* ferr, double* berr );
typedef lapack_int (*cposvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* af,
                           lapack_int ldaf, char* equed, float* s,
                           lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx,
                           float* rcond, float* ferr, float* berr );
typedef lapack_int (*zposvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* af,
                           lapack_int ldaf, char* equed, double* s,
                           lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* rcond, double* ferr, double* berr );

typedef lapack_int (*sposvxx_t)( int matrix_order, char fact, char uplo,
                            lapack_int n, lapack_int nrhs, float* a,
                            lapack_int lda, float* af, lapack_int ldaf,
                            char* equed, float* s, float* b, lapack_int ldb,
                            float* x, lapack_int ldx, float* rcond,
                            float* rpvgrw, float* berr, lapack_int n_err_bnds,
                            float* err_bnds_norm, float* err_bnds_comp,
                            lapack_int nparams, float* params );
typedef lapack_int (*dposvxx_t)( int matrix_order, char fact, char uplo,
                            lapack_int n, lapack_int nrhs, double* a,
                            lapack_int lda, double* af, lapack_int ldaf,
                            char* equed, double* s, double* b, lapack_int ldb,
                            double* x, lapack_int ldx, double* rcond,
                            double* rpvgrw, double* berr, lapack_int n_err_bnds,
                            double* err_bnds_norm, double* err_bnds_comp,
                            lapack_int nparams, double* params );
typedef lapack_int (*cposvxx_t)( int matrix_order, char fact, char uplo,
                            lapack_int n, lapack_int nrhs,
                            lapack_complex_float* a, lapack_int lda,
                            lapack_complex_float* af, lapack_int ldaf,
                            char* equed, float* s, lapack_complex_float* b,
                            lapack_int ldb, lapack_complex_float* x,
                            lapack_int ldx, float* rcond, float* rpvgrw,
                            float* berr, lapack_int n_err_bnds,
                            float* err_bnds_norm, float* err_bnds_comp,
                            lapack_int nparams, float* params );
typedef lapack_int (*zposvxx_t)( int matrix_order, char fact, char uplo,
                            lapack_int n, lapack_int nrhs,
                            lapack_complex_double* a, lapack_int lda,
                            lapack_complex_double* af, lapack_int ldaf,
                            char* equed, double* s, lapack_complex_double* b,
                            lapack_int ldb, lapack_complex_double* x,
                            lapack_int ldx, double* rcond, double* rpvgrw,
                            double* berr, lapack_int n_err_bnds,
                            double* err_bnds_norm, double* err_bnds_comp,
                            lapack_int nparams, double* params );

typedef lapack_int (*spotrf_t)( int matrix_order, char uplo, lapack_int n, float* a,
                           lapack_int lda );
typedef lapack_int (*dpotrf_t)( int matrix_order, char uplo, lapack_int n, double* a,
                           lapack_int lda );
typedef lapack_int (*cpotrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* a, lapack_int lda );
typedef lapack_int (*zpotrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*spotri_t)( int matrix_order, char uplo, lapack_int n, float* a,
                           lapack_int lda );
typedef lapack_int (*dpotri_t)( int matrix_order, char uplo, lapack_int n, double* a,
                           lapack_int lda );
typedef lapack_int (*cpotri_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* a, lapack_int lda );
typedef lapack_int (*zpotri_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*spotrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const float* a, lapack_int lda,
                           float* b, lapack_int ldb );
typedef lapack_int (*dpotrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const double* a, lapack_int lda,
                           double* b, lapack_int ldb );
typedef lapack_int (*cpotrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* b,
                           lapack_int ldb );
typedef lapack_int (*zpotrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* b,
                           lapack_int ldb );

typedef lapack_int (*sppcon_t)( int matrix_order, char uplo, lapack_int n,
                           const float* ap, float anorm, float* rcond );
typedef lapack_int (*dppcon_t)( int matrix_order, char uplo, lapack_int n,
                           const double* ap, double anorm, double* rcond );
typedef lapack_int (*cppcon_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_float* ap, float anorm,
                           float* rcond );
typedef lapack_int (*zppcon_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_double* ap, double anorm,
                           double* rcond );

typedef lapack_int (*sppequ_t)( int matrix_order, char uplo, lapack_int n,
                           const float* ap, float* s, float* scond,
                           float* amax );
typedef lapack_int (*dppequ_t)( int matrix_order, char uplo, lapack_int n,
                           const double* ap, double* s, double* scond,
                           double* amax );
typedef lapack_int (*cppequ_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_float* ap, float* s,
                           float* scond, float* amax );
typedef lapack_int (*zppequ_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_double* ap, double* s,
                           double* scond, double* amax );

typedef lapack_int (*spprfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const float* ap, const float* afp,
                           const float* b, lapack_int ldb, float* x,
                           lapack_int ldx, float* ferr, float* berr );
typedef lapack_int (*dpprfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const double* ap, const double* afp,
                           const double* b, lapack_int ldb, double* x,
                           lapack_int ldx, double* ferr, double* berr );
typedef lapack_int (*cpprfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* ap,
                           const lapack_complex_float* afp,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx, float* ferr,
                           float* berr );
typedef lapack_int (*zpprfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* ap,
                           const lapack_complex_double* afp,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* ferr, double* berr );

typedef lapack_int (*sppsv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, float* ap, float* b,
                          lapack_int ldb );
typedef lapack_int (*dppsv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, double* ap, double* b,
                          lapack_int ldb );
typedef lapack_int (*cppsv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, lapack_complex_float* ap,
                          lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zppsv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, lapack_complex_double* ap,
                          lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*sppsvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, float* ap, float* afp, char* equed,
                           float* s, float* b, lapack_int ldb, float* x,
                           lapack_int ldx, float* rcond, float* ferr,
                           float* berr );
typedef lapack_int (*dppsvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, double* ap, double* afp,
                           char* equed, double* s, double* b, lapack_int ldb,
                           double* x, lapack_int ldx, double* rcond,
                           double* ferr, double* berr );
typedef lapack_int (*cppsvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, lapack_complex_float* ap,
                           lapack_complex_float* afp, char* equed, float* s,
                           lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx,
                           float* rcond, float* ferr, float* berr );
typedef lapack_int (*zppsvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, lapack_complex_double* ap,
                           lapack_complex_double* afp, char* equed, double* s,
                           lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* rcond, double* ferr, double* berr );

typedef lapack_int (*spptrf_t)( int matrix_order, char uplo, lapack_int n,
                           float* ap );
typedef lapack_int (*dpptrf_t)( int matrix_order, char uplo, lapack_int n,
                           double* ap );
typedef lapack_int (*cpptrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* ap );
typedef lapack_int (*zpptrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* ap );

typedef lapack_int (*spptri_t)( int matrix_order, char uplo, lapack_int n,
                           float* ap );
typedef lapack_int (*dpptri_t)( int matrix_order, char uplo, lapack_int n,
                           double* ap );
typedef lapack_int (*cpptri_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* ap );
typedef lapack_int (*zpptri_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* ap );

typedef lapack_int (*spptrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const float* ap, float* b,
                           lapack_int ldb );
typedef lapack_int (*dpptrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const double* ap, double* b,
                           lapack_int ldb );
typedef lapack_int (*cpptrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* ap,
                           lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zpptrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* ap,
                           lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*spstrf_t)( int matrix_order, char uplo, lapack_int n, float* a,
                           lapack_int lda, lapack_int* piv, lapack_int* rank,
                           float tol );
typedef lapack_int (*dpstrf_t)( int matrix_order, char uplo, lapack_int n, double* a,
                           lapack_int lda, lapack_int* piv, lapack_int* rank,
                           double tol );
typedef lapack_int (*cpstrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_int* piv, lapack_int* rank, float tol );
typedef lapack_int (*zpstrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_int* piv, lapack_int* rank, double tol );

typedef lapack_int (*sptcon_t)( lapack_int n, const float* d, const float* e,
                           float anorm, float* rcond );
typedef lapack_int (*dptcon_t)( lapack_int n, const double* d, const double* e,
                           double anorm, double* rcond );
typedef lapack_int (*cptcon_t)( lapack_int n, const float* d,
                           const lapack_complex_float* e, float anorm,
                           float* rcond );
typedef lapack_int (*zptcon_t)( lapack_int n, const double* d,
                           const lapack_complex_double* e, double anorm,
                           double* rcond );

typedef lapack_int (*spteqr_t)( int matrix_order, char compz, lapack_int n, float* d,
                           float* e, float* z, lapack_int ldz );
typedef lapack_int (*dpteqr_t)( int matrix_order, char compz, lapack_int n,
                           double* d, double* e, double* z, lapack_int ldz );
typedef lapack_int (*cpteqr_t)( int matrix_order, char compz, lapack_int n, float* d,
                           float* e, lapack_complex_float* z, lapack_int ldz );
typedef lapack_int (*zpteqr_t)( int matrix_order, char compz, lapack_int n,
                           double* d, double* e, lapack_complex_double* z,
                           lapack_int ldz );

typedef lapack_int (*sptrfs_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                           const float* d, const float* e, const float* df,
                           const float* ef, const float* b, lapack_int ldb,
                           float* x, lapack_int ldx, float* ferr, float* berr );
typedef lapack_int (*dptrfs_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                           const double* d, const double* e, const double* df,
                           const double* ef, const double* b, lapack_int ldb,
                           double* x, lapack_int ldx, double* ferr,
                           double* berr );
typedef lapack_int (*cptrfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const float* d,
                           const lapack_complex_float* e, const float* df,
                           const lapack_complex_float* ef,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx, float* ferr,
                           float* berr );
typedef lapack_int (*zptrfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const double* d,
                           const lapack_complex_double* e, const double* df,
                           const lapack_complex_double* ef,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* ferr, double* berr );

typedef lapack_int (*sptsv_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                          float* d, float* e, float* b, lapack_int ldb );
typedef lapack_int (*dptsv_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                          double* d, double* e, double* b, lapack_int ldb );
typedef lapack_int (*cptsv_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                          float* d, lapack_complex_float* e,
                          lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zptsv_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                          double* d, lapack_complex_double* e,
                          lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*sptsvx_t)( int matrix_order, char fact, lapack_int n,
                           lapack_int nrhs, const float* d, const float* e,
                           float* df, float* ef, const float* b, lapack_int ldb,
                           float* x, lapack_int ldx, float* rcond, float* ferr,
                           float* berr );
typedef lapack_int (*dptsvx_t)( int matrix_order, char fact, lapack_int n,
                           lapack_int nrhs, const double* d, const double* e,
                           double* df, double* ef, const double* b,
                           lapack_int ldb, double* x, lapack_int ldx,
                           double* rcond, double* ferr, double* berr );
typedef lapack_int (*cptsvx_t)( int matrix_order, char fact, lapack_int n,
                           lapack_int nrhs, const float* d,
                           const lapack_complex_float* e, float* df,
                           lapack_complex_float* ef,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx,
                           float* rcond, float* ferr, float* berr );
typedef lapack_int (*zptsvx_t)( int matrix_order, char fact, lapack_int n,
                           lapack_int nrhs, const double* d,
                           const lapack_complex_double* e, double* df,
                           lapack_complex_double* ef,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* rcond, double* ferr, double* berr );

typedef lapack_int (*spttrf_t)( lapack_int n, float* d, float* e );
typedef lapack_int (*dpttrf_t)( lapack_int n, double* d, double* e );
typedef lapack_int (*cpttrf_t)( lapack_int n, float* d, lapack_complex_float* e );
typedef lapack_int (*zpttrf_t)( lapack_int n, double* d, lapack_complex_double* e );

typedef lapack_int (*spttrs_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                           const float* d, const float* e, float* b,
                           lapack_int ldb );
typedef lapack_int (*dpttrs_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                           const double* d, const double* e, double* b,
                           lapack_int ldb );
typedef lapack_int (*cpttrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const float* d,
                           const lapack_complex_float* e,
                           lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zpttrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const double* d,
                           const lapack_complex_double* e,
                           lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*ssbev_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          lapack_int kd, float* ab, lapack_int ldab, float* w,
                          float* z, lapack_int ldz );
typedef lapack_int (*dsbev_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          lapack_int kd, double* ab, lapack_int ldab, double* w,
                          double* z, lapack_int ldz );

typedef lapack_int (*ssbevd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           lapack_int kd, float* ab, lapack_int ldab, float* w,
                           float* z, lapack_int ldz );
typedef lapack_int (*dsbevd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           lapack_int kd, double* ab, lapack_int ldab,
                           double* w, double* z, lapack_int ldz );

typedef lapack_int (*ssbevx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, lapack_int kd, float* ab,
                           lapack_int ldab, float* q, lapack_int ldq, float vl,
                           float vu, lapack_int il, lapack_int iu, float abstol,
                           lapack_int* m, float* w, float* z, lapack_int ldz,
                           lapack_int* ifail );
typedef lapack_int (*dsbevx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, lapack_int kd, double* ab,
                           lapack_int ldab, double* q, lapack_int ldq,
                           double vl, double vu, lapack_int il, lapack_int iu,
                           double abstol, lapack_int* m, double* w, double* z,
                           lapack_int ldz, lapack_int* ifail );

typedef lapack_int (*ssbgst_t)( int matrix_order, char vect, char uplo, lapack_int n,
                           lapack_int ka, lapack_int kb, float* ab,
                           lapack_int ldab, const float* bb, lapack_int ldbb,
                           float* x, lapack_int ldx );
typedef lapack_int (*dsbgst_t)( int matrix_order, char vect, char uplo, lapack_int n,
                           lapack_int ka, lapack_int kb, double* ab,
                           lapack_int ldab, const double* bb, lapack_int ldbb,
                           double* x, lapack_int ldx );

typedef lapack_int (*ssbgv_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          lapack_int ka, lapack_int kb, float* ab,
                          lapack_int ldab, float* bb, lapack_int ldbb, float* w,
                          float* z, lapack_int ldz );
typedef lapack_int (*dsbgv_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          lapack_int ka, lapack_int kb, double* ab,
                          lapack_int ldab, double* bb, lapack_int ldbb,
                          double* w, double* z, lapack_int ldz );

typedef lapack_int (*ssbgvd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           lapack_int ka, lapack_int kb, float* ab,
                           lapack_int ldab, float* bb, lapack_int ldbb,
                           float* w, float* z, lapack_int ldz );
typedef lapack_int (*dsbgvd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           lapack_int ka, lapack_int kb, double* ab,
                           lapack_int ldab, double* bb, lapack_int ldbb,
                           double* w, double* z, lapack_int ldz );

typedef lapack_int (*ssbgvx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, lapack_int ka, lapack_int kb,
                           float* ab, lapack_int ldab, float* bb,
                           lapack_int ldbb, float* q, lapack_int ldq, float vl,
                           float vu, lapack_int il, lapack_int iu, float abstol,
                           lapack_int* m, float* w, float* z, lapack_int ldz,
                           lapack_int* ifail );
typedef lapack_int (*dsbgvx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, lapack_int ka, lapack_int kb,
                           double* ab, lapack_int ldab, double* bb,
                           lapack_int ldbb, double* q, lapack_int ldq,
                           double vl, double vu, lapack_int il, lapack_int iu,
                           double abstol, lapack_int* m, double* w, double* z,
                           lapack_int ldz, lapack_int* ifail );

typedef lapack_int (*ssbtrd_t)( int matrix_order, char vect, char uplo, lapack_int n,
                           lapack_int kd, float* ab, lapack_int ldab, float* d,
                           float* e, float* q, lapack_int ldq );
typedef lapack_int (*dsbtrd_t)( int matrix_order, char vect, char uplo, lapack_int n,
                           lapack_int kd, double* ab, lapack_int ldab,
                           double* d, double* e, double* q, lapack_int ldq );

typedef lapack_int (*ssfrk_t)( int matrix_order, char transr, char uplo, char trans,
                          lapack_int n, lapack_int k, float alpha,
                          const float* a, lapack_int lda, float beta,
                          float* c );
typedef lapack_int (*dsfrk_t)( int matrix_order, char transr, char uplo, char trans,
                          lapack_int n, lapack_int k, double alpha,
                          const double* a, lapack_int lda, double beta,
                          double* c );

typedef lapack_int (*sspcon_t)( int matrix_order, char uplo, lapack_int n,
                           const float* ap, const lapack_int* ipiv, float anorm,
                           float* rcond );
typedef lapack_int (*dspcon_t)( int matrix_order, char uplo, lapack_int n,
                           const double* ap, const lapack_int* ipiv,
                           double anorm, double* rcond );
typedef lapack_int (*cspcon_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_float* ap,
                           const lapack_int* ipiv, float anorm, float* rcond );
typedef lapack_int (*zspcon_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_double* ap,
                           const lapack_int* ipiv, double anorm,
                           double* rcond );

typedef lapack_int (*sspev_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          float* ap, float* w, float* z, lapack_int ldz );
typedef lapack_int (*dspev_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          double* ap, double* w, double* z, lapack_int ldz );

typedef lapack_int (*sspevd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           float* ap, float* w, float* z, lapack_int ldz );
typedef lapack_int (*dspevd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           double* ap, double* w, double* z, lapack_int ldz );

typedef lapack_int (*sspevx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, float* ap, float vl, float vu,
                           lapack_int il, lapack_int iu, float abstol,
                           lapack_int* m, float* w, float* z, lapack_int ldz,
                           lapack_int* ifail );
typedef lapack_int (*dspevx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, double* ap, double vl, double vu,
                           lapack_int il, lapack_int iu, double abstol,
                           lapack_int* m, double* w, double* z, lapack_int ldz,
                           lapack_int* ifail );

typedef lapack_int (*sspgst_t)( int matrix_order, lapack_int itype, char uplo,
                           lapack_int n, float* ap, const float* bp );
typedef lapack_int (*dspgst_t)( int matrix_order, lapack_int itype, char uplo,
                           lapack_int n, double* ap, const double* bp );

typedef lapack_int (*sspgv_t)( int matrix_order, lapack_int itype, char jobz,
                          char uplo, lapack_int n, float* ap, float* bp,
                          float* w, float* z, lapack_int ldz );
typedef lapack_int (*dspgv_t)( int matrix_order, lapack_int itype, char jobz,
                          char uplo, lapack_int n, double* ap, double* bp,
                          double* w, double* z, lapack_int ldz );

typedef lapack_int (*sspgvd_t)( int matrix_order, lapack_int itype, char jobz,
                           char uplo, lapack_int n, float* ap, float* bp,
                           float* w, float* z, lapack_int ldz );
typedef lapack_int (*dspgvd_t)( int matrix_order, lapack_int itype, char jobz,
                           char uplo, lapack_int n, double* ap, double* bp,
                           double* w, double* z, lapack_int ldz );

typedef lapack_int (*sspgvx_t)( int matrix_order, lapack_int itype, char jobz,
                           char range, char uplo, lapack_int n, float* ap,
                           float* bp, float vl, float vu, lapack_int il,
                           lapack_int iu, float abstol, lapack_int* m, float* w,
                           float* z, lapack_int ldz, lapack_int* ifail );
typedef lapack_int (*dspgvx_t)( int matrix_order, lapack_int itype, char jobz,
                           char range, char uplo, lapack_int n, double* ap,
                           double* bp, double vl, double vu, lapack_int il,
                           lapack_int iu, double abstol, lapack_int* m,
                           double* w, double* z, lapack_int ldz,
                           lapack_int* ifail );

typedef lapack_int (*ssprfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const float* ap, const float* afp,
                           const lapack_int* ipiv, const float* b,
                           lapack_int ldb, float* x, lapack_int ldx,
                           float* ferr, float* berr );
typedef lapack_int (*dsprfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const double* ap, const double* afp,
                           const lapack_int* ipiv, const double* b,
                           lapack_int ldb, double* x, lapack_int ldx,
                           double* ferr, double* berr );
typedef lapack_int (*csprfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* ap,
                           const lapack_complex_float* afp,
                           const lapack_int* ipiv,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx, float* ferr,
                           float* berr );
typedef lapack_int (*zsprfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* ap,
                           const lapack_complex_double* afp,
                           const lapack_int* ipiv,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* ferr, double* berr );

typedef lapack_int (*sspsv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, float* ap, lapack_int* ipiv,
                          float* b, lapack_int ldb );
typedef lapack_int (*dspsv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, double* ap, lapack_int* ipiv,
                          double* b, lapack_int ldb );
typedef lapack_int (*cspsv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, lapack_complex_float* ap,
                          lapack_int* ipiv, lapack_complex_float* b,
                          lapack_int ldb );
typedef lapack_int (*zspsv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, lapack_complex_double* ap,
                          lapack_int* ipiv, lapack_complex_double* b,
                          lapack_int ldb );

typedef lapack_int (*sspsvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, const float* ap, float* afp,
                           lapack_int* ipiv, const float* b, lapack_int ldb,
                           float* x, lapack_int ldx, float* rcond, float* ferr,
                           float* berr );
typedef lapack_int (*dspsvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, const double* ap, double* afp,
                           lapack_int* ipiv, const double* b, lapack_int ldb,
                           double* x, lapack_int ldx, double* rcond,
                           double* ferr, double* berr );
typedef lapack_int (*cspsvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* ap,
                           lapack_complex_float* afp, lapack_int* ipiv,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx,
                           float* rcond, float* ferr, float* berr );
typedef lapack_int (*zspsvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* ap,
                           lapack_complex_double* afp, lapack_int* ipiv,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* rcond, double* ferr, double* berr );

typedef lapack_int (*ssptrd_t)( int matrix_order, char uplo, lapack_int n, float* ap,
                           float* d, float* e, float* tau );
typedef lapack_int (*dsptrd_t)( int matrix_order, char uplo, lapack_int n,
                           double* ap, double* d, double* e, double* tau );

typedef lapack_int (*ssptrf_t)( int matrix_order, char uplo, lapack_int n, float* ap,
                           lapack_int* ipiv );
typedef lapack_int (*dsptrf_t)( int matrix_order, char uplo, lapack_int n,
                           double* ap, lapack_int* ipiv );
typedef lapack_int (*csptrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* ap, lapack_int* ipiv );
typedef lapack_int (*zsptrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* ap, lapack_int* ipiv );

typedef lapack_int (*ssptri_t)( int matrix_order, char uplo, lapack_int n, float* ap,
                           const lapack_int* ipiv );
typedef lapack_int (*dsptri_t)( int matrix_order, char uplo, lapack_int n,
                           double* ap, const lapack_int* ipiv );
typedef lapack_int (*csptri_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* ap, const lapack_int* ipiv );
typedef lapack_int (*zsptri_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* ap, const lapack_int* ipiv );

typedef lapack_int (*ssptrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const float* ap,
                           const lapack_int* ipiv, float* b, lapack_int ldb );
typedef lapack_int (*dsptrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const double* ap,
                           const lapack_int* ipiv, double* b, lapack_int ldb );
typedef lapack_int (*csptrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* ap,
                           const lapack_int* ipiv, lapack_complex_float* b,
                           lapack_int ldb );
typedef lapack_int (*zsptrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* ap,
                           const lapack_int* ipiv, lapack_complex_double* b,
                           lapack_int ldb );

typedef lapack_int (*sstebz_t)( char range, char order, lapack_int n, float vl,
                           float vu, lapack_int il, lapack_int iu, float abstol,
                           const float* d, const float* e, lapack_int* m,
                           lapack_int* nsplit, float* w, lapack_int* iblock,
                           lapack_int* isplit );
typedef lapack_int (*dstebz_t)( char range, char order, lapack_int n, double vl,
                           double vu, lapack_int il, lapack_int iu,
                           double abstol, const double* d, const double* e,
                           lapack_int* m, lapack_int* nsplit, double* w,
                           lapack_int* iblock, lapack_int* isplit );

typedef lapack_int (*sstedc_t)( int matrix_order, char compz, lapack_int n, float* d,
                           float* e, float* z, lapack_int ldz );
typedef lapack_int (*dstedc_t)( int matrix_order, char compz, lapack_int n,
                           double* d, double* e, double* z, lapack_int ldz );
typedef lapack_int (*cstedc_t)( int matrix_order, char compz, lapack_int n, float* d,
                           float* e, lapack_complex_float* z, lapack_int ldz );
typedef lapack_int (*zstedc_t)( int matrix_order, char compz, lapack_int n,
                           double* d, double* e, lapack_complex_double* z,
                           lapack_int ldz );

typedef lapack_int (*sstegr_t)( int matrix_order, char jobz, char range,
                           lapack_int n, float* d, float* e, float vl, float vu,
                           lapack_int il, lapack_int iu, float abstol,
                           lapack_int* m, float* w, float* z, lapack_int ldz,
                           lapack_int* isuppz );
typedef lapack_int (*dstegr_t)( int matrix_order, char jobz, char range,
                           lapack_int n, double* d, double* e, double vl,
                           double vu, lapack_int il, lapack_int iu,
                           double abstol, lapack_int* m, double* w, double* z,
                           lapack_int ldz, lapack_int* isuppz );
typedef lapack_int (*cstegr_t)( int matrix_order, char jobz, char range,
                           lapack_int n, float* d, float* e, float vl, float vu,
                           lapack_int il, lapack_int iu, float abstol,
                           lapack_int* m, float* w, lapack_complex_float* z,
                           lapack_int ldz, lapack_int* isuppz );
typedef lapack_int (*zstegr_t)( int matrix_order, char jobz, char range,
                           lapack_int n, double* d, double* e, double vl,
                           double vu, lapack_int il, lapack_int iu,
                           double abstol, lapack_int* m, double* w,
                           lapack_complex_double* z, lapack_int ldz,
                           lapack_int* isuppz );

typedef lapack_int (*sstein_t)( int matrix_order, lapack_int n, const float* d,
                           const float* e, lapack_int m, const float* w,
                           const lapack_int* iblock, const lapack_int* isplit,
                           float* z, lapack_int ldz, lapack_int* ifailv );
typedef lapack_int (*dstein_t)( int matrix_order, lapack_int n, const double* d,
                           const double* e, lapack_int m, const double* w,
                           const lapack_int* iblock, const lapack_int* isplit,
                           double* z, lapack_int ldz, lapack_int* ifailv );
typedef lapack_int (*cstein_t)( int matrix_order, lapack_int n, const float* d,
                           const float* e, lapack_int m, const float* w,
                           const lapack_int* iblock, const lapack_int* isplit,
                           lapack_complex_float* z, lapack_int ldz,
                           lapack_int* ifailv );
typedef lapack_int (*zstein_t)( int matrix_order, lapack_int n, const double* d,
                           const double* e, lapack_int m, const double* w,
                           const lapack_int* iblock, const lapack_int* isplit,
                           lapack_complex_double* z, lapack_int ldz,
                           lapack_int* ifailv );

typedef lapack_int (*sstemr_t)( int matrix_order, char jobz, char range,
                           lapack_int n, float* d, float* e, float vl, float vu,
                           lapack_int il, lapack_int iu, lapack_int* m,
                           float* w, float* z, lapack_int ldz, lapack_int nzc,
                           lapack_int* isuppz, lapack_logical* tryrac );
typedef lapack_int (*dstemr_t)( int matrix_order, char jobz, char range,
                           lapack_int n, double* d, double* e, double vl,
                           double vu, lapack_int il, lapack_int iu,
                           lapack_int* m, double* w, double* z, lapack_int ldz,
                           lapack_int nzc, lapack_int* isuppz,
                           lapack_logical* tryrac );
typedef lapack_int (*cstemr_t)( int matrix_order, char jobz, char range,
                           lapack_int n, float* d, float* e, float vl, float vu,
                           lapack_int il, lapack_int iu, lapack_int* m,
                           float* w, lapack_complex_float* z, lapack_int ldz,
                           lapack_int nzc, lapack_int* isuppz,
                           lapack_logical* tryrac );
typedef lapack_int (*zstemr_t)( int matrix_order, char jobz, char range,
                           lapack_int n, double* d, double* e, double vl,
                           double vu, lapack_int il, lapack_int iu,
                           lapack_int* m, double* w, lapack_complex_double* z,
                           lapack_int ldz, lapack_int nzc, lapack_int* isuppz,
                           lapack_logical* tryrac );

typedef lapack_int (*ssteqr_t)( int matrix_order, char compz, lapack_int n, float* d,
                           float* e, float* z, lapack_int ldz );
typedef lapack_int (*dsteqr_t)( int matrix_order, char compz, lapack_int n,
                           double* d, double* e, double* z, lapack_int ldz );
typedef lapack_int (*csteqr_t)( int matrix_order, char compz, lapack_int n, float* d,
                           float* e, lapack_complex_float* z, lapack_int ldz );
typedef lapack_int (*zsteqr_t)( int matrix_order, char compz, lapack_int n,
                           double* d, double* e, lapack_complex_double* z,
                           lapack_int ldz );

typedef lapack_int (*ssterf_t)( lapack_int n, float* d, float* e );
typedef lapack_int (*dsterf_t)( lapack_int n, double* d, double* e );

typedef lapack_int (*sstev_t)( int matrix_order, char jobz, lapack_int n, float* d,
                          float* e, float* z, lapack_int ldz );
typedef lapack_int (*dstev_t)( int matrix_order, char jobz, lapack_int n, double* d,
                          double* e, double* z, lapack_int ldz );

typedef lapack_int (*sstevd_t)( int matrix_order, char jobz, lapack_int n, float* d,
                           float* e, float* z, lapack_int ldz );
typedef lapack_int (*dstevd_t)( int matrix_order, char jobz, lapack_int n, double* d,
                           double* e, double* z, lapack_int ldz );

typedef lapack_int (*sstevr_t)( int matrix_order, char jobz, char range,
                           lapack_int n, float* d, float* e, float vl, float vu,
                           lapack_int il, lapack_int iu, float abstol,
                           lapack_int* m, float* w, float* z, lapack_int ldz,
                           lapack_int* isuppz );
typedef lapack_int (*dstevr_t)( int matrix_order, char jobz, char range,
                           lapack_int n, double* d, double* e, double vl,
                           double vu, lapack_int il, lapack_int iu,
                           double abstol, lapack_int* m, double* w, double* z,
                           lapack_int ldz, lapack_int* isuppz );

typedef lapack_int (*sstevx_t)( int matrix_order, char jobz, char range,
                           lapack_int n, float* d, float* e, float vl, float vu,
                           lapack_int il, lapack_int iu, float abstol,
                           lapack_int* m, float* w, float* z, lapack_int ldz,
                           lapack_int* ifail );
typedef lapack_int (*dstevx_t)( int matrix_order, char jobz, char range,
                           lapack_int n, double* d, double* e, double vl,
                           double vu, lapack_int il, lapack_int iu,
                           double abstol, lapack_int* m, double* w, double* z,
                           lapack_int ldz, lapack_int* ifail );

typedef lapack_int (*ssycon_t)( int matrix_order, char uplo, lapack_int n,
                           const float* a, lapack_int lda,
                           const lapack_int* ipiv, float anorm, float* rcond );
typedef lapack_int (*dsycon_t)( int matrix_order, char uplo, lapack_int n,
                           const double* a, lapack_int lda,
                           const lapack_int* ipiv, double anorm,
                           double* rcond );
typedef lapack_int (*csycon_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_float* a, lapack_int lda,
                           const lapack_int* ipiv, float anorm, float* rcond );
typedef lapack_int (*zsycon_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_double* a, lapack_int lda,
                           const lapack_int* ipiv, double anorm,
                           double* rcond );

typedef lapack_int (*ssyequb_t)( int matrix_order, char uplo, lapack_int n,
                            const float* a, lapack_int lda, float* s,
                            float* scond, float* amax );
typedef lapack_int (*dsyequb_t)( int matrix_order, char uplo, lapack_int n,
                            const double* a, lapack_int lda, double* s,
                            double* scond, double* amax );
typedef lapack_int (*csyequb_t)( int matrix_order, char uplo, lapack_int n,
                            const lapack_complex_float* a, lapack_int lda,
                            float* s, float* scond, float* amax );
typedef lapack_int (*zsyequb_t)( int matrix_order, char uplo, lapack_int n,
                            const lapack_complex_double* a, lapack_int lda,
                            double* s, double* scond, double* amax );

typedef lapack_int (*ssyev_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          float* a, lapack_int lda, float* w );
typedef lapack_int (*dsyev_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                          double* a, lapack_int lda, double* w );

typedef lapack_int (*ssyevd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           float* a, lapack_int lda, float* w );
typedef lapack_int (*dsyevd_t)( int matrix_order, char jobz, char uplo, lapack_int n,
                           double* a, lapack_int lda, double* w );

typedef lapack_int (*ssyevr_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, float* a, lapack_int lda, float vl,
                           float vu, lapack_int il, lapack_int iu, float abstol,
                           lapack_int* m, float* w, float* z, lapack_int ldz,
                           lapack_int* isuppz );
typedef lapack_int (*dsyevr_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, double* a, lapack_int lda, double vl,
                           double vu, lapack_int il, lapack_int iu,
                           double abstol, lapack_int* m, double* w, double* z,
                           lapack_int ldz, lapack_int* isuppz );

typedef lapack_int (*ssyevx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, float* a, lapack_int lda, float vl,
                           float vu, lapack_int il, lapack_int iu, float abstol,
                           lapack_int* m, float* w, float* z, lapack_int ldz,
                           lapack_int* ifail );
typedef lapack_int (*dsyevx_t)( int matrix_order, char jobz, char range, char uplo,
                           lapack_int n, double* a, lapack_int lda, double vl,
                           double vu, lapack_int il, lapack_int iu,
                           double abstol, lapack_int* m, double* w, double* z,
                           lapack_int ldz, lapack_int* ifail );

typedef lapack_int (*ssygst_t)( int matrix_order, lapack_int itype, char uplo,
                           lapack_int n, float* a, lapack_int lda,
                           const float* b, lapack_int ldb );
typedef lapack_int (*dsygst_t)( int matrix_order, lapack_int itype, char uplo,
                           lapack_int n, double* a, lapack_int lda,
                           const double* b, lapack_int ldb );

typedef lapack_int (*ssygv_t)( int matrix_order, lapack_int itype, char jobz,
                          char uplo, lapack_int n, float* a, lapack_int lda,
                          float* b, lapack_int ldb, float* w );
typedef lapack_int (*dsygv_t)( int matrix_order, lapack_int itype, char jobz,
                          char uplo, lapack_int n, double* a, lapack_int lda,
                          double* b, lapack_int ldb, double* w );

typedef lapack_int (*ssygvd_t)( int matrix_order, lapack_int itype, char jobz,
                           char uplo, lapack_int n, float* a, lapack_int lda,
                           float* b, lapack_int ldb, float* w );
typedef lapack_int (*dsygvd_t)( int matrix_order, lapack_int itype, char jobz,
                           char uplo, lapack_int n, double* a, lapack_int lda,
                           double* b, lapack_int ldb, double* w );

typedef lapack_int (*ssygvx_t)( int matrix_order, lapack_int itype, char jobz,
                           char range, char uplo, lapack_int n, float* a,
                           lapack_int lda, float* b, lapack_int ldb, float vl,
                           float vu, lapack_int il, lapack_int iu, float abstol,
                           lapack_int* m, float* w, float* z, lapack_int ldz,
                           lapack_int* ifail );
typedef lapack_int (*dsygvx_t)( int matrix_order, lapack_int itype, char jobz,
                           char range, char uplo, lapack_int n, double* a,
                           lapack_int lda, double* b, lapack_int ldb, double vl,
                           double vu, lapack_int il, lapack_int iu,
                           double abstol, lapack_int* m, double* w, double* z,
                           lapack_int ldz, lapack_int* ifail );

typedef lapack_int (*ssyrfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const float* a, lapack_int lda,
                           const float* af, lapack_int ldaf,
                           const lapack_int* ipiv, const float* b,
                           lapack_int ldb, float* x, lapack_int ldx,
                           float* ferr, float* berr );
typedef lapack_int (*dsyrfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const double* a, lapack_int lda,
                           const double* af, lapack_int ldaf,
                           const lapack_int* ipiv, const double* b,
                           lapack_int ldb, double* x, lapack_int ldx,
                           double* ferr, double* berr );
typedef lapack_int (*csyrfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* a,
                           lapack_int lda, const lapack_complex_float* af,
                           lapack_int ldaf, const lapack_int* ipiv,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx, float* ferr,
                           float* berr );
typedef lapack_int (*zsyrfs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* a,
                           lapack_int lda, const lapack_complex_double* af,
                           lapack_int ldaf, const lapack_int* ipiv,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* ferr, double* berr );

typedef lapack_int (*ssyrfsx_t)( int matrix_order, char uplo, char equed,
                            lapack_int n, lapack_int nrhs, const float* a,
                            lapack_int lda, const float* af, lapack_int ldaf,
                            const lapack_int* ipiv, const float* s,
                            const float* b, lapack_int ldb, float* x,
                            lapack_int ldx, float* rcond, float* berr,
                            lapack_int n_err_bnds, float* err_bnds_norm,
                            float* err_bnds_comp, lapack_int nparams,
                            float* params );
typedef lapack_int (*dsyrfsx_t)( int matrix_order, char uplo, char equed,
                            lapack_int n, lapack_int nrhs, const double* a,
                            lapack_int lda, const double* af, lapack_int ldaf,
                            const lapack_int* ipiv, const double* s,
                            const double* b, lapack_int ldb, double* x,
                            lapack_int ldx, double* rcond, double* berr,
                            lapack_int n_err_bnds, double* err_bnds_norm,
                            double* err_bnds_comp, lapack_int nparams,
                            double* params );
typedef lapack_int (*csyrfsx_t)( int matrix_order, char uplo, char equed,
                            lapack_int n, lapack_int nrhs,
                            const lapack_complex_float* a, lapack_int lda,
                            const lapack_complex_float* af, lapack_int ldaf,
                            const lapack_int* ipiv, const float* s,
                            const lapack_complex_float* b, lapack_int ldb,
                            lapack_complex_float* x, lapack_int ldx,
                            float* rcond, float* berr, lapack_int n_err_bnds,
                            float* err_bnds_norm, float* err_bnds_comp,
                            lapack_int nparams, float* params );
typedef lapack_int (*zsyrfsx_t)( int matrix_order, char uplo, char equed,
                            lapack_int n, lapack_int nrhs,
                            const lapack_complex_double* a, lapack_int lda,
                            const lapack_complex_double* af, lapack_int ldaf,
                            const lapack_int* ipiv, const double* s,
                            const lapack_complex_double* b, lapack_int ldb,
                            lapack_complex_double* x, lapack_int ldx,
                            double* rcond, double* berr, lapack_int n_err_bnds,
                            double* err_bnds_norm, double* err_bnds_comp,
                            lapack_int nparams, double* params );

typedef lapack_int (*ssysv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, float* a, lapack_int lda,
                          lapack_int* ipiv, float* b, lapack_int ldb );
typedef lapack_int (*dsysv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, double* a, lapack_int lda,
                          lapack_int* ipiv, double* b, lapack_int ldb );
typedef lapack_int (*csysv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, lapack_complex_float* a,
                          lapack_int lda, lapack_int* ipiv,
                          lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zsysv_t)( int matrix_order, char uplo, lapack_int n,
                          lapack_int nrhs, lapack_complex_double* a,
                          lapack_int lda, lapack_int* ipiv,
                          lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*ssysvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, const float* a, lapack_int lda,
                           float* af, lapack_int ldaf, lapack_int* ipiv,
                           const float* b, lapack_int ldb, float* x,
                           lapack_int ldx, float* rcond, float* ferr,
                           float* berr );
typedef lapack_int (*dsysvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, const double* a, lapack_int lda,
                           double* af, lapack_int ldaf, lapack_int* ipiv,
                           const double* b, lapack_int ldb, double* x,
                           lapack_int ldx, double* rcond, double* ferr,
                           double* berr );
typedef lapack_int (*csysvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* af,
                           lapack_int ldaf, lapack_int* ipiv,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* x, lapack_int ldx,
                           float* rcond, float* ferr, float* berr );
typedef lapack_int (*zsysvx_t)( int matrix_order, char fact, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* af,
                           lapack_int ldaf, lapack_int* ipiv,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* x, lapack_int ldx,
                           double* rcond, double* ferr, double* berr );

typedef lapack_int (*ssysvxx_t)( int matrix_order, char fact, char uplo,
                            lapack_int n, lapack_int nrhs, float* a,
                            lapack_int lda, float* af, lapack_int ldaf,
                            lapack_int* ipiv, char* equed, float* s, float* b,
                            lapack_int ldb, float* x, lapack_int ldx,
                            float* rcond, float* rpvgrw, float* berr,
                            lapack_int n_err_bnds, float* err_bnds_norm,
                            float* err_bnds_comp, lapack_int nparams,
                            float* params );
typedef lapack_int (*dsysvxx_t)( int matrix_order, char fact, char uplo,
                            lapack_int n, lapack_int nrhs, double* a,
                            lapack_int lda, double* af, lapack_int ldaf,
                            lapack_int* ipiv, char* equed, double* s, double* b,
                            lapack_int ldb, double* x, lapack_int ldx,
                            double* rcond, double* rpvgrw, double* berr,
                            lapack_int n_err_bnds, double* err_bnds_norm,
                            double* err_bnds_comp, lapack_int nparams,
                            double* params );
typedef lapack_int (*csysvxx_t)( int matrix_order, char fact, char uplo,
                            lapack_int n, lapack_int nrhs,
                            lapack_complex_float* a, lapack_int lda,
                            lapack_complex_float* af, lapack_int ldaf,
                            lapack_int* ipiv, char* equed, float* s,
                            lapack_complex_float* b, lapack_int ldb,
                            lapack_complex_float* x, lapack_int ldx,
                            float* rcond, float* rpvgrw, float* berr,
                            lapack_int n_err_bnds, float* err_bnds_norm,
                            float* err_bnds_comp, lapack_int nparams,
                            float* params );
typedef lapack_int (*zsysvxx_t)( int matrix_order, char fact, char uplo,
                            lapack_int n, lapack_int nrhs,
                            lapack_complex_double* a, lapack_int lda,
                            lapack_complex_double* af, lapack_int ldaf,
                            lapack_int* ipiv, char* equed, double* s,
                            lapack_complex_double* b, lapack_int ldb,
                            lapack_complex_double* x, lapack_int ldx,
                            double* rcond, double* rpvgrw, double* berr,
                            lapack_int n_err_bnds, double* err_bnds_norm,
                            double* err_bnds_comp, lapack_int nparams,
                            double* params );

typedef lapack_int (*ssytrd_t)( int matrix_order, char uplo, lapack_int n, float* a,
                           lapack_int lda, float* d, float* e, float* tau );
typedef lapack_int (*dsytrd_t)( int matrix_order, char uplo, lapack_int n, double* a,
                           lapack_int lda, double* d, double* e, double* tau );

typedef lapack_int (*ssytrf_t)( int matrix_order, char uplo, lapack_int n, float* a,
                           lapack_int lda, lapack_int* ipiv );
typedef lapack_int (*dsytrf_t)( int matrix_order, char uplo, lapack_int n, double* a,
                           lapack_int lda, lapack_int* ipiv );
typedef lapack_int (*csytrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_int* ipiv );
typedef lapack_int (*zsytrf_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_int* ipiv );

typedef lapack_int (*ssytri_t)( int matrix_order, char uplo, lapack_int n, float* a,
                           lapack_int lda, const lapack_int* ipiv );
typedef lapack_int (*dsytri_t)( int matrix_order, char uplo, lapack_int n, double* a,
                           lapack_int lda, const lapack_int* ipiv );
typedef lapack_int (*csytri_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           const lapack_int* ipiv );
typedef lapack_int (*zsytri_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           const lapack_int* ipiv );

typedef lapack_int (*ssytrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const float* a, lapack_int lda,
                           const lapack_int* ipiv, float* b, lapack_int ldb );
typedef lapack_int (*dsytrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const double* a, lapack_int lda,
                           const lapack_int* ipiv, double* b, lapack_int ldb );
typedef lapack_int (*csytrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_float* a,
                           lapack_int lda, const lapack_int* ipiv,
                           lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zsytrs_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_int nrhs, const lapack_complex_double* a,
                           lapack_int lda, const lapack_int* ipiv,
                           lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*stbcon_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int n, lapack_int kd, const float* ab,
                           lapack_int ldab, float* rcond );
typedef lapack_int (*dtbcon_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int n, lapack_int kd, const double* ab,
                           lapack_int ldab, double* rcond );
typedef lapack_int (*ctbcon_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int n, lapack_int kd,
                           const lapack_complex_float* ab, lapack_int ldab,
                           float* rcond );
typedef lapack_int (*ztbcon_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int n, lapack_int kd,
                           const lapack_complex_double* ab, lapack_int ldab,
                           double* rcond );

typedef lapack_int (*stbrfs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int kd, lapack_int nrhs,
                           const float* ab, lapack_int ldab, const float* b,
                           lapack_int ldb, const float* x, lapack_int ldx,
                           float* ferr, float* berr );
typedef lapack_int (*dtbrfs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int kd, lapack_int nrhs,
                           const double* ab, lapack_int ldab, const double* b,
                           lapack_int ldb, const double* x, lapack_int ldx,
                           double* ferr, double* berr );
typedef lapack_int (*ctbrfs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int kd, lapack_int nrhs,
                           const lapack_complex_float* ab, lapack_int ldab,
                           const lapack_complex_float* b, lapack_int ldb,
                           const lapack_complex_float* x, lapack_int ldx,
                           float* ferr, float* berr );
typedef lapack_int (*ztbrfs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int kd, lapack_int nrhs,
                           const lapack_complex_double* ab, lapack_int ldab,
                           const lapack_complex_double* b, lapack_int ldb,
                           const lapack_complex_double* x, lapack_int ldx,
                           double* ferr, double* berr );

typedef lapack_int (*stbtrs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int kd, lapack_int nrhs,
                           const float* ab, lapack_int ldab, float* b,
                           lapack_int ldb );
typedef lapack_int (*dtbtrs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int kd, lapack_int nrhs,
                           const double* ab, lapack_int ldab, double* b,
                           lapack_int ldb );
typedef lapack_int (*ctbtrs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int kd, lapack_int nrhs,
                           const lapack_complex_float* ab, lapack_int ldab,
                           lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*ztbtrs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int kd, lapack_int nrhs,
                           const lapack_complex_double* ab, lapack_int ldab,
                           lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*stfsm_t)( int matrix_order, char transr, char side, char uplo,
                          char trans, char diag, lapack_int m, lapack_int n,
                          float alpha, const float* a, float* b,
                          lapack_int ldb );
typedef lapack_int (*dtfsm_t)( int matrix_order, char transr, char side, char uplo,
                          char trans, char diag, lapack_int m, lapack_int n,
                          double alpha, const double* a, double* b,
                          lapack_int ldb );
typedef lapack_int (*ctfsm_t)( int matrix_order, char transr, char side, char uplo,
                          char trans, char diag, lapack_int m, lapack_int n,
                          lapack_complex_float alpha,
                          const lapack_complex_float* a,
                          lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*ztfsm_t)( int matrix_order, char transr, char side, char uplo,
                          char trans, char diag, lapack_int m, lapack_int n,
                          lapack_complex_double alpha,
                          const lapack_complex_double* a,
                          lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*stftri_t)( int matrix_order, char transr, char uplo, char diag,
                           lapack_int n, float* a );
typedef lapack_int (*dtftri_t)( int matrix_order, char transr, char uplo, char diag,
                           lapack_int n, double* a );
typedef lapack_int (*ctftri_t)( int matrix_order, char transr, char uplo, char diag,
                           lapack_int n, lapack_complex_float* a );
typedef lapack_int (*ztftri_t)( int matrix_order, char transr, char uplo, char diag,
                           lapack_int n, lapack_complex_double* a );

typedef lapack_int (*stfttp_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const float* arf, float* ap );
typedef lapack_int (*dtfttp_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const double* arf, double* ap );
typedef lapack_int (*ctfttp_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const lapack_complex_float* arf,
                           lapack_complex_float* ap );
typedef lapack_int (*ztfttp_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const lapack_complex_double* arf,
                           lapack_complex_double* ap );

typedef lapack_int (*stfttr_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const float* arf, float* a,
                           lapack_int lda );
typedef lapack_int (*dtfttr_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const double* arf, double* a,
                           lapack_int lda );
typedef lapack_int (*ctfttr_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const lapack_complex_float* arf,
                           lapack_complex_float* a, lapack_int lda );
typedef lapack_int (*ztfttr_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const lapack_complex_double* arf,
                           lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*stgevc_t)( int matrix_order, char side, char howmny,
                           const lapack_logical* select, lapack_int n,
                           const float* s, lapack_int lds, const float* p,
                           lapack_int ldp, float* vl, lapack_int ldvl,
                           float* vr, lapack_int ldvr, lapack_int mm,
                           lapack_int* m );
typedef lapack_int (*dtgevc_t)( int matrix_order, char side, char howmny,
                           const lapack_logical* select, lapack_int n,
                           const double* s, lapack_int lds, const double* p,
                           lapack_int ldp, double* vl, lapack_int ldvl,
                           double* vr, lapack_int ldvr, lapack_int mm,
                           lapack_int* m );
typedef lapack_int (*ctgevc_t)( int matrix_order, char side, char howmny,
                           const lapack_logical* select, lapack_int n,
                           const lapack_complex_float* s, lapack_int lds,
                           const lapack_complex_float* p, lapack_int ldp,
                           lapack_complex_float* vl, lapack_int ldvl,
                           lapack_complex_float* vr, lapack_int ldvr,
                           lapack_int mm, lapack_int* m );
typedef lapack_int (*ztgevc_t)( int matrix_order, char side, char howmny,
                           const lapack_logical* select, lapack_int n,
                           const lapack_complex_double* s, lapack_int lds,
                           const lapack_complex_double* p, lapack_int ldp,
                           lapack_complex_double* vl, lapack_int ldvl,
                           lapack_complex_double* vr, lapack_int ldvr,
                           lapack_int mm, lapack_int* m );

typedef lapack_int (*stgexc_t)( int matrix_order, lapack_logical wantq,
                           lapack_logical wantz, lapack_int n, float* a,
                           lapack_int lda, float* b, lapack_int ldb, float* q,
                           lapack_int ldq, float* z, lapack_int ldz,
                           lapack_int* ifst, lapack_int* ilst );
typedef lapack_int (*dtgexc_t)( int matrix_order, lapack_logical wantq,
                           lapack_logical wantz, lapack_int n, double* a,
                           lapack_int lda, double* b, lapack_int ldb, double* q,
                           lapack_int ldq, double* z, lapack_int ldz,
                           lapack_int* ifst, lapack_int* ilst );
typedef lapack_int (*ctgexc_t)( int matrix_order, lapack_logical wantq,
                           lapack_logical wantz, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* q, lapack_int ldq,
                           lapack_complex_float* z, lapack_int ldz,
                           lapack_int ifst, lapack_int ilst );
typedef lapack_int (*ztgexc_t)( int matrix_order, lapack_logical wantq,
                           lapack_logical wantz, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* q, lapack_int ldq,
                           lapack_complex_double* z, lapack_int ldz,
                           lapack_int ifst, lapack_int ilst );

typedef lapack_int (*stgsen_t)( int matrix_order, lapack_int ijob,
                           lapack_logical wantq, lapack_logical wantz,
                           const lapack_logical* select, lapack_int n, float* a,
                           lapack_int lda, float* b, lapack_int ldb,
                           float* alphar, float* alphai, float* beta, float* q,
                           lapack_int ldq, float* z, lapack_int ldz,
                           lapack_int* m, float* pl, float* pr, float* dif );
typedef lapack_int (*dtgsen_t)( int matrix_order, lapack_int ijob,
                           lapack_logical wantq, lapack_logical wantz,
                           const lapack_logical* select, lapack_int n,
                           double* a, lapack_int lda, double* b, lapack_int ldb,
                           double* alphar, double* alphai, double* beta,
                           double* q, lapack_int ldq, double* z, lapack_int ldz,
                           lapack_int* m, double* pl, double* pr, double* dif );
typedef lapack_int (*ctgsen_t)( int matrix_order, lapack_int ijob,
                           lapack_logical wantq, lapack_logical wantz,
                           const lapack_logical* select, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* alpha,
                           lapack_complex_float* beta, lapack_complex_float* q,
                           lapack_int ldq, lapack_complex_float* z,
                           lapack_int ldz, lapack_int* m, float* pl, float* pr,
                           float* dif );
typedef lapack_int (*ztgsen_t)( int matrix_order, lapack_int ijob,
                           lapack_logical wantq, lapack_logical wantz,
                           const lapack_logical* select, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* alpha,
                           lapack_complex_double* beta,
                           lapack_complex_double* q, lapack_int ldq,
                           lapack_complex_double* z, lapack_int ldz,
                           lapack_int* m, double* pl, double* pr, double* dif );

typedef lapack_int (*stgsja_t)( int matrix_order, char jobu, char jobv, char jobq,
                           lapack_int m, lapack_int p, lapack_int n,
                           lapack_int k, lapack_int l, float* a, lapack_int lda,
                           float* b, lapack_int ldb, float tola, float tolb,
                           float* alpha, float* beta, float* u, lapack_int ldu,
                           float* v, lapack_int ldv, float* q, lapack_int ldq,
                           lapack_int* ncycle );
typedef lapack_int (*dtgsja_t)( int matrix_order, char jobu, char jobv, char jobq,
                           lapack_int m, lapack_int p, lapack_int n,
                           lapack_int k, lapack_int l, double* a,
                           lapack_int lda, double* b, lapack_int ldb,
                           double tola, double tolb, double* alpha,
                           double* beta, double* u, lapack_int ldu, double* v,
                           lapack_int ldv, double* q, lapack_int ldq,
                           lapack_int* ncycle );
typedef lapack_int (*ctgsja_t)( int matrix_order, char jobu, char jobv, char jobq,
                           lapack_int m, lapack_int p, lapack_int n,
                           lapack_int k, lapack_int l, lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* b,
                           lapack_int ldb, float tola, float tolb, float* alpha,
                           float* beta, lapack_complex_float* u, lapack_int ldu,
                           lapack_complex_float* v, lapack_int ldv,
                           lapack_complex_float* q, lapack_int ldq,
                           lapack_int* ncycle );
typedef lapack_int (*ztgsja_t)( int matrix_order, char jobu, char jobv, char jobq,
                           lapack_int m, lapack_int p, lapack_int n,
                           lapack_int k, lapack_int l, lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* b,
                           lapack_int ldb, double tola, double tolb,
                           double* alpha, double* beta,
                           lapack_complex_double* u, lapack_int ldu,
                           lapack_complex_double* v, lapack_int ldv,
                           lapack_complex_double* q, lapack_int ldq,
                           lapack_int* ncycle );

typedef lapack_int (*stgsna_t)( int matrix_order, char job, char howmny,
                           const lapack_logical* select, lapack_int n,
                           const float* a, lapack_int lda, const float* b,
                           lapack_int ldb, const float* vl, lapack_int ldvl,
                           const float* vr, lapack_int ldvr, float* s,
                           float* dif, lapack_int mm, lapack_int* m );
typedef lapack_int (*dtgsna_t)( int matrix_order, char job, char howmny,
                           const lapack_logical* select, lapack_int n,
                           const double* a, lapack_int lda, const double* b,
                           lapack_int ldb, const double* vl, lapack_int ldvl,
                           const double* vr, lapack_int ldvr, double* s,
                           double* dif, lapack_int mm, lapack_int* m );
typedef lapack_int (*ctgsna_t)( int matrix_order, char job, char howmny,
                           const lapack_logical* select, lapack_int n,
                           const lapack_complex_float* a, lapack_int lda,
                           const lapack_complex_float* b, lapack_int ldb,
                           const lapack_complex_float* vl, lapack_int ldvl,
                           const lapack_complex_float* vr, lapack_int ldvr,
                           float* s, float* dif, lapack_int mm, lapack_int* m );
typedef lapack_int (*ztgsna_t)( int matrix_order, char job, char howmny,
                           const lapack_logical* select, lapack_int n,
                           const lapack_complex_double* a, lapack_int lda,
                           const lapack_complex_double* b, lapack_int ldb,
                           const lapack_complex_double* vl, lapack_int ldvl,
                           const lapack_complex_double* vr, lapack_int ldvr,
                           double* s, double* dif, lapack_int mm,
                           lapack_int* m );

typedef lapack_int (*stgsyl_t)( int matrix_order, char trans, lapack_int ijob,
                           lapack_int m, lapack_int n, const float* a,
                           lapack_int lda, const float* b, lapack_int ldb,
                           float* c, lapack_int ldc, const float* d,
                           lapack_int ldd, const float* e, lapack_int lde,
                           float* f, lapack_int ldf, float* scale, float* dif );
typedef lapack_int (*dtgsyl_t)( int matrix_order, char trans, lapack_int ijob,
                           lapack_int m, lapack_int n, const double* a,
                           lapack_int lda, const double* b, lapack_int ldb,
                           double* c, lapack_int ldc, const double* d,
                           lapack_int ldd, const double* e, lapack_int lde,
                           double* f, lapack_int ldf, double* scale,
                           double* dif );
typedef lapack_int (*ctgsyl_t)( int matrix_order, char trans, lapack_int ijob,
                           lapack_int m, lapack_int n,
                           const lapack_complex_float* a, lapack_int lda,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* c, lapack_int ldc,
                           const lapack_complex_float* d, lapack_int ldd,
                           const lapack_complex_float* e, lapack_int lde,
                           lapack_complex_float* f, lapack_int ldf,
                           float* scale, float* dif );
typedef lapack_int (*ztgsyl_t)( int matrix_order, char trans, lapack_int ijob,
                           lapack_int m, lapack_int n,
                           const lapack_complex_double* a, lapack_int lda,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* c, lapack_int ldc,
                           const lapack_complex_double* d, lapack_int ldd,
                           const lapack_complex_double* e, lapack_int lde,
                           lapack_complex_double* f, lapack_int ldf,
                           double* scale, double* dif );

typedef lapack_int (*stpcon_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int n, const float* ap, float* rcond );
typedef lapack_int (*dtpcon_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int n, const double* ap, double* rcond );
typedef lapack_int (*ctpcon_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int n, const lapack_complex_float* ap,
                           float* rcond );
typedef lapack_int (*ztpcon_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int n, const lapack_complex_double* ap,
                           double* rcond );

typedef lapack_int (*stprfs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs, const float* ap,
                           const float* b, lapack_int ldb, const float* x,
                           lapack_int ldx, float* ferr, float* berr );
typedef lapack_int (*dtprfs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs, const double* ap,
                           const double* b, lapack_int ldb, const double* x,
                           lapack_int ldx, double* ferr, double* berr );
typedef lapack_int (*ctprfs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs,
                           const lapack_complex_float* ap,
                           const lapack_complex_float* b, lapack_int ldb,
                           const lapack_complex_float* x, lapack_int ldx,
                           float* ferr, float* berr );
typedef lapack_int (*ztprfs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs,
                           const lapack_complex_double* ap,
                           const lapack_complex_double* b, lapack_int ldb,
                           const lapack_complex_double* x, lapack_int ldx,
                           double* ferr, double* berr );

typedef lapack_int (*stptri_t)( int matrix_order, char uplo, char diag, lapack_int n,
                           float* ap );
typedef lapack_int (*dtptri_t)( int matrix_order, char uplo, char diag, lapack_int n,
                           double* ap );
typedef lapack_int (*ctptri_t)( int matrix_order, char uplo, char diag, lapack_int n,
                           lapack_complex_float* ap );
typedef lapack_int (*ztptri_t)( int matrix_order, char uplo, char diag, lapack_int n,
                           lapack_complex_double* ap );

typedef lapack_int (*stptrs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs, const float* ap,
                           float* b, lapack_int ldb );
typedef lapack_int (*dtptrs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs, const double* ap,
                           double* b, lapack_int ldb );
typedef lapack_int (*ctptrs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs,
                           const lapack_complex_float* ap,
                           lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*ztptrs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs,
                           const lapack_complex_double* ap,
                           lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*stpttf_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const float* ap, float* arf );
typedef lapack_int (*dtpttf_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const double* ap, double* arf );
typedef lapack_int (*ctpttf_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const lapack_complex_float* ap,
                           lapack_complex_float* arf );
typedef lapack_int (*ztpttf_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const lapack_complex_double* ap,
                           lapack_complex_double* arf );

typedef lapack_int (*stpttr_t)( int matrix_order, char uplo, lapack_int n,
                           const float* ap, float* a, lapack_int lda );
typedef lapack_int (*dtpttr_t)( int matrix_order, char uplo, lapack_int n,
                           const double* ap, double* a, lapack_int lda );
typedef lapack_int (*ctpttr_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_float* ap,
                           lapack_complex_float* a, lapack_int lda );
typedef lapack_int (*ztpttr_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_double* ap,
                           lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*strcon_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int n, const float* a, lapack_int lda,
                           float* rcond );
typedef lapack_int (*dtrcon_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int n, const double* a, lapack_int lda,
                           double* rcond );
typedef lapack_int (*ctrcon_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int n, const lapack_complex_float* a,
                           lapack_int lda, float* rcond );
typedef lapack_int (*ztrcon_t)( int matrix_order, char norm, char uplo, char diag,
                           lapack_int n, const lapack_complex_double* a,
                           lapack_int lda, double* rcond );

typedef lapack_int (*strevc_t)( int matrix_order, char side, char howmny,
                           lapack_logical* select, lapack_int n, const float* t,
                           lapack_int ldt, float* vl, lapack_int ldvl,
                           float* vr, lapack_int ldvr, lapack_int mm,
                           lapack_int* m );
typedef lapack_int (*dtrevc_t)( int matrix_order, char side, char howmny,
                           lapack_logical* select, lapack_int n,
                           const double* t, lapack_int ldt, double* vl,
                           lapack_int ldvl, double* vr, lapack_int ldvr,
                           lapack_int mm, lapack_int* m );
typedef lapack_int (*ctrevc_t)( int matrix_order, char side, char howmny,
                           const lapack_logical* select, lapack_int n,
                           lapack_complex_float* t, lapack_int ldt,
                           lapack_complex_float* vl, lapack_int ldvl,
                           lapack_complex_float* vr, lapack_int ldvr,
                           lapack_int mm, lapack_int* m );
typedef lapack_int (*ztrevc_t)( int matrix_order, char side, char howmny,
                           const lapack_logical* select, lapack_int n,
                           lapack_complex_double* t, lapack_int ldt,
                           lapack_complex_double* vl, lapack_int ldvl,
                           lapack_complex_double* vr, lapack_int ldvr,
                           lapack_int mm, lapack_int* m );

typedef lapack_int (*strexc_t)( int matrix_order, char compq, lapack_int n, float* t,
                           lapack_int ldt, float* q, lapack_int ldq,
                           lapack_int* ifst, lapack_int* ilst );
typedef lapack_int (*dtrexc_t)( int matrix_order, char compq, lapack_int n,
                           double* t, lapack_int ldt, double* q, lapack_int ldq,
                           lapack_int* ifst, lapack_int* ilst );
typedef lapack_int (*ctrexc_t)( int matrix_order, char compq, lapack_int n,
                           lapack_complex_float* t, lapack_int ldt,
                           lapack_complex_float* q, lapack_int ldq,
                           lapack_int ifst, lapack_int ilst );
typedef lapack_int (*ztrexc_t)( int matrix_order, char compq, lapack_int n,
                           lapack_complex_double* t, lapack_int ldt,
                           lapack_complex_double* q, lapack_int ldq,
                           lapack_int ifst, lapack_int ilst );

typedef lapack_int (*strrfs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs, const float* a,
                           lapack_int lda, const float* b, lapack_int ldb,
                           const float* x, lapack_int ldx, float* ferr,
                           float* berr );
typedef lapack_int (*dtrrfs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs, const double* a,
                           lapack_int lda, const double* b, lapack_int ldb,
                           const double* x, lapack_int ldx, double* ferr,
                           double* berr );
typedef lapack_int (*ctrrfs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs,
                           const lapack_complex_float* a, lapack_int lda,
                           const lapack_complex_float* b, lapack_int ldb,
                           const lapack_complex_float* x, lapack_int ldx,
                           float* ferr, float* berr );
typedef lapack_int (*ztrrfs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs,
                           const lapack_complex_double* a, lapack_int lda,
                           const lapack_complex_double* b, lapack_int ldb,
                           const lapack_complex_double* x, lapack_int ldx,
                           double* ferr, double* berr );

typedef lapack_int (*strsen_t)( int matrix_order, char job, char compq,
                           const lapack_logical* select, lapack_int n, float* t,
                           lapack_int ldt, float* q, lapack_int ldq, float* wr,
                           float* wi, lapack_int* m, float* s, float* sep );
typedef lapack_int (*dtrsen_t)( int matrix_order, char job, char compq,
                           const lapack_logical* select, lapack_int n,
                           double* t, lapack_int ldt, double* q, lapack_int ldq,
                           double* wr, double* wi, lapack_int* m, double* s,
                           double* sep );
typedef lapack_int (*ctrsen_t)( int matrix_order, char job, char compq,
                           const lapack_logical* select, lapack_int n,
                           lapack_complex_float* t, lapack_int ldt,
                           lapack_complex_float* q, lapack_int ldq,
                           lapack_complex_float* w, lapack_int* m, float* s,
                           float* sep );
typedef lapack_int (*ztrsen_t)( int matrix_order, char job, char compq,
                           const lapack_logical* select, lapack_int n,
                           lapack_complex_double* t, lapack_int ldt,
                           lapack_complex_double* q, lapack_int ldq,
                           lapack_complex_double* w, lapack_int* m, double* s,
                           double* sep );

typedef lapack_int (*strsna_t)( int matrix_order, char job, char howmny,
                           const lapack_logical* select, lapack_int n,
                           const float* t, lapack_int ldt, const float* vl,
                           lapack_int ldvl, const float* vr, lapack_int ldvr,
                           float* s, float* sep, lapack_int mm, lapack_int* m );
typedef lapack_int (*dtrsna_t)( int matrix_order, char job, char howmny,
                           const lapack_logical* select, lapack_int n,
                           const double* t, lapack_int ldt, const double* vl,
                           lapack_int ldvl, const double* vr, lapack_int ldvr,
                           double* s, double* sep, lapack_int mm,
                           lapack_int* m );
typedef lapack_int (*ctrsna_t)( int matrix_order, char job, char howmny,
                           const lapack_logical* select, lapack_int n,
                           const lapack_complex_float* t, lapack_int ldt,
                           const lapack_complex_float* vl, lapack_int ldvl,
                           const lapack_complex_float* vr, lapack_int ldvr,
                           float* s, float* sep, lapack_int mm, lapack_int* m );
typedef lapack_int (*ztrsna_t)( int matrix_order, char job, char howmny,
                           const lapack_logical* select, lapack_int n,
                           const lapack_complex_double* t, lapack_int ldt,
                           const lapack_complex_double* vl, lapack_int ldvl,
                           const lapack_complex_double* vr, lapack_int ldvr,
                           double* s, double* sep, lapack_int mm,
                           lapack_int* m );

typedef lapack_int (*strsyl_t)( int matrix_order, char trana, char tranb,
                           lapack_int isgn, lapack_int m, lapack_int n,
                           const float* a, lapack_int lda, const float* b,
                           lapack_int ldb, float* c, lapack_int ldc,
                           float* scale );
typedef lapack_int (*dtrsyl_t)( int matrix_order, char trana, char tranb,
                           lapack_int isgn, lapack_int m, lapack_int n,
                           const double* a, lapack_int lda, const double* b,
                           lapack_int ldb, double* c, lapack_int ldc,
                           double* scale );
typedef lapack_int (*ctrsyl_t)( int matrix_order, char trana, char tranb,
                           lapack_int isgn, lapack_int m, lapack_int n,
                           const lapack_complex_float* a, lapack_int lda,
                           const lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* c, lapack_int ldc,
                           float* scale );
typedef lapack_int (*ztrsyl_t)( int matrix_order, char trana, char tranb,
                           lapack_int isgn, lapack_int m, lapack_int n,
                           const lapack_complex_double* a, lapack_int lda,
                           const lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* c, lapack_int ldc,
                           double* scale );

typedef lapack_int (*strtri_t)( int matrix_order, char uplo, char diag, lapack_int n,
                           float* a, lapack_int lda );
typedef lapack_int (*dtrtri_t)( int matrix_order, char uplo, char diag, lapack_int n,
                           double* a, lapack_int lda );
typedef lapack_int (*ctrtri_t)( int matrix_order, char uplo, char diag, lapack_int n,
                           lapack_complex_float* a, lapack_int lda );
typedef lapack_int (*ztrtri_t)( int matrix_order, char uplo, char diag, lapack_int n,
                           lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*strtrs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs, const float* a,
                           lapack_int lda, float* b, lapack_int ldb );
typedef lapack_int (*dtrtrs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs, const double* a,
                           lapack_int lda, double* b, lapack_int ldb );
typedef lapack_int (*ctrtrs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs,
                           const lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*ztrtrs_t)( int matrix_order, char uplo, char trans, char diag,
                           lapack_int n, lapack_int nrhs,
                           const lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*strttf_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const float* a, lapack_int lda,
                           float* arf );
typedef lapack_int (*dtrttf_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const double* a, lapack_int lda,
                           double* arf );
typedef lapack_int (*ctrttf_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* arf );
typedef lapack_int (*ztrttf_t)( int matrix_order, char transr, char uplo,
                           lapack_int n, const lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* arf );

typedef lapack_int (*strttp_t)( int matrix_order, char uplo, lapack_int n,
                           const float* a, lapack_int lda, float* ap );
typedef lapack_int (*dtrttp_t)( int matrix_order, char uplo, lapack_int n,
                           const double* a, lapack_int lda, double* ap );
typedef lapack_int (*ctrttp_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* ap );
typedef lapack_int (*ztrttp_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* ap );

typedef lapack_int (*stzrzf_t)( int matrix_order, lapack_int m, lapack_int n,
                           float* a, lapack_int lda, float* tau );
typedef lapack_int (*dtzrzf_t)( int matrix_order, lapack_int m, lapack_int n,
                           double* a, lapack_int lda, double* tau );
typedef lapack_int (*ctzrzf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* tau );
typedef lapack_int (*ztzrzf_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* tau );

typedef lapack_int (*cungbr_t)( int matrix_order, char vect, lapack_int m,
                           lapack_int n, lapack_int k, lapack_complex_float* a,
                           lapack_int lda, const lapack_complex_float* tau );
typedef lapack_int (*zungbr_t)( int matrix_order, char vect, lapack_int m,
                           lapack_int n, lapack_int k, lapack_complex_double* a,
                           lapack_int lda, const lapack_complex_double* tau );

typedef lapack_int (*cunghr_t)( int matrix_order, lapack_int n, lapack_int ilo,
                           lapack_int ihi, lapack_complex_float* a,
                           lapack_int lda, const lapack_complex_float* tau );
typedef lapack_int (*zunghr_t)( int matrix_order, lapack_int n, lapack_int ilo,
                           lapack_int ihi, lapack_complex_double* a,
                           lapack_int lda, const lapack_complex_double* tau );

typedef lapack_int (*cunglq_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, lapack_complex_float* a,
                           lapack_int lda, const lapack_complex_float* tau );
typedef lapack_int (*zunglq_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, lapack_complex_double* a,
                           lapack_int lda, const lapack_complex_double* tau );

typedef lapack_int (*cungql_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, lapack_complex_float* a,
                           lapack_int lda, const lapack_complex_float* tau );
typedef lapack_int (*zungql_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, lapack_complex_double* a,
                           lapack_int lda, const lapack_complex_double* tau );

typedef lapack_int (*cungqr_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, lapack_complex_float* a,
                           lapack_int lda, const lapack_complex_float* tau );
typedef lapack_int (*zungqr_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, lapack_complex_double* a,
                           lapack_int lda, const lapack_complex_double* tau );

typedef lapack_int (*cungrq_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, lapack_complex_float* a,
                           lapack_int lda, const lapack_complex_float* tau );
typedef lapack_int (*zungrq_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int k, lapack_complex_double* a,
                           lapack_int lda, const lapack_complex_double* tau );

typedef lapack_int (*cungtr_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_float* a, lapack_int lda,
                           const lapack_complex_float* tau );
typedef lapack_int (*zungtr_t)( int matrix_order, char uplo, lapack_int n,
                           lapack_complex_double* a, lapack_int lda,
                           const lapack_complex_double* tau );

typedef lapack_int (*cunmbr_t)( int matrix_order, char vect, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const lapack_complex_float* a, lapack_int lda,
                           const lapack_complex_float* tau,
                           lapack_complex_float* c, lapack_int ldc );
typedef lapack_int (*zunmbr_t)( int matrix_order, char vect, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const lapack_complex_double* a, lapack_int lda,
                           const lapack_complex_double* tau,
                           lapack_complex_double* c, lapack_int ldc );

typedef lapack_int (*cunmhr_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int ilo,
                           lapack_int ihi, const lapack_complex_float* a,
                           lapack_int lda, const lapack_complex_float* tau,
                           lapack_complex_float* c, lapack_int ldc );
typedef lapack_int (*zunmhr_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int ilo,
                           lapack_int ihi, const lapack_complex_double* a,
                           lapack_int lda, const lapack_complex_double* tau,
                           lapack_complex_double* c, lapack_int ldc );

typedef lapack_int (*cunmlq_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const lapack_complex_float* a, lapack_int lda,
                           const lapack_complex_float* tau,
                           lapack_complex_float* c, lapack_int ldc );
typedef lapack_int (*zunmlq_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const lapack_complex_double* a, lapack_int lda,
                           const lapack_complex_double* tau,
                           lapack_complex_double* c, lapack_int ldc );

typedef lapack_int (*cunmql_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const lapack_complex_float* a, lapack_int lda,
                           const lapack_complex_float* tau,
                           lapack_complex_float* c, lapack_int ldc );
typedef lapack_int (*zunmql_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const lapack_complex_double* a, lapack_int lda,
                           const lapack_complex_double* tau,
                           lapack_complex_double* c, lapack_int ldc );

typedef lapack_int (*cunmqr_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const lapack_complex_float* a, lapack_int lda,
                           const lapack_complex_float* tau,
                           lapack_complex_float* c, lapack_int ldc );
typedef lapack_int (*zunmqr_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const lapack_complex_double* a, lapack_int lda,
                           const lapack_complex_double* tau,
                           lapack_complex_double* c, lapack_int ldc );

typedef lapack_int (*cunmrq_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const lapack_complex_float* a, lapack_int lda,
                           const lapack_complex_float* tau,
                           lapack_complex_float* c, lapack_int ldc );
typedef lapack_int (*zunmrq_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           const lapack_complex_double* a, lapack_int lda,
                           const lapack_complex_double* tau,
                           lapack_complex_double* c, lapack_int ldc );

typedef lapack_int (*cunmrz_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           lapack_int l, const lapack_complex_float* a,
                           lapack_int lda, const lapack_complex_float* tau,
                           lapack_complex_float* c, lapack_int ldc );
typedef lapack_int (*zunmrz_t)( int matrix_order, char side, char trans,
                           lapack_int m, lapack_int n, lapack_int k,
                           lapack_int l, const lapack_complex_double* a,
                           lapack_int lda, const lapack_complex_double* tau,
                           lapack_complex_double* c, lapack_int ldc );

typedef lapack_int (*cunmtr_t)( int matrix_order, char side, char uplo, char trans,
                           lapack_int m, lapack_int n,
                           const lapack_complex_float* a, lapack_int lda,
                           const lapack_complex_float* tau,
                           lapack_complex_float* c, lapack_int ldc );
typedef lapack_int (*zunmtr_t)( int matrix_order, char side, char uplo, char trans,
                           lapack_int m, lapack_int n,
                           const lapack_complex_double* a, lapack_int lda,
                           const lapack_complex_double* tau,
                           lapack_complex_double* c, lapack_int ldc );

typedef lapack_int (*cupgtr_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_float* ap,
                           const lapack_complex_float* tau,
                           lapack_complex_float* q, lapack_int ldq );
typedef lapack_int (*zupgtr_t)( int matrix_order, char uplo, lapack_int n,
                           const lapack_complex_double* ap,
                           const lapack_complex_double* tau,
                           lapack_complex_double* q, lapack_int ldq );

typedef lapack_int (*cupmtr_t)( int matrix_order, char side, char uplo, char trans,
                           lapack_int m, lapack_int n,
                           const lapack_complex_float* ap,
                           const lapack_complex_float* tau,
                           lapack_complex_float* c, lapack_int ldc );
typedef lapack_int (*zupmtr_t)( int matrix_order, char side, char uplo, char trans,
                           lapack_int m, lapack_int n,
                           const lapack_complex_double* ap,
                           const lapack_complex_double* tau,
                           lapack_complex_double* c, lapack_int ldc );

typedef lapack_int (*sbdsdc_work_t)( int matrix_order, char uplo, char compq,
                                lapack_int n, float* d, float* e, float* u,
                                lapack_int ldu, float* vt, lapack_int ldvt,
                                float* q, lapack_int* iq, float* work,
                                lapack_int* iwork );
typedef lapack_int (*dbdsdc_work_t)( int matrix_order, char uplo, char compq,
                                lapack_int n, double* d, double* e, double* u,
                                lapack_int ldu, double* vt, lapack_int ldvt,
                                double* q, lapack_int* iq, double* work,
                                lapack_int* iwork );

typedef lapack_int (*sbdsqr_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int ncvt, lapack_int nru, lapack_int ncc,
                                float* d, float* e, float* vt, lapack_int ldvt,
                                float* u, lapack_int ldu, float* c,
                                lapack_int ldc, float* work );
typedef lapack_int (*dbdsqr_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int ncvt, lapack_int nru, lapack_int ncc,
                                double* d, double* e, double* vt,
                                lapack_int ldvt, double* u, lapack_int ldu,
                                double* c, lapack_int ldc, double* work );
typedef lapack_int (*cbdsqr_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int ncvt, lapack_int nru, lapack_int ncc,
                                float* d, float* e, lapack_complex_float* vt,
                                lapack_int ldvt, lapack_complex_float* u,
                                lapack_int ldu, lapack_complex_float* c,
                                lapack_int ldc, float* work );
typedef lapack_int (*zbdsqr_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int ncvt, lapack_int nru, lapack_int ncc,
                                double* d, double* e, lapack_complex_double* vt,
                                lapack_int ldvt, lapack_complex_double* u,
                                lapack_int ldu, lapack_complex_double* c,
                                lapack_int ldc, double* work );

typedef lapack_int (*sdisna_work_t)( char job, lapack_int m, lapack_int n,
                                const float* d, float* sep );
typedef lapack_int (*ddisna_work_t)( char job, lapack_int m, lapack_int n,
                                const double* d, double* sep );

typedef lapack_int (*sgbbrd_work_t)( int matrix_order, char vect, lapack_int m,
                                lapack_int n, lapack_int ncc, lapack_int kl,
                                lapack_int ku, float* ab, lapack_int ldab,
                                float* d, float* e, float* q, lapack_int ldq,
                                float* pt, lapack_int ldpt, float* c,
                                lapack_int ldc, float* work );
typedef lapack_int (*dgbbrd_work_t)( int matrix_order, char vect, lapack_int m,
                                lapack_int n, lapack_int ncc, lapack_int kl,
                                lapack_int ku, double* ab, lapack_int ldab,
                                double* d, double* e, double* q, lapack_int ldq,
                                double* pt, lapack_int ldpt, double* c,
                                lapack_int ldc, double* work );
typedef lapack_int (*cgbbrd_work_t)( int matrix_order, char vect, lapack_int m,
                                lapack_int n, lapack_int ncc, lapack_int kl,
                                lapack_int ku, lapack_complex_float* ab,
                                lapack_int ldab, float* d, float* e,
                                lapack_complex_float* q, lapack_int ldq,
                                lapack_complex_float* pt, lapack_int ldpt,
                                lapack_complex_float* c, lapack_int ldc,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zgbbrd_work_t)( int matrix_order, char vect, lapack_int m,
                                lapack_int n, lapack_int ncc, lapack_int kl,
                                lapack_int ku, lapack_complex_double* ab,
                                lapack_int ldab, double* d, double* e,
                                lapack_complex_double* q, lapack_int ldq,
                                lapack_complex_double* pt, lapack_int ldpt,
                                lapack_complex_double* c, lapack_int ldc,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*sgbcon_work_t)( int matrix_order, char norm, lapack_int n,
                                lapack_int kl, lapack_int ku, const float* ab,
                                lapack_int ldab, const lapack_int* ipiv,
                                float anorm, float* rcond, float* work,
                                lapack_int* iwork );
typedef lapack_int (*dgbcon_work_t)( int matrix_order, char norm, lapack_int n,
                                lapack_int kl, lapack_int ku, const double* ab,
                                lapack_int ldab, const lapack_int* ipiv,
                                double anorm, double* rcond, double* work,
                                lapack_int* iwork );
typedef lapack_int (*cgbcon_work_t)( int matrix_order, char norm, lapack_int n,
                                lapack_int kl, lapack_int ku,
                                const lapack_complex_float* ab, lapack_int ldab,
                                const lapack_int* ipiv, float anorm,
                                float* rcond, lapack_complex_float* work,
                                float* rwork );
typedef lapack_int (*zgbcon_work_t)( int matrix_order, char norm, lapack_int n,
                                lapack_int kl, lapack_int ku,
                                const lapack_complex_double* ab,
                                lapack_int ldab, const lapack_int* ipiv,
                                double anorm, double* rcond,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*sgbequ_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int kl, lapack_int ku, const float* ab,
                                lapack_int ldab, float* r, float* c,
                                float* rowcnd, float* colcnd, float* amax );
typedef lapack_int (*dgbequ_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int kl, lapack_int ku, const double* ab,
                                lapack_int ldab, double* r, double* c,
                                double* rowcnd, double* colcnd, double* amax );
typedef lapack_int (*cgbequ_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int kl, lapack_int ku,
                                const lapack_complex_float* ab, lapack_int ldab,
                                float* r, float* c, float* rowcnd,
                                float* colcnd, float* amax );
typedef lapack_int (*zgbequ_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int kl, lapack_int ku,
                                const lapack_complex_double* ab,
                                lapack_int ldab, double* r, double* c,
                                double* rowcnd, double* colcnd, double* amax );

typedef lapack_int (*sgbequb_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 lapack_int kl, lapack_int ku, const float* ab,
                                 lapack_int ldab, float* r, float* c,
                                 float* rowcnd, float* colcnd, float* amax );
typedef lapack_int (*dgbequb_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 lapack_int kl, lapack_int ku, const double* ab,
                                 lapack_int ldab, double* r, double* c,
                                 double* rowcnd, double* colcnd, double* amax );
typedef lapack_int (*cgbequb_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 lapack_int kl, lapack_int ku,
                                 const lapack_complex_float* ab,
                                 lapack_int ldab, float* r, float* c,
                                 float* rowcnd, float* colcnd, float* amax );
typedef lapack_int (*zgbequb_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 lapack_int kl, lapack_int ku,
                                 const lapack_complex_double* ab,
                                 lapack_int ldab, double* r, double* c,
                                 double* rowcnd, double* colcnd, double* amax );

typedef lapack_int (*sgbrfs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int kl, lapack_int ku, lapack_int nrhs,
                                const float* ab, lapack_int ldab,
                                const float* afb, lapack_int ldafb,
                                const lapack_int* ipiv, const float* b,
                                lapack_int ldb, float* x, lapack_int ldx,
                                float* ferr, float* berr, float* work,
                                lapack_int* iwork );
typedef lapack_int (*dgbrfs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int kl, lapack_int ku, lapack_int nrhs,
                                const double* ab, lapack_int ldab,
                                const double* afb, lapack_int ldafb,
                                const lapack_int* ipiv, const double* b,
                                lapack_int ldb, double* x, lapack_int ldx,
                                double* ferr, double* berr, double* work,
                                lapack_int* iwork );
typedef lapack_int (*cgbrfs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int kl, lapack_int ku, lapack_int nrhs,
                                const lapack_complex_float* ab, lapack_int ldab,
                                const lapack_complex_float* afb,
                                lapack_int ldafb, const lapack_int* ipiv,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* x, lapack_int ldx,
                                float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zgbrfs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int kl, lapack_int ku, lapack_int nrhs,
                                const lapack_complex_double* ab,
                                lapack_int ldab,
                                const lapack_complex_double* afb,
                                lapack_int ldafb, const lapack_int* ipiv,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*sgbrfsx_work_t)( int matrix_order, char trans, char equed,
                                 lapack_int n, lapack_int kl, lapack_int ku,
                                 lapack_int nrhs, const float* ab,
                                 lapack_int ldab, const float* afb,
                                 lapack_int ldafb, const lapack_int* ipiv,
                                 const float* r, const float* c, const float* b,
                                 lapack_int ldb, float* x, lapack_int ldx,
                                 float* rcond, float* berr,
                                 lapack_int n_err_bnds, float* err_bnds_norm,
                                 float* err_bnds_comp, lapack_int nparams,
                                 float* params, float* work,
                                 lapack_int* iwork );
typedef lapack_int (*dgbrfsx_work_t)( int matrix_order, char trans, char equed,
                                 lapack_int n, lapack_int kl, lapack_int ku,
                                 lapack_int nrhs, const double* ab,
                                 lapack_int ldab, const double* afb,
                                 lapack_int ldafb, const lapack_int* ipiv,
                                 const double* r, const double* c,
                                 const double* b, lapack_int ldb, double* x,
                                 lapack_int ldx, double* rcond, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, double* work,
                                 lapack_int* iwork );
typedef lapack_int (*cgbrfsx_work_t)( int matrix_order, char trans, char equed,
                                 lapack_int n, lapack_int kl, lapack_int ku,
                                 lapack_int nrhs,
                                 const lapack_complex_float* ab,
                                 lapack_int ldab,
                                 const lapack_complex_float* afb,
                                 lapack_int ldafb, const lapack_int* ipiv,
                                 const float* r, const float* c,
                                 const lapack_complex_float* b, lapack_int ldb,
                                 lapack_complex_float* x, lapack_int ldx,
                                 float* rcond, float* berr,
                                 lapack_int n_err_bnds, float* err_bnds_norm,
                                 float* err_bnds_comp, lapack_int nparams,
                                 float* params, lapack_complex_float* work,
                                 float* rwork );
typedef lapack_int (*zgbrfsx_work_t)( int matrix_order, char trans, char equed,
                                 lapack_int n, lapack_int kl, lapack_int ku,
                                 lapack_int nrhs,
                                 const lapack_complex_double* ab,
                                 lapack_int ldab,
                                 const lapack_complex_double* afb,
                                 lapack_int ldafb, const lapack_int* ipiv,
                                 const double* r, const double* c,
                                 const lapack_complex_double* b, lapack_int ldb,
                                 lapack_complex_double* x, lapack_int ldx,
                                 double* rcond, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, lapack_complex_double* work,
                                 double* rwork );

typedef lapack_int (*sgbsv_work_t)( int matrix_order, lapack_int n, lapack_int kl,
                               lapack_int ku, lapack_int nrhs, float* ab,
                               lapack_int ldab, lapack_int* ipiv, float* b,
                               lapack_int ldb );
typedef lapack_int (*dgbsv_work_t)( int matrix_order, lapack_int n, lapack_int kl,
                               lapack_int ku, lapack_int nrhs, double* ab,
                               lapack_int ldab, lapack_int* ipiv, double* b,
                               lapack_int ldb );
typedef lapack_int (*cgbsv_work_t)( int matrix_order, lapack_int n, lapack_int kl,
                               lapack_int ku, lapack_int nrhs,
                               lapack_complex_float* ab, lapack_int ldab,
                               lapack_int* ipiv, lapack_complex_float* b,
                               lapack_int ldb );
typedef lapack_int (*zgbsv_work_t)( int matrix_order, lapack_int n, lapack_int kl,
                               lapack_int ku, lapack_int nrhs,
                               lapack_complex_double* ab, lapack_int ldab,
                               lapack_int* ipiv, lapack_complex_double* b,
                               lapack_int ldb );

typedef lapack_int (*sgbsvx_work_t)( int matrix_order, char fact, char trans,
                                lapack_int n, lapack_int kl, lapack_int ku,
                                lapack_int nrhs, float* ab, lapack_int ldab,
                                float* afb, lapack_int ldafb, lapack_int* ipiv,
                                char* equed, float* r, float* c, float* b,
                                lapack_int ldb, float* x, lapack_int ldx,
                                float* rcond, float* ferr, float* berr,
                                float* work, lapack_int* iwork );
typedef lapack_int (*dgbsvx_work_t)( int matrix_order, char fact, char trans,
                                lapack_int n, lapack_int kl, lapack_int ku,
                                lapack_int nrhs, double* ab, lapack_int ldab,
                                double* afb, lapack_int ldafb, lapack_int* ipiv,
                                char* equed, double* r, double* c, double* b,
                                lapack_int ldb, double* x, lapack_int ldx,
                                double* rcond, double* ferr, double* berr,
                                double* work, lapack_int* iwork );
typedef lapack_int (*cgbsvx_work_t)( int matrix_order, char fact, char trans,
                                lapack_int n, lapack_int kl, lapack_int ku,
                                lapack_int nrhs, lapack_complex_float* ab,
                                lapack_int ldab, lapack_complex_float* afb,
                                lapack_int ldafb, lapack_int* ipiv, char* equed,
                                float* r, float* c, lapack_complex_float* b,
                                lapack_int ldb, lapack_complex_float* x,
                                lapack_int ldx, float* rcond, float* ferr,
                                float* berr, lapack_complex_float* work,
                                float* rwork );
typedef lapack_int (*zgbsvx_work_t)( int matrix_order, char fact, char trans,
                                lapack_int n, lapack_int kl, lapack_int ku,
                                lapack_int nrhs, lapack_complex_double* ab,
                                lapack_int ldab, lapack_complex_double* afb,
                                lapack_int ldafb, lapack_int* ipiv, char* equed,
                                double* r, double* c, lapack_complex_double* b,
                                lapack_int ldb, lapack_complex_double* x,
                                lapack_int ldx, double* rcond, double* ferr,
                                double* berr, lapack_complex_double* work,
                                double* rwork );

typedef lapack_int (*sgbsvxx_work_t)( int matrix_order, char fact, char trans,
                                 lapack_int n, lapack_int kl, lapack_int ku,
                                 lapack_int nrhs, float* ab, lapack_int ldab,
                                 float* afb, lapack_int ldafb, lapack_int* ipiv,
                                 char* equed, float* r, float* c, float* b,
                                 lapack_int ldb, float* x, lapack_int ldx,
                                 float* rcond, float* rpvgrw, float* berr,
                                 lapack_int n_err_bnds, float* err_bnds_norm,
                                 float* err_bnds_comp, lapack_int nparams,
                                 float* params, float* work,
                                 lapack_int* iwork );
typedef lapack_int (*dgbsvxx_work_t)( int matrix_order, char fact, char trans,
                                 lapack_int n, lapack_int kl, lapack_int ku,
                                 lapack_int nrhs, double* ab, lapack_int ldab,
                                 double* afb, lapack_int ldafb,
                                 lapack_int* ipiv, char* equed, double* r,
                                 double* c, double* b, lapack_int ldb,
                                 double* x, lapack_int ldx, double* rcond,
                                 double* rpvgrw, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, double* work,
                                 lapack_int* iwork );
typedef lapack_int (*cgbsvxx_work_t)( int matrix_order, char fact, char trans,
                                 lapack_int n, lapack_int kl, lapack_int ku,
                                 lapack_int nrhs, lapack_complex_float* ab,
                                 lapack_int ldab, lapack_complex_float* afb,
                                 lapack_int ldafb, lapack_int* ipiv,
                                 char* equed, float* r, float* c,
                                 lapack_complex_float* b, lapack_int ldb,
                                 lapack_complex_float* x, lapack_int ldx,
                                 float* rcond, float* rpvgrw, float* berr,
                                 lapack_int n_err_bnds, float* err_bnds_norm,
                                 float* err_bnds_comp, lapack_int nparams,
                                 float* params, lapack_complex_float* work,
                                 float* rwork );
typedef lapack_int (*zgbsvxx_work_t)( int matrix_order, char fact, char trans,
                                 lapack_int n, lapack_int kl, lapack_int ku,
                                 lapack_int nrhs, lapack_complex_double* ab,
                                 lapack_int ldab, lapack_complex_double* afb,
                                 lapack_int ldafb, lapack_int* ipiv,
                                 char* equed, double* r, double* c,
                                 lapack_complex_double* b, lapack_int ldb,
                                 lapack_complex_double* x, lapack_int ldx,
                                 double* rcond, double* rpvgrw, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, lapack_complex_double* work,
                                 double* rwork );

typedef lapack_int (*sgbtrf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int kl, lapack_int ku, float* ab,
                                lapack_int ldab, lapack_int* ipiv );
typedef lapack_int (*dgbtrf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int kl, lapack_int ku, double* ab,
                                lapack_int ldab, lapack_int* ipiv );
typedef lapack_int (*cgbtrf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int kl, lapack_int ku,
                                lapack_complex_float* ab, lapack_int ldab,
                                lapack_int* ipiv );
typedef lapack_int (*zgbtrf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int kl, lapack_int ku,
                                lapack_complex_double* ab, lapack_int ldab,
                                lapack_int* ipiv );

typedef lapack_int (*sgbtrs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int kl, lapack_int ku, lapack_int nrhs,
                                const float* ab, lapack_int ldab,
                                const lapack_int* ipiv, float* b,
                                lapack_int ldb );
typedef lapack_int (*dgbtrs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int kl, lapack_int ku, lapack_int nrhs,
                                const double* ab, lapack_int ldab,
                                const lapack_int* ipiv, double* b,
                                lapack_int ldb );
typedef lapack_int (*cgbtrs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int kl, lapack_int ku, lapack_int nrhs,
                                const lapack_complex_float* ab, lapack_int ldab,
                                const lapack_int* ipiv, lapack_complex_float* b,
                                lapack_int ldb );
typedef lapack_int (*zgbtrs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int kl, lapack_int ku, lapack_int nrhs,
                                const lapack_complex_double* ab,
                                lapack_int ldab, const lapack_int* ipiv,
                                lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*sgebak_work_t)( int matrix_order, char job, char side,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                const float* scale, lapack_int m, float* v,
                                lapack_int ldv );
typedef lapack_int (*dgebak_work_t)( int matrix_order, char job, char side,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                const double* scale, lapack_int m, double* v,
                                lapack_int ldv );
typedef lapack_int (*cgebak_work_t)( int matrix_order, char job, char side,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                const float* scale, lapack_int m,
                                lapack_complex_float* v, lapack_int ldv );
typedef lapack_int (*zgebak_work_t)( int matrix_order, char job, char side,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                const double* scale, lapack_int m,
                                lapack_complex_double* v, lapack_int ldv );

typedef lapack_int (*sgebal_work_t)( int matrix_order, char job, lapack_int n,
                                float* a, lapack_int lda, lapack_int* ilo,
                                lapack_int* ihi, float* scale );
typedef lapack_int (*dgebal_work_t)( int matrix_order, char job, lapack_int n,
                                double* a, lapack_int lda, lapack_int* ilo,
                                lapack_int* ihi, double* scale );
typedef lapack_int (*cgebal_work_t)( int matrix_order, char job, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_int* ilo, lapack_int* ihi,
                                float* scale );
typedef lapack_int (*zgebal_work_t)( int matrix_order, char job, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_int* ilo, lapack_int* ihi,
                                double* scale );

typedef lapack_int (*sgebrd_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                float* a, lapack_int lda, float* d, float* e,
                                float* tauq, float* taup, float* work,
                                lapack_int lwork );
typedef lapack_int (*dgebrd_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                double* a, lapack_int lda, double* d, double* e,
                                double* tauq, double* taup, double* work,
                                lapack_int lwork );
typedef lapack_int (*cgebrd_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                float* d, float* e, lapack_complex_float* tauq,
                                lapack_complex_float* taup,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zgebrd_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                double* d, double* e,
                                lapack_complex_double* tauq,
                                lapack_complex_double* taup,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*sgecon_work_t)( int matrix_order, char norm, lapack_int n,
                                const float* a, lapack_int lda, float anorm,
                                float* rcond, float* work, lapack_int* iwork );
typedef lapack_int (*dgecon_work_t)( int matrix_order, char norm, lapack_int n,
                                const double* a, lapack_int lda, double anorm,
                                double* rcond, double* work,
                                lapack_int* iwork );
typedef lapack_int (*cgecon_work_t)( int matrix_order, char norm, lapack_int n,
                                const lapack_complex_float* a, lapack_int lda,
                                float anorm, float* rcond,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zgecon_work_t)( int matrix_order, char norm, lapack_int n,
                                const lapack_complex_double* a, lapack_int lda,
                                double anorm, double* rcond,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*sgeequ_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                const float* a, lapack_int lda, float* r,
                                float* c, float* rowcnd, float* colcnd,
                                float* amax );
typedef lapack_int (*dgeequ_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                const double* a, lapack_int lda, double* r,
                                double* c, double* rowcnd, double* colcnd,
                                double* amax );
typedef lapack_int (*cgeequ_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                const lapack_complex_float* a, lapack_int lda,
                                float* r, float* c, float* rowcnd,
                                float* colcnd, float* amax );
typedef lapack_int (*zgeequ_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                const lapack_complex_double* a, lapack_int lda,
                                double* r, double* c, double* rowcnd,
                                double* colcnd, double* amax );

typedef lapack_int (*sgeequb_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 const float* a, lapack_int lda, float* r,
                                 float* c, float* rowcnd, float* colcnd,
                                 float* amax );
typedef lapack_int (*dgeequb_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 const double* a, lapack_int lda, double* r,
                                 double* c, double* rowcnd, double* colcnd,
                                 double* amax );
typedef lapack_int (*cgeequb_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 const lapack_complex_float* a, lapack_int lda,
                                 float* r, float* c, float* rowcnd,
                                 float* colcnd, float* amax );
typedef lapack_int (*zgeequb_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 const lapack_complex_double* a, lapack_int lda,
                                 double* r, double* c, double* rowcnd,
                                 double* colcnd, double* amax );

typedef lapack_int (*sgees_work_t)( int matrix_order, char jobvs, char sort,
                               LAPACK_S_SELECT2 select, lapack_int n, float* a,
                               lapack_int lda, lapack_int* sdim, float* wr,
                               float* wi, float* vs, lapack_int ldvs,
                               float* work, lapack_int lwork,
                               lapack_logical* bwork );
typedef lapack_int (*dgees_work_t)( int matrix_order, char jobvs, char sort,
                               LAPACK_D_SELECT2 select, lapack_int n, double* a,
                               lapack_int lda, lapack_int* sdim, double* wr,
                               double* wi, double* vs, lapack_int ldvs,
                               double* work, lapack_int lwork,
                               lapack_logical* bwork );
typedef lapack_int (*cgees_work_t)( int matrix_order, char jobvs, char sort,
                               LAPACK_C_SELECT1 select, lapack_int n,
                               lapack_complex_float* a, lapack_int lda,
                               lapack_int* sdim, lapack_complex_float* w,
                               lapack_complex_float* vs, lapack_int ldvs,
                               lapack_complex_float* work, lapack_int lwork,
                               float* rwork, lapack_logical* bwork );
typedef lapack_int (*zgees_work_t)( int matrix_order, char jobvs, char sort,
                               LAPACK_Z_SELECT1 select, lapack_int n,
                               lapack_complex_double* a, lapack_int lda,
                               lapack_int* sdim, lapack_complex_double* w,
                               lapack_complex_double* vs, lapack_int ldvs,
                               lapack_complex_double* work, lapack_int lwork,
                               double* rwork, lapack_logical* bwork );

typedef lapack_int (*sgeesx_work_t)( int matrix_order, char jobvs, char sort,
                                LAPACK_S_SELECT2 select, char sense,
                                lapack_int n, float* a, lapack_int lda,
                                lapack_int* sdim, float* wr, float* wi,
                                float* vs, lapack_int ldvs, float* rconde,
                                float* rcondv, float* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork,
                                lapack_logical* bwork );
typedef lapack_int (*dgeesx_work_t)( int matrix_order, char jobvs, char sort,
                                LAPACK_D_SELECT2 select, char sense,
                                lapack_int n, double* a, lapack_int lda,
                                lapack_int* sdim, double* wr, double* wi,
                                double* vs, lapack_int ldvs, double* rconde,
                                double* rcondv, double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork,
                                lapack_logical* bwork );
typedef lapack_int (*cgeesx_work_t)( int matrix_order, char jobvs, char sort,
                                LAPACK_C_SELECT1 select, char sense,
                                lapack_int n, lapack_complex_float* a,
                                lapack_int lda, lapack_int* sdim,
                                lapack_complex_float* w,
                                lapack_complex_float* vs, lapack_int ldvs,
                                float* rconde, float* rcondv,
                                lapack_complex_float* work, lapack_int lwork,
                                float* rwork, lapack_logical* bwork );
typedef lapack_int (*zgeesx_work_t)( int matrix_order, char jobvs, char sort,
                                LAPACK_Z_SELECT1 select, char sense,
                                lapack_int n, lapack_complex_double* a,
                                lapack_int lda, lapack_int* sdim,
                                lapack_complex_double* w,
                                lapack_complex_double* vs, lapack_int ldvs,
                                double* rconde, double* rcondv,
                                lapack_complex_double* work, lapack_int lwork,
                                double* rwork, lapack_logical* bwork );

typedef lapack_int (*sgeev_work_t)( int matrix_order, char jobvl, char jobvr,
                               lapack_int n, float* a, lapack_int lda,
                               float* wr, float* wi, float* vl, lapack_int ldvl,
                               float* vr, lapack_int ldvr, float* work,
                               lapack_int lwork );
typedef lapack_int (*dgeev_work_t)( int matrix_order, char jobvl, char jobvr,
                               lapack_int n, double* a, lapack_int lda,
                               double* wr, double* wi, double* vl,
                               lapack_int ldvl, double* vr, lapack_int ldvr,
                               double* work, lapack_int lwork );
typedef lapack_int (*cgeev_work_t)( int matrix_order, char jobvl, char jobvr,
                               lapack_int n, lapack_complex_float* a,
                               lapack_int lda, lapack_complex_float* w,
                               lapack_complex_float* vl, lapack_int ldvl,
                               lapack_complex_float* vr, lapack_int ldvr,
                               lapack_complex_float* work, lapack_int lwork,
                               float* rwork );
typedef lapack_int (*zgeev_work_t)( int matrix_order, char jobvl, char jobvr,
                               lapack_int n, lapack_complex_double* a,
                               lapack_int lda, lapack_complex_double* w,
                               lapack_complex_double* vl, lapack_int ldvl,
                               lapack_complex_double* vr, lapack_int ldvr,
                               lapack_complex_double* work, lapack_int lwork,
                               double* rwork );

typedef lapack_int (*sgeevx_work_t)( int matrix_order, char balanc, char jobvl,
                                char jobvr, char sense, lapack_int n, float* a,
                                lapack_int lda, float* wr, float* wi, float* vl,
                                lapack_int ldvl, float* vr, lapack_int ldvr,
                                lapack_int* ilo, lapack_int* ihi, float* scale,
                                float* abnrm, float* rconde, float* rcondv,
                                float* work, lapack_int lwork,
                                lapack_int* iwork );
typedef lapack_int (*dgeevx_work_t)( int matrix_order, char balanc, char jobvl,
                                char jobvr, char sense, lapack_int n, double* a,
                                lapack_int lda, double* wr, double* wi,
                                double* vl, lapack_int ldvl, double* vr,
                                lapack_int ldvr, lapack_int* ilo,
                                lapack_int* ihi, double* scale, double* abnrm,
                                double* rconde, double* rcondv, double* work,
                                lapack_int lwork, lapack_int* iwork );
typedef lapack_int (*cgeevx_work_t)( int matrix_order, char balanc, char jobvl,
                                char jobvr, char sense, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* w,
                                lapack_complex_float* vl, lapack_int ldvl,
                                lapack_complex_float* vr, lapack_int ldvr,
                                lapack_int* ilo, lapack_int* ihi, float* scale,
                                float* abnrm, float* rconde, float* rcondv,
                                lapack_complex_float* work, lapack_int lwork,
                                float* rwork );
typedef lapack_int (*zgeevx_work_t)( int matrix_order, char balanc, char jobvl,
                                char jobvr, char sense, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* w,
                                lapack_complex_double* vl, lapack_int ldvl,
                                lapack_complex_double* vr, lapack_int ldvr,
                                lapack_int* ilo, lapack_int* ihi, double* scale,
                                double* abnrm, double* rconde, double* rcondv,
                                lapack_complex_double* work, lapack_int lwork,
                                double* rwork );

typedef lapack_int (*sgehrd_work_t)( int matrix_order, lapack_int n, lapack_int ilo,
                                lapack_int ihi, float* a, lapack_int lda,
                                float* tau, float* work, lapack_int lwork );
typedef lapack_int (*dgehrd_work_t)( int matrix_order, lapack_int n, lapack_int ilo,
                                lapack_int ihi, double* a, lapack_int lda,
                                double* tau, double* work, lapack_int lwork );
typedef lapack_int (*cgehrd_work_t)( int matrix_order, lapack_int n, lapack_int ilo,
                                lapack_int ihi, lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zgehrd_work_t)( int matrix_order, lapack_int n, lapack_int ilo,
                                lapack_int ihi, lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*sgejsv_work_t)( int matrix_order, char joba, char jobu,
                                char jobv, char jobr, char jobt, char jobp,
                                lapack_int m, lapack_int n, float* a,
                                lapack_int lda, float* sva, float* u,
                                lapack_int ldu, float* v, lapack_int ldv,
                                float* work, lapack_int lwork,
                                lapack_int* iwork );
typedef lapack_int (*dgejsv_work_t)( int matrix_order, char joba, char jobu,
                                char jobv, char jobr, char jobt, char jobp,
                                lapack_int m, lapack_int n, double* a,
                                lapack_int lda, double* sva, double* u,
                                lapack_int ldu, double* v, lapack_int ldv,
                                double* work, lapack_int lwork,
                                lapack_int* iwork );

typedef lapack_int (*sgelq2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                float* a, lapack_int lda, float* tau,
                                float* work );
typedef lapack_int (*dgelq2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                double* a, lapack_int lda, double* tau,
                                double* work );
typedef lapack_int (*cgelq2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* tau,
                                lapack_complex_float* work );
typedef lapack_int (*zgelq2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* tau,
                                lapack_complex_double* work );

typedef lapack_int (*sgelqf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                float* a, lapack_int lda, float* tau,
                                float* work, lapack_int lwork );
typedef lapack_int (*dgelqf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                double* a, lapack_int lda, double* tau,
                                double* work, lapack_int lwork );
typedef lapack_int (*cgelqf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zgelqf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*sgels_work_t)( int matrix_order, char trans, lapack_int m,
                               lapack_int n, lapack_int nrhs, float* a,
                               lapack_int lda, float* b, lapack_int ldb,
                               float* work, lapack_int lwork );
typedef lapack_int (*dgels_work_t)( int matrix_order, char trans, lapack_int m,
                               lapack_int n, lapack_int nrhs, double* a,
                               lapack_int lda, double* b, lapack_int ldb,
                               double* work, lapack_int lwork );
typedef lapack_int (*cgels_work_t)( int matrix_order, char trans, lapack_int m,
                               lapack_int n, lapack_int nrhs,
                               lapack_complex_float* a, lapack_int lda,
                               lapack_complex_float* b, lapack_int ldb,
                               lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zgels_work_t)( int matrix_order, char trans, lapack_int m,
                               lapack_int n, lapack_int nrhs,
                               lapack_complex_double* a, lapack_int lda,
                               lapack_complex_double* b, lapack_int ldb,
                               lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*sgelsd_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nrhs, float* a, lapack_int lda,
                                float* b, lapack_int ldb, float* s, float rcond,
                                lapack_int* rank, float* work, lapack_int lwork,
                                lapack_int* iwork );
typedef lapack_int (*dgelsd_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nrhs, double* a, lapack_int lda,
                                double* b, lapack_int ldb, double* s,
                                double rcond, lapack_int* rank, double* work,
                                lapack_int lwork, lapack_int* iwork );
typedef lapack_int (*cgelsd_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nrhs, lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* b,
                                lapack_int ldb, float* s, float rcond,
                                lapack_int* rank, lapack_complex_float* work,
                                lapack_int lwork, float* rwork,
                                lapack_int* iwork );
typedef lapack_int (*zgelsd_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nrhs, lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* b,
                                lapack_int ldb, double* s, double rcond,
                                lapack_int* rank, lapack_complex_double* work,
                                lapack_int lwork, double* rwork,
                                lapack_int* iwork );

typedef lapack_int (*sgelss_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nrhs, float* a, lapack_int lda,
                                float* b, lapack_int ldb, float* s, float rcond,
                                lapack_int* rank, float* work,
                                lapack_int lwork );
typedef lapack_int (*dgelss_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nrhs, double* a, lapack_int lda,
                                double* b, lapack_int ldb, double* s,
                                double rcond, lapack_int* rank, double* work,
                                lapack_int lwork );
typedef lapack_int (*cgelss_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nrhs, lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* b,
                                lapack_int ldb, float* s, float rcond,
                                lapack_int* rank, lapack_complex_float* work,
                                lapack_int lwork, float* rwork );
typedef lapack_int (*zgelss_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nrhs, lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* b,
                                lapack_int ldb, double* s, double rcond,
                                lapack_int* rank, lapack_complex_double* work,
                                lapack_int lwork, double* rwork );

typedef lapack_int (*sgelsy_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nrhs, float* a, lapack_int lda,
                                float* b, lapack_int ldb, lapack_int* jpvt,
                                float rcond, lapack_int* rank, float* work,
                                lapack_int lwork );
typedef lapack_int (*dgelsy_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nrhs, double* a, lapack_int lda,
                                double* b, lapack_int ldb, lapack_int* jpvt,
                                double rcond, lapack_int* rank, double* work,
                                lapack_int lwork );
typedef lapack_int (*cgelsy_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nrhs, lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* b,
                                lapack_int ldb, lapack_int* jpvt, float rcond,
                                lapack_int* rank, lapack_complex_float* work,
                                lapack_int lwork, float* rwork );
typedef lapack_int (*zgelsy_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nrhs, lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* b,
                                lapack_int ldb, lapack_int* jpvt, double rcond,
                                lapack_int* rank, lapack_complex_double* work,
                                lapack_int lwork, double* rwork );

typedef lapack_int (*sgeqlf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                float* a, lapack_int lda, float* tau,
                                float* work, lapack_int lwork );
typedef lapack_int (*dgeqlf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                double* a, lapack_int lda, double* tau,
                                double* work, lapack_int lwork );
typedef lapack_int (*cgeqlf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zgeqlf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*sgeqp3_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                float* a, lapack_int lda, lapack_int* jpvt,
                                float* tau, float* work, lapack_int lwork );
typedef lapack_int (*dgeqp3_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                double* a, lapack_int lda, lapack_int* jpvt,
                                double* tau, double* work, lapack_int lwork );
typedef lapack_int (*cgeqp3_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_int* jpvt, lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork,
                                float* rwork );
typedef lapack_int (*zgeqp3_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_int* jpvt, lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork,
                                double* rwork );

typedef lapack_int (*sgeqpf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                float* a, lapack_int lda, lapack_int* jpvt,
                                float* tau, float* work );
typedef lapack_int (*dgeqpf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                double* a, lapack_int lda, lapack_int* jpvt,
                                double* tau, double* work );
typedef lapack_int (*cgeqpf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_int* jpvt, lapack_complex_float* tau,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zgeqpf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_int* jpvt, lapack_complex_double* tau,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*sgeqr2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                float* a, lapack_int lda, float* tau,
                                float* work );
typedef lapack_int (*dgeqr2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                double* a, lapack_int lda, double* tau,
                                double* work );
typedef lapack_int (*cgeqr2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* tau,
                                lapack_complex_float* work );
typedef lapack_int (*zgeqr2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* tau,
                                lapack_complex_double* work );

typedef lapack_int (*sgeqrf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                float* a, lapack_int lda, float* tau,
                                float* work, lapack_int lwork );
typedef lapack_int (*dgeqrf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                double* a, lapack_int lda, double* tau,
                                double* work, lapack_int lwork );
typedef lapack_int (*cgeqrf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zgeqrf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*sgeqrfp_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 float* a, lapack_int lda, float* tau,
                                 float* work, lapack_int lwork );
typedef lapack_int (*dgeqrfp_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 double* a, lapack_int lda, double* tau,
                                 double* work, lapack_int lwork );
typedef lapack_int (*cgeqrfp_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 lapack_complex_float* a, lapack_int lda,
                                 lapack_complex_float* tau,
                                 lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zgeqrfp_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 lapack_complex_double* a, lapack_int lda,
                                 lapack_complex_double* tau,
                                 lapack_complex_double* work,
                                 lapack_int lwork );

typedef lapack_int (*sgerfs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs, const float* a, lapack_int lda,
                                const float* af, lapack_int ldaf,
                                const lapack_int* ipiv, const float* b,
                                lapack_int ldb, float* x, lapack_int ldx,
                                float* ferr, float* berr, float* work,
                                lapack_int* iwork );
typedef lapack_int (*dgerfs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs, const double* a,
                                lapack_int lda, const double* af,
                                lapack_int ldaf, const lapack_int* ipiv,
                                const double* b, lapack_int ldb, double* x,
                                lapack_int ldx, double* ferr, double* berr,
                                double* work, lapack_int* iwork );
typedef lapack_int (*cgerfs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* a,
                                lapack_int lda, const lapack_complex_float* af,
                                lapack_int ldaf, const lapack_int* ipiv,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* x, lapack_int ldx,
                                float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zgerfs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs, const lapack_complex_double* a,
                                lapack_int lda, const lapack_complex_double* af,
                                lapack_int ldaf, const lapack_int* ipiv,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*sgerfsx_work_t)( int matrix_order, char trans, char equed,
                                 lapack_int n, lapack_int nrhs, const float* a,
                                 lapack_int lda, const float* af,
                                 lapack_int ldaf, const lapack_int* ipiv,
                                 const float* r, const float* c, const float* b,
                                 lapack_int ldb, float* x, lapack_int ldx,
                                 float* rcond, float* berr,
                                 lapack_int n_err_bnds, float* err_bnds_norm,
                                 float* err_bnds_comp, lapack_int nparams,
                                 float* params, float* work,
                                 lapack_int* iwork );
typedef lapack_int (*dgerfsx_work_t)( int matrix_order, char trans, char equed,
                                 lapack_int n, lapack_int nrhs, const double* a,
                                 lapack_int lda, const double* af,
                                 lapack_int ldaf, const lapack_int* ipiv,
                                 const double* r, const double* c,
                                 const double* b, lapack_int ldb, double* x,
                                 lapack_int ldx, double* rcond, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, double* work,
                                 lapack_int* iwork );
typedef lapack_int (*cgerfsx_work_t)( int matrix_order, char trans, char equed,
                                 lapack_int n, lapack_int nrhs,
                                 const lapack_complex_float* a, lapack_int lda,
                                 const lapack_complex_float* af,
                                 lapack_int ldaf, const lapack_int* ipiv,
                                 const float* r, const float* c,
                                 const lapack_complex_float* b, lapack_int ldb,
                                 lapack_complex_float* x, lapack_int ldx,
                                 float* rcond, float* berr,
                                 lapack_int n_err_bnds, float* err_bnds_norm,
                                 float* err_bnds_comp, lapack_int nparams,
                                 float* params, lapack_complex_float* work,
                                 float* rwork );
typedef lapack_int (*zgerfsx_work_t)( int matrix_order, char trans, char equed,
                                 lapack_int n, lapack_int nrhs,
                                 const lapack_complex_double* a, lapack_int lda,
                                 const lapack_complex_double* af,
                                 lapack_int ldaf, const lapack_int* ipiv,
                                 const double* r, const double* c,
                                 const lapack_complex_double* b, lapack_int ldb,
                                 lapack_complex_double* x, lapack_int ldx,
                                 double* rcond, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, lapack_complex_double* work,
                                 double* rwork );

typedef lapack_int (*sgerqf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                float* a, lapack_int lda, float* tau,
                                float* work, lapack_int lwork );
typedef lapack_int (*dgerqf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                double* a, lapack_int lda, double* tau,
                                double* work, lapack_int lwork );
typedef lapack_int (*cgerqf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zgerqf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*sgesdd_work_t)( int matrix_order, char jobz, lapack_int m,
                                lapack_int n, float* a, lapack_int lda,
                                float* s, float* u, lapack_int ldu, float* vt,
                                lapack_int ldvt, float* work, lapack_int lwork,
                                lapack_int* iwork );
typedef lapack_int (*dgesdd_work_t)( int matrix_order, char jobz, lapack_int m,
                                lapack_int n, double* a, lapack_int lda,
                                double* s, double* u, lapack_int ldu,
                                double* vt, lapack_int ldvt, double* work,
                                lapack_int lwork, lapack_int* iwork );
typedef lapack_int (*cgesdd_work_t)( int matrix_order, char jobz, lapack_int m,
                                lapack_int n, lapack_complex_float* a,
                                lapack_int lda, float* s,
                                lapack_complex_float* u, lapack_int ldu,
                                lapack_complex_float* vt, lapack_int ldvt,
                                lapack_complex_float* work, lapack_int lwork,
                                float* rwork, lapack_int* iwork );
typedef lapack_int (*zgesdd_work_t)( int matrix_order, char jobz, lapack_int m,
                                lapack_int n, lapack_complex_double* a,
                                lapack_int lda, double* s,
                                lapack_complex_double* u, lapack_int ldu,
                                lapack_complex_double* vt, lapack_int ldvt,
                                lapack_complex_double* work, lapack_int lwork,
                                double* rwork, lapack_int* iwork );

typedef lapack_int (*sgesv_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                               float* a, lapack_int lda, lapack_int* ipiv,
                               float* b, lapack_int ldb );
typedef lapack_int (*dgesv_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                               double* a, lapack_int lda, lapack_int* ipiv,
                               double* b, lapack_int ldb );
typedef lapack_int (*cgesv_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                               lapack_complex_float* a, lapack_int lda,
                               lapack_int* ipiv, lapack_complex_float* b,
                               lapack_int ldb );
typedef lapack_int (*zgesv_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                               lapack_complex_double* a, lapack_int lda,
                               lapack_int* ipiv, lapack_complex_double* b,
                               lapack_int ldb );
typedef lapack_int (*dsgesv_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                                double* a, lapack_int lda, lapack_int* ipiv,
                                double* b, lapack_int ldb, double* x,
                                lapack_int ldx, double* work, float* swork,
                                lapack_int* iter );
typedef lapack_int (*zcgesv_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_int* ipiv, lapack_complex_double* b,
                                lapack_int ldb, lapack_complex_double* x,
                                lapack_int ldx, lapack_complex_double* work,
                                lapack_complex_float* swork, double* rwork,
                                lapack_int* iter );

typedef lapack_int (*sgesvd_work_t)( int matrix_order, char jobu, char jobvt,
                                lapack_int m, lapack_int n, float* a,
                                lapack_int lda, float* s, float* u,
                                lapack_int ldu, float* vt, lapack_int ldvt,
                                float* work, lapack_int lwork );
typedef lapack_int (*dgesvd_work_t)( int matrix_order, char jobu, char jobvt,
                                lapack_int m, lapack_int n, double* a,
                                lapack_int lda, double* s, double* u,
                                lapack_int ldu, double* vt, lapack_int ldvt,
                                double* work, lapack_int lwork );
typedef lapack_int (*cgesvd_work_t)( int matrix_order, char jobu, char jobvt,
                                lapack_int m, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                float* s, lapack_complex_float* u,
                                lapack_int ldu, lapack_complex_float* vt,
                                lapack_int ldvt, lapack_complex_float* work,
                                lapack_int lwork, float* rwork );
typedef lapack_int (*zgesvd_work_t)( int matrix_order, char jobu, char jobvt,
                                lapack_int m, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                double* s, lapack_complex_double* u,
                                lapack_int ldu, lapack_complex_double* vt,
                                lapack_int ldvt, lapack_complex_double* work,
                                lapack_int lwork, double* rwork );

typedef lapack_int (*sgesvj_work_t)( int matrix_order, char joba, char jobu,
                                char jobv, lapack_int m, lapack_int n, float* a,
                                lapack_int lda, float* sva, lapack_int mv,
                                float* v, lapack_int ldv, float* work,
                                lapack_int lwork );
typedef lapack_int (*dgesvj_work_t)( int matrix_order, char joba, char jobu,
                                char jobv, lapack_int m, lapack_int n,
                                double* a, lapack_int lda, double* sva,
                                lapack_int mv, double* v, lapack_int ldv,
                                double* work, lapack_int lwork );

typedef lapack_int (*sgesvx_work_t)( int matrix_order, char fact, char trans,
                                lapack_int n, lapack_int nrhs, float* a,
                                lapack_int lda, float* af, lapack_int ldaf,
                                lapack_int* ipiv, char* equed, float* r,
                                float* c, float* b, lapack_int ldb, float* x,
                                lapack_int ldx, float* rcond, float* ferr,
                                float* berr, float* work, lapack_int* iwork );
typedef lapack_int (*dgesvx_work_t)( int matrix_order, char fact, char trans,
                                lapack_int n, lapack_int nrhs, double* a,
                                lapack_int lda, double* af, lapack_int ldaf,
                                lapack_int* ipiv, char* equed, double* r,
                                double* c, double* b, lapack_int ldb, double* x,
                                lapack_int ldx, double* rcond, double* ferr,
                                double* berr, double* work, lapack_int* iwork );
typedef lapack_int (*cgesvx_work_t)( int matrix_order, char fact, char trans,
                                lapack_int n, lapack_int nrhs,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* af, lapack_int ldaf,
                                lapack_int* ipiv, char* equed, float* r,
                                float* c, lapack_complex_float* b,
                                lapack_int ldb, lapack_complex_float* x,
                                lapack_int ldx, float* rcond, float* ferr,
                                float* berr, lapack_complex_float* work,
                                float* rwork );
typedef lapack_int (*zgesvx_work_t)( int matrix_order, char fact, char trans,
                                lapack_int n, lapack_int nrhs,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* af, lapack_int ldaf,
                                lapack_int* ipiv, char* equed, double* r,
                                double* c, lapack_complex_double* b,
                                lapack_int ldb, lapack_complex_double* x,
                                lapack_int ldx, double* rcond, double* ferr,
                                double* berr, lapack_complex_double* work,
                                double* rwork );

typedef lapack_int (*sgesvxx_work_t)( int matrix_order, char fact, char trans,
                                 lapack_int n, lapack_int nrhs, float* a,
                                 lapack_int lda, float* af, lapack_int ldaf,
                                 lapack_int* ipiv, char* equed, float* r,
                                 float* c, float* b, lapack_int ldb, float* x,
                                 lapack_int ldx, float* rcond, float* rpvgrw,
                                 float* berr, lapack_int n_err_bnds,
                                 float* err_bnds_norm, float* err_bnds_comp,
                                 lapack_int nparams, float* params, float* work,
                                 lapack_int* iwork );
typedef lapack_int (*dgesvxx_work_t)( int matrix_order, char fact, char trans,
                                 lapack_int n, lapack_int nrhs, double* a,
                                 lapack_int lda, double* af, lapack_int ldaf,
                                 lapack_int* ipiv, char* equed, double* r,
                                 double* c, double* b, lapack_int ldb,
                                 double* x, lapack_int ldx, double* rcond,
                                 double* rpvgrw, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, double* work,
                                 lapack_int* iwork );
typedef lapack_int (*cgesvxx_work_t)( int matrix_order, char fact, char trans,
                                 lapack_int n, lapack_int nrhs,
                                 lapack_complex_float* a, lapack_int lda,
                                 lapack_complex_float* af, lapack_int ldaf,
                                 lapack_int* ipiv, char* equed, float* r,
                                 float* c, lapack_complex_float* b,
                                 lapack_int ldb, lapack_complex_float* x,
                                 lapack_int ldx, float* rcond, float* rpvgrw,
                                 float* berr, lapack_int n_err_bnds,
                                 float* err_bnds_norm, float* err_bnds_comp,
                                 lapack_int nparams, float* params,
                                 lapack_complex_float* work, float* rwork );
typedef lapack_int (*zgesvxx_work_t)( int matrix_order, char fact, char trans,
                                 lapack_int n, lapack_int nrhs,
                                 lapack_complex_double* a, lapack_int lda,
                                 lapack_complex_double* af, lapack_int ldaf,
                                 lapack_int* ipiv, char* equed, double* r,
                                 double* c, lapack_complex_double* b,
                                 lapack_int ldb, lapack_complex_double* x,
                                 lapack_int ldx, double* rcond, double* rpvgrw,
                                 double* berr, lapack_int n_err_bnds,
                                 double* err_bnds_norm, double* err_bnds_comp,
                                 lapack_int nparams, double* params,
                                 lapack_complex_double* work, double* rwork );

typedef lapack_int (*sgetf2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                float* a, lapack_int lda, lapack_int* ipiv );
typedef lapack_int (*dgetf2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                double* a, lapack_int lda, lapack_int* ipiv );
typedef lapack_int (*cgetf2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_int* ipiv );
typedef lapack_int (*zgetf2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_int* ipiv );

typedef lapack_int (*sgetrf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                float* a, lapack_int lda, lapack_int* ipiv );
typedef lapack_int (*dgetrf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                double* a, lapack_int lda, lapack_int* ipiv );
typedef lapack_int (*cgetrf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_int* ipiv );
typedef lapack_int (*zgetrf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_int* ipiv );

typedef lapack_int (*sgetri_work_t)( int matrix_order, lapack_int n, float* a,
                                lapack_int lda, const lapack_int* ipiv,
                                float* work, lapack_int lwork );
typedef lapack_int (*dgetri_work_t)( int matrix_order, lapack_int n, double* a,
                                lapack_int lda, const lapack_int* ipiv,
                                double* work, lapack_int lwork );
typedef lapack_int (*cgetri_work_t)( int matrix_order, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                const lapack_int* ipiv,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zgetri_work_t)( int matrix_order, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                const lapack_int* ipiv,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*sgetrs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs, const float* a, lapack_int lda,
                                const lapack_int* ipiv, float* b,
                                lapack_int ldb );
typedef lapack_int (*dgetrs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs, const double* a,
                                lapack_int lda, const lapack_int* ipiv,
                                double* b, lapack_int ldb );
typedef lapack_int (*cgetrs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* a,
                                lapack_int lda, const lapack_int* ipiv,
                                lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zgetrs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs, const lapack_complex_double* a,
                                lapack_int lda, const lapack_int* ipiv,
                                lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*sggbak_work_t)( int matrix_order, char job, char side,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                const float* lscale, const float* rscale,
                                lapack_int m, float* v, lapack_int ldv );
typedef lapack_int (*dggbak_work_t)( int matrix_order, char job, char side,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                const double* lscale, const double* rscale,
                                lapack_int m, double* v, lapack_int ldv );
typedef lapack_int (*cggbak_work_t)( int matrix_order, char job, char side,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                const float* lscale, const float* rscale,
                                lapack_int m, lapack_complex_float* v,
                                lapack_int ldv );
typedef lapack_int (*zggbak_work_t)( int matrix_order, char job, char side,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                const double* lscale, const double* rscale,
                                lapack_int m, lapack_complex_double* v,
                                lapack_int ldv );

typedef lapack_int (*sggbal_work_t)( int matrix_order, char job, lapack_int n,
                                float* a, lapack_int lda, float* b,
                                lapack_int ldb, lapack_int* ilo,
                                lapack_int* ihi, float* lscale, float* rscale,
                                float* work );
typedef lapack_int (*dggbal_work_t)( int matrix_order, char job, lapack_int n,
                                double* a, lapack_int lda, double* b,
                                lapack_int ldb, lapack_int* ilo,
                                lapack_int* ihi, double* lscale, double* rscale,
                                double* work );
typedef lapack_int (*cggbal_work_t)( int matrix_order, char job, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* b, lapack_int ldb,
                                lapack_int* ilo, lapack_int* ihi, float* lscale,
                                float* rscale, float* work );
typedef lapack_int (*zggbal_work_t)( int matrix_order, char job, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* b, lapack_int ldb,
                                lapack_int* ilo, lapack_int* ihi,
                                double* lscale, double* rscale, double* work );

typedef lapack_int (*sgges_work_t)( int matrix_order, char jobvsl, char jobvsr,
                               char sort, LAPACK_S_SELECT3 selctg, lapack_int n,
                               float* a, lapack_int lda, float* b,
                               lapack_int ldb, lapack_int* sdim, float* alphar,
                               float* alphai, float* beta, float* vsl,
                               lapack_int ldvsl, float* vsr, lapack_int ldvsr,
                               float* work, lapack_int lwork,
                               lapack_logical* bwork );
typedef lapack_int (*dgges_work_t)( int matrix_order, char jobvsl, char jobvsr,
                               char sort, LAPACK_D_SELECT3 selctg, lapack_int n,
                               double* a, lapack_int lda, double* b,
                               lapack_int ldb, lapack_int* sdim, double* alphar,
                               double* alphai, double* beta, double* vsl,
                               lapack_int ldvsl, double* vsr, lapack_int ldvsr,
                               double* work, lapack_int lwork,
                               lapack_logical* bwork );
typedef lapack_int (*cgges_work_t)( int matrix_order, char jobvsl, char jobvsr,
                               char sort, LAPACK_C_SELECT2 selctg, lapack_int n,
                               lapack_complex_float* a, lapack_int lda,
                               lapack_complex_float* b, lapack_int ldb,
                               lapack_int* sdim, lapack_complex_float* alpha,
                               lapack_complex_float* beta,
                               lapack_complex_float* vsl, lapack_int ldvsl,
                               lapack_complex_float* vsr, lapack_int ldvsr,
                               lapack_complex_float* work, lapack_int lwork,
                               float* rwork, lapack_logical* bwork );
typedef lapack_int (*zgges_work_t)( int matrix_order, char jobvsl, char jobvsr,
                               char sort, LAPACK_Z_SELECT2 selctg, lapack_int n,
                               lapack_complex_double* a, lapack_int lda,
                               lapack_complex_double* b, lapack_int ldb,
                               lapack_int* sdim, lapack_complex_double* alpha,
                               lapack_complex_double* beta,
                               lapack_complex_double* vsl, lapack_int ldvsl,
                               lapack_complex_double* vsr, lapack_int ldvsr,
                               lapack_complex_double* work, lapack_int lwork,
                               double* rwork, lapack_logical* bwork );

typedef lapack_int (*sggesx_work_t)( int matrix_order, char jobvsl, char jobvsr,
                                char sort, LAPACK_S_SELECT3 selctg, char sense,
                                lapack_int n, float* a, lapack_int lda,
                                float* b, lapack_int ldb, lapack_int* sdim,
                                float* alphar, float* alphai, float* beta,
                                float* vsl, lapack_int ldvsl, float* vsr,
                                lapack_int ldvsr, float* rconde, float* rcondv,
                                float* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork,
                                lapack_logical* bwork );
typedef lapack_int (*dggesx_work_t)( int matrix_order, char jobvsl, char jobvsr,
                                char sort, LAPACK_D_SELECT3 selctg, char sense,
                                lapack_int n, double* a, lapack_int lda,
                                double* b, lapack_int ldb, lapack_int* sdim,
                                double* alphar, double* alphai, double* beta,
                                double* vsl, lapack_int ldvsl, double* vsr,
                                lapack_int ldvsr, double* rconde,
                                double* rcondv, double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork,
                                lapack_logical* bwork );
typedef lapack_int (*cggesx_work_t)( int matrix_order, char jobvsl, char jobvsr,
                                char sort, LAPACK_C_SELECT2 selctg, char sense,
                                lapack_int n, lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* b,
                                lapack_int ldb, lapack_int* sdim,
                                lapack_complex_float* alpha,
                                lapack_complex_float* beta,
                                lapack_complex_float* vsl, lapack_int ldvsl,
                                lapack_complex_float* vsr, lapack_int ldvsr,
                                float* rconde, float* rcondv,
                                lapack_complex_float* work, lapack_int lwork,
                                float* rwork, lapack_int* iwork,
                                lapack_int liwork, lapack_logical* bwork );
typedef lapack_int (*zggesx_work_t)( int matrix_order, char jobvsl, char jobvsr,
                                char sort, LAPACK_Z_SELECT2 selctg, char sense,
                                lapack_int n, lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* b,
                                lapack_int ldb, lapack_int* sdim,
                                lapack_complex_double* alpha,
                                lapack_complex_double* beta,
                                lapack_complex_double* vsl, lapack_int ldvsl,
                                lapack_complex_double* vsr, lapack_int ldvsr,
                                double* rconde, double* rcondv,
                                lapack_complex_double* work, lapack_int lwork,
                                double* rwork, lapack_int* iwork,
                                lapack_int liwork, lapack_logical* bwork );

typedef lapack_int (*sggev_work_t)( int matrix_order, char jobvl, char jobvr,
                               lapack_int n, float* a, lapack_int lda, float* b,
                               lapack_int ldb, float* alphar, float* alphai,
                               float* beta, float* vl, lapack_int ldvl,
                               float* vr, lapack_int ldvr, float* work,
                               lapack_int lwork );
typedef lapack_int (*dggev_work_t)( int matrix_order, char jobvl, char jobvr,
                               lapack_int n, double* a, lapack_int lda,
                               double* b, lapack_int ldb, double* alphar,
                               double* alphai, double* beta, double* vl,
                               lapack_int ldvl, double* vr, lapack_int ldvr,
                               double* work, lapack_int lwork );
typedef lapack_int (*cggev_work_t)( int matrix_order, char jobvl, char jobvr,
                               lapack_int n, lapack_complex_float* a,
                               lapack_int lda, lapack_complex_float* b,
                               lapack_int ldb, lapack_complex_float* alpha,
                               lapack_complex_float* beta,
                               lapack_complex_float* vl, lapack_int ldvl,
                               lapack_complex_float* vr, lapack_int ldvr,
                               lapack_complex_float* work, lapack_int lwork,
                               float* rwork );
typedef lapack_int (*zggev_work_t)( int matrix_order, char jobvl, char jobvr,
                               lapack_int n, lapack_complex_double* a,
                               lapack_int lda, lapack_complex_double* b,
                               lapack_int ldb, lapack_complex_double* alpha,
                               lapack_complex_double* beta,
                               lapack_complex_double* vl, lapack_int ldvl,
                               lapack_complex_double* vr, lapack_int ldvr,
                               lapack_complex_double* work, lapack_int lwork,
                               double* rwork );

typedef lapack_int (*sggevx_work_t)( int matrix_order, char balanc, char jobvl,
                                char jobvr, char sense, lapack_int n, float* a,
                                lapack_int lda, float* b, lapack_int ldb,
                                float* alphar, float* alphai, float* beta,
                                float* vl, lapack_int ldvl, float* vr,
                                lapack_int ldvr, lapack_int* ilo,
                                lapack_int* ihi, float* lscale, float* rscale,
                                float* abnrm, float* bbnrm, float* rconde,
                                float* rcondv, float* work, lapack_int lwork,
                                lapack_int* iwork, lapack_logical* bwork );
typedef lapack_int (*dggevx_work_t)( int matrix_order, char balanc, char jobvl,
                                char jobvr, char sense, lapack_int n, double* a,
                                lapack_int lda, double* b, lapack_int ldb,
                                double* alphar, double* alphai, double* beta,
                                double* vl, lapack_int ldvl, double* vr,
                                lapack_int ldvr, lapack_int* ilo,
                                lapack_int* ihi, double* lscale, double* rscale,
                                double* abnrm, double* bbnrm, double* rconde,
                                double* rcondv, double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_logical* bwork );
typedef lapack_int (*cggevx_work_t)( int matrix_order, char balanc, char jobvl,
                                char jobvr, char sense, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* alpha,
                                lapack_complex_float* beta,
                                lapack_complex_float* vl, lapack_int ldvl,
                                lapack_complex_float* vr, lapack_int ldvr,
                                lapack_int* ilo, lapack_int* ihi, float* lscale,
                                float* rscale, float* abnrm, float* bbnrm,
                                float* rconde, float* rcondv,
                                lapack_complex_float* work, lapack_int lwork,
                                float* rwork, lapack_int* iwork,
                                lapack_logical* bwork );
typedef lapack_int (*zggevx_work_t)( int matrix_order, char balanc, char jobvl,
                                char jobvr, char sense, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* alpha,
                                lapack_complex_double* beta,
                                lapack_complex_double* vl, lapack_int ldvl,
                                lapack_complex_double* vr, lapack_int ldvr,
                                lapack_int* ilo, lapack_int* ihi,
                                double* lscale, double* rscale, double* abnrm,
                                double* bbnrm, double* rconde, double* rcondv,
                                lapack_complex_double* work, lapack_int lwork,
                                double* rwork, lapack_int* iwork,
                                lapack_logical* bwork );

typedef lapack_int (*sggglm_work_t)( int matrix_order, lapack_int n, lapack_int m,
                                lapack_int p, float* a, lapack_int lda,
                                float* b, lapack_int ldb, float* d, float* x,
                                float* y, float* work, lapack_int lwork );
typedef lapack_int (*dggglm_work_t)( int matrix_order, lapack_int n, lapack_int m,
                                lapack_int p, double* a, lapack_int lda,
                                double* b, lapack_int ldb, double* d, double* x,
                                double* y, double* work, lapack_int lwork );
typedef lapack_int (*cggglm_work_t)( int matrix_order, lapack_int n, lapack_int m,
                                lapack_int p, lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* b,
                                lapack_int ldb, lapack_complex_float* d,
                                lapack_complex_float* x,
                                lapack_complex_float* y,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zggglm_work_t)( int matrix_order, lapack_int n, lapack_int m,
                                lapack_int p, lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* b,
                                lapack_int ldb, lapack_complex_double* d,
                                lapack_complex_double* x,
                                lapack_complex_double* y,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*sgghrd_work_t)( int matrix_order, char compq, char compz,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                float* a, lapack_int lda, float* b,
                                lapack_int ldb, float* q, lapack_int ldq,
                                float* z, lapack_int ldz );
typedef lapack_int (*dgghrd_work_t)( int matrix_order, char compq, char compz,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                double* a, lapack_int lda, double* b,
                                lapack_int ldb, double* q, lapack_int ldq,
                                double* z, lapack_int ldz );
typedef lapack_int (*cgghrd_work_t)( int matrix_order, char compq, char compz,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* q, lapack_int ldq,
                                lapack_complex_float* z, lapack_int ldz );
typedef lapack_int (*zgghrd_work_t)( int matrix_order, char compq, char compz,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* q, lapack_int ldq,
                                lapack_complex_double* z, lapack_int ldz );

typedef lapack_int (*sgglse_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int p, float* a, lapack_int lda,
                                float* b, lapack_int ldb, float* c, float* d,
                                float* x, float* work, lapack_int lwork );
typedef lapack_int (*dgglse_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int p, double* a, lapack_int lda,
                                double* b, lapack_int ldb, double* c, double* d,
                                double* x, double* work, lapack_int lwork );
typedef lapack_int (*cgglse_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int p, lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* b,
                                lapack_int ldb, lapack_complex_float* c,
                                lapack_complex_float* d,
                                lapack_complex_float* x,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zgglse_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int p, lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* b,
                                lapack_int ldb, lapack_complex_double* c,
                                lapack_complex_double* d,
                                lapack_complex_double* x,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*sggqrf_work_t)( int matrix_order, lapack_int n, lapack_int m,
                                lapack_int p, float* a, lapack_int lda,
                                float* taua, float* b, lapack_int ldb,
                                float* taub, float* work, lapack_int lwork );
typedef lapack_int (*dggqrf_work_t)( int matrix_order, lapack_int n, lapack_int m,
                                lapack_int p, double* a, lapack_int lda,
                                double* taua, double* b, lapack_int ldb,
                                double* taub, double* work, lapack_int lwork );
typedef lapack_int (*cggqrf_work_t)( int matrix_order, lapack_int n, lapack_int m,
                                lapack_int p, lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* taua,
                                lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* taub,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zggqrf_work_t)( int matrix_order, lapack_int n, lapack_int m,
                                lapack_int p, lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* taua,
                                lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* taub,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*sggrqf_work_t)( int matrix_order, lapack_int m, lapack_int p,
                                lapack_int n, float* a, lapack_int lda,
                                float* taua, float* b, lapack_int ldb,
                                float* taub, float* work, lapack_int lwork );
typedef lapack_int (*dggrqf_work_t)( int matrix_order, lapack_int m, lapack_int p,
                                lapack_int n, double* a, lapack_int lda,
                                double* taua, double* b, lapack_int ldb,
                                double* taub, double* work, lapack_int lwork );
typedef lapack_int (*cggrqf_work_t)( int matrix_order, lapack_int m, lapack_int p,
                                lapack_int n, lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* taua,
                                lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* taub,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zggrqf_work_t)( int matrix_order, lapack_int m, lapack_int p,
                                lapack_int n, lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* taua,
                                lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* taub,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*sggsvd_work_t)( int matrix_order, char jobu, char jobv,
                                char jobq, lapack_int m, lapack_int n,
                                lapack_int p, lapack_int* k, lapack_int* l,
                                float* a, lapack_int lda, float* b,
                                lapack_int ldb, float* alpha, float* beta,
                                float* u, lapack_int ldu, float* v,
                                lapack_int ldv, float* q, lapack_int ldq,
                                float* work, lapack_int* iwork );
typedef lapack_int (*dggsvd_work_t)( int matrix_order, char jobu, char jobv,
                                char jobq, lapack_int m, lapack_int n,
                                lapack_int p, lapack_int* k, lapack_int* l,
                                double* a, lapack_int lda, double* b,
                                lapack_int ldb, double* alpha, double* beta,
                                double* u, lapack_int ldu, double* v,
                                lapack_int ldv, double* q, lapack_int ldq,
                                double* work, lapack_int* iwork );
typedef lapack_int (*cggsvd_work_t)( int matrix_order, char jobu, char jobv,
                                char jobq, lapack_int m, lapack_int n,
                                lapack_int p, lapack_int* k, lapack_int* l,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* b, lapack_int ldb,
                                float* alpha, float* beta,
                                lapack_complex_float* u, lapack_int ldu,
                                lapack_complex_float* v, lapack_int ldv,
                                lapack_complex_float* q, lapack_int ldq,
                                lapack_complex_float* work, float* rwork,
                                lapack_int* iwork );
typedef lapack_int (*zggsvd_work_t)( int matrix_order, char jobu, char jobv,
                                char jobq, lapack_int m, lapack_int n,
                                lapack_int p, lapack_int* k, lapack_int* l,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* b, lapack_int ldb,
                                double* alpha, double* beta,
                                lapack_complex_double* u, lapack_int ldu,
                                lapack_complex_double* v, lapack_int ldv,
                                lapack_complex_double* q, lapack_int ldq,
                                lapack_complex_double* work, double* rwork,
                                lapack_int* iwork );

typedef lapack_int (*sggsvp_work_t)( int matrix_order, char jobu, char jobv,
                                char jobq, lapack_int m, lapack_int p,
                                lapack_int n, float* a, lapack_int lda,
                                float* b, lapack_int ldb, float tola,
                                float tolb, lapack_int* k, lapack_int* l,
                                float* u, lapack_int ldu, float* v,
                                lapack_int ldv, float* q, lapack_int ldq,
                                lapack_int* iwork, float* tau, float* work );
typedef lapack_int (*dggsvp_work_t)( int matrix_order, char jobu, char jobv,
                                char jobq, lapack_int m, lapack_int p,
                                lapack_int n, double* a, lapack_int lda,
                                double* b, lapack_int ldb, double tola,
                                double tolb, lapack_int* k, lapack_int* l,
                                double* u, lapack_int ldu, double* v,
                                lapack_int ldv, double* q, lapack_int ldq,
                                lapack_int* iwork, double* tau, double* work );
typedef lapack_int (*cggsvp_work_t)( int matrix_order, char jobu, char jobv,
                                char jobq, lapack_int m, lapack_int p,
                                lapack_int n, lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* b,
                                lapack_int ldb, float tola, float tolb,
                                lapack_int* k, lapack_int* l,
                                lapack_complex_float* u, lapack_int ldu,
                                lapack_complex_float* v, lapack_int ldv,
                                lapack_complex_float* q, lapack_int ldq,
                                lapack_int* iwork, float* rwork,
                                lapack_complex_float* tau,
                                lapack_complex_float* work );
typedef lapack_int (*zggsvp_work_t)( int matrix_order, char jobu, char jobv,
                                char jobq, lapack_int m, lapack_int p,
                                lapack_int n, lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* b,
                                lapack_int ldb, double tola, double tolb,
                                lapack_int* k, lapack_int* l,
                                lapack_complex_double* u, lapack_int ldu,
                                lapack_complex_double* v, lapack_int ldv,
                                lapack_complex_double* q, lapack_int ldq,
                                lapack_int* iwork, double* rwork,
                                lapack_complex_double* tau,
                                lapack_complex_double* work );

typedef lapack_int (*sgtcon_work_t)( char norm, lapack_int n, const float* dl,
                                const float* d, const float* du,
                                const float* du2, const lapack_int* ipiv,
                                float anorm, float* rcond, float* work,
                                lapack_int* iwork );
typedef lapack_int (*dgtcon_work_t)( char norm, lapack_int n, const double* dl,
                                const double* d, const double* du,
                                const double* du2, const lapack_int* ipiv,
                                double anorm, double* rcond, double* work,
                                lapack_int* iwork );
typedef lapack_int (*cgtcon_work_t)( char norm, lapack_int n,
                                const lapack_complex_float* dl,
                                const lapack_complex_float* d,
                                const lapack_complex_float* du,
                                const lapack_complex_float* du2,
                                const lapack_int* ipiv, float anorm,
                                float* rcond, lapack_complex_float* work );
typedef lapack_int (*zgtcon_work_t)( char norm, lapack_int n,
                                const lapack_complex_double* dl,
                                const lapack_complex_double* d,
                                const lapack_complex_double* du,
                                const lapack_complex_double* du2,
                                const lapack_int* ipiv, double anorm,
                                double* rcond, lapack_complex_double* work );

typedef lapack_int (*sgtrfs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs, const float* dl,
                                const float* d, const float* du,
                                const float* dlf, const float* df,
                                const float* duf, const float* du2,
                                const lapack_int* ipiv, const float* b,
                                lapack_int ldb, float* x, lapack_int ldx,
                                float* ferr, float* berr, float* work,
                                lapack_int* iwork );
typedef lapack_int (*dgtrfs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs, const double* dl,
                                const double* d, const double* du,
                                const double* dlf, const double* df,
                                const double* duf, const double* du2,
                                const lapack_int* ipiv, const double* b,
                                lapack_int ldb, double* x, lapack_int ldx,
                                double* ferr, double* berr, double* work,
                                lapack_int* iwork );
typedef lapack_int (*cgtrfs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* dl,
                                const lapack_complex_float* d,
                                const lapack_complex_float* du,
                                const lapack_complex_float* dlf,
                                const lapack_complex_float* df,
                                const lapack_complex_float* duf,
                                const lapack_complex_float* du2,
                                const lapack_int* ipiv,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* x, lapack_int ldx,
                                float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zgtrfs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs,
                                const lapack_complex_double* dl,
                                const lapack_complex_double* d,
                                const lapack_complex_double* du,
                                const lapack_complex_double* dlf,
                                const lapack_complex_double* df,
                                const lapack_complex_double* duf,
                                const lapack_complex_double* du2,
                                const lapack_int* ipiv,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*sgtsv_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                               float* dl, float* d, float* du, float* b,
                               lapack_int ldb );
typedef lapack_int (*dgtsv_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                               double* dl, double* d, double* du, double* b,
                               lapack_int ldb );
typedef lapack_int (*cgtsv_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                               lapack_complex_float* dl,
                               lapack_complex_float* d,
                               lapack_complex_float* du,
                               lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zgtsv_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                               lapack_complex_double* dl,
                               lapack_complex_double* d,
                               lapack_complex_double* du,
                               lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*sgtsvx_work_t)( int matrix_order, char fact, char trans,
                                lapack_int n, lapack_int nrhs, const float* dl,
                                const float* d, const float* du, float* dlf,
                                float* df, float* duf, float* du2,
                                lapack_int* ipiv, const float* b,
                                lapack_int ldb, float* x, lapack_int ldx,
                                float* rcond, float* ferr, float* berr,
                                float* work, lapack_int* iwork );
typedef lapack_int (*dgtsvx_work_t)( int matrix_order, char fact, char trans,
                                lapack_int n, lapack_int nrhs, const double* dl,
                                const double* d, const double* du, double* dlf,
                                double* df, double* duf, double* du2,
                                lapack_int* ipiv, const double* b,
                                lapack_int ldb, double* x, lapack_int ldx,
                                double* rcond, double* ferr, double* berr,
                                double* work, lapack_int* iwork );
typedef lapack_int (*cgtsvx_work_t)( int matrix_order, char fact, char trans,
                                lapack_int n, lapack_int nrhs,
                                const lapack_complex_float* dl,
                                const lapack_complex_float* d,
                                const lapack_complex_float* du,
                                lapack_complex_float* dlf,
                                lapack_complex_float* df,
                                lapack_complex_float* duf,
                                lapack_complex_float* du2, lapack_int* ipiv,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* x, lapack_int ldx,
                                float* rcond, float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zgtsvx_work_t)( int matrix_order, char fact, char trans,
                                lapack_int n, lapack_int nrhs,
                                const lapack_complex_double* dl,
                                const lapack_complex_double* d,
                                const lapack_complex_double* du,
                                lapack_complex_double* dlf,
                                lapack_complex_double* df,
                                lapack_complex_double* duf,
                                lapack_complex_double* du2, lapack_int* ipiv,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* rcond, double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*sgttrf_work_t)( lapack_int n, float* dl, float* d, float* du,
                                float* du2, lapack_int* ipiv );
typedef lapack_int (*dgttrf_work_t)( lapack_int n, double* dl, double* d, double* du,
                                double* du2, lapack_int* ipiv );
typedef lapack_int (*cgttrf_work_t)( lapack_int n, lapack_complex_float* dl,
                                lapack_complex_float* d,
                                lapack_complex_float* du,
                                lapack_complex_float* du2, lapack_int* ipiv );
typedef lapack_int (*zgttrf_work_t)( lapack_int n, lapack_complex_double* dl,
                                lapack_complex_double* d,
                                lapack_complex_double* du,
                                lapack_complex_double* du2, lapack_int* ipiv );

typedef lapack_int (*sgttrs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs, const float* dl,
                                const float* d, const float* du,
                                const float* du2, const lapack_int* ipiv,
                                float* b, lapack_int ldb );
typedef lapack_int (*dgttrs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs, const double* dl,
                                const double* d, const double* du,
                                const double* du2, const lapack_int* ipiv,
                                double* b, lapack_int ldb );
typedef lapack_int (*cgttrs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* dl,
                                const lapack_complex_float* d,
                                const lapack_complex_float* du,
                                const lapack_complex_float* du2,
                                const lapack_int* ipiv, lapack_complex_float* b,
                                lapack_int ldb );
typedef lapack_int (*zgttrs_work_t)( int matrix_order, char trans, lapack_int n,
                                lapack_int nrhs,
                                const lapack_complex_double* dl,
                                const lapack_complex_double* d,
                                const lapack_complex_double* du,
                                const lapack_complex_double* du2,
                                const lapack_int* ipiv,
                                lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*chbev_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, lapack_int kd,
                               lapack_complex_float* ab, lapack_int ldab,
                               float* w, lapack_complex_float* z,
                               lapack_int ldz, lapack_complex_float* work,
                               float* rwork );
typedef lapack_int (*zhbev_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, lapack_int kd,
                               lapack_complex_double* ab, lapack_int ldab,
                               double* w, lapack_complex_double* z,
                               lapack_int ldz, lapack_complex_double* work,
                               double* rwork );

typedef lapack_int (*chbevd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, lapack_int kd,
                                lapack_complex_float* ab, lapack_int ldab,
                                float* w, lapack_complex_float* z,
                                lapack_int ldz, lapack_complex_float* work,
                                lapack_int lwork, float* rwork,
                                lapack_int lrwork, lapack_int* iwork,
                                lapack_int liwork );
typedef lapack_int (*zhbevd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, lapack_int kd,
                                lapack_complex_double* ab, lapack_int ldab,
                                double* w, lapack_complex_double* z,
                                lapack_int ldz, lapack_complex_double* work,
                                lapack_int lwork, double* rwork,
                                lapack_int lrwork, lapack_int* iwork,
                                lapack_int liwork );

typedef lapack_int (*chbevx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n, lapack_int kd,
                                lapack_complex_float* ab, lapack_int ldab,
                                lapack_complex_float* q, lapack_int ldq,
                                float vl, float vu, lapack_int il,
                                lapack_int iu, float abstol, lapack_int* m,
                                float* w, lapack_complex_float* z,
                                lapack_int ldz, lapack_complex_float* work,
                                float* rwork, lapack_int* iwork,
                                lapack_int* ifail );
typedef lapack_int (*zhbevx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n, lapack_int kd,
                                lapack_complex_double* ab, lapack_int ldab,
                                lapack_complex_double* q, lapack_int ldq,
                                double vl, double vu, lapack_int il,
                                lapack_int iu, double abstol, lapack_int* m,
                                double* w, lapack_complex_double* z,
                                lapack_int ldz, lapack_complex_double* work,
                                double* rwork, lapack_int* iwork,
                                lapack_int* ifail );

typedef lapack_int (*chbgst_work_t)( int matrix_order, char vect, char uplo,
                                lapack_int n, lapack_int ka, lapack_int kb,
                                lapack_complex_float* ab, lapack_int ldab,
                                const lapack_complex_float* bb, lapack_int ldbb,
                                lapack_complex_float* x, lapack_int ldx,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zhbgst_work_t)( int matrix_order, char vect, char uplo,
                                lapack_int n, lapack_int ka, lapack_int kb,
                                lapack_complex_double* ab, lapack_int ldab,
                                const lapack_complex_double* bb,
                                lapack_int ldbb, lapack_complex_double* x,
                                lapack_int ldx, lapack_complex_double* work,
                                double* rwork );

typedef lapack_int (*chbgv_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, lapack_int ka, lapack_int kb,
                               lapack_complex_float* ab, lapack_int ldab,
                               lapack_complex_float* bb, lapack_int ldbb,
                               float* w, lapack_complex_float* z,
                               lapack_int ldz, lapack_complex_float* work,
                               float* rwork );
typedef lapack_int (*zhbgv_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, lapack_int ka, lapack_int kb,
                               lapack_complex_double* ab, lapack_int ldab,
                               lapack_complex_double* bb, lapack_int ldbb,
                               double* w, lapack_complex_double* z,
                               lapack_int ldz, lapack_complex_double* work,
                               double* rwork );

typedef lapack_int (*chbgvd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, lapack_int ka, lapack_int kb,
                                lapack_complex_float* ab, lapack_int ldab,
                                lapack_complex_float* bb, lapack_int ldbb,
                                float* w, lapack_complex_float* z,
                                lapack_int ldz, lapack_complex_float* work,
                                lapack_int lwork, float* rwork,
                                lapack_int lrwork, lapack_int* iwork,
                                lapack_int liwork );
typedef lapack_int (*zhbgvd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, lapack_int ka, lapack_int kb,
                                lapack_complex_double* ab, lapack_int ldab,
                                lapack_complex_double* bb, lapack_int ldbb,
                                double* w, lapack_complex_double* z,
                                lapack_int ldz, lapack_complex_double* work,
                                lapack_int lwork, double* rwork,
                                lapack_int lrwork, lapack_int* iwork,
                                lapack_int liwork );

typedef lapack_int (*chbgvx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n, lapack_int ka,
                                lapack_int kb, lapack_complex_float* ab,
                                lapack_int ldab, lapack_complex_float* bb,
                                lapack_int ldbb, lapack_complex_float* q,
                                lapack_int ldq, float vl, float vu,
                                lapack_int il, lapack_int iu, float abstol,
                                lapack_int* m, float* w,
                                lapack_complex_float* z, lapack_int ldz,
                                lapack_complex_float* work, float* rwork,
                                lapack_int* iwork, lapack_int* ifail );
typedef lapack_int (*zhbgvx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n, lapack_int ka,
                                lapack_int kb, lapack_complex_double* ab,
                                lapack_int ldab, lapack_complex_double* bb,
                                lapack_int ldbb, lapack_complex_double* q,
                                lapack_int ldq, double vl, double vu,
                                lapack_int il, lapack_int iu, double abstol,
                                lapack_int* m, double* w,
                                lapack_complex_double* z, lapack_int ldz,
                                lapack_complex_double* work, double* rwork,
                                lapack_int* iwork, lapack_int* ifail );

typedef lapack_int (*chbtrd_work_t)( int matrix_order, char vect, char uplo,
                                lapack_int n, lapack_int kd,
                                lapack_complex_float* ab, lapack_int ldab,
                                float* d, float* e, lapack_complex_float* q,
                                lapack_int ldq, lapack_complex_float* work );
typedef lapack_int (*zhbtrd_work_t)( int matrix_order, char vect, char uplo,
                                lapack_int n, lapack_int kd,
                                lapack_complex_double* ab, lapack_int ldab,
                                double* d, double* e, lapack_complex_double* q,
                                lapack_int ldq, lapack_complex_double* work );

typedef lapack_int (*checon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_float* a, lapack_int lda,
                                const lapack_int* ipiv, float anorm,
                                float* rcond, lapack_complex_float* work );
typedef lapack_int (*zhecon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_double* a, lapack_int lda,
                                const lapack_int* ipiv, double anorm,
                                double* rcond, lapack_complex_double* work );

typedef lapack_int (*cheequb_work_t)( int matrix_order, char uplo, lapack_int n,
                                 const lapack_complex_float* a, lapack_int lda,
                                 float* s, float* scond, float* amax,
                                 lapack_complex_float* work );
typedef lapack_int (*zheequb_work_t)( int matrix_order, char uplo, lapack_int n,
                                 const lapack_complex_double* a, lapack_int lda,
                                 double* s, double* scond, double* amax,
                                 lapack_complex_double* work );

typedef lapack_int (*cheev_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, lapack_complex_float* a,
                               lapack_int lda, float* w,
                               lapack_complex_float* work, lapack_int lwork,
                               float* rwork );
typedef lapack_int (*zheev_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, lapack_complex_double* a,
                               lapack_int lda, double* w,
                               lapack_complex_double* work, lapack_int lwork,
                               double* rwork );

typedef lapack_int (*cheevd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, lapack_complex_float* a,
                                lapack_int lda, float* w,
                                lapack_complex_float* work, lapack_int lwork,
                                float* rwork, lapack_int lrwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*zheevd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, lapack_complex_double* a,
                                lapack_int lda, double* w,
                                lapack_complex_double* work, lapack_int lwork,
                                double* rwork, lapack_int lrwork,
                                lapack_int* iwork, lapack_int liwork );

typedef lapack_int (*cheevr_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                float vl, float vu, lapack_int il,
                                lapack_int iu, float abstol, lapack_int* m,
                                float* w, lapack_complex_float* z,
                                lapack_int ldz, lapack_int* isuppz,
                                lapack_complex_float* work, lapack_int lwork,
                                float* rwork, lapack_int lrwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*zheevr_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                double vl, double vu, lapack_int il,
                                lapack_int iu, double abstol, lapack_int* m,
                                double* w, lapack_complex_double* z,
                                lapack_int ldz, lapack_int* isuppz,
                                lapack_complex_double* work, lapack_int lwork,
                                double* rwork, lapack_int lrwork,
                                lapack_int* iwork, lapack_int liwork );

typedef lapack_int (*cheevx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                float vl, float vu, lapack_int il,
                                lapack_int iu, float abstol, lapack_int* m,
                                float* w, lapack_complex_float* z,
                                lapack_int ldz, lapack_complex_float* work,
                                lapack_int lwork, float* rwork,
                                lapack_int* iwork, lapack_int* ifail );
typedef lapack_int (*zheevx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                double vl, double vu, lapack_int il,
                                lapack_int iu, double abstol, lapack_int* m,
                                double* w, lapack_complex_double* z,
                                lapack_int ldz, lapack_complex_double* work,
                                lapack_int lwork, double* rwork,
                                lapack_int* iwork, lapack_int* ifail );

typedef lapack_int (*chegst_work_t)( int matrix_order, lapack_int itype, char uplo,
                                lapack_int n, lapack_complex_float* a,
                                lapack_int lda, const lapack_complex_float* b,
                                lapack_int ldb );
typedef lapack_int (*zhegst_work_t)( int matrix_order, lapack_int itype, char uplo,
                                lapack_int n, lapack_complex_double* a,
                                lapack_int lda, const lapack_complex_double* b,
                                lapack_int ldb );

typedef lapack_int (*chegv_work_t)( int matrix_order, lapack_int itype, char jobz,
                               char uplo, lapack_int n, lapack_complex_float* a,
                               lapack_int lda, lapack_complex_float* b,
                               lapack_int ldb, float* w,
                               lapack_complex_float* work, lapack_int lwork,
                               float* rwork );
typedef lapack_int (*zhegv_work_t)( int matrix_order, lapack_int itype, char jobz,
                               char uplo, lapack_int n,
                               lapack_complex_double* a, lapack_int lda,
                               lapack_complex_double* b, lapack_int ldb,
                               double* w, lapack_complex_double* work,
                               lapack_int lwork, double* rwork );

typedef lapack_int (*chegvd_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char uplo, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* b, lapack_int ldb,
                                float* w, lapack_complex_float* work,
                                lapack_int lwork, float* rwork,
                                lapack_int lrwork, lapack_int* iwork,
                                lapack_int liwork );
typedef lapack_int (*zhegvd_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char uplo, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* b, lapack_int ldb,
                                double* w, lapack_complex_double* work,
                                lapack_int lwork, double* rwork,
                                lapack_int lrwork, lapack_int* iwork,
                                lapack_int liwork );

typedef lapack_int (*chegvx_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char range, char uplo, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* b, lapack_int ldb,
                                float vl, float vu, lapack_int il,
                                lapack_int iu, float abstol, lapack_int* m,
                                float* w, lapack_complex_float* z,
                                lapack_int ldz, lapack_complex_float* work,
                                lapack_int lwork, float* rwork,
                                lapack_int* iwork, lapack_int* ifail );
typedef lapack_int (*zhegvx_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char range, char uplo, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* b, lapack_int ldb,
                                double vl, double vu, lapack_int il,
                                lapack_int iu, double abstol, lapack_int* m,
                                double* w, lapack_complex_double* z,
                                lapack_int ldz, lapack_complex_double* work,
                                lapack_int lwork, double* rwork,
                                lapack_int* iwork, lapack_int* ifail );

typedef lapack_int (*cherfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* a,
                                lapack_int lda, const lapack_complex_float* af,
                                lapack_int ldaf, const lapack_int* ipiv,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* x, lapack_int ldx,
                                float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zherfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_double* a,
                                lapack_int lda, const lapack_complex_double* af,
                                lapack_int ldaf, const lapack_int* ipiv,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*cherfsx_work_t)( int matrix_order, char uplo, char equed,
                                 lapack_int n, lapack_int nrhs,
                                 const lapack_complex_float* a, lapack_int lda,
                                 const lapack_complex_float* af,
                                 lapack_int ldaf, const lapack_int* ipiv,
                                 const float* s, const lapack_complex_float* b,
                                 lapack_int ldb, lapack_complex_float* x,
                                 lapack_int ldx, float* rcond, float* berr,
                                 lapack_int n_err_bnds, float* err_bnds_norm,
                                 float* err_bnds_comp, lapack_int nparams,
                                 float* params, lapack_complex_float* work,
                                 float* rwork );
typedef lapack_int (*zherfsx_work_t)( int matrix_order, char uplo, char equed,
                                 lapack_int n, lapack_int nrhs,
                                 const lapack_complex_double* a, lapack_int lda,
                                 const lapack_complex_double* af,
                                 lapack_int ldaf, const lapack_int* ipiv,
                                 const double* s,
                                 const lapack_complex_double* b, lapack_int ldb,
                                 lapack_complex_double* x, lapack_int ldx,
                                 double* rcond, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, lapack_complex_double* work,
                                 double* rwork );

typedef lapack_int (*chesv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, lapack_complex_float* a,
                               lapack_int lda, lapack_int* ipiv,
                               lapack_complex_float* b, lapack_int ldb,
                               lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zhesv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, lapack_complex_double* a,
                               lapack_int lda, lapack_int* ipiv,
                               lapack_complex_double* b, lapack_int ldb,
                               lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*chesvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs,
                                const lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* af, lapack_int ldaf,
                                lapack_int* ipiv, const lapack_complex_float* b,
                                lapack_int ldb, lapack_complex_float* x,
                                lapack_int ldx, float* rcond, float* ferr,
                                float* berr, lapack_complex_float* work,
                                lapack_int lwork, float* rwork );
typedef lapack_int (*zhesvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs,
                                const lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* af, lapack_int ldaf,
                                lapack_int* ipiv,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* rcond, double* ferr, double* berr,
                                lapack_complex_double* work, lapack_int lwork,
                                double* rwork );

typedef lapack_int (*chesvxx_work_t)( int matrix_order, char fact, char uplo,
                                 lapack_int n, lapack_int nrhs,
                                 lapack_complex_float* a, lapack_int lda,
                                 lapack_complex_float* af, lapack_int ldaf,
                                 lapack_int* ipiv, char* equed, float* s,
                                 lapack_complex_float* b, lapack_int ldb,
                                 lapack_complex_float* x, lapack_int ldx,
                                 float* rcond, float* rpvgrw, float* berr,
                                 lapack_int n_err_bnds, float* err_bnds_norm,
                                 float* err_bnds_comp, lapack_int nparams,
                                 float* params, lapack_complex_float* work,
                                 float* rwork );
typedef lapack_int (*zhesvxx_work_t)( int matrix_order, char fact, char uplo,
                                 lapack_int n, lapack_int nrhs,
                                 lapack_complex_double* a, lapack_int lda,
                                 lapack_complex_double* af, lapack_int ldaf,
                                 lapack_int* ipiv, char* equed, double* s,
                                 lapack_complex_double* b, lapack_int ldb,
                                 lapack_complex_double* x, lapack_int ldx,
                                 double* rcond, double* rpvgrw, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, lapack_complex_double* work,
                                 double* rwork );

typedef lapack_int (*chetrd_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                float* d, float* e, lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zhetrd_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                double* d, double* e,
                                lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*chetrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_int* ipiv, lapack_complex_float* work,
                                lapack_int lwork );
typedef lapack_int (*zhetrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_int* ipiv, lapack_complex_double* work,
                                lapack_int lwork );

typedef lapack_int (*chetri_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                const lapack_int* ipiv,
                                lapack_complex_float* work );
typedef lapack_int (*zhetri_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                const lapack_int* ipiv,
                                lapack_complex_double* work );

typedef lapack_int (*chetrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* a,
                                lapack_int lda, const lapack_int* ipiv,
                                lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zhetrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_double* a,
                                lapack_int lda, const lapack_int* ipiv,
                                lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*chfrk_work_t)( int matrix_order, char transr, char uplo,
                               char trans, lapack_int n, lapack_int k,
                               float alpha, const lapack_complex_float* a,
                               lapack_int lda, float beta,
                               lapack_complex_float* c );
typedef lapack_int (*zhfrk_work_t)( int matrix_order, char transr, char uplo,
                               char trans, lapack_int n, lapack_int k,
                               double alpha, const lapack_complex_double* a,
                               lapack_int lda, double beta,
                               lapack_complex_double* c );

typedef lapack_int (*shgeqz_work_t)( int matrix_order, char job, char compq,
                                char compz, lapack_int n, lapack_int ilo,
                                lapack_int ihi, float* h, lapack_int ldh,
                                float* t, lapack_int ldt, float* alphar,
                                float* alphai, float* beta, float* q,
                                lapack_int ldq, float* z, lapack_int ldz,
                                float* work, lapack_int lwork );
typedef lapack_int (*dhgeqz_work_t)( int matrix_order, char job, char compq,
                                char compz, lapack_int n, lapack_int ilo,
                                lapack_int ihi, double* h, lapack_int ldh,
                                double* t, lapack_int ldt, double* alphar,
                                double* alphai, double* beta, double* q,
                                lapack_int ldq, double* z, lapack_int ldz,
                                double* work, lapack_int lwork );
typedef lapack_int (*chgeqz_work_t)( int matrix_order, char job, char compq,
                                char compz, lapack_int n, lapack_int ilo,
                                lapack_int ihi, lapack_complex_float* h,
                                lapack_int ldh, lapack_complex_float* t,
                                lapack_int ldt, lapack_complex_float* alpha,
                                lapack_complex_float* beta,
                                lapack_complex_float* q, lapack_int ldq,
                                lapack_complex_float* z, lapack_int ldz,
                                lapack_complex_float* work, lapack_int lwork,
                                float* rwork );
typedef lapack_int (*zhgeqz_work_t)( int matrix_order, char job, char compq,
                                char compz, lapack_int n, lapack_int ilo,
                                lapack_int ihi, lapack_complex_double* h,
                                lapack_int ldh, lapack_complex_double* t,
                                lapack_int ldt, lapack_complex_double* alpha,
                                lapack_complex_double* beta,
                                lapack_complex_double* q, lapack_int ldq,
                                lapack_complex_double* z, lapack_int ldz,
                                lapack_complex_double* work, lapack_int lwork,
                                double* rwork );

typedef lapack_int (*chpcon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_float* ap,
                                const lapack_int* ipiv, float anorm,
                                float* rcond, lapack_complex_float* work );
typedef lapack_int (*zhpcon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_double* ap,
                                const lapack_int* ipiv, double anorm,
                                double* rcond, lapack_complex_double* work );

typedef lapack_int (*chpev_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, lapack_complex_float* ap, float* w,
                               lapack_complex_float* z, lapack_int ldz,
                               lapack_complex_float* work, float* rwork );
typedef lapack_int (*zhpev_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, lapack_complex_double* ap,
                               double* w, lapack_complex_double* z,
                               lapack_int ldz, lapack_complex_double* work,
                               double* rwork );

typedef lapack_int (*chpevd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, lapack_complex_float* ap,
                                float* w, lapack_complex_float* z,
                                lapack_int ldz, lapack_complex_float* work,
                                lapack_int lwork, float* rwork,
                                lapack_int lrwork, lapack_int* iwork,
                                lapack_int liwork );
typedef lapack_int (*zhpevd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, lapack_complex_double* ap,
                                double* w, lapack_complex_double* z,
                                lapack_int ldz, lapack_complex_double* work,
                                lapack_int lwork, double* rwork,
                                lapack_int lrwork, lapack_int* iwork,
                                lapack_int liwork );

typedef lapack_int (*chpevx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n,
                                lapack_complex_float* ap, float vl, float vu,
                                lapack_int il, lapack_int iu, float abstol,
                                lapack_int* m, float* w,
                                lapack_complex_float* z, lapack_int ldz,
                                lapack_complex_float* work, float* rwork,
                                lapack_int* iwork, lapack_int* ifail );
typedef lapack_int (*zhpevx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n,
                                lapack_complex_double* ap, double vl, double vu,
                                lapack_int il, lapack_int iu, double abstol,
                                lapack_int* m, double* w,
                                lapack_complex_double* z, lapack_int ldz,
                                lapack_complex_double* work, double* rwork,
                                lapack_int* iwork, lapack_int* ifail );

typedef lapack_int (*chpgst_work_t)( int matrix_order, lapack_int itype, char uplo,
                                lapack_int n, lapack_complex_float* ap,
                                const lapack_complex_float* bp );
typedef lapack_int (*zhpgst_work_t)( int matrix_order, lapack_int itype, char uplo,
                                lapack_int n, lapack_complex_double* ap,
                                const lapack_complex_double* bp );

typedef lapack_int (*chpgv_work_t)( int matrix_order, lapack_int itype, char jobz,
                               char uplo, lapack_int n,
                               lapack_complex_float* ap,
                               lapack_complex_float* bp, float* w,
                               lapack_complex_float* z, lapack_int ldz,
                               lapack_complex_float* work, float* rwork );
typedef lapack_int (*zhpgv_work_t)( int matrix_order, lapack_int itype, char jobz,
                               char uplo, lapack_int n,
                               lapack_complex_double* ap,
                               lapack_complex_double* bp, double* w,
                               lapack_complex_double* z, lapack_int ldz,
                               lapack_complex_double* work, double* rwork );

typedef lapack_int (*chpgvd_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char uplo, lapack_int n,
                                lapack_complex_float* ap,
                                lapack_complex_float* bp, float* w,
                                lapack_complex_float* z, lapack_int ldz,
                                lapack_complex_float* work, lapack_int lwork,
                                float* rwork, lapack_int lrwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*zhpgvd_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char uplo, lapack_int n,
                                lapack_complex_double* ap,
                                lapack_complex_double* bp, double* w,
                                lapack_complex_double* z, lapack_int ldz,
                                lapack_complex_double* work, lapack_int lwork,
                                double* rwork, lapack_int lrwork,
                                lapack_int* iwork, lapack_int liwork );

typedef lapack_int (*chpgvx_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char range, char uplo, lapack_int n,
                                lapack_complex_float* ap,
                                lapack_complex_float* bp, float vl, float vu,
                                lapack_int il, lapack_int iu, float abstol,
                                lapack_int* m, float* w,
                                lapack_complex_float* z, lapack_int ldz,
                                lapack_complex_float* work, float* rwork,
                                lapack_int* iwork, lapack_int* ifail );
typedef lapack_int (*zhpgvx_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char range, char uplo, lapack_int n,
                                lapack_complex_double* ap,
                                lapack_complex_double* bp, double vl, double vu,
                                lapack_int il, lapack_int iu, double abstol,
                                lapack_int* m, double* w,
                                lapack_complex_double* z, lapack_int ldz,
                                lapack_complex_double* work, double* rwork,
                                lapack_int* iwork, lapack_int* ifail );

typedef lapack_int (*chprfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* ap,
                                const lapack_complex_float* afp,
                                const lapack_int* ipiv,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* x, lapack_int ldx,
                                float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zhprfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs,
                                const lapack_complex_double* ap,
                                const lapack_complex_double* afp,
                                const lapack_int* ipiv,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*chpsv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, lapack_complex_float* ap,
                               lapack_int* ipiv, lapack_complex_float* b,
                               lapack_int ldb );
typedef lapack_int (*zhpsv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, lapack_complex_double* ap,
                               lapack_int* ipiv, lapack_complex_double* b,
                               lapack_int ldb );

typedef lapack_int (*chpsvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs,
                                const lapack_complex_float* ap,
                                lapack_complex_float* afp, lapack_int* ipiv,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* x, lapack_int ldx,
                                float* rcond, float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zhpsvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs,
                                const lapack_complex_double* ap,
                                lapack_complex_double* afp, lapack_int* ipiv,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* rcond, double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*chptrd_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* ap, float* d, float* e,
                                lapack_complex_float* tau );
typedef lapack_int (*zhptrd_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* ap, double* d, double* e,
                                lapack_complex_double* tau );

typedef lapack_int (*chptrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* ap, lapack_int* ipiv );
typedef lapack_int (*zhptrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* ap, lapack_int* ipiv );

typedef lapack_int (*chptri_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* ap,
                                const lapack_int* ipiv,
                                lapack_complex_float* work );
typedef lapack_int (*zhptri_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* ap,
                                const lapack_int* ipiv,
                                lapack_complex_double* work );

typedef lapack_int (*chptrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* ap,
                                const lapack_int* ipiv, lapack_complex_float* b,
                                lapack_int ldb );
typedef lapack_int (*zhptrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs,
                                const lapack_complex_double* ap,
                                const lapack_int* ipiv,
                                lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*shsein_work_t)( int matrix_order, char job, char eigsrc,
                                char initv, lapack_logical* select,
                                lapack_int n, const float* h, lapack_int ldh,
                                float* wr, const float* wi, float* vl,
                                lapack_int ldvl, float* vr, lapack_int ldvr,
                                lapack_int mm, lapack_int* m, float* work,
                                lapack_int* ifaill, lapack_int* ifailr );
typedef lapack_int (*dhsein_work_t)( int matrix_order, char job, char eigsrc,
                                char initv, lapack_logical* select,
                                lapack_int n, const double* h, lapack_int ldh,
                                double* wr, const double* wi, double* vl,
                                lapack_int ldvl, double* vr, lapack_int ldvr,
                                lapack_int mm, lapack_int* m, double* work,
                                lapack_int* ifaill, lapack_int* ifailr );
typedef lapack_int (*chsein_work_t)( int matrix_order, char job, char eigsrc,
                                char initv, const lapack_logical* select,
                                lapack_int n, const lapack_complex_float* h,
                                lapack_int ldh, lapack_complex_float* w,
                                lapack_complex_float* vl, lapack_int ldvl,
                                lapack_complex_float* vr, lapack_int ldvr,
                                lapack_int mm, lapack_int* m,
                                lapack_complex_float* work, float* rwork,
                                lapack_int* ifaill, lapack_int* ifailr );
typedef lapack_int (*zhsein_work_t)( int matrix_order, char job, char eigsrc,
                                char initv, const lapack_logical* select,
                                lapack_int n, const lapack_complex_double* h,
                                lapack_int ldh, lapack_complex_double* w,
                                lapack_complex_double* vl, lapack_int ldvl,
                                lapack_complex_double* vr, lapack_int ldvr,
                                lapack_int mm, lapack_int* m,
                                lapack_complex_double* work, double* rwork,
                                lapack_int* ifaill, lapack_int* ifailr );

typedef lapack_int (*shseqr_work_t)( int matrix_order, char job, char compz,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                float* h, lapack_int ldh, float* wr, float* wi,
                                float* z, lapack_int ldz, float* work,
                                lapack_int lwork );
typedef lapack_int (*dhseqr_work_t)( int matrix_order, char job, char compz,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                double* h, lapack_int ldh, double* wr,
                                double* wi, double* z, lapack_int ldz,
                                double* work, lapack_int lwork );
typedef lapack_int (*chseqr_work_t)( int matrix_order, char job, char compz,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                lapack_complex_float* h, lapack_int ldh,
                                lapack_complex_float* w,
                                lapack_complex_float* z, lapack_int ldz,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zhseqr_work_t)( int matrix_order, char job, char compz,
                                lapack_int n, lapack_int ilo, lapack_int ihi,
                                lapack_complex_double* h, lapack_int ldh,
                                lapack_complex_double* w,
                                lapack_complex_double* z, lapack_int ldz,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*clacgv_work_t)( lapack_int n, lapack_complex_float* x,
                                lapack_int incx );
typedef lapack_int (*zlacgv_work_t)( lapack_int n, lapack_complex_double* x,
                                lapack_int incx );

typedef lapack_int (*slacn2_work_t)( lapack_int n, float* v, float* x,
                                lapack_int* isgn, float* est, lapack_int* kase,
                                lapack_int* isave );
typedef lapack_int (*dlacn2_work_t)( lapack_int n, double* v, double* x,
                                lapack_int* isgn, double* est, lapack_int* kase,
                                lapack_int* isave );
typedef lapack_int (*clacn2_work_t)( lapack_int n, lapack_complex_float* v,
                                lapack_complex_float* x,
                                float* est, lapack_int* kase,
                                lapack_int* isave );
typedef lapack_int (*zlacn2_work_t)( lapack_int n, lapack_complex_double* v,
                                lapack_complex_double* x,
                                double* est, lapack_int* kase,
                                lapack_int* isave );

typedef lapack_int (*slacpy_work_t)( int matrix_order, char uplo, lapack_int m,
                                lapack_int n, const float* a, lapack_int lda,
                                float* b, lapack_int ldb );
typedef lapack_int (*dlacpy_work_t)( int matrix_order, char uplo, lapack_int m,
                                lapack_int n, const double* a, lapack_int lda,
                                double* b, lapack_int ldb );
typedef lapack_int (*clacpy_work_t)( int matrix_order, char uplo, lapack_int m,
                                lapack_int n, const lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* b,
                                lapack_int ldb );
typedef lapack_int (*zlacpy_work_t)( int matrix_order, char uplo, lapack_int m,
                                lapack_int n, const lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* b,
                                lapack_int ldb );

typedef lapack_int (*clacp2_work_t)( int matrix_order, char uplo, lapack_int m,
                                lapack_int n, const float* a, lapack_int lda,
                                lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zlacp2_work_t)( int matrix_order, char uplo, lapack_int m,
                                lapack_int n, const double* a, lapack_int lda,
                                lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*zlag2c_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                const lapack_complex_double* a, lapack_int lda,
                                lapack_complex_float* sa, lapack_int ldsa );

typedef lapack_int (*slag2d_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                const float* sa, lapack_int ldsa, double* a,
                                lapack_int lda );

typedef lapack_int (*dlag2s_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                const double* a, lapack_int lda, float* sa,
                                lapack_int ldsa );

typedef lapack_int (*clag2z_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                const lapack_complex_float* sa, lapack_int ldsa,
                                lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*slagge_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int kl, lapack_int ku, const float* d,
                                float* a, lapack_int lda, lapack_int* iseed,
                                float* work );
typedef lapack_int (*dlagge_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int kl, lapack_int ku, const double* d,
                                double* a, lapack_int lda, lapack_int* iseed,
                                double* work );
typedef lapack_int (*clagge_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int kl, lapack_int ku, const float* d,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_int* iseed, lapack_complex_float* work );
typedef lapack_int (*zlagge_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int kl, lapack_int ku, const double* d,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_int* iseed,
                                lapack_complex_double* work );

typedef lapack_int (*claghe_work_t)( int matrix_order, lapack_int n, lapack_int k,
                                const float* d, lapack_complex_float* a,
                                lapack_int lda, lapack_int* iseed,
                                lapack_complex_float* work );
typedef lapack_int (*zlaghe_work_t)( int matrix_order, lapack_int n, lapack_int k,
                                const double* d, lapack_complex_double* a,
                                lapack_int lda, lapack_int* iseed,
                                lapack_complex_double* work );

typedef lapack_int (*slagsy_work_t)( int matrix_order, lapack_int n, lapack_int k,
                                const float* d, float* a, lapack_int lda,
                                lapack_int* iseed, float* work );
typedef lapack_int (*dlagsy_work_t)( int matrix_order, lapack_int n, lapack_int k,
                                const double* d, double* a, lapack_int lda,
                                lapack_int* iseed, double* work );
typedef lapack_int (*clagsy_work_t)( int matrix_order, lapack_int n, lapack_int k,
                                const float* d, lapack_complex_float* a,
                                lapack_int lda, lapack_int* iseed,
                                lapack_complex_float* work );
typedef lapack_int (*zlagsy_work_t)( int matrix_order, lapack_int n, lapack_int k,
                                const double* d, lapack_complex_double* a,
                                lapack_int lda, lapack_int* iseed,
                                lapack_complex_double* work );

typedef lapack_int (*slapmr_work_t)( int matrix_order, lapack_logical forwrd,
                                lapack_int m, lapack_int n, float* x,
                                lapack_int ldx, lapack_int* k );
typedef lapack_int (*dlapmr_work_t)( int matrix_order, lapack_logical forwrd,
                                lapack_int m, lapack_int n, double* x,
                                lapack_int ldx, lapack_int* k );
typedef lapack_int (*clapmr_work_t)( int matrix_order, lapack_logical forwrd,
                                lapack_int m, lapack_int n,
                                lapack_complex_float* x, lapack_int ldx,
                                lapack_int* k );
typedef lapack_int (*zlapmr_work_t)( int matrix_order, lapack_logical forwrd,
                                lapack_int m, lapack_int n,
                                lapack_complex_double* x, lapack_int ldx,
                                lapack_int* k );

typedef lapack_int (*slartgp_work_t)( float f, float g, float* cs, float* sn,
                                 float* r );
typedef lapack_int (*dlartgp_work_t)( double f, double g, double* cs, double* sn,
                                 double* r );

typedef lapack_int (*slartgs_work_t)( float x, float y, float sigma, float* cs,
                                 float* sn );
typedef lapack_int (*dlartgs_work_t)( double x, double y, double sigma, double* cs,
                                 double* sn );

typedef float (*slapy2_work_t)( float x, float y );
typedef double (*dlapy2_work_t)( double x, double y );

typedef float (*slapy3_work_t)( float x, float y, float z );
typedef double (*dlapy3_work_t)( double x, double y, double z );

typedef float (*slamch_work_t)( char cmach );
typedef double (*dlamch_work_t)( char cmach );

typedef float (*slange_work_t)( int matrix_order, char norm, lapack_int m,
                                lapack_int n, const float* a, lapack_int lda,
                                float* work );
typedef double (*dlange_work_t)( int matrix_order, char norm, lapack_int m,
                                lapack_int n, const double* a, lapack_int lda,
                                double* work );
typedef float (*clange_work_t)( int matrix_order, char norm, lapack_int m,
                                lapack_int n, const lapack_complex_float* a,
                                lapack_int lda, float* work );
typedef double (*zlange_work_t)( int matrix_order, char norm, lapack_int m,
                                lapack_int n, const lapack_complex_double* a,
                                lapack_int lda, double* work );

typedef float (*clanhe_work_t)( int matrix_order, char norm, char uplo,
                                lapack_int n, const lapack_complex_float* a,
                                lapack_int lda, float* work );
typedef double (*zlanhe_work_t)( int matrix_order, char norm, char uplo,
                                lapack_int n, const lapack_complex_double* a,
                                lapack_int lda, double* work );

typedef float (*slansy_work_t)( int matrix_order, char norm, char uplo,
                                lapack_int n, const float* a, lapack_int lda,
                                float* work );
typedef double (*dlansy_work_t)( int matrix_order, char norm, char uplo,
                                lapack_int n, const double* a, lapack_int lda,
                                double* work );
typedef float (*clansy_work_t)( int matrix_order, char norm, char uplo,
                                lapack_int n, const lapack_complex_float* a,
                                lapack_int lda, float* work );
typedef double (*zlansy_work_t)( int matrix_order, char norm, char uplo,
                                lapack_int n, const lapack_complex_double* a,
                                lapack_int lda, double* work );

typedef float (*slantr_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int m, lapack_int n, const float* a,
                                lapack_int lda, float* work );
typedef double (*dlantr_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int m, lapack_int n,
                                const double* a, lapack_int lda, double* work );
typedef float (*clantr_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int m, lapack_int n,
                                const lapack_complex_float* a, lapack_int lda,
                                float* work );
typedef double (*zlantr_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int m, lapack_int n,
                                const lapack_complex_double* a, lapack_int lda,
                                double* work );

typedef lapack_int (*slarfb_work_t)( int matrix_order, char side, char trans,
                                char direct, char storev, lapack_int m,
                                lapack_int n, lapack_int k, const float* v,
                                lapack_int ldv, const float* t, lapack_int ldt,
                                float* c, lapack_int ldc, float* work,
                                lapack_int ldwork );
typedef lapack_int (*dlarfb_work_t)( int matrix_order, char side, char trans,
                                char direct, char storev, lapack_int m,
                                lapack_int n, lapack_int k, const double* v,
                                lapack_int ldv, const double* t, lapack_int ldt,
                                double* c, lapack_int ldc, double* work,
                                lapack_int ldwork );
typedef lapack_int (*clarfb_work_t)( int matrix_order, char side, char trans,
                                char direct, char storev, lapack_int m,
                                lapack_int n, lapack_int k,
                                const lapack_complex_float* v, lapack_int ldv,
                                const lapack_complex_float* t, lapack_int ldt,
                                lapack_complex_float* c, lapack_int ldc,
                                lapack_complex_float* work, lapack_int ldwork );
typedef lapack_int (*zlarfb_work_t)( int matrix_order, char side, char trans,
                                char direct, char storev, lapack_int m,
                                lapack_int n, lapack_int k,
                                const lapack_complex_double* v, lapack_int ldv,
                                const lapack_complex_double* t, lapack_int ldt,
                                lapack_complex_double* c, lapack_int ldc,
                                lapack_complex_double* work,
                                lapack_int ldwork );

typedef lapack_int (*slarfg_work_t)( lapack_int n, float* alpha, float* x,
                                lapack_int incx, float* tau );
typedef lapack_int (*dlarfg_work_t)( lapack_int n, double* alpha, double* x,
                                lapack_int incx, double* tau );
typedef lapack_int (*clarfg_work_t)( lapack_int n, lapack_complex_float* alpha,
                                lapack_complex_float* x, lapack_int incx,
                                lapack_complex_float* tau );
typedef lapack_int (*zlarfg_work_t)( lapack_int n, lapack_complex_double* alpha,
                                lapack_complex_double* x, lapack_int incx,
                                lapack_complex_double* tau );

typedef lapack_int (*slarft_work_t)( int matrix_order, char direct, char storev,
                                lapack_int n, lapack_int k, const float* v,
                                lapack_int ldv, const float* tau, float* t,
                                lapack_int ldt );
typedef lapack_int (*dlarft_work_t)( int matrix_order, char direct, char storev,
                                lapack_int n, lapack_int k, const double* v,
                                lapack_int ldv, const double* tau, double* t,
                                lapack_int ldt );
typedef lapack_int (*clarft_work_t)( int matrix_order, char direct, char storev,
                                lapack_int n, lapack_int k,
                                const lapack_complex_float* v, lapack_int ldv,
                                const lapack_complex_float* tau,
                                lapack_complex_float* t, lapack_int ldt );
typedef lapack_int (*zlarft_work_t)( int matrix_order, char direct, char storev,
                                lapack_int n, lapack_int k,
                                const lapack_complex_double* v, lapack_int ldv,
                                const lapack_complex_double* tau,
                                lapack_complex_double* t, lapack_int ldt );

typedef lapack_int (*slarfx_work_t)( int matrix_order, char side, lapack_int m,
                                lapack_int n, const float* v, float tau,
                                float* c, lapack_int ldc, float* work );
typedef lapack_int (*dlarfx_work_t)( int matrix_order, char side, lapack_int m,
                                lapack_int n, const double* v, double tau,
                                double* c, lapack_int ldc, double* work );
typedef lapack_int (*clarfx_work_t)( int matrix_order, char side, lapack_int m,
                                lapack_int n, const lapack_complex_float* v,
                                lapack_complex_float tau,
                                lapack_complex_float* c, lapack_int ldc,
                                lapack_complex_float* work );
typedef lapack_int (*zlarfx_work_t)( int matrix_order, char side, lapack_int m,
                                lapack_int n, const lapack_complex_double* v,
                                lapack_complex_double tau,
                                lapack_complex_double* c, lapack_int ldc,
                                lapack_complex_double* work );

typedef lapack_int (*slarnv_work_t)( lapack_int idist, lapack_int* iseed,
                                lapack_int n, float* x );
typedef lapack_int (*dlarnv_work_t)( lapack_int idist, lapack_int* iseed,
                                lapack_int n, double* x );
typedef lapack_int (*clarnv_work_t)( lapack_int idist, lapack_int* iseed,
                                lapack_int n, lapack_complex_float* x );
typedef lapack_int (*zlarnv_work_t)( lapack_int idist, lapack_int* iseed,
                                lapack_int n, lapack_complex_double* x );

typedef lapack_int (*slaset_work_t)( int matrix_order, char uplo, lapack_int m,
                                lapack_int n, float alpha, float beta, float* a,
                                lapack_int lda );
typedef lapack_int (*dlaset_work_t)( int matrix_order, char uplo, lapack_int m,
                                lapack_int n, double alpha, double beta,
                                double* a, lapack_int lda );
typedef lapack_int (*claset_work_t)( int matrix_order, char uplo, lapack_int m,
                                lapack_int n, lapack_complex_float alpha,
                                lapack_complex_float beta,
                                lapack_complex_float* a, lapack_int lda );
typedef lapack_int (*zlaset_work_t)( int matrix_order, char uplo, lapack_int m,
                                lapack_int n, lapack_complex_double alpha,
                                lapack_complex_double beta,
                                lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*slasrt_work_t)( char id, lapack_int n, float* d );
typedef lapack_int (*dlasrt_work_t)( char id, lapack_int n, double* d );

typedef lapack_int (*slaswp_work_t)( int matrix_order, lapack_int n, float* a,
                                lapack_int lda, lapack_int k1, lapack_int k2,
                                const lapack_int* ipiv, lapack_int incx );
typedef lapack_int (*dlaswp_work_t)( int matrix_order, lapack_int n, double* a,
                                lapack_int lda, lapack_int k1, lapack_int k2,
                                const lapack_int* ipiv, lapack_int incx );
typedef lapack_int (*claswp_work_t)( int matrix_order, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_int k1, lapack_int k2,
                                const lapack_int* ipiv, lapack_int incx );
typedef lapack_int (*zlaswp_work_t)( int matrix_order, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_int k1, lapack_int k2,
                                const lapack_int* ipiv, lapack_int incx );

typedef lapack_int (*slatms_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                char dist, lapack_int* iseed, char sym,
                                float* d, lapack_int mode, float cond,
                                float dmax, lapack_int kl, lapack_int ku,
                                char pack, float* a, lapack_int lda,
                                float* work );
typedef lapack_int (*dlatms_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                char dist, lapack_int* iseed, char sym,
                                double* d, lapack_int mode, double cond,
                                double dmax, lapack_int kl, lapack_int ku,
                                char pack, double* a, lapack_int lda,
                                double* work );
typedef lapack_int (*clatms_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                char dist, lapack_int* iseed, char sym,
                                float* d, lapack_int mode, float cond,
                                float dmax, lapack_int kl, lapack_int ku,
                                char pack, lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* work );
typedef lapack_int (*zlatms_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                char dist, lapack_int* iseed, char sym,
                                double* d, lapack_int mode, double cond,
                                double dmax, lapack_int kl, lapack_int ku,
                                char pack, lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* work );

typedef lapack_int (*slauum_work_t)( int matrix_order, char uplo, lapack_int n,
                                float* a, lapack_int lda );
typedef lapack_int (*dlauum_work_t)( int matrix_order, char uplo, lapack_int n,
                                double* a, lapack_int lda );
typedef lapack_int (*clauum_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* a, lapack_int lda );
typedef lapack_int (*zlauum_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*sopgtr_work_t)( int matrix_order, char uplo, lapack_int n,
                                const float* ap, const float* tau, float* q,
                                lapack_int ldq, float* work );
typedef lapack_int (*dopgtr_work_t)( int matrix_order, char uplo, lapack_int n,
                                const double* ap, const double* tau, double* q,
                                lapack_int ldq, double* work );

typedef lapack_int (*sopmtr_work_t)( int matrix_order, char side, char uplo,
                                char trans, lapack_int m, lapack_int n,
                                const float* ap, const float* tau, float* c,
                                lapack_int ldc, float* work );
typedef lapack_int (*dopmtr_work_t)( int matrix_order, char side, char uplo,
                                char trans, lapack_int m, lapack_int n,
                                const double* ap, const double* tau, double* c,
                                lapack_int ldc, double* work );

typedef lapack_int (*sorgbr_work_t)( int matrix_order, char vect, lapack_int m,
                                lapack_int n, lapack_int k, float* a,
                                lapack_int lda, const float* tau, float* work,
                                lapack_int lwork );
typedef lapack_int (*dorgbr_work_t)( int matrix_order, char vect, lapack_int m,
                                lapack_int n, lapack_int k, double* a,
                                lapack_int lda, const double* tau, double* work,
                                lapack_int lwork );

typedef lapack_int (*sorghr_work_t)( int matrix_order, lapack_int n, lapack_int ilo,
                                lapack_int ihi, float* a, lapack_int lda,
                                const float* tau, float* work,
                                lapack_int lwork );
typedef lapack_int (*dorghr_work_t)( int matrix_order, lapack_int n, lapack_int ilo,
                                lapack_int ihi, double* a, lapack_int lda,
                                const double* tau, double* work,
                                lapack_int lwork );

typedef lapack_int (*sorglq_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, float* a, lapack_int lda,
                                const float* tau, float* work,
                                lapack_int lwork );
typedef lapack_int (*dorglq_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, double* a, lapack_int lda,
                                const double* tau, double* work,
                                lapack_int lwork );

typedef lapack_int (*sorgql_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, float* a, lapack_int lda,
                                const float* tau, float* work,
                                lapack_int lwork );
typedef lapack_int (*dorgql_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, double* a, lapack_int lda,
                                const double* tau, double* work,
                                lapack_int lwork );

typedef lapack_int (*sorgqr_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, float* a, lapack_int lda,
                                const float* tau, float* work,
                                lapack_int lwork );
typedef lapack_int (*dorgqr_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, double* a, lapack_int lda,
                                const double* tau, double* work,
                                lapack_int lwork );

typedef lapack_int (*sorgrq_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, float* a, lapack_int lda,
                                const float* tau, float* work,
                                lapack_int lwork );
typedef lapack_int (*dorgrq_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, double* a, lapack_int lda,
                                const double* tau, double* work,
                                lapack_int lwork );

typedef lapack_int (*sorgtr_work_t)( int matrix_order, char uplo, lapack_int n,
                                float* a, lapack_int lda, const float* tau,
                                float* work, lapack_int lwork );
typedef lapack_int (*dorgtr_work_t)( int matrix_order, char uplo, lapack_int n,
                                double* a, lapack_int lda, const double* tau,
                                double* work, lapack_int lwork );

typedef lapack_int (*sormbr_work_t)( int matrix_order, char vect, char side,
                                char trans, lapack_int m, lapack_int n,
                                lapack_int k, const float* a, lapack_int lda,
                                const float* tau, float* c, lapack_int ldc,
                                float* work, lapack_int lwork );
typedef lapack_int (*dormbr_work_t)( int matrix_order, char vect, char side,
                                char trans, lapack_int m, lapack_int n,
                                lapack_int k, const double* a, lapack_int lda,
                                const double* tau, double* c, lapack_int ldc,
                                double* work, lapack_int lwork );

typedef lapack_int (*sormhr_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int ilo,
                                lapack_int ihi, const float* a, lapack_int lda,
                                const float* tau, float* c, lapack_int ldc,
                                float* work, lapack_int lwork );
typedef lapack_int (*dormhr_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int ilo,
                                lapack_int ihi, const double* a, lapack_int lda,
                                const double* tau, double* c, lapack_int ldc,
                                double* work, lapack_int lwork );

typedef lapack_int (*sormlq_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const float* a, lapack_int lda,
                                const float* tau, float* c, lapack_int ldc,
                                float* work, lapack_int lwork );
typedef lapack_int (*dormlq_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const double* a, lapack_int lda,
                                const double* tau, double* c, lapack_int ldc,
                                double* work, lapack_int lwork );

typedef lapack_int (*sormql_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const float* a, lapack_int lda,
                                const float* tau, float* c, lapack_int ldc,
                                float* work, lapack_int lwork );
typedef lapack_int (*dormql_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const double* a, lapack_int lda,
                                const double* tau, double* c, lapack_int ldc,
                                double* work, lapack_int lwork );

typedef lapack_int (*sormqr_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const float* a, lapack_int lda,
                                const float* tau, float* c, lapack_int ldc,
                                float* work, lapack_int lwork );
typedef lapack_int (*dormqr_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const double* a, lapack_int lda,
                                const double* tau, double* c, lapack_int ldc,
                                double* work, lapack_int lwork );

typedef lapack_int (*sormrq_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const float* a, lapack_int lda,
                                const float* tau, float* c, lapack_int ldc,
                                float* work, lapack_int lwork );
typedef lapack_int (*dormrq_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const double* a, lapack_int lda,
                                const double* tau, double* c, lapack_int ldc,
                                double* work, lapack_int lwork );

typedef lapack_int (*sormrz_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                lapack_int l, const float* a, lapack_int lda,
                                const float* tau, float* c, lapack_int ldc,
                                float* work, lapack_int lwork );
typedef lapack_int (*dormrz_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                lapack_int l, const double* a, lapack_int lda,
                                const double* tau, double* c, lapack_int ldc,
                                double* work, lapack_int lwork );

typedef lapack_int (*sormtr_work_t)( int matrix_order, char side, char uplo,
                                char trans, lapack_int m, lapack_int n,
                                const float* a, lapack_int lda,
                                const float* tau, float* c, lapack_int ldc,
                                float* work, lapack_int lwork );
typedef lapack_int (*dormtr_work_t)( int matrix_order, char side, char uplo,
                                char trans, lapack_int m, lapack_int n,
                                const double* a, lapack_int lda,
                                const double* tau, double* c, lapack_int ldc,
                                double* work, lapack_int lwork );

typedef lapack_int (*spbcon_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, const float* ab, lapack_int ldab,
                                float anorm, float* rcond, float* work,
                                lapack_int* iwork );
typedef lapack_int (*dpbcon_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, const double* ab,
                                lapack_int ldab, double anorm, double* rcond,
                                double* work, lapack_int* iwork );
typedef lapack_int (*cpbcon_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, const lapack_complex_float* ab,
                                lapack_int ldab, float anorm, float* rcond,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zpbcon_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, const lapack_complex_double* ab,
                                lapack_int ldab, double anorm, double* rcond,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*spbequ_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, const float* ab, lapack_int ldab,
                                float* s, float* scond, float* amax );
typedef lapack_int (*dpbequ_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, const double* ab,
                                lapack_int ldab, double* s, double* scond,
                                double* amax );
typedef lapack_int (*cpbequ_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, const lapack_complex_float* ab,
                                lapack_int ldab, float* s, float* scond,
                                float* amax );
typedef lapack_int (*zpbequ_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, const lapack_complex_double* ab,
                                lapack_int ldab, double* s, double* scond,
                                double* amax );

typedef lapack_int (*spbrfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, lapack_int nrhs, const float* ab,
                                lapack_int ldab, const float* afb,
                                lapack_int ldafb, const float* b,
                                lapack_int ldb, float* x, lapack_int ldx,
                                float* ferr, float* berr, float* work,
                                lapack_int* iwork );
typedef lapack_int (*dpbrfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, lapack_int nrhs,
                                const double* ab, lapack_int ldab,
                                const double* afb, lapack_int ldafb,
                                const double* b, lapack_int ldb, double* x,
                                lapack_int ldx, double* ferr, double* berr,
                                double* work, lapack_int* iwork );
typedef lapack_int (*cpbrfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, lapack_int nrhs,
                                const lapack_complex_float* ab, lapack_int ldab,
                                const lapack_complex_float* afb,
                                lapack_int ldafb, const lapack_complex_float* b,
                                lapack_int ldb, lapack_complex_float* x,
                                lapack_int ldx, float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zpbrfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, lapack_int nrhs,
                                const lapack_complex_double* ab,
                                lapack_int ldab,
                                const lapack_complex_double* afb,
                                lapack_int ldafb,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*spbstf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kb, float* bb, lapack_int ldbb );
typedef lapack_int (*dpbstf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kb, double* bb, lapack_int ldbb );
typedef lapack_int (*cpbstf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kb, lapack_complex_float* bb,
                                lapack_int ldbb );
typedef lapack_int (*zpbstf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kb, lapack_complex_double* bb,
                                lapack_int ldbb );

typedef lapack_int (*spbsv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int kd, lapack_int nrhs, float* ab,
                               lapack_int ldab, float* b, lapack_int ldb );
typedef lapack_int (*dpbsv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int kd, lapack_int nrhs, double* ab,
                               lapack_int ldab, double* b, lapack_int ldb );
typedef lapack_int (*cpbsv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int kd, lapack_int nrhs,
                               lapack_complex_float* ab, lapack_int ldab,
                               lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zpbsv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int kd, lapack_int nrhs,
                               lapack_complex_double* ab, lapack_int ldab,
                               lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*spbsvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int kd, lapack_int nrhs,
                                float* ab, lapack_int ldab, float* afb,
                                lapack_int ldafb, char* equed, float* s,
                                float* b, lapack_int ldb, float* x,
                                lapack_int ldx, float* rcond, float* ferr,
                                float* berr, float* work, lapack_int* iwork );
typedef lapack_int (*dpbsvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int kd, lapack_int nrhs,
                                double* ab, lapack_int ldab, double* afb,
                                lapack_int ldafb, char* equed, double* s,
                                double* b, lapack_int ldb, double* x,
                                lapack_int ldx, double* rcond, double* ferr,
                                double* berr, double* work, lapack_int* iwork );
typedef lapack_int (*cpbsvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int kd, lapack_int nrhs,
                                lapack_complex_float* ab, lapack_int ldab,
                                lapack_complex_float* afb, lapack_int ldafb,
                                char* equed, float* s, lapack_complex_float* b,
                                lapack_int ldb, lapack_complex_float* x,
                                lapack_int ldx, float* rcond, float* ferr,
                                float* berr, lapack_complex_float* work,
                                float* rwork );
typedef lapack_int (*zpbsvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int kd, lapack_int nrhs,
                                lapack_complex_double* ab, lapack_int ldab,
                                lapack_complex_double* afb, lapack_int ldafb,
                                char* equed, double* s,
                                lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* rcond, double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*spbtrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, float* ab, lapack_int ldab );
typedef lapack_int (*dpbtrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, double* ab, lapack_int ldab );
typedef lapack_int (*cpbtrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, lapack_complex_float* ab,
                                lapack_int ldab );
typedef lapack_int (*zpbtrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, lapack_complex_double* ab,
                                lapack_int ldab );

typedef lapack_int (*spbtrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, lapack_int nrhs, const float* ab,
                                lapack_int ldab, float* b, lapack_int ldb );
typedef lapack_int (*dpbtrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, lapack_int nrhs,
                                const double* ab, lapack_int ldab, double* b,
                                lapack_int ldb );
typedef lapack_int (*cpbtrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, lapack_int nrhs,
                                const lapack_complex_float* ab, lapack_int ldab,
                                lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zpbtrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int kd, lapack_int nrhs,
                                const lapack_complex_double* ab,
                                lapack_int ldab, lapack_complex_double* b,
                                lapack_int ldb );

typedef lapack_int (*spftrf_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, float* a );
typedef lapack_int (*dpftrf_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, double* a );
typedef lapack_int (*cpftrf_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, lapack_complex_float* a );
typedef lapack_int (*zpftrf_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, lapack_complex_double* a );

typedef lapack_int (*spftri_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, float* a );
typedef lapack_int (*dpftri_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, double* a );
typedef lapack_int (*cpftri_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, lapack_complex_float* a );
typedef lapack_int (*zpftri_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, lapack_complex_double* a );

typedef lapack_int (*spftrs_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, lapack_int nrhs, const float* a,
                                float* b, lapack_int ldb );
typedef lapack_int (*dpftrs_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, lapack_int nrhs, const double* a,
                                double* b, lapack_int ldb );
typedef lapack_int (*cpftrs_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, lapack_int nrhs,
                                const lapack_complex_float* a,
                                lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zpftrs_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, lapack_int nrhs,
                                const lapack_complex_double* a,
                                lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*spocon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const float* a, lapack_int lda, float anorm,
                                float* rcond, float* work, lapack_int* iwork );
typedef lapack_int (*dpocon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const double* a, lapack_int lda, double anorm,
                                double* rcond, double* work,
                                lapack_int* iwork );
typedef lapack_int (*cpocon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_float* a, lapack_int lda,
                                float anorm, float* rcond,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zpocon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_double* a, lapack_int lda,
                                double anorm, double* rcond,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*spoequ_work_t)( int matrix_order, lapack_int n, const float* a,
                                lapack_int lda, float* s, float* scond,
                                float* amax );
typedef lapack_int (*dpoequ_work_t)( int matrix_order, lapack_int n, const double* a,
                                lapack_int lda, double* s, double* scond,
                                double* amax );
typedef lapack_int (*cpoequ_work_t)( int matrix_order, lapack_int n,
                                const lapack_complex_float* a, lapack_int lda,
                                float* s, float* scond, float* amax );
typedef lapack_int (*zpoequ_work_t)( int matrix_order, lapack_int n,
                                const lapack_complex_double* a, lapack_int lda,
                                double* s, double* scond, double* amax );

typedef lapack_int (*spoequb_work_t)( int matrix_order, lapack_int n, const float* a,
                                 lapack_int lda, float* s, float* scond,
                                 float* amax );
typedef lapack_int (*dpoequb_work_t)( int matrix_order, lapack_int n,
                                 const double* a, lapack_int lda, double* s,
                                 double* scond, double* amax );
typedef lapack_int (*cpoequb_work_t)( int matrix_order, lapack_int n,
                                 const lapack_complex_float* a, lapack_int lda,
                                 float* s, float* scond, float* amax );
typedef lapack_int (*zpoequb_work_t)( int matrix_order, lapack_int n,
                                 const lapack_complex_double* a, lapack_int lda,
                                 double* s, double* scond, double* amax );

typedef lapack_int (*sporfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const float* a, lapack_int lda,
                                const float* af, lapack_int ldaf,
                                const float* b, lapack_int ldb, float* x,
                                lapack_int ldx, float* ferr, float* berr,
                                float* work, lapack_int* iwork );
typedef lapack_int (*dporfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const double* a,
                                lapack_int lda, const double* af,
                                lapack_int ldaf, const double* b,
                                lapack_int ldb, double* x, lapack_int ldx,
                                double* ferr, double* berr, double* work,
                                lapack_int* iwork );
typedef lapack_int (*cporfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* a,
                                lapack_int lda, const lapack_complex_float* af,
                                lapack_int ldaf, const lapack_complex_float* b,
                                lapack_int ldb, lapack_complex_float* x,
                                lapack_int ldx, float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zporfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_double* a,
                                lapack_int lda, const lapack_complex_double* af,
                                lapack_int ldaf, const lapack_complex_double* b,
                                lapack_int ldb, lapack_complex_double* x,
                                lapack_int ldx, double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*sporfsx_work_t)( int matrix_order, char uplo, char equed,
                                 lapack_int n, lapack_int nrhs, const float* a,
                                 lapack_int lda, const float* af,
                                 lapack_int ldaf, const float* s,
                                 const float* b, lapack_int ldb, float* x,
                                 lapack_int ldx, float* rcond, float* berr,
                                 lapack_int n_err_bnds, float* err_bnds_norm,
                                 float* err_bnds_comp, lapack_int nparams,
                                 float* params, float* work,
                                 lapack_int* iwork );
typedef lapack_int (*dporfsx_work_t)( int matrix_order, char uplo, char equed,
                                 lapack_int n, lapack_int nrhs, const double* a,
                                 lapack_int lda, const double* af,
                                 lapack_int ldaf, const double* s,
                                 const double* b, lapack_int ldb, double* x,
                                 lapack_int ldx, double* rcond, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, double* work,
                                 lapack_int* iwork );
typedef lapack_int (*cporfsx_work_t)( int matrix_order, char uplo, char equed,
                                 lapack_int n, lapack_int nrhs,
                                 const lapack_complex_float* a, lapack_int lda,
                                 const lapack_complex_float* af,
                                 lapack_int ldaf, const float* s,
                                 const lapack_complex_float* b, lapack_int ldb,
                                 lapack_complex_float* x, lapack_int ldx,
                                 float* rcond, float* berr,
                                 lapack_int n_err_bnds, float* err_bnds_norm,
                                 float* err_bnds_comp, lapack_int nparams,
                                 float* params, lapack_complex_float* work,
                                 float* rwork );
typedef lapack_int (*zporfsx_work_t)( int matrix_order, char uplo, char equed,
                                 lapack_int n, lapack_int nrhs,
                                 const lapack_complex_double* a, lapack_int lda,
                                 const lapack_complex_double* af,
                                 lapack_int ldaf, const double* s,
                                 const lapack_complex_double* b, lapack_int ldb,
                                 lapack_complex_double* x, lapack_int ldx,
                                 double* rcond, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, lapack_complex_double* work,
                                 double* rwork );

typedef lapack_int (*sposv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, float* a, lapack_int lda,
                               float* b, lapack_int ldb );
typedef lapack_int (*dposv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, double* a, lapack_int lda,
                               double* b, lapack_int ldb );
typedef lapack_int (*cposv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, lapack_complex_float* a,
                               lapack_int lda, lapack_complex_float* b,
                               lapack_int ldb );
typedef lapack_int (*zposv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, lapack_complex_double* a,
                               lapack_int lda, lapack_complex_double* b,
                               lapack_int ldb );
typedef lapack_int (*dsposv_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, double* a, lapack_int lda,
                                double* b, lapack_int ldb, double* x,
                                lapack_int ldx, double* work, float* swork,
                                lapack_int* iter );
typedef lapack_int (*zcposv_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* b,
                                lapack_int ldb, lapack_complex_double* x,
                                lapack_int ldx, lapack_complex_double* work,
                                lapack_complex_float* swork, double* rwork,
                                lapack_int* iter );

typedef lapack_int (*sposvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs, float* a,
                                lapack_int lda, float* af, lapack_int ldaf,
                                char* equed, float* s, float* b, lapack_int ldb,
                                float* x, lapack_int ldx, float* rcond,
                                float* ferr, float* berr, float* work,
                                lapack_int* iwork );
typedef lapack_int (*dposvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs, double* a,
                                lapack_int lda, double* af, lapack_int ldaf,
                                char* equed, double* s, double* b,
                                lapack_int ldb, double* x, lapack_int ldx,
                                double* rcond, double* ferr, double* berr,
                                double* work, lapack_int* iwork );
typedef lapack_int (*cposvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* af, lapack_int ldaf,
                                char* equed, float* s, lapack_complex_float* b,
                                lapack_int ldb, lapack_complex_float* x,
                                lapack_int ldx, float* rcond, float* ferr,
                                float* berr, lapack_complex_float* work,
                                float* rwork );
typedef lapack_int (*zposvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* af, lapack_int ldaf,
                                char* equed, double* s,
                                lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* rcond, double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*sposvxx_work_t)( int matrix_order, char fact, char uplo,
                                 lapack_int n, lapack_int nrhs, float* a,
                                 lapack_int lda, float* af, lapack_int ldaf,
                                 char* equed, float* s, float* b,
                                 lapack_int ldb, float* x, lapack_int ldx,
                                 float* rcond, float* rpvgrw, float* berr,
                                 lapack_int n_err_bnds, float* err_bnds_norm,
                                 float* err_bnds_comp, lapack_int nparams,
                                 float* params, float* work,
                                 lapack_int* iwork );
typedef lapack_int (*dposvxx_work_t)( int matrix_order, char fact, char uplo,
                                 lapack_int n, lapack_int nrhs, double* a,
                                 lapack_int lda, double* af, lapack_int ldaf,
                                 char* equed, double* s, double* b,
                                 lapack_int ldb, double* x, lapack_int ldx,
                                 double* rcond, double* rpvgrw, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, double* work,
                                 lapack_int* iwork );
typedef lapack_int (*cposvxx_work_t)( int matrix_order, char fact, char uplo,
                                 lapack_int n, lapack_int nrhs,
                                 lapack_complex_float* a, lapack_int lda,
                                 lapack_complex_float* af, lapack_int ldaf,
                                 char* equed, float* s, lapack_complex_float* b,
                                 lapack_int ldb, lapack_complex_float* x,
                                 lapack_int ldx, float* rcond, float* rpvgrw,
                                 float* berr, lapack_int n_err_bnds,
                                 float* err_bnds_norm, float* err_bnds_comp,
                                 lapack_int nparams, float* params,
                                 lapack_complex_float* work, float* rwork );
typedef lapack_int (*zposvxx_work_t)( int matrix_order, char fact, char uplo,
                                 lapack_int n, lapack_int nrhs,
                                 lapack_complex_double* a, lapack_int lda,
                                 lapack_complex_double* af, lapack_int ldaf,
                                 char* equed, double* s,
                                 lapack_complex_double* b, lapack_int ldb,
                                 lapack_complex_double* x, lapack_int ldx,
                                 double* rcond, double* rpvgrw, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, lapack_complex_double* work,
                                 double* rwork );

typedef lapack_int (*spotrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                float* a, lapack_int lda );
typedef lapack_int (*dpotrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                double* a, lapack_int lda );
typedef lapack_int (*cpotrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* a, lapack_int lda );
typedef lapack_int (*zpotrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*spotri_work_t)( int matrix_order, char uplo, lapack_int n,
                                float* a, lapack_int lda );
typedef lapack_int (*dpotri_work_t)( int matrix_order, char uplo, lapack_int n,
                                double* a, lapack_int lda );
typedef lapack_int (*cpotri_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* a, lapack_int lda );
typedef lapack_int (*zpotri_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*spotrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const float* a, lapack_int lda,
                                float* b, lapack_int ldb );
typedef lapack_int (*dpotrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const double* a,
                                lapack_int lda, double* b, lapack_int ldb );
typedef lapack_int (*cpotrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* b,
                                lapack_int ldb );
typedef lapack_int (*zpotrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* b,
                                lapack_int ldb );

typedef lapack_int (*sppcon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const float* ap, float anorm, float* rcond,
                                float* work, lapack_int* iwork );
typedef lapack_int (*dppcon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const double* ap, double anorm, double* rcond,
                                double* work, lapack_int* iwork );
typedef lapack_int (*cppcon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_float* ap, float anorm,
                                float* rcond, lapack_complex_float* work,
                                float* rwork );
typedef lapack_int (*zppcon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_double* ap, double anorm,
                                double* rcond, lapack_complex_double* work,
                                double* rwork );

typedef lapack_int (*sppequ_work_t)( int matrix_order, char uplo, lapack_int n,
                                const float* ap, float* s, float* scond,
                                float* amax );
typedef lapack_int (*dppequ_work_t)( int matrix_order, char uplo, lapack_int n,
                                const double* ap, double* s, double* scond,
                                double* amax );
typedef lapack_int (*cppequ_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_float* ap, float* s,
                                float* scond, float* amax );
typedef lapack_int (*zppequ_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_double* ap, double* s,
                                double* scond, double* amax );

typedef lapack_int (*spprfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const float* ap,
                                const float* afp, const float* b,
                                lapack_int ldb, float* x, lapack_int ldx,
                                float* ferr, float* berr, float* work,
                                lapack_int* iwork );
typedef lapack_int (*dpprfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const double* ap,
                                const double* afp, const double* b,
                                lapack_int ldb, double* x, lapack_int ldx,
                                double* ferr, double* berr, double* work,
                                lapack_int* iwork );
typedef lapack_int (*cpprfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* ap,
                                const lapack_complex_float* afp,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* x, lapack_int ldx,
                                float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zpprfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs,
                                const lapack_complex_double* ap,
                                const lapack_complex_double* afp,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*sppsv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, float* ap, float* b,
                               lapack_int ldb );
typedef lapack_int (*dppsv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, double* ap, double* b,
                               lapack_int ldb );
typedef lapack_int (*cppsv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, lapack_complex_float* ap,
                               lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zppsv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, lapack_complex_double* ap,
                               lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*sppsvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs, float* ap,
                                float* afp, char* equed, float* s, float* b,
                                lapack_int ldb, float* x, lapack_int ldx,
                                float* rcond, float* ferr, float* berr,
                                float* work, lapack_int* iwork );
typedef lapack_int (*dppsvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs, double* ap,
                                double* afp, char* equed, double* s, double* b,
                                lapack_int ldb, double* x, lapack_int ldx,
                                double* rcond, double* ferr, double* berr,
                                double* work, lapack_int* iwork );
typedef lapack_int (*cppsvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs,
                                lapack_complex_float* ap,
                                lapack_complex_float* afp, char* equed,
                                float* s, lapack_complex_float* b,
                                lapack_int ldb, lapack_complex_float* x,
                                lapack_int ldx, float* rcond, float* ferr,
                                float* berr, lapack_complex_float* work,
                                float* rwork );
typedef lapack_int (*zppsvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs,
                                lapack_complex_double* ap,
                                lapack_complex_double* afp, char* equed,
                                double* s, lapack_complex_double* b,
                                lapack_int ldb, lapack_complex_double* x,
                                lapack_int ldx, double* rcond, double* ferr,
                                double* berr, lapack_complex_double* work,
                                double* rwork );

typedef lapack_int (*spptrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                float* ap );
typedef lapack_int (*dpptrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                double* ap );
typedef lapack_int (*cpptrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* ap );
typedef lapack_int (*zpptrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* ap );

typedef lapack_int (*spptri_work_t)( int matrix_order, char uplo, lapack_int n,
                                float* ap );
typedef lapack_int (*dpptri_work_t)( int matrix_order, char uplo, lapack_int n,
                                double* ap );
typedef lapack_int (*cpptri_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* ap );
typedef lapack_int (*zpptri_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* ap );

typedef lapack_int (*spptrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const float* ap, float* b,
                                lapack_int ldb );
typedef lapack_int (*dpptrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const double* ap, double* b,
                                lapack_int ldb );
typedef lapack_int (*cpptrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* ap,
                                lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zpptrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs,
                                const lapack_complex_double* ap,
                                lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*spstrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                float* a, lapack_int lda, lapack_int* piv,
                                lapack_int* rank, float tol, float* work );
typedef lapack_int (*dpstrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                double* a, lapack_int lda, lapack_int* piv,
                                lapack_int* rank, double tol, double* work );
typedef lapack_int (*cpstrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_int* piv, lapack_int* rank, float tol,
                                float* work );
typedef lapack_int (*zpstrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_int* piv, lapack_int* rank, double tol,
                                double* work );

typedef lapack_int (*sptcon_work_t)( lapack_int n, const float* d, const float* e,
                                float anorm, float* rcond, float* work );
typedef lapack_int (*dptcon_work_t)( lapack_int n, const double* d, const double* e,
                                double anorm, double* rcond, double* work );
typedef lapack_int (*cptcon_work_t)( lapack_int n, const float* d,
                                const lapack_complex_float* e, float anorm,
                                float* rcond, float* work );
typedef lapack_int (*zptcon_work_t)( lapack_int n, const double* d,
                                const lapack_complex_double* e, double anorm,
                                double* rcond, double* work );

typedef lapack_int (*spteqr_work_t)( int matrix_order, char compz, lapack_int n,
                                float* d, float* e, float* z, lapack_int ldz,
                                float* work );
typedef lapack_int (*dpteqr_work_t)( int matrix_order, char compz, lapack_int n,
                                double* d, double* e, double* z, lapack_int ldz,
                                double* work );
typedef lapack_int (*cpteqr_work_t)( int matrix_order, char compz, lapack_int n,
                                float* d, float* e, lapack_complex_float* z,
                                lapack_int ldz, float* work );
typedef lapack_int (*zpteqr_work_t)( int matrix_order, char compz, lapack_int n,
                                double* d, double* e, lapack_complex_double* z,
                                lapack_int ldz, double* work );

typedef lapack_int (*sptrfs_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                                const float* d, const float* e, const float* df,
                                const float* ef, const float* b, lapack_int ldb,
                                float* x, lapack_int ldx, float* ferr,
                                float* berr, float* work );
typedef lapack_int (*dptrfs_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                                const double* d, const double* e,
                                const double* df, const double* ef,
                                const double* b, lapack_int ldb, double* x,
                                lapack_int ldx, double* ferr, double* berr,
                                double* work );
typedef lapack_int (*cptrfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const float* d,
                                const lapack_complex_float* e, const float* df,
                                const lapack_complex_float* ef,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* x, lapack_int ldx,
                                float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zptrfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const double* d,
                                const lapack_complex_double* e,
                                const double* df,
                                const lapack_complex_double* ef,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*sptsv_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                               float* d, float* e, float* b, lapack_int ldb );
typedef lapack_int (*dptsv_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                               double* d, double* e, double* b,
                               lapack_int ldb );
typedef lapack_int (*cptsv_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                               float* d, lapack_complex_float* e,
                               lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zptsv_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                               double* d, lapack_complex_double* e,
                               lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*sptsvx_work_t)( int matrix_order, char fact, lapack_int n,
                                lapack_int nrhs, const float* d, const float* e,
                                float* df, float* ef, const float* b,
                                lapack_int ldb, float* x, lapack_int ldx,
                                float* rcond, float* ferr, float* berr,
                                float* work );
typedef lapack_int (*dptsvx_work_t)( int matrix_order, char fact, lapack_int n,
                                lapack_int nrhs, const double* d,
                                const double* e, double* df, double* ef,
                                const double* b, lapack_int ldb, double* x,
                                lapack_int ldx, double* rcond, double* ferr,
                                double* berr, double* work );
typedef lapack_int (*cptsvx_work_t)( int matrix_order, char fact, lapack_int n,
                                lapack_int nrhs, const float* d,
                                const lapack_complex_float* e, float* df,
                                lapack_complex_float* ef,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* x, lapack_int ldx,
                                float* rcond, float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zptsvx_work_t)( int matrix_order, char fact, lapack_int n,
                                lapack_int nrhs, const double* d,
                                const lapack_complex_double* e, double* df,
                                lapack_complex_double* ef,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* rcond, double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*spttrf_work_t)( lapack_int n, float* d, float* e );
typedef lapack_int (*dpttrf_work_t)( lapack_int n, double* d, double* e );
typedef lapack_int (*cpttrf_work_t)( lapack_int n, float* d,
                                lapack_complex_float* e );
typedef lapack_int (*zpttrf_work_t)( lapack_int n, double* d,
                                lapack_complex_double* e );

typedef lapack_int (*spttrs_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                                const float* d, const float* e, float* b,
                                lapack_int ldb );
typedef lapack_int (*dpttrs_work_t)( int matrix_order, lapack_int n, lapack_int nrhs,
                                const double* d, const double* e, double* b,
                                lapack_int ldb );
typedef lapack_int (*cpttrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const float* d,
                                const lapack_complex_float* e,
                                lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zpttrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const double* d,
                                const lapack_complex_double* e,
                                lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*ssbev_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, lapack_int kd, float* ab,
                               lapack_int ldab, float* w, float* z,
                               lapack_int ldz, float* work );
typedef lapack_int (*dsbev_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, lapack_int kd, double* ab,
                               lapack_int ldab, double* w, double* z,
                               lapack_int ldz, double* work );

typedef lapack_int (*ssbevd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, lapack_int kd, float* ab,
                                lapack_int ldab, float* w, float* z,
                                lapack_int ldz, float* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*dsbevd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, lapack_int kd, double* ab,
                                lapack_int ldab, double* w, double* z,
                                lapack_int ldz, double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );

typedef lapack_int (*ssbevx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n, lapack_int kd,
                                float* ab, lapack_int ldab, float* q,
                                lapack_int ldq, float vl, float vu,
                                lapack_int il, lapack_int iu, float abstol,
                                lapack_int* m, float* w, float* z,
                                lapack_int ldz, float* work, lapack_int* iwork,
                                lapack_int* ifail );
typedef lapack_int (*dsbevx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n, lapack_int kd,
                                double* ab, lapack_int ldab, double* q,
                                lapack_int ldq, double vl, double vu,
                                lapack_int il, lapack_int iu, double abstol,
                                lapack_int* m, double* w, double* z,
                                lapack_int ldz, double* work, lapack_int* iwork,
                                lapack_int* ifail );

typedef lapack_int (*ssbgst_work_t)( int matrix_order, char vect, char uplo,
                                lapack_int n, lapack_int ka, lapack_int kb,
                                float* ab, lapack_int ldab, const float* bb,
                                lapack_int ldbb, float* x, lapack_int ldx,
                                float* work );
typedef lapack_int (*dsbgst_work_t)( int matrix_order, char vect, char uplo,
                                lapack_int n, lapack_int ka, lapack_int kb,
                                double* ab, lapack_int ldab, const double* bb,
                                lapack_int ldbb, double* x, lapack_int ldx,
                                double* work );

typedef lapack_int (*ssbgv_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, lapack_int ka, lapack_int kb,
                               float* ab, lapack_int ldab, float* bb,
                               lapack_int ldbb, float* w, float* z,
                               lapack_int ldz, float* work );
typedef lapack_int (*dsbgv_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, lapack_int ka, lapack_int kb,
                               double* ab, lapack_int ldab, double* bb,
                               lapack_int ldbb, double* w, double* z,
                               lapack_int ldz, double* work );

typedef lapack_int (*ssbgvd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, lapack_int ka, lapack_int kb,
                                float* ab, lapack_int ldab, float* bb,
                                lapack_int ldbb, float* w, float* z,
                                lapack_int ldz, float* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*dsbgvd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, lapack_int ka, lapack_int kb,
                                double* ab, lapack_int ldab, double* bb,
                                lapack_int ldbb, double* w, double* z,
                                lapack_int ldz, double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );

typedef lapack_int (*ssbgvx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n, lapack_int ka,
                                lapack_int kb, float* ab, lapack_int ldab,
                                float* bb, lapack_int ldbb, float* q,
                                lapack_int ldq, float vl, float vu,
                                lapack_int il, lapack_int iu, float abstol,
                                lapack_int* m, float* w, float* z,
                                lapack_int ldz, float* work, lapack_int* iwork,
                                lapack_int* ifail );
typedef lapack_int (*dsbgvx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n, lapack_int ka,
                                lapack_int kb, double* ab, lapack_int ldab,
                                double* bb, lapack_int ldbb, double* q,
                                lapack_int ldq, double vl, double vu,
                                lapack_int il, lapack_int iu, double abstol,
                                lapack_int* m, double* w, double* z,
                                lapack_int ldz, double* work, lapack_int* iwork,
                                lapack_int* ifail );

typedef lapack_int (*ssbtrd_work_t)( int matrix_order, char vect, char uplo,
                                lapack_int n, lapack_int kd, float* ab,
                                lapack_int ldab, float* d, float* e, float* q,
                                lapack_int ldq, float* work );
typedef lapack_int (*dsbtrd_work_t)( int matrix_order, char vect, char uplo,
                                lapack_int n, lapack_int kd, double* ab,
                                lapack_int ldab, double* d, double* e,
                                double* q, lapack_int ldq, double* work );

typedef lapack_int (*ssfrk_work_t)( int matrix_order, char transr, char uplo,
                               char trans, lapack_int n, lapack_int k,
                               float alpha, const float* a, lapack_int lda,
                               float beta, float* c );
typedef lapack_int (*dsfrk_work_t)( int matrix_order, char transr, char uplo,
                               char trans, lapack_int n, lapack_int k,
                               double alpha, const double* a, lapack_int lda,
                               double beta, double* c );

typedef lapack_int (*sspcon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const float* ap, const lapack_int* ipiv,
                                float anorm, float* rcond, float* work,
                                lapack_int* iwork );
typedef lapack_int (*dspcon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const double* ap, const lapack_int* ipiv,
                                double anorm, double* rcond, double* work,
                                lapack_int* iwork );
typedef lapack_int (*cspcon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_float* ap,
                                const lapack_int* ipiv, float anorm,
                                float* rcond, lapack_complex_float* work );
typedef lapack_int (*zspcon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_double* ap,
                                const lapack_int* ipiv, double anorm,
                                double* rcond, lapack_complex_double* work );

typedef lapack_int (*sspev_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, float* ap, float* w, float* z,
                               lapack_int ldz, float* work );
typedef lapack_int (*dspev_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, double* ap, double* w, double* z,
                               lapack_int ldz, double* work );

typedef lapack_int (*sspevd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, float* ap, float* w, float* z,
                                lapack_int ldz, float* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*dspevd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, double* ap, double* w, double* z,
                                lapack_int ldz, double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );

typedef lapack_int (*sspevx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n, float* ap, float vl,
                                float vu, lapack_int il, lapack_int iu,
                                float abstol, lapack_int* m, float* w, float* z,
                                lapack_int ldz, float* work, lapack_int* iwork,
                                lapack_int* ifail );
typedef lapack_int (*dspevx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n, double* ap, double vl,
                                double vu, lapack_int il, lapack_int iu,
                                double abstol, lapack_int* m, double* w,
                                double* z, lapack_int ldz, double* work,
                                lapack_int* iwork, lapack_int* ifail );

typedef lapack_int (*sspgst_work_t)( int matrix_order, lapack_int itype, char uplo,
                                lapack_int n, float* ap, const float* bp );
typedef lapack_int (*dspgst_work_t)( int matrix_order, lapack_int itype, char uplo,
                                lapack_int n, double* ap, const double* bp );

typedef lapack_int (*sspgv_work_t)( int matrix_order, lapack_int itype, char jobz,
                               char uplo, lapack_int n, float* ap, float* bp,
                               float* w, float* z, lapack_int ldz,
                               float* work );
typedef lapack_int (*dspgv_work_t)( int matrix_order, lapack_int itype, char jobz,
                               char uplo, lapack_int n, double* ap, double* bp,
                               double* w, double* z, lapack_int ldz,
                               double* work );

typedef lapack_int (*sspgvd_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char uplo, lapack_int n, float* ap, float* bp,
                                float* w, float* z, lapack_int ldz, float* work,
                                lapack_int lwork, lapack_int* iwork,
                                lapack_int liwork );
typedef lapack_int (*dspgvd_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char uplo, lapack_int n, double* ap, double* bp,
                                double* w, double* z, lapack_int ldz,
                                double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );

typedef lapack_int (*sspgvx_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char range, char uplo, lapack_int n, float* ap,
                                float* bp, float vl, float vu, lapack_int il,
                                lapack_int iu, float abstol, lapack_int* m,
                                float* w, float* z, lapack_int ldz, float* work,
                                lapack_int* iwork, lapack_int* ifail );
typedef lapack_int (*dspgvx_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char range, char uplo, lapack_int n, double* ap,
                                double* bp, double vl, double vu, lapack_int il,
                                lapack_int iu, double abstol, lapack_int* m,
                                double* w, double* z, lapack_int ldz,
                                double* work, lapack_int* iwork,
                                lapack_int* ifail );

typedef lapack_int (*ssprfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const float* ap,
                                const float* afp, const lapack_int* ipiv,
                                const float* b, lapack_int ldb, float* x,
                                lapack_int ldx, float* ferr, float* berr,
                                float* work, lapack_int* iwork );
typedef lapack_int (*dsprfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const double* ap,
                                const double* afp, const lapack_int* ipiv,
                                const double* b, lapack_int ldb, double* x,
                                lapack_int ldx, double* ferr, double* berr,
                                double* work, lapack_int* iwork );
typedef lapack_int (*csprfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* ap,
                                const lapack_complex_float* afp,
                                const lapack_int* ipiv,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* x, lapack_int ldx,
                                float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zsprfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs,
                                const lapack_complex_double* ap,
                                const lapack_complex_double* afp,
                                const lapack_int* ipiv,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*sspsv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, float* ap, lapack_int* ipiv,
                               float* b, lapack_int ldb );
typedef lapack_int (*dspsv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, double* ap, lapack_int* ipiv,
                               double* b, lapack_int ldb );
typedef lapack_int (*cspsv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, lapack_complex_float* ap,
                               lapack_int* ipiv, lapack_complex_float* b,
                               lapack_int ldb );
typedef lapack_int (*zspsv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, lapack_complex_double* ap,
                               lapack_int* ipiv, lapack_complex_double* b,
                               lapack_int ldb );

typedef lapack_int (*sspsvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs, const float* ap,
                                float* afp, lapack_int* ipiv, const float* b,
                                lapack_int ldb, float* x, lapack_int ldx,
                                float* rcond, float* ferr, float* berr,
                                float* work, lapack_int* iwork );
typedef lapack_int (*dspsvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs, const double* ap,
                                double* afp, lapack_int* ipiv, const double* b,
                                lapack_int ldb, double* x, lapack_int ldx,
                                double* rcond, double* ferr, double* berr,
                                double* work, lapack_int* iwork );
typedef lapack_int (*cspsvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs,
                                const lapack_complex_float* ap,
                                lapack_complex_float* afp, lapack_int* ipiv,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* x, lapack_int ldx,
                                float* rcond, float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zspsvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs,
                                const lapack_complex_double* ap,
                                lapack_complex_double* afp, lapack_int* ipiv,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* rcond, double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*ssptrd_work_t)( int matrix_order, char uplo, lapack_int n,
                                float* ap, float* d, float* e, float* tau );
typedef lapack_int (*dsptrd_work_t)( int matrix_order, char uplo, lapack_int n,
                                double* ap, double* d, double* e, double* tau );

typedef lapack_int (*ssptrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                float* ap, lapack_int* ipiv );
typedef lapack_int (*dsptrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                double* ap, lapack_int* ipiv );
typedef lapack_int (*csptrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* ap, lapack_int* ipiv );
typedef lapack_int (*zsptrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* ap, lapack_int* ipiv );

typedef lapack_int (*ssptri_work_t)( int matrix_order, char uplo, lapack_int n,
                                float* ap, const lapack_int* ipiv,
                                float* work );
typedef lapack_int (*dsptri_work_t)( int matrix_order, char uplo, lapack_int n,
                                double* ap, const lapack_int* ipiv,
                                double* work );
typedef lapack_int (*csptri_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* ap,
                                const lapack_int* ipiv,
                                lapack_complex_float* work );
typedef lapack_int (*zsptri_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* ap,
                                const lapack_int* ipiv,
                                lapack_complex_double* work );

typedef lapack_int (*ssptrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const float* ap,
                                const lapack_int* ipiv, float* b,
                                lapack_int ldb );
typedef lapack_int (*dsptrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const double* ap,
                                const lapack_int* ipiv, double* b,
                                lapack_int ldb );
typedef lapack_int (*csptrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* ap,
                                const lapack_int* ipiv, lapack_complex_float* b,
                                lapack_int ldb );
typedef lapack_int (*zsptrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs,
                                const lapack_complex_double* ap,
                                const lapack_int* ipiv,
                                lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*sstebz_work_t)( char range, char order, lapack_int n, float vl,
                                float vu, lapack_int il, lapack_int iu,
                                float abstol, const float* d, const float* e,
                                lapack_int* m, lapack_int* nsplit, float* w,
                                lapack_int* iblock, lapack_int* isplit,
                                float* work, lapack_int* iwork );
typedef lapack_int (*dstebz_work_t)( char range, char order, lapack_int n, double vl,
                                double vu, lapack_int il, lapack_int iu,
                                double abstol, const double* d, const double* e,
                                lapack_int* m, lapack_int* nsplit, double* w,
                                lapack_int* iblock, lapack_int* isplit,
                                double* work, lapack_int* iwork );

typedef lapack_int (*sstedc_work_t)( int matrix_order, char compz, lapack_int n,
                                float* d, float* e, float* z, lapack_int ldz,
                                float* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*dstedc_work_t)( int matrix_order, char compz, lapack_int n,
                                double* d, double* e, double* z, lapack_int ldz,
                                double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*cstedc_work_t)( int matrix_order, char compz, lapack_int n,
                                float* d, float* e, lapack_complex_float* z,
                                lapack_int ldz, lapack_complex_float* work,
                                lapack_int lwork, float* rwork,
                                lapack_int lrwork, lapack_int* iwork,
                                lapack_int liwork );
typedef lapack_int (*zstedc_work_t)( int matrix_order, char compz, lapack_int n,
                                double* d, double* e, lapack_complex_double* z,
                                lapack_int ldz, lapack_complex_double* work,
                                lapack_int lwork, double* rwork,
                                lapack_int lrwork, lapack_int* iwork,
                                lapack_int liwork );

typedef lapack_int (*sstegr_work_t)( int matrix_order, char jobz, char range,
                                lapack_int n, float* d, float* e, float vl,
                                float vu, lapack_int il, lapack_int iu,
                                float abstol, lapack_int* m, float* w, float* z,
                                lapack_int ldz, lapack_int* isuppz, float* work,
                                lapack_int lwork, lapack_int* iwork,
                                lapack_int liwork );
typedef lapack_int (*dstegr_work_t)( int matrix_order, char jobz, char range,
                                lapack_int n, double* d, double* e, double vl,
                                double vu, lapack_int il, lapack_int iu,
                                double abstol, lapack_int* m, double* w,
                                double* z, lapack_int ldz, lapack_int* isuppz,
                                double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*cstegr_work_t)( int matrix_order, char jobz, char range,
                                lapack_int n, float* d, float* e, float vl,
                                float vu, lapack_int il, lapack_int iu,
                                float abstol, lapack_int* m, float* w,
                                lapack_complex_float* z, lapack_int ldz,
                                lapack_int* isuppz, float* work,
                                lapack_int lwork, lapack_int* iwork,
                                lapack_int liwork );
typedef lapack_int (*zstegr_work_t)( int matrix_order, char jobz, char range,
                                lapack_int n, double* d, double* e, double vl,
                                double vu, lapack_int il, lapack_int iu,
                                double abstol, lapack_int* m, double* w,
                                lapack_complex_double* z, lapack_int ldz,
                                lapack_int* isuppz, double* work,
                                lapack_int lwork, lapack_int* iwork,
                                lapack_int liwork );

typedef lapack_int (*sstein_work_t)( int matrix_order, lapack_int n, const float* d,
                                const float* e, lapack_int m, const float* w,
                                const lapack_int* iblock,
                                const lapack_int* isplit, float* z,
                                lapack_int ldz, float* work, lapack_int* iwork,
                                lapack_int* ifailv );
typedef lapack_int (*dstein_work_t)( int matrix_order, lapack_int n, const double* d,
                                const double* e, lapack_int m, const double* w,
                                const lapack_int* iblock,
                                const lapack_int* isplit, double* z,
                                lapack_int ldz, double* work, lapack_int* iwork,
                                lapack_int* ifailv );
typedef lapack_int (*cstein_work_t)( int matrix_order, lapack_int n, const float* d,
                                const float* e, lapack_int m, const float* w,
                                const lapack_int* iblock,
                                const lapack_int* isplit,
                                lapack_complex_float* z, lapack_int ldz,
                                float* work, lapack_int* iwork,
                                lapack_int* ifailv );
typedef lapack_int (*zstein_work_t)( int matrix_order, lapack_int n, const double* d,
                                const double* e, lapack_int m, const double* w,
                                const lapack_int* iblock,
                                const lapack_int* isplit,
                                lapack_complex_double* z, lapack_int ldz,
                                double* work, lapack_int* iwork,
                                lapack_int* ifailv );

typedef lapack_int (*sstemr_work_t)( int matrix_order, char jobz, char range,
                                lapack_int n, float* d, float* e, float vl,
                                float vu, lapack_int il, lapack_int iu,
                                lapack_int* m, float* w, float* z,
                                lapack_int ldz, lapack_int nzc,
                                lapack_int* isuppz, lapack_logical* tryrac,
                                float* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*dstemr_work_t)( int matrix_order, char jobz, char range,
                                lapack_int n, double* d, double* e, double vl,
                                double vu, lapack_int il, lapack_int iu,
                                lapack_int* m, double* w, double* z,
                                lapack_int ldz, lapack_int nzc,
                                lapack_int* isuppz, lapack_logical* tryrac,
                                double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*cstemr_work_t)( int matrix_order, char jobz, char range,
                                lapack_int n, float* d, float* e, float vl,
                                float vu, lapack_int il, lapack_int iu,
                                lapack_int* m, float* w,
                                lapack_complex_float* z, lapack_int ldz,
                                lapack_int nzc, lapack_int* isuppz,
                                lapack_logical* tryrac, float* work,
                                lapack_int lwork, lapack_int* iwork,
                                lapack_int liwork );
typedef lapack_int (*zstemr_work_t)( int matrix_order, char jobz, char range,
                                lapack_int n, double* d, double* e, double vl,
                                double vu, lapack_int il, lapack_int iu,
                                lapack_int* m, double* w,
                                lapack_complex_double* z, lapack_int ldz,
                                lapack_int nzc, lapack_int* isuppz,
                                lapack_logical* tryrac, double* work,
                                lapack_int lwork, lapack_int* iwork,
                                lapack_int liwork );

typedef lapack_int (*ssteqr_work_t)( int matrix_order, char compz, lapack_int n,
                                float* d, float* e, float* z, lapack_int ldz,
                                float* work );
typedef lapack_int (*dsteqr_work_t)( int matrix_order, char compz, lapack_int n,
                                double* d, double* e, double* z, lapack_int ldz,
                                double* work );
typedef lapack_int (*csteqr_work_t)( int matrix_order, char compz, lapack_int n,
                                float* d, float* e, lapack_complex_float* z,
                                lapack_int ldz, float* work );
typedef lapack_int (*zsteqr_work_t)( int matrix_order, char compz, lapack_int n,
                                double* d, double* e, lapack_complex_double* z,
                                lapack_int ldz, double* work );

typedef lapack_int (*ssterf_work_t)( lapack_int n, float* d, float* e );
typedef lapack_int (*dsterf_work_t)( lapack_int n, double* d, double* e );

typedef lapack_int (*sstev_work_t)( int matrix_order, char jobz, lapack_int n,
                               float* d, float* e, float* z, lapack_int ldz,
                               float* work );
typedef lapack_int (*dstev_work_t)( int matrix_order, char jobz, lapack_int n,
                               double* d, double* e, double* z, lapack_int ldz,
                               double* work );

typedef lapack_int (*sstevd_work_t)( int matrix_order, char jobz, lapack_int n,
                                float* d, float* e, float* z, lapack_int ldz,
                                float* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*dstevd_work_t)( int matrix_order, char jobz, lapack_int n,
                                double* d, double* e, double* z, lapack_int ldz,
                                double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );

typedef lapack_int (*sstevr_work_t)( int matrix_order, char jobz, char range,
                                lapack_int n, float* d, float* e, float vl,
                                float vu, lapack_int il, lapack_int iu,
                                float abstol, lapack_int* m, float* w, float* z,
                                lapack_int ldz, lapack_int* isuppz, float* work,
                                lapack_int lwork, lapack_int* iwork,
                                lapack_int liwork );
typedef lapack_int (*dstevr_work_t)( int matrix_order, char jobz, char range,
                                lapack_int n, double* d, double* e, double vl,
                                double vu, lapack_int il, lapack_int iu,
                                double abstol, lapack_int* m, double* w,
                                double* z, lapack_int ldz, lapack_int* isuppz,
                                double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );

typedef lapack_int (*sstevx_work_t)( int matrix_order, char jobz, char range,
                                lapack_int n, float* d, float* e, float vl,
                                float vu, lapack_int il, lapack_int iu,
                                float abstol, lapack_int* m, float* w, float* z,
                                lapack_int ldz, float* work, lapack_int* iwork,
                                lapack_int* ifail );
typedef lapack_int (*dstevx_work_t)( int matrix_order, char jobz, char range,
                                lapack_int n, double* d, double* e, double vl,
                                double vu, lapack_int il, lapack_int iu,
                                double abstol, lapack_int* m, double* w,
                                double* z, lapack_int ldz, double* work,
                                lapack_int* iwork, lapack_int* ifail );

typedef lapack_int (*ssycon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const float* a, lapack_int lda,
                                const lapack_int* ipiv, float anorm,
                                float* rcond, float* work, lapack_int* iwork );
typedef lapack_int (*dsycon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const double* a, lapack_int lda,
                                const lapack_int* ipiv, double anorm,
                                double* rcond, double* work,
                                lapack_int* iwork );
typedef lapack_int (*csycon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_float* a, lapack_int lda,
                                const lapack_int* ipiv, float anorm,
                                float* rcond, lapack_complex_float* work );
typedef lapack_int (*zsycon_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_double* a, lapack_int lda,
                                const lapack_int* ipiv, double anorm,
                                double* rcond, lapack_complex_double* work );

typedef lapack_int (*ssyequb_work_t)( int matrix_order, char uplo, lapack_int n,
                                 const float* a, lapack_int lda, float* s,
                                 float* scond, float* amax, float* work );
typedef lapack_int (*dsyequb_work_t)( int matrix_order, char uplo, lapack_int n,
                                 const double* a, lapack_int lda, double* s,
                                 double* scond, double* amax, double* work );
typedef lapack_int (*csyequb_work_t)( int matrix_order, char uplo, lapack_int n,
                                 const lapack_complex_float* a, lapack_int lda,
                                 float* s, float* scond, float* amax,
                                 lapack_complex_float* work );
typedef lapack_int (*zsyequb_work_t)( int matrix_order, char uplo, lapack_int n,
                                 const lapack_complex_double* a, lapack_int lda,
                                 double* s, double* scond, double* amax,
                                 lapack_complex_double* work );

typedef lapack_int (*ssyev_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, float* a, lapack_int lda, float* w,
                               float* work, lapack_int lwork );
typedef lapack_int (*dsyev_work_t)( int matrix_order, char jobz, char uplo,
                               lapack_int n, double* a, lapack_int lda,
                               double* w, double* work, lapack_int lwork );

typedef lapack_int (*ssyevd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, float* a, lapack_int lda,
                                float* w, float* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*dsyevd_work_t)( int matrix_order, char jobz, char uplo,
                                lapack_int n, double* a, lapack_int lda,
                                double* w, double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );

typedef lapack_int (*ssyevr_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n, float* a,
                                lapack_int lda, float vl, float vu,
                                lapack_int il, lapack_int iu, float abstol,
                                lapack_int* m, float* w, float* z,
                                lapack_int ldz, lapack_int* isuppz, float* work,
                                lapack_int lwork, lapack_int* iwork,
                                lapack_int liwork );
typedef lapack_int (*dsyevr_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n, double* a,
                                lapack_int lda, double vl, double vu,
                                lapack_int il, lapack_int iu, double abstol,
                                lapack_int* m, double* w, double* z,
                                lapack_int ldz, lapack_int* isuppz,
                                double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );

typedef lapack_int (*ssyevx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n, float* a,
                                lapack_int lda, float vl, float vu,
                                lapack_int il, lapack_int iu, float abstol,
                                lapack_int* m, float* w, float* z,
                                lapack_int ldz, float* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int* ifail );
typedef lapack_int (*dsyevx_work_t)( int matrix_order, char jobz, char range,
                                char uplo, lapack_int n, double* a,
                                lapack_int lda, double vl, double vu,
                                lapack_int il, lapack_int iu, double abstol,
                                lapack_int* m, double* w, double* z,
                                lapack_int ldz, double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int* ifail );

typedef lapack_int (*ssygst_work_t)( int matrix_order, lapack_int itype, char uplo,
                                lapack_int n, float* a, lapack_int lda,
                                const float* b, lapack_int ldb );
typedef lapack_int (*dsygst_work_t)( int matrix_order, lapack_int itype, char uplo,
                                lapack_int n, double* a, lapack_int lda,
                                const double* b, lapack_int ldb );

typedef lapack_int (*ssygv_work_t)( int matrix_order, lapack_int itype, char jobz,
                               char uplo, lapack_int n, float* a,
                               lapack_int lda, float* b, lapack_int ldb,
                               float* w, float* work, lapack_int lwork );
typedef lapack_int (*dsygv_work_t)( int matrix_order, lapack_int itype, char jobz,
                               char uplo, lapack_int n, double* a,
                               lapack_int lda, double* b, lapack_int ldb,
                               double* w, double* work, lapack_int lwork );

typedef lapack_int (*ssygvd_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char uplo, lapack_int n, float* a,
                                lapack_int lda, float* b, lapack_int ldb,
                                float* w, float* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*dsygvd_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char uplo, lapack_int n, double* a,
                                lapack_int lda, double* b, lapack_int ldb,
                                double* w, double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );

typedef lapack_int (*ssygvx_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char range, char uplo, lapack_int n, float* a,
                                lapack_int lda, float* b, lapack_int ldb,
                                float vl, float vu, lapack_int il,
                                lapack_int iu, float abstol, lapack_int* m,
                                float* w, float* z, lapack_int ldz, float* work,
                                lapack_int lwork, lapack_int* iwork,
                                lapack_int* ifail );
typedef lapack_int (*dsygvx_work_t)( int matrix_order, lapack_int itype, char jobz,
                                char range, char uplo, lapack_int n, double* a,
                                lapack_int lda, double* b, lapack_int ldb,
                                double vl, double vu, lapack_int il,
                                lapack_int iu, double abstol, lapack_int* m,
                                double* w, double* z, lapack_int ldz,
                                double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int* ifail );

typedef lapack_int (*ssyrfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const float* a, lapack_int lda,
                                const float* af, lapack_int ldaf,
                                const lapack_int* ipiv, const float* b,
                                lapack_int ldb, float* x, lapack_int ldx,
                                float* ferr, float* berr, float* work,
                                lapack_int* iwork );
typedef lapack_int (*dsyrfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const double* a,
                                lapack_int lda, const double* af,
                                lapack_int ldaf, const lapack_int* ipiv,
                                const double* b, lapack_int ldb, double* x,
                                lapack_int ldx, double* ferr, double* berr,
                                double* work, lapack_int* iwork );
typedef lapack_int (*csyrfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* a,
                                lapack_int lda, const lapack_complex_float* af,
                                lapack_int ldaf, const lapack_int* ipiv,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* x, lapack_int ldx,
                                float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*zsyrfs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_double* a,
                                lapack_int lda, const lapack_complex_double* af,
                                lapack_int ldaf, const lapack_int* ipiv,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*ssyrfsx_work_t)( int matrix_order, char uplo, char equed,
                                 lapack_int n, lapack_int nrhs, const float* a,
                                 lapack_int lda, const float* af,
                                 lapack_int ldaf, const lapack_int* ipiv,
                                 const float* s, const float* b, lapack_int ldb,
                                 float* x, lapack_int ldx, float* rcond,
                                 float* berr, lapack_int n_err_bnds,
                                 float* err_bnds_norm, float* err_bnds_comp,
                                 lapack_int nparams, float* params, float* work,
                                 lapack_int* iwork );
typedef lapack_int (*dsyrfsx_work_t)( int matrix_order, char uplo, char equed,
                                 lapack_int n, lapack_int nrhs, const double* a,
                                 lapack_int lda, const double* af,
                                 lapack_int ldaf, const lapack_int* ipiv,
                                 const double* s, const double* b,
                                 lapack_int ldb, double* x, lapack_int ldx,
                                 double* rcond, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, double* work,
                                 lapack_int* iwork );
typedef lapack_int (*csyrfsx_work_t)( int matrix_order, char uplo, char equed,
                                 lapack_int n, lapack_int nrhs,
                                 const lapack_complex_float* a, lapack_int lda,
                                 const lapack_complex_float* af,
                                 lapack_int ldaf, const lapack_int* ipiv,
                                 const float* s, const lapack_complex_float* b,
                                 lapack_int ldb, lapack_complex_float* x,
                                 lapack_int ldx, float* rcond, float* berr,
                                 lapack_int n_err_bnds, float* err_bnds_norm,
                                 float* err_bnds_comp, lapack_int nparams,
                                 float* params, lapack_complex_float* work,
                                 float* rwork );
typedef lapack_int (*zsyrfsx_work_t)( int matrix_order, char uplo, char equed,
                                 lapack_int n, lapack_int nrhs,
                                 const lapack_complex_double* a, lapack_int lda,
                                 const lapack_complex_double* af,
                                 lapack_int ldaf, const lapack_int* ipiv,
                                 const double* s,
                                 const lapack_complex_double* b, lapack_int ldb,
                                 lapack_complex_double* x, lapack_int ldx,
                                 double* rcond, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, lapack_complex_double* work,
                                 double* rwork );

typedef lapack_int (*ssysv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, float* a, lapack_int lda,
                               lapack_int* ipiv, float* b, lapack_int ldb,
                               float* work, lapack_int lwork );
typedef lapack_int (*dsysv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, double* a, lapack_int lda,
                               lapack_int* ipiv, double* b, lapack_int ldb,
                               double* work, lapack_int lwork );
typedef lapack_int (*csysv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, lapack_complex_float* a,
                               lapack_int lda, lapack_int* ipiv,
                               lapack_complex_float* b, lapack_int ldb,
                               lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zsysv_work_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, lapack_complex_double* a,
                               lapack_int lda, lapack_int* ipiv,
                               lapack_complex_double* b, lapack_int ldb,
                               lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*ssysv_rook_work_t)( int matrix_order, char uplo, lapack_int n,
                                    lapack_int nrhs, float* a, lapack_int lda,
                                    lapack_int* ipiv, float* b, lapack_int ldb,
                                    float* work, lapack_int lwork );
typedef lapack_int (*dsysv_rook_work_t)( int matrix_order, char uplo, lapack_int n,
                                    lapack_int nrhs, double* a, lapack_int lda,
                                    lapack_int* ipiv, double* b, lapack_int ldb,
                                    double* work, lapack_int lwork );
typedef lapack_int (*csysv_rook_work_t)( int matrix_order, char uplo, lapack_int n,
                                    lapack_int nrhs, lapack_complex_float* a,
                                    lapack_int lda, lapack_int* ipiv,
                                    lapack_complex_float* b, lapack_int ldb,
                                    lapack_complex_float* work,
                                    lapack_int lwork );
typedef lapack_int (*zsysv_rook_work_t)( int matrix_order, char uplo, lapack_int n,
                                    lapack_int nrhs, lapack_complex_double* a,
                                    lapack_int lda, lapack_int* ipiv,
                                    lapack_complex_double* b, lapack_int ldb,
                                    lapack_complex_double* work,
                                    lapack_int lwork );

typedef lapack_int (*ssysvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs, const float* a,
                                lapack_int lda, float* af, lapack_int ldaf,
                                lapack_int* ipiv, const float* b,
                                lapack_int ldb, float* x, lapack_int ldx,
                                float* rcond, float* ferr, float* berr,
                                float* work, lapack_int lwork,
                                lapack_int* iwork );
typedef lapack_int (*dsysvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs, const double* a,
                                lapack_int lda, double* af, lapack_int ldaf,
                                lapack_int* ipiv, const double* b,
                                lapack_int ldb, double* x, lapack_int ldx,
                                double* rcond, double* ferr, double* berr,
                                double* work, lapack_int lwork,
                                lapack_int* iwork );
typedef lapack_int (*csysvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs,
                                const lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* af, lapack_int ldaf,
                                lapack_int* ipiv, const lapack_complex_float* b,
                                lapack_int ldb, lapack_complex_float* x,
                                lapack_int ldx, float* rcond, float* ferr,
                                float* berr, lapack_complex_float* work,
                                lapack_int lwork, float* rwork );
typedef lapack_int (*zsysvx_work_t)( int matrix_order, char fact, char uplo,
                                lapack_int n, lapack_int nrhs,
                                const lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* af, lapack_int ldaf,
                                lapack_int* ipiv,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* x, lapack_int ldx,
                                double* rcond, double* ferr, double* berr,
                                lapack_complex_double* work, lapack_int lwork,
                                double* rwork );

typedef lapack_int (*ssysvxx_work_t)( int matrix_order, char fact, char uplo,
                                 lapack_int n, lapack_int nrhs, float* a,
                                 lapack_int lda, float* af, lapack_int ldaf,
                                 lapack_int* ipiv, char* equed, float* s,
                                 float* b, lapack_int ldb, float* x,
                                 lapack_int ldx, float* rcond, float* rpvgrw,
                                 float* berr, lapack_int n_err_bnds,
                                 float* err_bnds_norm, float* err_bnds_comp,
                                 lapack_int nparams, float* params, float* work,
                                 lapack_int* iwork );
typedef lapack_int (*dsysvxx_work_t)( int matrix_order, char fact, char uplo,
                                 lapack_int n, lapack_int nrhs, double* a,
                                 lapack_int lda, double* af, lapack_int ldaf,
                                 lapack_int* ipiv, char* equed, double* s,
                                 double* b, lapack_int ldb, double* x,
                                 lapack_int ldx, double* rcond, double* rpvgrw,
                                 double* berr, lapack_int n_err_bnds,
                                 double* err_bnds_norm, double* err_bnds_comp,
                                 lapack_int nparams, double* params,
                                 double* work, lapack_int* iwork );
typedef lapack_int (*csysvxx_work_t)( int matrix_order, char fact, char uplo,
                                 lapack_int n, lapack_int nrhs,
                                 lapack_complex_float* a, lapack_int lda,
                                 lapack_complex_float* af, lapack_int ldaf,
                                 lapack_int* ipiv, char* equed, float* s,
                                 lapack_complex_float* b, lapack_int ldb,
                                 lapack_complex_float* x, lapack_int ldx,
                                 float* rcond, float* rpvgrw, float* berr,
                                 lapack_int n_err_bnds, float* err_bnds_norm,
                                 float* err_bnds_comp, lapack_int nparams,
                                 float* params, lapack_complex_float* work,
                                 float* rwork );
typedef lapack_int (*zsysvxx_work_t)( int matrix_order, char fact, char uplo,
                                 lapack_int n, lapack_int nrhs,
                                 lapack_complex_double* a, lapack_int lda,
                                 lapack_complex_double* af, lapack_int ldaf,
                                 lapack_int* ipiv, char* equed, double* s,
                                 lapack_complex_double* b, lapack_int ldb,
                                 lapack_complex_double* x, lapack_int ldx,
                                 double* rcond, double* rpvgrw, double* berr,
                                 lapack_int n_err_bnds, double* err_bnds_norm,
                                 double* err_bnds_comp, lapack_int nparams,
                                 double* params, lapack_complex_double* work,
                                 double* rwork );

typedef lapack_int (*ssytrd_work_t)( int matrix_order, char uplo, lapack_int n,
                                float* a, lapack_int lda, float* d, float* e,
                                float* tau, float* work, lapack_int lwork );
typedef lapack_int (*dsytrd_work_t)( int matrix_order, char uplo, lapack_int n,
                                double* a, lapack_int lda, double* d, double* e,
                                double* tau, double* work, lapack_int lwork );

typedef lapack_int (*ssytrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                float* a, lapack_int lda, lapack_int* ipiv,
                                float* work, lapack_int lwork );
typedef lapack_int (*dsytrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                double* a, lapack_int lda, lapack_int* ipiv,
                                double* work, lapack_int lwork );
typedef lapack_int (*csytrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_int* ipiv, lapack_complex_float* work,
                                lapack_int lwork );
typedef lapack_int (*zsytrf_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_int* ipiv, lapack_complex_double* work,
                                lapack_int lwork );

typedef lapack_int (*ssytri_work_t)( int matrix_order, char uplo, lapack_int n,
                                float* a, lapack_int lda,
                                const lapack_int* ipiv, float* work );
typedef lapack_int (*dsytri_work_t)( int matrix_order, char uplo, lapack_int n,
                                double* a, lapack_int lda,
                                const lapack_int* ipiv, double* work );
typedef lapack_int (*csytri_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                const lapack_int* ipiv,
                                lapack_complex_float* work );
typedef lapack_int (*zsytri_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                const lapack_int* ipiv,
                                lapack_complex_double* work );

typedef lapack_int (*ssytrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const float* a, lapack_int lda,
                                const lapack_int* ipiv, float* b,
                                lapack_int ldb );
typedef lapack_int (*dsytrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const double* a,
                                lapack_int lda, const lapack_int* ipiv,
                                double* b, lapack_int ldb );
typedef lapack_int (*csytrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_float* a,
                                lapack_int lda, const lapack_int* ipiv,
                                lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zsytrs_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_int nrhs, const lapack_complex_double* a,
                                lapack_int lda, const lapack_int* ipiv,
                                lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*stbcon_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int n, lapack_int kd,
                                const float* ab, lapack_int ldab, float* rcond,
                                float* work, lapack_int* iwork );
typedef lapack_int (*dtbcon_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int n, lapack_int kd,
                                const double* ab, lapack_int ldab,
                                double* rcond, double* work,
                                lapack_int* iwork );
typedef lapack_int (*ctbcon_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int n, lapack_int kd,
                                const lapack_complex_float* ab, lapack_int ldab,
                                float* rcond, lapack_complex_float* work,
                                float* rwork );
typedef lapack_int (*ztbcon_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int n, lapack_int kd,
                                const lapack_complex_double* ab,
                                lapack_int ldab, double* rcond,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*stbrfs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int kd,
                                lapack_int nrhs, const float* ab,
                                lapack_int ldab, const float* b, lapack_int ldb,
                                const float* x, lapack_int ldx, float* ferr,
                                float* berr, float* work, lapack_int* iwork );
typedef lapack_int (*dtbrfs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int kd,
                                lapack_int nrhs, const double* ab,
                                lapack_int ldab, const double* b,
                                lapack_int ldb, const double* x, lapack_int ldx,
                                double* ferr, double* berr, double* work,
                                lapack_int* iwork );
typedef lapack_int (*ctbrfs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int kd,
                                lapack_int nrhs, const lapack_complex_float* ab,
                                lapack_int ldab, const lapack_complex_float* b,
                                lapack_int ldb, const lapack_complex_float* x,
                                lapack_int ldx, float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*ztbrfs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int kd,
                                lapack_int nrhs,
                                const lapack_complex_double* ab,
                                lapack_int ldab, const lapack_complex_double* b,
                                lapack_int ldb, const lapack_complex_double* x,
                                lapack_int ldx, double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*stbtrs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int kd,
                                lapack_int nrhs, const float* ab,
                                lapack_int ldab, float* b, lapack_int ldb );
typedef lapack_int (*dtbtrs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int kd,
                                lapack_int nrhs, const double* ab,
                                lapack_int ldab, double* b, lapack_int ldb );
typedef lapack_int (*ctbtrs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int kd,
                                lapack_int nrhs, const lapack_complex_float* ab,
                                lapack_int ldab, lapack_complex_float* b,
                                lapack_int ldb );
typedef lapack_int (*ztbtrs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int kd,
                                lapack_int nrhs,
                                const lapack_complex_double* ab,
                                lapack_int ldab, lapack_complex_double* b,
                                lapack_int ldb );

typedef lapack_int (*stfsm_work_t)( int matrix_order, char transr, char side,
                               char uplo, char trans, char diag, lapack_int m,
                               lapack_int n, float alpha, const float* a,
                               float* b, lapack_int ldb );
typedef lapack_int (*dtfsm_work_t)( int matrix_order, char transr, char side,
                               char uplo, char trans, char diag, lapack_int m,
                               lapack_int n, double alpha, const double* a,
                               double* b, lapack_int ldb );
typedef lapack_int (*ctfsm_work_t)( int matrix_order, char transr, char side,
                               char uplo, char trans, char diag, lapack_int m,
                               lapack_int n, lapack_complex_float alpha,
                               const lapack_complex_float* a,
                               lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*ztfsm_work_t)( int matrix_order, char transr, char side,
                               char uplo, char trans, char diag, lapack_int m,
                               lapack_int n, lapack_complex_double alpha,
                               const lapack_complex_double* a,
                               lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*stftri_work_t)( int matrix_order, char transr, char uplo,
                                char diag, lapack_int n, float* a );
typedef lapack_int (*dtftri_work_t)( int matrix_order, char transr, char uplo,
                                char diag, lapack_int n, double* a );
typedef lapack_int (*ctftri_work_t)( int matrix_order, char transr, char uplo,
                                char diag, lapack_int n,
                                lapack_complex_float* a );
typedef lapack_int (*ztftri_work_t)( int matrix_order, char transr, char uplo,
                                char diag, lapack_int n,
                                lapack_complex_double* a );

typedef lapack_int (*stfttp_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const float* arf, float* ap );
typedef lapack_int (*dtfttp_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const double* arf, double* ap );
typedef lapack_int (*ctfttp_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const lapack_complex_float* arf,
                                lapack_complex_float* ap );
typedef lapack_int (*ztfttp_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const lapack_complex_double* arf,
                                lapack_complex_double* ap );

typedef lapack_int (*stfttr_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const float* arf, float* a,
                                lapack_int lda );
typedef lapack_int (*dtfttr_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const double* arf, double* a,
                                lapack_int lda );
typedef lapack_int (*ctfttr_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const lapack_complex_float* arf,
                                lapack_complex_float* a, lapack_int lda );
typedef lapack_int (*ztfttr_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const lapack_complex_double* arf,
                                lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*stgevc_work_t)( int matrix_order, char side, char howmny,
                                const lapack_logical* select, lapack_int n,
                                const float* s, lapack_int lds, const float* p,
                                lapack_int ldp, float* vl, lapack_int ldvl,
                                float* vr, lapack_int ldvr, lapack_int mm,
                                lapack_int* m, float* work );
typedef lapack_int (*dtgevc_work_t)( int matrix_order, char side, char howmny,
                                const lapack_logical* select, lapack_int n,
                                const double* s, lapack_int lds,
                                const double* p, lapack_int ldp, double* vl,
                                lapack_int ldvl, double* vr, lapack_int ldvr,
                                lapack_int mm, lapack_int* m, double* work );
typedef lapack_int (*ctgevc_work_t)( int matrix_order, char side, char howmny,
                                const lapack_logical* select, lapack_int n,
                                const lapack_complex_float* s, lapack_int lds,
                                const lapack_complex_float* p, lapack_int ldp,
                                lapack_complex_float* vl, lapack_int ldvl,
                                lapack_complex_float* vr, lapack_int ldvr,
                                lapack_int mm, lapack_int* m,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*ztgevc_work_t)( int matrix_order, char side, char howmny,
                                const lapack_logical* select, lapack_int n,
                                const lapack_complex_double* s, lapack_int lds,
                                const lapack_complex_double* p, lapack_int ldp,
                                lapack_complex_double* vl, lapack_int ldvl,
                                lapack_complex_double* vr, lapack_int ldvr,
                                lapack_int mm, lapack_int* m,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*stgexc_work_t)( int matrix_order, lapack_logical wantq,
                                lapack_logical wantz, lapack_int n, float* a,
                                lapack_int lda, float* b, lapack_int ldb,
                                float* q, lapack_int ldq, float* z,
                                lapack_int ldz, lapack_int* ifst,
                                lapack_int* ilst, float* work,
                                lapack_int lwork );
typedef lapack_int (*dtgexc_work_t)( int matrix_order, lapack_logical wantq,
                                lapack_logical wantz, lapack_int n, double* a,
                                lapack_int lda, double* b, lapack_int ldb,
                                double* q, lapack_int ldq, double* z,
                                lapack_int ldz, lapack_int* ifst,
                                lapack_int* ilst, double* work,
                                lapack_int lwork );
typedef lapack_int (*ctgexc_work_t)( int matrix_order, lapack_logical wantq,
                                lapack_logical wantz, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* q, lapack_int ldq,
                                lapack_complex_float* z, lapack_int ldz,
                                lapack_int ifst, lapack_int ilst );
typedef lapack_int (*ztgexc_work_t)( int matrix_order, lapack_logical wantq,
                                lapack_logical wantz, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* q, lapack_int ldq,
                                lapack_complex_double* z, lapack_int ldz,
                                lapack_int ifst, lapack_int ilst );

typedef lapack_int (*stgsen_work_t)( int matrix_order, lapack_int ijob,
                                lapack_logical wantq, lapack_logical wantz,
                                const lapack_logical* select, lapack_int n,
                                float* a, lapack_int lda, float* b,
                                lapack_int ldb, float* alphar, float* alphai,
                                float* beta, float* q, lapack_int ldq, float* z,
                                lapack_int ldz, lapack_int* m, float* pl,
                                float* pr, float* dif, float* work,
                                lapack_int lwork, lapack_int* iwork,
                                lapack_int liwork );
typedef lapack_int (*dtgsen_work_t)( int matrix_order, lapack_int ijob,
                                lapack_logical wantq, lapack_logical wantz,
                                const lapack_logical* select, lapack_int n,
                                double* a, lapack_int lda, double* b,
                                lapack_int ldb, double* alphar, double* alphai,
                                double* beta, double* q, lapack_int ldq,
                                double* z, lapack_int ldz, lapack_int* m,
                                double* pl, double* pr, double* dif,
                                double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*ctgsen_work_t)( int matrix_order, lapack_int ijob,
                                lapack_logical wantq, lapack_logical wantz,
                                const lapack_logical* select, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* alpha,
                                lapack_complex_float* beta,
                                lapack_complex_float* q, lapack_int ldq,
                                lapack_complex_float* z, lapack_int ldz,
                                lapack_int* m, float* pl, float* pr, float* dif,
                                lapack_complex_float* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*ztgsen_work_t)( int matrix_order, lapack_int ijob,
                                lapack_logical wantq, lapack_logical wantz,
                                const lapack_logical* select, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* alpha,
                                lapack_complex_double* beta,
                                lapack_complex_double* q, lapack_int ldq,
                                lapack_complex_double* z, lapack_int ldz,
                                lapack_int* m, double* pl, double* pr,
                                double* dif, lapack_complex_double* work,
                                lapack_int lwork, lapack_int* iwork,
                                lapack_int liwork );

typedef lapack_int (*stgsja_work_t)( int matrix_order, char jobu, char jobv,
                                char jobq, lapack_int m, lapack_int p,
                                lapack_int n, lapack_int k, lapack_int l,
                                float* a, lapack_int lda, float* b,
                                lapack_int ldb, float tola, float tolb,
                                float* alpha, float* beta, float* u,
                                lapack_int ldu, float* v, lapack_int ldv,
                                float* q, lapack_int ldq, float* work,
                                lapack_int* ncycle );
typedef lapack_int (*dtgsja_work_t)( int matrix_order, char jobu, char jobv,
                                char jobq, lapack_int m, lapack_int p,
                                lapack_int n, lapack_int k, lapack_int l,
                                double* a, lapack_int lda, double* b,
                                lapack_int ldb, double tola, double tolb,
                                double* alpha, double* beta, double* u,
                                lapack_int ldu, double* v, lapack_int ldv,
                                double* q, lapack_int ldq, double* work,
                                lapack_int* ncycle );
typedef lapack_int (*ctgsja_work_t)( int matrix_order, char jobu, char jobv,
                                char jobq, lapack_int m, lapack_int p,
                                lapack_int n, lapack_int k, lapack_int l,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* b, lapack_int ldb,
                                float tola, float tolb, float* alpha,
                                float* beta, lapack_complex_float* u,
                                lapack_int ldu, lapack_complex_float* v,
                                lapack_int ldv, lapack_complex_float* q,
                                lapack_int ldq, lapack_complex_float* work,
                                lapack_int* ncycle );
typedef lapack_int (*ztgsja_work_t)( int matrix_order, char jobu, char jobv,
                                char jobq, lapack_int m, lapack_int p,
                                lapack_int n, lapack_int k, lapack_int l,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* b, lapack_int ldb,
                                double tola, double tolb, double* alpha,
                                double* beta, lapack_complex_double* u,
                                lapack_int ldu, lapack_complex_double* v,
                                lapack_int ldv, lapack_complex_double* q,
                                lapack_int ldq, lapack_complex_double* work,
                                lapack_int* ncycle );

typedef lapack_int (*stgsna_work_t)( int matrix_order, char job, char howmny,
                                const lapack_logical* select, lapack_int n,
                                const float* a, lapack_int lda, const float* b,
                                lapack_int ldb, const float* vl,
                                lapack_int ldvl, const float* vr,
                                lapack_int ldvr, float* s, float* dif,
                                lapack_int mm, lapack_int* m, float* work,
                                lapack_int lwork, lapack_int* iwork );
typedef lapack_int (*dtgsna_work_t)( int matrix_order, char job, char howmny,
                                const lapack_logical* select, lapack_int n,
                                const double* a, lapack_int lda,
                                const double* b, lapack_int ldb,
                                const double* vl, lapack_int ldvl,
                                const double* vr, lapack_int ldvr, double* s,
                                double* dif, lapack_int mm, lapack_int* m,
                                double* work, lapack_int lwork,
                                lapack_int* iwork );
typedef lapack_int (*ctgsna_work_t)( int matrix_order, char job, char howmny,
                                const lapack_logical* select, lapack_int n,
                                const lapack_complex_float* a, lapack_int lda,
                                const lapack_complex_float* b, lapack_int ldb,
                                const lapack_complex_float* vl, lapack_int ldvl,
                                const lapack_complex_float* vr, lapack_int ldvr,
                                float* s, float* dif, lapack_int mm,
                                lapack_int* m, lapack_complex_float* work,
                                lapack_int lwork, lapack_int* iwork );
typedef lapack_int (*ztgsna_work_t)( int matrix_order, char job, char howmny,
                                const lapack_logical* select, lapack_int n,
                                const lapack_complex_double* a, lapack_int lda,
                                const lapack_complex_double* b, lapack_int ldb,
                                const lapack_complex_double* vl,
                                lapack_int ldvl,
                                const lapack_complex_double* vr,
                                lapack_int ldvr, double* s, double* dif,
                                lapack_int mm, lapack_int* m,
                                lapack_complex_double* work, lapack_int lwork,
                                lapack_int* iwork );

typedef lapack_int (*stgsyl_work_t)( int matrix_order, char trans, lapack_int ijob,
                                lapack_int m, lapack_int n, const float* a,
                                lapack_int lda, const float* b, lapack_int ldb,
                                float* c, lapack_int ldc, const float* d,
                                lapack_int ldd, const float* e, lapack_int lde,
                                float* f, lapack_int ldf, float* scale,
                                float* dif, float* work, lapack_int lwork,
                                lapack_int* iwork );
typedef lapack_int (*dtgsyl_work_t)( int matrix_order, char trans, lapack_int ijob,
                                lapack_int m, lapack_int n, const double* a,
                                lapack_int lda, const double* b, lapack_int ldb,
                                double* c, lapack_int ldc, const double* d,
                                lapack_int ldd, const double* e, lapack_int lde,
                                double* f, lapack_int ldf, double* scale,
                                double* dif, double* work, lapack_int lwork,
                                lapack_int* iwork );
typedef lapack_int (*ctgsyl_work_t)( int matrix_order, char trans, lapack_int ijob,
                                lapack_int m, lapack_int n,
                                const lapack_complex_float* a, lapack_int lda,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* c, lapack_int ldc,
                                const lapack_complex_float* d, lapack_int ldd,
                                const lapack_complex_float* e, lapack_int lde,
                                lapack_complex_float* f, lapack_int ldf,
                                float* scale, float* dif,
                                lapack_complex_float* work, lapack_int lwork,
                                lapack_int* iwork );
typedef lapack_int (*ztgsyl_work_t)( int matrix_order, char trans, lapack_int ijob,
                                lapack_int m, lapack_int n,
                                const lapack_complex_double* a, lapack_int lda,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* c, lapack_int ldc,
                                const lapack_complex_double* d, lapack_int ldd,
                                const lapack_complex_double* e, lapack_int lde,
                                lapack_complex_double* f, lapack_int ldf,
                                double* scale, double* dif,
                                lapack_complex_double* work, lapack_int lwork,
                                lapack_int* iwork );

typedef lapack_int (*stpcon_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int n, const float* ap,
                                float* rcond, float* work, lapack_int* iwork );
typedef lapack_int (*dtpcon_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int n, const double* ap,
                                double* rcond, double* work,
                                lapack_int* iwork );
typedef lapack_int (*ctpcon_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int n,
                                const lapack_complex_float* ap, float* rcond,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*ztpcon_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int n,
                                const lapack_complex_double* ap, double* rcond,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*stprfs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const float* ap, const float* b, lapack_int ldb,
                                const float* x, lapack_int ldx, float* ferr,
                                float* berr, float* work, lapack_int* iwork );
typedef lapack_int (*dtprfs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const double* ap, const double* b,
                                lapack_int ldb, const double* x, lapack_int ldx,
                                double* ferr, double* berr, double* work,
                                lapack_int* iwork );
typedef lapack_int (*ctprfs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const lapack_complex_float* ap,
                                const lapack_complex_float* b, lapack_int ldb,
                                const lapack_complex_float* x, lapack_int ldx,
                                float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*ztprfs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const lapack_complex_double* ap,
                                const lapack_complex_double* b, lapack_int ldb,
                                const lapack_complex_double* x, lapack_int ldx,
                                double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*stptri_work_t)( int matrix_order, char uplo, char diag,
                                lapack_int n, float* ap );
typedef lapack_int (*dtptri_work_t)( int matrix_order, char uplo, char diag,
                                lapack_int n, double* ap );
typedef lapack_int (*ctptri_work_t)( int matrix_order, char uplo, char diag,
                                lapack_int n, lapack_complex_float* ap );
typedef lapack_int (*ztptri_work_t)( int matrix_order, char uplo, char diag,
                                lapack_int n, lapack_complex_double* ap );

typedef lapack_int (*stptrs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const float* ap, float* b, lapack_int ldb );
typedef lapack_int (*dtptrs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const double* ap, double* b, lapack_int ldb );
typedef lapack_int (*ctptrs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const lapack_complex_float* ap,
                                lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*ztptrs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const lapack_complex_double* ap,
                                lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*stpttf_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const float* ap, float* arf );
typedef lapack_int (*dtpttf_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const double* ap, double* arf );
typedef lapack_int (*ctpttf_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const lapack_complex_float* ap,
                                lapack_complex_float* arf );
typedef lapack_int (*ztpttf_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const lapack_complex_double* ap,
                                lapack_complex_double* arf );

typedef lapack_int (*stpttr_work_t)( int matrix_order, char uplo, lapack_int n,
                                const float* ap, float* a, lapack_int lda );
typedef lapack_int (*dtpttr_work_t)( int matrix_order, char uplo, lapack_int n,
                                const double* ap, double* a, lapack_int lda );
typedef lapack_int (*ctpttr_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_float* ap,
                                lapack_complex_float* a, lapack_int lda );
typedef lapack_int (*ztpttr_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_double* ap,
                                lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*strcon_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int n, const float* a,
                                lapack_int lda, float* rcond, float* work,
                                lapack_int* iwork );
typedef lapack_int (*dtrcon_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int n, const double* a,
                                lapack_int lda, double* rcond, double* work,
                                lapack_int* iwork );
typedef lapack_int (*ctrcon_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int n,
                                const lapack_complex_float* a, lapack_int lda,
                                float* rcond, lapack_complex_float* work,
                                float* rwork );
typedef lapack_int (*ztrcon_work_t)( int matrix_order, char norm, char uplo,
                                char diag, lapack_int n,
                                const lapack_complex_double* a, lapack_int lda,
                                double* rcond, lapack_complex_double* work,
                                double* rwork );

typedef lapack_int (*strevc_work_t)( int matrix_order, char side, char howmny,
                                lapack_logical* select, lapack_int n,
                                const float* t, lapack_int ldt, float* vl,
                                lapack_int ldvl, float* vr, lapack_int ldvr,
                                lapack_int mm, lapack_int* m, float* work );
typedef lapack_int (*dtrevc_work_t)( int matrix_order, char side, char howmny,
                                lapack_logical* select, lapack_int n,
                                const double* t, lapack_int ldt, double* vl,
                                lapack_int ldvl, double* vr, lapack_int ldvr,
                                lapack_int mm, lapack_int* m, double* work );
typedef lapack_int (*ctrevc_work_t)( int matrix_order, char side, char howmny,
                                const lapack_logical* select, lapack_int n,
                                lapack_complex_float* t, lapack_int ldt,
                                lapack_complex_float* vl, lapack_int ldvl,
                                lapack_complex_float* vr, lapack_int ldvr,
                                lapack_int mm, lapack_int* m,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*ztrevc_work_t)( int matrix_order, char side, char howmny,
                                const lapack_logical* select, lapack_int n,
                                lapack_complex_double* t, lapack_int ldt,
                                lapack_complex_double* vl, lapack_int ldvl,
                                lapack_complex_double* vr, lapack_int ldvr,
                                lapack_int mm, lapack_int* m,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*strexc_work_t)( int matrix_order, char compq, lapack_int n,
                                float* t, lapack_int ldt, float* q,
                                lapack_int ldq, lapack_int* ifst,
                                lapack_int* ilst, float* work );
typedef lapack_int (*dtrexc_work_t)( int matrix_order, char compq, lapack_int n,
                                double* t, lapack_int ldt, double* q,
                                lapack_int ldq, lapack_int* ifst,
                                lapack_int* ilst, double* work );
typedef lapack_int (*ctrexc_work_t)( int matrix_order, char compq, lapack_int n,
                                lapack_complex_float* t, lapack_int ldt,
                                lapack_complex_float* q, lapack_int ldq,
                                lapack_int ifst, lapack_int ilst );
typedef lapack_int (*ztrexc_work_t)( int matrix_order, char compq, lapack_int n,
                                lapack_complex_double* t, lapack_int ldt,
                                lapack_complex_double* q, lapack_int ldq,
                                lapack_int ifst, lapack_int ilst );

typedef lapack_int (*strrfs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const float* a, lapack_int lda, const float* b,
                                lapack_int ldb, const float* x, lapack_int ldx,
                                float* ferr, float* berr, float* work,
                                lapack_int* iwork );
typedef lapack_int (*dtrrfs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const double* a, lapack_int lda,
                                const double* b, lapack_int ldb,
                                const double* x, lapack_int ldx, double* ferr,
                                double* berr, double* work, lapack_int* iwork );
typedef lapack_int (*ctrrfs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const lapack_complex_float* a, lapack_int lda,
                                const lapack_complex_float* b, lapack_int ldb,
                                const lapack_complex_float* x, lapack_int ldx,
                                float* ferr, float* berr,
                                lapack_complex_float* work, float* rwork );
typedef lapack_int (*ztrrfs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const lapack_complex_double* a, lapack_int lda,
                                const lapack_complex_double* b, lapack_int ldb,
                                const lapack_complex_double* x, lapack_int ldx,
                                double* ferr, double* berr,
                                lapack_complex_double* work, double* rwork );

typedef lapack_int (*strsen_work_t)( int matrix_order, char job, char compq,
                                const lapack_logical* select, lapack_int n,
                                float* t, lapack_int ldt, float* q,
                                lapack_int ldq, float* wr, float* wi,
                                lapack_int* m, float* s, float* sep,
                                float* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*dtrsen_work_t)( int matrix_order, char job, char compq,
                                const lapack_logical* select, lapack_int n,
                                double* t, lapack_int ldt, double* q,
                                lapack_int ldq, double* wr, double* wi,
                                lapack_int* m, double* s, double* sep,
                                double* work, lapack_int lwork,
                                lapack_int* iwork, lapack_int liwork );
typedef lapack_int (*ctrsen_work_t)( int matrix_order, char job, char compq,
                                const lapack_logical* select, lapack_int n,
                                lapack_complex_float* t, lapack_int ldt,
                                lapack_complex_float* q, lapack_int ldq,
                                lapack_complex_float* w, lapack_int* m,
                                float* s, float* sep,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*ztrsen_work_t)( int matrix_order, char job, char compq,
                                const lapack_logical* select, lapack_int n,
                                lapack_complex_double* t, lapack_int ldt,
                                lapack_complex_double* q, lapack_int ldq,
                                lapack_complex_double* w, lapack_int* m,
                                double* s, double* sep,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*strsna_work_t)( int matrix_order, char job, char howmny,
                                const lapack_logical* select, lapack_int n,
                                const float* t, lapack_int ldt, const float* vl,
                                lapack_int ldvl, const float* vr,
                                lapack_int ldvr, float* s, float* sep,
                                lapack_int mm, lapack_int* m, float* work,
                                lapack_int ldwork, lapack_int* iwork );
typedef lapack_int (*dtrsna_work_t)( int matrix_order, char job, char howmny,
                                const lapack_logical* select, lapack_int n,
                                const double* t, lapack_int ldt,
                                const double* vl, lapack_int ldvl,
                                const double* vr, lapack_int ldvr, double* s,
                                double* sep, lapack_int mm, lapack_int* m,
                                double* work, lapack_int ldwork,
                                lapack_int* iwork );
typedef lapack_int (*ctrsna_work_t)( int matrix_order, char job, char howmny,
                                const lapack_logical* select, lapack_int n,
                                const lapack_complex_float* t, lapack_int ldt,
                                const lapack_complex_float* vl, lapack_int ldvl,
                                const lapack_complex_float* vr, lapack_int ldvr,
                                float* s, float* sep, lapack_int mm,
                                lapack_int* m, lapack_complex_float* work,
                                lapack_int ldwork, float* rwork );
typedef lapack_int (*ztrsna_work_t)( int matrix_order, char job, char howmny,
                                const lapack_logical* select, lapack_int n,
                                const lapack_complex_double* t, lapack_int ldt,
                                const lapack_complex_double* vl,
                                lapack_int ldvl,
                                const lapack_complex_double* vr,
                                lapack_int ldvr, double* s, double* sep,
                                lapack_int mm, lapack_int* m,
                                lapack_complex_double* work, lapack_int ldwork,
                                double* rwork );

typedef lapack_int (*strsyl_work_t)( int matrix_order, char trana, char tranb,
                                lapack_int isgn, lapack_int m, lapack_int n,
                                const float* a, lapack_int lda, const float* b,
                                lapack_int ldb, float* c, lapack_int ldc,
                                float* scale );
typedef lapack_int (*dtrsyl_work_t)( int matrix_order, char trana, char tranb,
                                lapack_int isgn, lapack_int m, lapack_int n,
                                const double* a, lapack_int lda,
                                const double* b, lapack_int ldb, double* c,
                                lapack_int ldc, double* scale );
typedef lapack_int (*ctrsyl_work_t)( int matrix_order, char trana, char tranb,
                                lapack_int isgn, lapack_int m, lapack_int n,
                                const lapack_complex_float* a, lapack_int lda,
                                const lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* c, lapack_int ldc,
                                float* scale );
typedef lapack_int (*ztrsyl_work_t)( int matrix_order, char trana, char tranb,
                                lapack_int isgn, lapack_int m, lapack_int n,
                                const lapack_complex_double* a, lapack_int lda,
                                const lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* c, lapack_int ldc,
                                double* scale );

typedef lapack_int (*strtri_work_t)( int matrix_order, char uplo, char diag,
                                lapack_int n, float* a, lapack_int lda );
typedef lapack_int (*dtrtri_work_t)( int matrix_order, char uplo, char diag,
                                lapack_int n, double* a, lapack_int lda );
typedef lapack_int (*ctrtri_work_t)( int matrix_order, char uplo, char diag,
                                lapack_int n, lapack_complex_float* a,
                                lapack_int lda );
typedef lapack_int (*ztrtri_work_t)( int matrix_order, char uplo, char diag,
                                lapack_int n, lapack_complex_double* a,
                                lapack_int lda );

typedef lapack_int (*strtrs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const float* a, lapack_int lda, float* b,
                                lapack_int ldb );
typedef lapack_int (*dtrtrs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const double* a, lapack_int lda, double* b,
                                lapack_int ldb );
typedef lapack_int (*ctrtrs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*ztrtrs_work_t)( int matrix_order, char uplo, char trans,
                                char diag, lapack_int n, lapack_int nrhs,
                                const lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*strttf_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const float* a, lapack_int lda,
                                float* arf );
typedef lapack_int (*dtrttf_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const double* a, lapack_int lda,
                                double* arf );
typedef lapack_int (*ctrttf_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* arf );
typedef lapack_int (*ztrttf_work_t)( int matrix_order, char transr, char uplo,
                                lapack_int n, const lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* arf );

typedef lapack_int (*strttp_work_t)( int matrix_order, char uplo, lapack_int n,
                                const float* a, lapack_int lda, float* ap );
typedef lapack_int (*dtrttp_work_t)( int matrix_order, char uplo, lapack_int n,
                                const double* a, lapack_int lda, double* ap );
typedef lapack_int (*ctrttp_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* ap );
typedef lapack_int (*ztrttp_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* ap );

typedef lapack_int (*stzrzf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                float* a, lapack_int lda, float* tau,
                                float* work, lapack_int lwork );
typedef lapack_int (*dtzrzf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                double* a, lapack_int lda, double* tau,
                                double* work, lapack_int lwork );
typedef lapack_int (*ctzrzf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*ztzrzf_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cungbr_work_t)( int matrix_order, char vect, lapack_int m,
                                lapack_int n, lapack_int k,
                                lapack_complex_float* a, lapack_int lda,
                                const lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zungbr_work_t)( int matrix_order, char vect, lapack_int m,
                                lapack_int n, lapack_int k,
                                lapack_complex_double* a, lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cunghr_work_t)( int matrix_order, lapack_int n, lapack_int ilo,
                                lapack_int ihi, lapack_complex_float* a,
                                lapack_int lda, const lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zunghr_work_t)( int matrix_order, lapack_int n, lapack_int ilo,
                                lapack_int ihi, lapack_complex_double* a,
                                lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cunglq_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, lapack_complex_float* a,
                                lapack_int lda, const lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zunglq_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, lapack_complex_double* a,
                                lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cungql_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, lapack_complex_float* a,
                                lapack_int lda, const lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zungql_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, lapack_complex_double* a,
                                lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cungqr_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, lapack_complex_float* a,
                                lapack_int lda, const lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zungqr_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, lapack_complex_double* a,
                                lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cungrq_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, lapack_complex_float* a,
                                lapack_int lda, const lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zungrq_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int k, lapack_complex_double* a,
                                lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cungtr_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_float* a, lapack_int lda,
                                const lapack_complex_float* tau,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zungtr_work_t)( int matrix_order, char uplo, lapack_int n,
                                lapack_complex_double* a, lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cunmbr_work_t)( int matrix_order, char vect, char side,
                                char trans, lapack_int m, lapack_int n,
                                lapack_int k, const lapack_complex_float* a,
                                lapack_int lda, const lapack_complex_float* tau,
                                lapack_complex_float* c, lapack_int ldc,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zunmbr_work_t)( int matrix_order, char vect, char side,
                                char trans, lapack_int m, lapack_int n,
                                lapack_int k, const lapack_complex_double* a,
                                lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* c, lapack_int ldc,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cunmhr_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int ilo,
                                lapack_int ihi, const lapack_complex_float* a,
                                lapack_int lda, const lapack_complex_float* tau,
                                lapack_complex_float* c, lapack_int ldc,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zunmhr_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int ilo,
                                lapack_int ihi, const lapack_complex_double* a,
                                lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* c, lapack_int ldc,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cunmlq_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const lapack_complex_float* a, lapack_int lda,
                                const lapack_complex_float* tau,
                                lapack_complex_float* c, lapack_int ldc,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zunmlq_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const lapack_complex_double* a, lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* c, lapack_int ldc,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cunmql_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const lapack_complex_float* a, lapack_int lda,
                                const lapack_complex_float* tau,
                                lapack_complex_float* c, lapack_int ldc,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zunmql_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const lapack_complex_double* a, lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* c, lapack_int ldc,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cunmqr_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const lapack_complex_float* a, lapack_int lda,
                                const lapack_complex_float* tau,
                                lapack_complex_float* c, lapack_int ldc,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zunmqr_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const lapack_complex_double* a, lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* c, lapack_int ldc,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cunmrq_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const lapack_complex_float* a, lapack_int lda,
                                const lapack_complex_float* tau,
                                lapack_complex_float* c, lapack_int ldc,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zunmrq_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                const lapack_complex_double* a, lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* c, lapack_int ldc,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cunmrz_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                lapack_int l, const lapack_complex_float* a,
                                lapack_int lda, const lapack_complex_float* tau,
                                lapack_complex_float* c, lapack_int ldc,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zunmrz_work_t)( int matrix_order, char side, char trans,
                                lapack_int m, lapack_int n, lapack_int k,
                                lapack_int l, const lapack_complex_double* a,
                                lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* c, lapack_int ldc,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cunmtr_work_t)( int matrix_order, char side, char uplo,
                                char trans, lapack_int m, lapack_int n,
                                const lapack_complex_float* a, lapack_int lda,
                                const lapack_complex_float* tau,
                                lapack_complex_float* c, lapack_int ldc,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*zunmtr_work_t)( int matrix_order, char side, char uplo,
                                char trans, lapack_int m, lapack_int n,
                                const lapack_complex_double* a, lapack_int lda,
                                const lapack_complex_double* tau,
                                lapack_complex_double* c, lapack_int ldc,
                                lapack_complex_double* work, lapack_int lwork );

typedef lapack_int (*cupgtr_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_float* ap,
                                const lapack_complex_float* tau,
                                lapack_complex_float* q, lapack_int ldq,
                                lapack_complex_float* work );
typedef lapack_int (*zupgtr_work_t)( int matrix_order, char uplo, lapack_int n,
                                const lapack_complex_double* ap,
                                const lapack_complex_double* tau,
                                lapack_complex_double* q, lapack_int ldq,
                                lapack_complex_double* work );

typedef lapack_int (*cupmtr_work_t)( int matrix_order, char side, char uplo,
                                char trans, lapack_int m, lapack_int n,
                                const lapack_complex_float* ap,
                                const lapack_complex_float* tau,
                                lapack_complex_float* c, lapack_int ldc,
                                lapack_complex_float* work );
typedef lapack_int (*zupmtr_work_t)( int matrix_order, char side, char uplo,
                                char trans, lapack_int m, lapack_int n,
                                const lapack_complex_double* ap,
                                const lapack_complex_double* tau,
                                lapack_complex_double* c, lapack_int ldc,
                                lapack_complex_double* work );

typedef lapack_int (*claghe_t)( int matrix_order, lapack_int n, lapack_int k,
                           const float* d, lapack_complex_float* a,
                           lapack_int lda, lapack_int* iseed );
typedef lapack_int (*zlaghe_t)( int matrix_order, lapack_int n, lapack_int k,
                           const double* d, lapack_complex_double* a,
                           lapack_int lda, lapack_int* iseed );

typedef lapack_int (*slagsy_t)( int matrix_order, lapack_int n, lapack_int k,
                           const float* d, float* a, lapack_int lda,
                           lapack_int* iseed );
typedef lapack_int (*dlagsy_t)( int matrix_order, lapack_int n, lapack_int k,
                           const double* d, double* a, lapack_int lda,
                           lapack_int* iseed );
typedef lapack_int (*clagsy_t)( int matrix_order, lapack_int n, lapack_int k,
                           const float* d, lapack_complex_float* a,
                           lapack_int lda, lapack_int* iseed );
typedef lapack_int (*zlagsy_t)( int matrix_order, lapack_int n, lapack_int k,
                           const double* d, lapack_complex_double* a,
                           lapack_int lda, lapack_int* iseed );

typedef lapack_int (*slapmr_t)( int matrix_order, lapack_logical forwrd,
                           lapack_int m, lapack_int n, float* x, lapack_int ldx,
                           lapack_int* k );
typedef lapack_int (*dlapmr_t)( int matrix_order, lapack_logical forwrd,
                           lapack_int m, lapack_int n, double* x,
                           lapack_int ldx, lapack_int* k );
typedef lapack_int (*clapmr_t)( int matrix_order, lapack_logical forwrd,
                           lapack_int m, lapack_int n, lapack_complex_float* x,
                           lapack_int ldx, lapack_int* k );
typedef lapack_int (*zlapmr_t)( int matrix_order, lapack_logical forwrd,
                           lapack_int m, lapack_int n, lapack_complex_double* x,
                           lapack_int ldx, lapack_int* k );


typedef float (*slapy2_t)( float x, float y );
typedef double (*dlapy2_t)( double x, double y );

typedef float (*slapy3_t)( float x, float y, float z );
typedef double (*dlapy3_t)( double x, double y, double z );

typedef lapack_int (*slartgp_t)( float f, float g, float* cs, float* sn, float* r );
typedef lapack_int (*dlartgp_t)( double f, double g, double* cs, double* sn,
                            double* r );

typedef lapack_int (*slartgs_t)( float x, float y, float sigma, float* cs,
                            float* sn );
typedef lapack_int (*dlartgs_t)( double x, double y, double sigma, double* cs,
                            double* sn );


//LAPACK 3.3.0
typedef lapack_int (*cbbcsd_t)( int matrix_order, char jobu1, char jobu2,
                           char jobv1t, char jobv2t, char trans, lapack_int m,
                           lapack_int p, lapack_int q, float* theta, float* phi,
                           lapack_complex_float* u1, lapack_int ldu1,
                           lapack_complex_float* u2, lapack_int ldu2,
                           lapack_complex_float* v1t, lapack_int ldv1t,
                           lapack_complex_float* v2t, lapack_int ldv2t,
                           float* b11d, float* b11e, float* b12d, float* b12e,
                           float* b21d, float* b21e, float* b22d, float* b22e );
typedef lapack_int (*cbbcsd_work_t)( int matrix_order, char jobu1, char jobu2,
                                char jobv1t, char jobv2t, char trans,
                                lapack_int m, lapack_int p, lapack_int q,
                                float* theta, float* phi,
                                lapack_complex_float* u1, lapack_int ldu1,
                                lapack_complex_float* u2, lapack_int ldu2,
                                lapack_complex_float* v1t, lapack_int ldv1t,
                                lapack_complex_float* v2t, lapack_int ldv2t,
                                float* b11d, float* b11e, float* b12d,
                                float* b12e, float* b21d, float* b21e,
                                float* b22d, float* b22e, float* rwork,
                                lapack_int lrwork );
typedef lapack_int (*cheswapr_t)( int matrix_order, char uplo, lapack_int n,
                             lapack_complex_float* a, lapack_int i1,
                             lapack_int i2 );
typedef lapack_int (*cheswapr_work_t)( int matrix_order, char uplo, lapack_int n,
                                  lapack_complex_float* a, lapack_int i1,
                                  lapack_int i2 );
typedef lapack_int (*chetri2_t)( int matrix_order, char uplo, lapack_int n,
                            lapack_complex_float* a, lapack_int lda,
                            const lapack_int* ipiv );
typedef lapack_int (*chetri2_work_t)( int matrix_order, char uplo, lapack_int n,
                                 lapack_complex_float* a, lapack_int lda,
                                 const lapack_int* ipiv,
                                 lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*chetri2x_t)( int matrix_order, char uplo, lapack_int n,
                             lapack_complex_float* a, lapack_int lda,
                             const lapack_int* ipiv, lapack_int nb );
typedef lapack_int (*chetri2x_work_t)( int matrix_order, char uplo, lapack_int n,
                                  lapack_complex_float* a, lapack_int lda,
                                  const lapack_int* ipiv,
                                  lapack_complex_float* work, lapack_int nb );
typedef lapack_int (*chetrs2_t)( int matrix_order, char uplo, lapack_int n,
                            lapack_int nrhs, const lapack_complex_float* a,
                            lapack_int lda, const lapack_int* ipiv,
                            lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*chetrs2_work_t)( int matrix_order, char uplo, lapack_int n,
                                 lapack_int nrhs, const lapack_complex_float* a,
                                 lapack_int lda, const lapack_int* ipiv,
                                 lapack_complex_float* b, lapack_int ldb,
                                 lapack_complex_float* work );
typedef lapack_int (*csyconv_t)( int matrix_order, char uplo, char way, lapack_int n,
                            lapack_complex_float* a, lapack_int lda,
                            const lapack_int* ipiv );
typedef lapack_int (*csyconv_work_t)( int matrix_order, char uplo, char way,
                                 lapack_int n, lapack_complex_float* a,
                                 lapack_int lda, const lapack_int* ipiv,
                                 lapack_complex_float* work );
typedef lapack_int (*csyswapr_t)( int matrix_order, char uplo, lapack_int n,
                             lapack_complex_float* a, lapack_int i1,
                             lapack_int i2 );
typedef lapack_int (*csyswapr_work_t)( int matrix_order, char uplo, lapack_int n,
                                  lapack_complex_float* a, lapack_int i1,
                                  lapack_int i2 );
typedef lapack_int (*csytri2_t)( int matrix_order, char uplo, lapack_int n,
                            lapack_complex_float* a, lapack_int lda,
                            const lapack_int* ipiv );
typedef lapack_int (*csytri2_work_t)( int matrix_order, char uplo, lapack_int n,
                                 lapack_complex_float* a, lapack_int lda,
                                 const lapack_int* ipiv,
                                 lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*csytri2x_t)( int matrix_order, char uplo, lapack_int n,
                             lapack_complex_float* a, lapack_int lda,
                             const lapack_int* ipiv, lapack_int nb );
typedef lapack_int (*csytri2x_work_t)( int matrix_order, char uplo, lapack_int n,
                                  lapack_complex_float* a, lapack_int lda,
                                  const lapack_int* ipiv,
                                  lapack_complex_float* work, lapack_int nb );
typedef lapack_int (*csytrs2_t)( int matrix_order, char uplo, lapack_int n,
                            lapack_int nrhs, const lapack_complex_float* a,
                            lapack_int lda, const lapack_int* ipiv,
                            lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*csytrs2_work_t)( int matrix_order, char uplo, lapack_int n,
                                 lapack_int nrhs, const lapack_complex_float* a,
                                 lapack_int lda, const lapack_int* ipiv,
                                 lapack_complex_float* b, lapack_int ldb,
                                 lapack_complex_float* work );
typedef lapack_int (*cunbdb_t)( int matrix_order, char trans, char signs,
                           lapack_int m, lapack_int p, lapack_int q,
                           lapack_complex_float* x11, lapack_int ldx11,
                           lapack_complex_float* x12, lapack_int ldx12,
                           lapack_complex_float* x21, lapack_int ldx21,
                           lapack_complex_float* x22, lapack_int ldx22,
                           float* theta, float* phi,
                           lapack_complex_float* taup1,
                           lapack_complex_float* taup2,
                           lapack_complex_float* tauq1,
                           lapack_complex_float* tauq2 );
typedef lapack_int (*cunbdb_work_t)( int matrix_order, char trans, char signs,
                                lapack_int m, lapack_int p, lapack_int q,
                                lapack_complex_float* x11, lapack_int ldx11,
                                lapack_complex_float* x12, lapack_int ldx12,
                                lapack_complex_float* x21, lapack_int ldx21,
                                lapack_complex_float* x22, lapack_int ldx22,
                                float* theta, float* phi,
                                lapack_complex_float* taup1,
                                lapack_complex_float* taup2,
                                lapack_complex_float* tauq1,
                                lapack_complex_float* tauq2,
                                lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*cuncsd_t)( int matrix_order, char jobu1, char jobu2,
                           char jobv1t, char jobv2t, char trans, char signs,
                           lapack_int m, lapack_int p, lapack_int q,
                           lapack_complex_float* x11, lapack_int ldx11,
                           lapack_complex_float* x12, lapack_int ldx12,
                           lapack_complex_float* x21, lapack_int ldx21,
                           lapack_complex_float* x22, lapack_int ldx22,
                           float* theta, lapack_complex_float* u1,
                           lapack_int ldu1, lapack_complex_float* u2,
                           lapack_int ldu2, lapack_complex_float* v1t,
                           lapack_int ldv1t, lapack_complex_float* v2t,
                           lapack_int ldv2t );
typedef lapack_int (*cuncsd_work_t)( int matrix_order, char jobu1, char jobu2,
                                char jobv1t, char jobv2t, char trans,
                                char signs, lapack_int m, lapack_int p,
                                lapack_int q, lapack_complex_float* x11,
                                lapack_int ldx11, lapack_complex_float* x12,
                                lapack_int ldx12, lapack_complex_float* x21,
                                lapack_int ldx21, lapack_complex_float* x22,
                                lapack_int ldx22, float* theta,
                                lapack_complex_float* u1, lapack_int ldu1,
                                lapack_complex_float* u2, lapack_int ldu2,
                                lapack_complex_float* v1t, lapack_int ldv1t,
                                lapack_complex_float* v2t, lapack_int ldv2t,
                                lapack_complex_float* work, lapack_int lwork,
                                float* rwork, lapack_int lrwork,
                                lapack_int* iwork );
typedef lapack_int (*dbbcsd_t)( int matrix_order, char jobu1, char jobu2,
                           char jobv1t, char jobv2t, char trans, lapack_int m,
                           lapack_int p, lapack_int q, double* theta,
                           double* phi, double* u1, lapack_int ldu1, double* u2,
                           lapack_int ldu2, double* v1t, lapack_int ldv1t,
                           double* v2t, lapack_int ldv2t, double* b11d,
                           double* b11e, double* b12d, double* b12e,
                           double* b21d, double* b21e, double* b22d,
                           double* b22e );
typedef lapack_int (*dbbcsd_work_t)( int matrix_order, char jobu1, char jobu2,
                                char jobv1t, char jobv2t, char trans,
                                lapack_int m, lapack_int p, lapack_int q,
                                double* theta, double* phi, double* u1,
                                lapack_int ldu1, double* u2, lapack_int ldu2,
                                double* v1t, lapack_int ldv1t, double* v2t,
                                lapack_int ldv2t, double* b11d, double* b11e,
                                double* b12d, double* b12e, double* b21d,
                                double* b21e, double* b22d, double* b22e,
                                double* work, lapack_int lwork );
typedef lapack_int (*dorbdb_t)( int matrix_order, char trans, char signs,
                           lapack_int m, lapack_int p, lapack_int q,
                           double* x11, lapack_int ldx11, double* x12,
                           lapack_int ldx12, double* x21, lapack_int ldx21,
                           double* x22, lapack_int ldx22, double* theta,
                           double* phi, double* taup1, double* taup2,
                           double* tauq1, double* tauq2 );
typedef lapack_int (*dorbdb_work_t)( int matrix_order, char trans, char signs,
                                lapack_int m, lapack_int p, lapack_int q,
                                double* x11, lapack_int ldx11, double* x12,
                                lapack_int ldx12, double* x21, lapack_int ldx21,
                                double* x22, lapack_int ldx22, double* theta,
                                double* phi, double* taup1, double* taup2,
                                double* tauq1, double* tauq2, double* work,
                                lapack_int lwork );
typedef lapack_int (*dorcsd_t)( int matrix_order, char jobu1, char jobu2,
                           char jobv1t, char jobv2t, char trans, char signs,
                           lapack_int m, lapack_int p, lapack_int q,
                           double* x11, lapack_int ldx11, double* x12,
                           lapack_int ldx12, double* x21, lapack_int ldx21,
                           double* x22, lapack_int ldx22, double* theta,
                           double* u1, lapack_int ldu1, double* u2,
                           lapack_int ldu2, double* v1t, lapack_int ldv1t,
                           double* v2t, lapack_int ldv2t );
typedef lapack_int (*dorcsd_work_t)( int matrix_order, char jobu1, char jobu2,
                                char jobv1t, char jobv2t, char trans,
                                char signs, lapack_int m, lapack_int p,
                                lapack_int q, double* x11, lapack_int ldx11,
                                double* x12, lapack_int ldx12, double* x21,
                                lapack_int ldx21, double* x22, lapack_int ldx22,
                                double* theta, double* u1, lapack_int ldu1,
                                double* u2, lapack_int ldu2, double* v1t,
                                lapack_int ldv1t, double* v2t, lapack_int ldv2t,
                                double* work, lapack_int lwork,
                                lapack_int* iwork );
typedef lapack_int (*dsyconv_t)( int matrix_order, char uplo, char way, lapack_int n,
                            double* a, lapack_int lda, const lapack_int* ipiv );
typedef lapack_int (*dsyconv_work_t)( int matrix_order, char uplo, char way,
                                 lapack_int n, double* a, lapack_int lda,
                                 const lapack_int* ipiv, double* work );
typedef lapack_int (*dsyswapr_t)( int matrix_order, char uplo, lapack_int n,
                             double* a, lapack_int i1, lapack_int i2 );
typedef lapack_int (*dsyswapr_work_t)( int matrix_order, char uplo, lapack_int n,
                                  double* a, lapack_int i1, lapack_int i2 );
typedef lapack_int (*dsytri2_t)( int matrix_order, char uplo, lapack_int n,
                            double* a, lapack_int lda, const lapack_int* ipiv );
typedef lapack_int (*dsytri2_work_t)( int matrix_order, char uplo, lapack_int n,
                                 double* a, lapack_int lda,
                                 const lapack_int* ipiv,
                                 lapack_complex_double* work, lapack_int lwork );
typedef lapack_int (*dsytri2x_t)( int matrix_order, char uplo, lapack_int n,
                             double* a, lapack_int lda, const lapack_int* ipiv,
                             lapack_int nb );
typedef lapack_int (*dsytri2x_work_t)( int matrix_order, char uplo, lapack_int n,
                                  double* a, lapack_int lda,
                                  const lapack_int* ipiv, double* work,
                                  lapack_int nb );
typedef lapack_int (*dsytrs2_t)( int matrix_order, char uplo, lapack_int n,
                            lapack_int nrhs, const double* a, lapack_int lda,
                            const lapack_int* ipiv, double* b, lapack_int ldb );
typedef lapack_int (*dsytrs2_work_t)( int matrix_order, char uplo, lapack_int n,
                                 lapack_int nrhs, const double* a,
                                 lapack_int lda, const lapack_int* ipiv,
                                 double* b, lapack_int ldb, double* work );
typedef lapack_int (*sbbcsd_t)( int matrix_order, char jobu1, char jobu2,
                           char jobv1t, char jobv2t, char trans, lapack_int m,
                           lapack_int p, lapack_int q, float* theta, float* phi,
                           float* u1, lapack_int ldu1, float* u2,
                           lapack_int ldu2, float* v1t, lapack_int ldv1t,
                           float* v2t, lapack_int ldv2t, float* b11d,
                           float* b11e, float* b12d, float* b12e, float* b21d,
                           float* b21e, float* b22d, float* b22e );
typedef lapack_int (*sbbcsd_work_t)( int matrix_order, char jobu1, char jobu2,
                                char jobv1t, char jobv2t, char trans,
                                lapack_int m, lapack_int p, lapack_int q,
                                float* theta, float* phi, float* u1,
                                lapack_int ldu1, float* u2, lapack_int ldu2,
                                float* v1t, lapack_int ldv1t, float* v2t,
                                lapack_int ldv2t, float* b11d, float* b11e,
                                float* b12d, float* b12e, float* b21d,
                                float* b21e, float* b22d, float* b22e,
                                float* work, lapack_int lwork );
typedef lapack_int (*sorbdb_t)( int matrix_order, char trans, char signs,
                           lapack_int m, lapack_int p, lapack_int q, float* x11,
                           lapack_int ldx11, float* x12, lapack_int ldx12,
                           float* x21, lapack_int ldx21, float* x22,
                           lapack_int ldx22, float* theta, float* phi,
                           float* taup1, float* taup2, float* tauq1,
                           float* tauq2 );
typedef lapack_int (*sorbdb_work_t)( int matrix_order, char trans, char signs,
                                lapack_int m, lapack_int p, lapack_int q,
                                float* x11, lapack_int ldx11, float* x12,
                                lapack_int ldx12, float* x21, lapack_int ldx21,
                                float* x22, lapack_int ldx22, float* theta,
                                float* phi, float* taup1, float* taup2,
                                float* tauq1, float* tauq2, float* work,
                                lapack_int lwork );
typedef lapack_int (*sorcsd_t)( int matrix_order, char jobu1, char jobu2,
                           char jobv1t, char jobv2t, char trans, char signs,
                           lapack_int m, lapack_int p, lapack_int q, float* x11,
                           lapack_int ldx11, float* x12, lapack_int ldx12,
                           float* x21, lapack_int ldx21, float* x22,
                           lapack_int ldx22, float* theta, float* u1,
                           lapack_int ldu1, float* u2, lapack_int ldu2,
                           float* v1t, lapack_int ldv1t, float* v2t,
                           lapack_int ldv2t );
typedef lapack_int (*sorcsd_work_t)( int matrix_order, char jobu1, char jobu2,
                                char jobv1t, char jobv2t, char trans,
                                char signs, lapack_int m, lapack_int p,
                                lapack_int q, float* x11, lapack_int ldx11,
                                float* x12, lapack_int ldx12, float* x21,
                                lapack_int ldx21, float* x22, lapack_int ldx22,
                                float* theta, float* u1, lapack_int ldu1,
                                float* u2, lapack_int ldu2, float* v1t,
                                lapack_int ldv1t, float* v2t, lapack_int ldv2t,
                                float* work, lapack_int lwork,
                                lapack_int* iwork );
typedef lapack_int (*ssyconv_t)( int matrix_order, char uplo, char way, lapack_int n,
                            float* a, lapack_int lda, const lapack_int* ipiv );
typedef lapack_int (*ssyconv_work_t)( int matrix_order, char uplo, char way,
                                 lapack_int n, float* a, lapack_int lda,
                                 const lapack_int* ipiv, float* work );
typedef lapack_int (*ssyswapr_t)( int matrix_order, char uplo, lapack_int n,
                             float* a, lapack_int i1, lapack_int i2 );
typedef lapack_int (*ssyswapr_work_t)( int matrix_order, char uplo, lapack_int n,
                                  float* a, lapack_int i1, lapack_int i2 );
typedef lapack_int (*ssytri2_t)( int matrix_order, char uplo, lapack_int n, float* a,
                            lapack_int lda, const lapack_int* ipiv );
typedef lapack_int (*ssytri2_work_t)( int matrix_order, char uplo, lapack_int n,
                                 float* a, lapack_int lda,
                                 const lapack_int* ipiv,
                                 lapack_complex_float* work, lapack_int lwork );
typedef lapack_int (*ssytri2x_t)( int matrix_order, char uplo, lapack_int n,
                             float* a, lapack_int lda, const lapack_int* ipiv,
                             lapack_int nb );
typedef lapack_int (*ssytri2x_work_t)( int matrix_order, char uplo, lapack_int n,
                                  float* a, lapack_int lda,
                                  const lapack_int* ipiv, float* work,
                                  lapack_int nb );
typedef lapack_int (*ssytrs2_t)( int matrix_order, char uplo, lapack_int n,
                            lapack_int nrhs, const float* a, lapack_int lda,
                            const lapack_int* ipiv, float* b, lapack_int ldb );
typedef lapack_int (*ssytrs2_work_t)( int matrix_order, char uplo, lapack_int n,
                                 lapack_int nrhs, const float* a,
                                 lapack_int lda, const lapack_int* ipiv,
                                 float* b, lapack_int ldb, float* work );
typedef lapack_int (*zbbcsd_t)( int matrix_order, char jobu1, char jobu2,
                           char jobv1t, char jobv2t, char trans, lapack_int m,
                           lapack_int p, lapack_int q, double* theta,
                           double* phi, lapack_complex_double* u1,
                           lapack_int ldu1, lapack_complex_double* u2,
                           lapack_int ldu2, lapack_complex_double* v1t,
                           lapack_int ldv1t, lapack_complex_double* v2t,
                           lapack_int ldv2t, double* b11d, double* b11e,
                           double* b12d, double* b12e, double* b21d,
                           double* b21e, double* b22d, double* b22e );
typedef lapack_int (*zbbcsd_work_t)( int matrix_order, char jobu1, char jobu2,
                                char jobv1t, char jobv2t, char trans,
                                lapack_int m, lapack_int p, lapack_int q,
                                double* theta, double* phi,
                                lapack_complex_double* u1, lapack_int ldu1,
                                lapack_complex_double* u2, lapack_int ldu2,
                                lapack_complex_double* v1t, lapack_int ldv1t,
                                lapack_complex_double* v2t, lapack_int ldv2t,
                                double* b11d, double* b11e, double* b12d,
                                double* b12e, double* b21d, double* b21e,
                                double* b22d, double* b22e, double* rwork,
                                lapack_int lrwork );
typedef lapack_int (*zheswapr_t)( int matrix_order, char uplo, lapack_int n,
                             lapack_complex_double* a, lapack_int i1,
                             lapack_int i2 );
typedef lapack_int (*zheswapr_work_t)( int matrix_order, char uplo, lapack_int n,
                                  lapack_complex_double* a, lapack_int i1,
                                  lapack_int i2 );
typedef lapack_int (*zhetri2_t)( int matrix_order, char uplo, lapack_int n,
                            lapack_complex_double* a, lapack_int lda,
                            const lapack_int* ipiv );
typedef lapack_int (*zhetri2_work_t)( int matrix_order, char uplo, lapack_int n,
                                 lapack_complex_double* a, lapack_int lda,
                                 const lapack_int* ipiv,
                                 lapack_complex_double* work, lapack_int lwork );
typedef lapack_int (*zhetri2x_t)( int matrix_order, char uplo, lapack_int n,
                             lapack_complex_double* a, lapack_int lda,
                             const lapack_int* ipiv, lapack_int nb );
typedef lapack_int (*zhetri2x_work_t)( int matrix_order, char uplo, lapack_int n,
                                  lapack_complex_double* a, lapack_int lda,
                                  const lapack_int* ipiv,
                                  lapack_complex_double* work, lapack_int nb );
typedef lapack_int (*zhetrs2_t)( int matrix_order, char uplo, lapack_int n,
                            lapack_int nrhs, const lapack_complex_double* a,
                            lapack_int lda, const lapack_int* ipiv,
                            lapack_complex_double* b, lapack_int ldb );
typedef lapack_int (*zhetrs2_work_t)( int matrix_order, char uplo, lapack_int n,
                                 lapack_int nrhs, const lapack_complex_double* a,
                                 lapack_int lda, const lapack_int* ipiv,
                                 lapack_complex_double* b, lapack_int ldb,
                                 lapack_complex_double* work );
typedef lapack_int (*zsyconv_t)( int matrix_order, char uplo, char way, lapack_int n,
                            lapack_complex_double* a, lapack_int lda,
                            const lapack_int* ipiv );
typedef lapack_int (*zsyconv_work_t)( int matrix_order, char uplo, char way,
                                 lapack_int n, lapack_complex_double* a,
                                 lapack_int lda, const lapack_int* ipiv,
                                 lapack_complex_double* work );
typedef lapack_int (*zsyswapr_t)( int matrix_order, char uplo, lapack_int n,
                             lapack_complex_double* a, lapack_int i1,
                             lapack_int i2 );
typedef lapack_int (*zsyswapr_work_t)( int matrix_order, char uplo, lapack_int n,
                                  lapack_complex_double* a, lapack_int i1,
                                  lapack_int i2 );
typedef lapack_int (*zsytri2_t)( int matrix_order, char uplo, lapack_int n,
                            lapack_complex_double* a, lapack_int lda,
                            const lapack_int* ipiv );
typedef lapack_int (*zsytri2_work_t)( int matrix_order, char uplo, lapack_int n,
                                 lapack_complex_double* a, lapack_int lda,
                                 const lapack_int* ipiv,
                                 lapack_complex_double* work, lapack_int lwork );
typedef lapack_int (*zsytri2x_t)( int matrix_order, char uplo, lapack_int n,
                             lapack_complex_double* a, lapack_int lda,
                             const lapack_int* ipiv, lapack_int nb );
typedef lapack_int (*zsytri2x_work_t)( int matrix_order, char uplo, lapack_int n,
                                  lapack_complex_double* a, lapack_int lda,
                                  const lapack_int* ipiv,
                                  lapack_complex_double* work, lapack_int nb );
typedef lapack_int (*zsytrs2_t)( int matrix_order, char uplo, lapack_int n,
                            lapack_int nrhs, const lapack_complex_double* a,
                            lapack_int lda, const lapack_int* ipiv,
                            lapack_complex_double* b, lapack_int ldb );
typedef lapack_int (*zsytrs2_work_t)( int matrix_order, char uplo, lapack_int n,
                                 lapack_int nrhs, const lapack_complex_double* a,
                                 lapack_int lda, const lapack_int* ipiv,
                                 lapack_complex_double* b, lapack_int ldb,
                                 lapack_complex_double* work );
typedef lapack_int (*zunbdb_t)( int matrix_order, char trans, char signs,
                           lapack_int m, lapack_int p, lapack_int q,
                           lapack_complex_double* x11, lapack_int ldx11,
                           lapack_complex_double* x12, lapack_int ldx12,
                           lapack_complex_double* x21, lapack_int ldx21,
                           lapack_complex_double* x22, lapack_int ldx22,
                           double* theta, double* phi,
                           lapack_complex_double* taup1,
                           lapack_complex_double* taup2,
                           lapack_complex_double* tauq1,
                           lapack_complex_double* tauq2 );
typedef lapack_int (*zunbdb_work_t)( int matrix_order, char trans, char signs,
                                lapack_int m, lapack_int p, lapack_int q,
                                lapack_complex_double* x11, lapack_int ldx11,
                                lapack_complex_double* x12, lapack_int ldx12,
                                lapack_complex_double* x21, lapack_int ldx21,
                                lapack_complex_double* x22, lapack_int ldx22,
                                double* theta, double* phi,
                                lapack_complex_double* taup1,
                                lapack_complex_double* taup2,
                                lapack_complex_double* tauq1,
                                lapack_complex_double* tauq2,
                                lapack_complex_double* work, lapack_int lwork );
typedef lapack_int (*zuncsd_t)( int matrix_order, char jobu1, char jobu2,
                           char jobv1t, char jobv2t, char trans, char signs,
                           lapack_int m, lapack_int p, lapack_int q,
                           lapack_complex_double* x11, lapack_int ldx11,
                           lapack_complex_double* x12, lapack_int ldx12,
                           lapack_complex_double* x21, lapack_int ldx21,
                           lapack_complex_double* x22, lapack_int ldx22,
                           double* theta, lapack_complex_double* u1,
                           lapack_int ldu1, lapack_complex_double* u2,
                           lapack_int ldu2, lapack_complex_double* v1t,
                           lapack_int ldv1t, lapack_complex_double* v2t,
                           lapack_int ldv2t );
typedef lapack_int (*zuncsd_work_t)( int matrix_order, char jobu1, char jobu2,
                                char jobv1t, char jobv2t, char trans,
                                char signs, lapack_int m, lapack_int p,
                                lapack_int q, lapack_complex_double* x11,
                                lapack_int ldx11, lapack_complex_double* x12,
                                lapack_int ldx12, lapack_complex_double* x21,
                                lapack_int ldx21, lapack_complex_double* x22,
                                lapack_int ldx22, double* theta,
                                lapack_complex_double* u1, lapack_int ldu1,
                                lapack_complex_double* u2, lapack_int ldu2,
                                lapack_complex_double* v1t, lapack_int ldv1t,
                                lapack_complex_double* v2t, lapack_int ldv2t,
                                lapack_complex_double* work, lapack_int lwork,
                                double* rwork, lapack_int lrwork,
                                lapack_int* iwork );
//LAPACK 3.4.0
typedef lapack_int (*sgemqrt_t)( int matrix_order, char side, char trans,
                            lapack_int m, lapack_int n, lapack_int k,
                            lapack_int nb, const float* v, lapack_int ldv,
                            const float* t, lapack_int ldt, float* c,
                            lapack_int ldc );
typedef lapack_int (*dgemqrt_t)( int matrix_order, char side, char trans,
                            lapack_int m, lapack_int n, lapack_int k,
                            lapack_int nb, const double* v, lapack_int ldv,
                            const double* t, lapack_int ldt, double* c,
                            lapack_int ldc );
typedef lapack_int (*cgemqrt_t)( int matrix_order, char side, char trans,
                            lapack_int m, lapack_int n, lapack_int k,
                            lapack_int nb, const lapack_complex_float* v,
                            lapack_int ldv, const lapack_complex_float* t,
                            lapack_int ldt, lapack_complex_float* c,
                            lapack_int ldc );
typedef lapack_int (*zgemqrt_t)( int matrix_order, char side, char trans,
                            lapack_int m, lapack_int n, lapack_int k,
                            lapack_int nb, const lapack_complex_double* v,
                            lapack_int ldv, const lapack_complex_double* t,
                            lapack_int ldt, lapack_complex_double* c,
                            lapack_int ldc );

typedef lapack_int (*sgeqrt_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nb, float* a, lapack_int lda, float* t,
                           lapack_int ldt );
typedef lapack_int (*dgeqrt_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nb, double* a, lapack_int lda, double* t,
                           lapack_int ldt );
typedef lapack_int (*cgeqrt_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nb, lapack_complex_float* a,
                           lapack_int lda, lapack_complex_float* t,
                           lapack_int ldt );
typedef lapack_int (*zgeqrt_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int nb, lapack_complex_double* a,
                           lapack_int lda, lapack_complex_double* t,
                           lapack_int ldt );

typedef lapack_int (*sgeqrt2_t)( int matrix_order, lapack_int m, lapack_int n,
                            float* a, lapack_int lda, float* t,
                            lapack_int ldt );
typedef lapack_int (*dgeqrt2_t)( int matrix_order, lapack_int m, lapack_int n,
                            double* a, lapack_int lda, double* t,
                            lapack_int ldt );
typedef lapack_int (*cgeqrt2_t)( int matrix_order, lapack_int m, lapack_int n,
                            lapack_complex_float* a, lapack_int lda,
                            lapack_complex_float* t, lapack_int ldt );
typedef lapack_int (*zgeqrt2_t)( int matrix_order, lapack_int m, lapack_int n,
                            lapack_complex_double* a, lapack_int lda,
                            lapack_complex_double* t, lapack_int ldt );

typedef lapack_int (*sgeqrt3_t)( int matrix_order, lapack_int m, lapack_int n,
                            float* a, lapack_int lda, float* t,
                            lapack_int ldt );
typedef lapack_int (*dgeqrt3_t)( int matrix_order, lapack_int m, lapack_int n,
                            double* a, lapack_int lda, double* t,
                            lapack_int ldt );
typedef lapack_int (*cgeqrt3_t)( int matrix_order, lapack_int m, lapack_int n,
                            lapack_complex_float* a, lapack_int lda,
                            lapack_complex_float* t, lapack_int ldt );
typedef lapack_int (*zgeqrt3_t)( int matrix_order, lapack_int m, lapack_int n,
                            lapack_complex_double* a, lapack_int lda,
                            lapack_complex_double* t, lapack_int ldt );

typedef lapack_int (*stpmqrt_t)( int matrix_order, char side, char trans,
                            lapack_int m, lapack_int n, lapack_int k,
                            lapack_int l, lapack_int nb, const float* v,
                            lapack_int ldv, const float* t, lapack_int ldt,
                            float* a, lapack_int lda, float* b,
                            lapack_int ldb );
typedef lapack_int (*dtpmqrt_t)( int matrix_order, char side, char trans,
                            lapack_int m, lapack_int n, lapack_int k,
                            lapack_int l, lapack_int nb, const double* v,
                            lapack_int ldv, const double* t, lapack_int ldt,
                            double* a, lapack_int lda, double* b,
                            lapack_int ldb );
typedef lapack_int (*ctpmqrt_t)( int matrix_order, char side, char trans,
                            lapack_int m, lapack_int n, lapack_int k,
                            lapack_int l, lapack_int nb,
                            const lapack_complex_float* v, lapack_int ldv,
                            const lapack_complex_float* t, lapack_int ldt,
                            lapack_complex_float* a, lapack_int lda,
                            lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*ztpmqrt_t)( int matrix_order, char side, char trans,
                            lapack_int m, lapack_int n, lapack_int k,
                            lapack_int l, lapack_int nb,
                            const lapack_complex_double* v, lapack_int ldv,
                            const lapack_complex_double* t, lapack_int ldt,
                            lapack_complex_double* a, lapack_int lda,
                            lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*dtpqrt_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int l, lapack_int nb, double* a,
                           lapack_int lda, double* b, lapack_int ldb, double* t,
                           lapack_int ldt );
typedef lapack_int (*ctpqrt_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int l, lapack_int nb,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* b, lapack_int ldb,
                           lapack_complex_float* t, lapack_int ldt );
typedef lapack_int (*ztpqrt_t)( int matrix_order, lapack_int m, lapack_int n,
                           lapack_int l, lapack_int nb,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* b, lapack_int ldb,
                           lapack_complex_double* t, lapack_int ldt );

typedef lapack_int (*stpqrt2_t)( int matrix_order,
                            lapack_int m, lapack_int n, lapack_int l,
                            float* a, lapack_int lda,
                            float* b, lapack_int ldb,
                            float* t, lapack_int ldt );
typedef lapack_int (*dtpqrt2_t)( int matrix_order,
                            lapack_int m, lapack_int n, lapack_int l,
                            double* a, lapack_int lda,
                            double* b, lapack_int ldb,
                            double* t, lapack_int ldt );
typedef lapack_int (*ctpqrt2_t)( int matrix_order,
                            lapack_int m, lapack_int n, lapack_int l,
                            lapack_complex_float* a, lapack_int lda,
                            lapack_complex_float* b, lapack_int ldb,
                            lapack_complex_float* t, lapack_int ldt );
typedef lapack_int (*ztpqrt2_t)( int matrix_order,
                            lapack_int m, lapack_int n, lapack_int l,
                            lapack_complex_double* a, lapack_int lda,
                            lapack_complex_double* b, lapack_int ldb,
                            lapack_complex_double* t, lapack_int ldt );

typedef lapack_int (*stprfb_t)( int matrix_order, char side, char trans, char direct,
                           char storev, lapack_int m, lapack_int n,
                           lapack_int k, lapack_int l, const float* v,
                           lapack_int ldv, const float* t, lapack_int ldt,
                           float* a, lapack_int lda, float* b, lapack_int ldb );
typedef lapack_int (*dtprfb_t)( int matrix_order, char side, char trans, char direct,
                           char storev, lapack_int m, lapack_int n,
                           lapack_int k, lapack_int l, const double* v,
                           lapack_int ldv, const double* t, lapack_int ldt,
                           double* a, lapack_int lda, double* b, lapack_int ldb );
typedef lapack_int (*ctprfb_t)( int matrix_order, char side, char trans, char direct,
                           char storev, lapack_int m, lapack_int n,
                           lapack_int k, lapack_int l,
                           const lapack_complex_float* v, lapack_int ldv,
                           const lapack_complex_float* t, lapack_int ldt,
                           lapack_complex_float* a, lapack_int lda,
                           lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*ztprfb_t)( int matrix_order, char side, char trans, char direct,
                           char storev, lapack_int m, lapack_int n,
                           lapack_int k, lapack_int l,
                           const lapack_complex_double* v, lapack_int ldv,
                           const lapack_complex_double* t, lapack_int ldt,
                           lapack_complex_double* a, lapack_int lda,
                           lapack_complex_double* b, lapack_int ldb );

typedef lapack_int (*sgemqrt_work_t)( int matrix_order, char side, char trans,
                                 lapack_int m, lapack_int n, lapack_int k,
                                 lapack_int nb, const float* v, lapack_int ldv,
                                 const float* t, lapack_int ldt, float* c,
                                 lapack_int ldc, float* work );
typedef lapack_int (*dgemqrt_work_t)( int matrix_order, char side, char trans,
                                 lapack_int m, lapack_int n, lapack_int k,
                                 lapack_int nb, const double* v, lapack_int ldv,
                                 const double* t, lapack_int ldt, double* c,
                                 lapack_int ldc, double* work );
typedef lapack_int (*cgemqrt_work_t)( int matrix_order, char side, char trans,
                                 lapack_int m, lapack_int n, lapack_int k,
                                 lapack_int nb, const lapack_complex_float* v,
                                 lapack_int ldv, const lapack_complex_float* t,
                                 lapack_int ldt, lapack_complex_float* c,
                                 lapack_int ldc, lapack_complex_float* work );
typedef lapack_int (*zgemqrt_work_t)( int matrix_order, char side, char trans,
                                 lapack_int m, lapack_int n, lapack_int k,
                                 lapack_int nb, const lapack_complex_double* v,
                                 lapack_int ldv, const lapack_complex_double* t,
                                 lapack_int ldt, lapack_complex_double* c,
                                 lapack_int ldc, lapack_complex_double* work );

typedef lapack_int (*sgeqrt_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nb, float* a, lapack_int lda,
                                float* t, lapack_int ldt, float* work );
typedef lapack_int (*dgeqrt_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nb, double* a, lapack_int lda,
                                double* t, lapack_int ldt, double* work );
typedef lapack_int (*cgeqrt_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nb, lapack_complex_float* a,
                                lapack_int lda, lapack_complex_float* t,
                                lapack_int ldt, lapack_complex_float* work );
typedef lapack_int (*zgeqrt_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int nb, lapack_complex_double* a,
                                lapack_int lda, lapack_complex_double* t,
                                lapack_int ldt, lapack_complex_double* work );

typedef lapack_int (*sgeqrt2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 float* a, lapack_int lda, float* t,
                                 lapack_int ldt );
typedef lapack_int (*dgeqrt2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 double* a, lapack_int lda, double* t,
                                 lapack_int ldt );
typedef lapack_int (*cgeqrt2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 lapack_complex_float* a, lapack_int lda,
                                 lapack_complex_float* t, lapack_int ldt );
typedef lapack_int (*zgeqrt2_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 lapack_complex_double* a, lapack_int lda,
                                 lapack_complex_double* t, lapack_int ldt );

typedef lapack_int (*sgeqrt3_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 float* a, lapack_int lda, float* t,
                                 lapack_int ldt );
typedef lapack_int (*dgeqrt3_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 double* a, lapack_int lda, double* t,
                                 lapack_int ldt );
typedef lapack_int (*cgeqrt3_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 lapack_complex_float* a, lapack_int lda,
                                 lapack_complex_float* t, lapack_int ldt );
typedef lapack_int (*zgeqrt3_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                 lapack_complex_double* a, lapack_int lda,
                                 lapack_complex_double* t, lapack_int ldt );

typedef lapack_int (*stpmqrt_work_t)( int matrix_order, char side, char trans,
                                 lapack_int m, lapack_int n, lapack_int k,
                                 lapack_int l, lapack_int nb, const float* v,
                                 lapack_int ldv, const float* t, lapack_int ldt,
                                 float* a, lapack_int lda, float* b,
                                 lapack_int ldb, float* work );
typedef lapack_int (*dtpmqrt_work_t)( int matrix_order, char side, char trans,
                                 lapack_int m, lapack_int n, lapack_int k,
                                 lapack_int l, lapack_int nb, const double* v,
                                 lapack_int ldv, const double* t,
                                 lapack_int ldt, double* a, lapack_int lda,
                                 double* b, lapack_int ldb, double* work );
typedef lapack_int (*ctpmqrt_work_t)( int matrix_order, char side, char trans,
                                 lapack_int m, lapack_int n, lapack_int k,
                                 lapack_int l, lapack_int nb,
                                 const lapack_complex_float* v, lapack_int ldv,
                                 const lapack_complex_float* t, lapack_int ldt,
                                 lapack_complex_float* a, lapack_int lda,
                                 lapack_complex_float* b, lapack_int ldb,
                                 lapack_complex_float* work );
typedef lapack_int (*ztpmqrt_work_t)( int matrix_order, char side, char trans,
                                 lapack_int m, lapack_int n, lapack_int k,
                                 lapack_int l, lapack_int nb,
                                 const lapack_complex_double* v, lapack_int ldv,
                                 const lapack_complex_double* t, lapack_int ldt,
                                 lapack_complex_double* a, lapack_int lda,
                                 lapack_complex_double* b, lapack_int ldb,
                                 lapack_complex_double* work );

typedef lapack_int (*dtpqrt_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int l, lapack_int nb, double* a,
                                lapack_int lda, double* b, lapack_int ldb,
                                double* t, lapack_int ldt, double* work );
typedef lapack_int (*ctpqrt_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int l, lapack_int nb,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* b, lapack_int ldb,
                                lapack_complex_float* t, lapack_int ldt,
                                lapack_complex_float* work );
typedef lapack_int (*ztpqrt_work_t)( int matrix_order, lapack_int m, lapack_int n,
                                lapack_int l, lapack_int nb,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* b, lapack_int ldb,
                                lapack_complex_double* t, lapack_int ldt,
                                lapack_complex_double* work );

typedef lapack_int (*stpqrt2_work_t)( int matrix_order,
                                 lapack_int m, lapack_int n, lapack_int l,
                                 float* a, lapack_int lda,
                                 float* b, lapack_int ldb,
                                 float* t, lapack_int ldt );
typedef lapack_int (*dtpqrt2_work_t)( int matrix_order,
                                 lapack_int m, lapack_int n, lapack_int l,
                                 double* a, lapack_int lda,
                                 double* b, lapack_int ldb,
                                 double* t, lapack_int ldt );
typedef lapack_int (*ctpqrt2_work_t)( int matrix_order,
                                 lapack_int m, lapack_int n, lapack_int l,
                                 lapack_complex_float* a, lapack_int lda,
                                 lapack_complex_float* b, lapack_int ldb,
                                 lapack_complex_float* t, lapack_int ldt );
typedef lapack_int (*ztpqrt2_work_t)( int matrix_order,
                                 lapack_int m, lapack_int n, lapack_int l,
                                 lapack_complex_double* a, lapack_int lda,
                                 lapack_complex_double* b, lapack_int ldb,
                                 lapack_complex_double* t, lapack_int ldt );

typedef lapack_int (*stprfb_work_t)( int matrix_order, char side, char trans,
                                char direct, char storev, lapack_int m,
                                lapack_int n, lapack_int k, lapack_int l,
                                const float* v, lapack_int ldv, const float* t,
                                lapack_int ldt, float* a, lapack_int lda,
                                float* b, lapack_int ldb, const float* work,
                                lapack_int ldwork );
typedef lapack_int (*dtprfb_work_t)( int matrix_order, char side, char trans,
                                char direct, char storev, lapack_int m,
                                lapack_int n, lapack_int k, lapack_int l,
                                const double* v, lapack_int ldv,
                                const double* t, lapack_int ldt, double* a,
                                lapack_int lda, double* b, lapack_int ldb,
                                const double* work, lapack_int ldwork );
typedef lapack_int (*ctprfb_work_t)( int matrix_order, char side, char trans,
                                char direct, char storev, lapack_int m,
                                lapack_int n, lapack_int k, lapack_int l,
                                const lapack_complex_float* v, lapack_int ldv,
                                const lapack_complex_float* t, lapack_int ldt,
                                lapack_complex_float* a, lapack_int lda,
                                lapack_complex_float* b, lapack_int ldb,
                                const float* work, lapack_int ldwork );
typedef lapack_int (*ztprfb_work_t)( int matrix_order, char side, char trans,
                                char direct, char storev, lapack_int m,
                                lapack_int n, lapack_int k, lapack_int l,
                                const lapack_complex_double* v, lapack_int ldv,
                                const lapack_complex_double* t, lapack_int ldt,
                                lapack_complex_double* a, lapack_int lda,
                                lapack_complex_double* b, lapack_int ldb,
                                const double* work, lapack_int ldwork );
//LAPACK 3.X.X
typedef lapack_int (*ssysv_rook_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, float* a, lapack_int lda,
                               lapack_int* ipiv, float* b, lapack_int ldb );
typedef lapack_int (*dsysv_rook_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, double* a, lapack_int lda,
                               lapack_int* ipiv, double* b, lapack_int ldb );
typedef lapack_int (*csysv_rook_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, lapack_complex_float* a,
                               lapack_int lda, lapack_int* ipiv,
                               lapack_complex_float* b, lapack_int ldb );
typedef lapack_int (*zsysv_rook_t)( int matrix_order, char uplo, lapack_int n,
                               lapack_int nrhs, lapack_complex_double* a,
                               lapack_int lda, lapack_int* ipiv,
                               lapack_complex_double* b, lapack_int ldb );
typedef lapack_int (*csyr_t)( int matrix_order, char uplo, lapack_int n,
                             lapack_complex_float alpha,
                             const lapack_complex_float* x, lapack_int incx,
                             lapack_complex_float* a, lapack_int lda );
typedef lapack_int (*zsyr_t)( int matrix_order, char uplo, lapack_int n,
                             lapack_complex_double alpha,
                             const lapack_complex_double* x, lapack_int incx,
                             lapack_complex_double* a, lapack_int lda );

typedef lapack_int (*csyr_work_t)( int matrix_order, char uplo, lapack_int n,
                                  lapack_complex_float alpha,
                                  const lapack_complex_float* x,
                                  lapack_int incx, lapack_complex_float* a,
                                  lapack_int lda );
typedef lapack_int (*zsyr_work_t)( int matrix_order, char uplo, lapack_int n,
                                  lapack_complex_double alpha,
                                  const lapack_complex_double* x,
                                  lapack_int incx, lapack_complex_double* a,
                                  lapack_int lda );
typedef void (*ilaver_t)( const lapack_int* vers_major,
                     const lapack_int* vers_minor,
                     const lapack_int* vers_patch );


#endif
