#if defined __clang__
#  define UNUSED(name) __unused name
#else
#  define UNUSED(name) name
#endif

#if SIZEOF_INT == 4
#define cI numo_cInt32
#define cUI numo_cUInt32
#elif SIZEOF_INT==8
#define cI numo_cInt64
#define cUI numo_cUInt64
#endif

#if SIZEOF_SIZE_T == 4
#define cSZ numo_cUInt32
#define cSSZ numo_cInt32
#elif SIZEOF_SIZE_T == 8
#define cSZ numo_cUInt64
#define cSSZ numo_cInt64
#endif

#define cDF numo_cDFloat
#define cDC numo_cDComplex
#define cSF numo_cSFloat
#define cSC numo_cSComplex
#define cInt cI
#define cUInt cUI

extern VALUE na_expand_dims(VALUE self, VALUE vdim);

#define max_(m,n) (((m)>(n)) ? (m):(n))
#define min_(m,n) (((m)<(n)) ? (m):(n))

#define ROW_SIZE(na) ((na)->shape[(na)->ndim-2])
#define COL_SIZE(na) ((na)->shape[(na)->ndim-1])

#define CHECK_NARRAY_TYPE(x,t)                                 \
    if (CLASS_OF(x)!=(t)) {                                    \
        rb_raise(rb_eTypeError,"invalid NArray type (class)"); \
    }

// Error Class ??
#define CHECK_DIM_GE(na,nd)                                     \
    if ((na)->ndim<(nd)) {                                      \
        rb_raise(nary_eShapeError,                              \
                 "n-dimension=%d, but >=%d is expected",        \
                 (na)->ndim, (nd));                             \
    }

#define CHECK_DIM_EQ(na1,nd)                                    \
    if ((na1)->ndim != (nd)) {                                  \
        rb_raise(nary_eShapeError,                              \
                 "dimention mismatch: %d != %d",                \
                 (na1)->ndim, (nd));                            \
    }

#define CHECK_SQUARE(name,na)                                           \
    if ((na)->shape[(na)->ndim-1] != (na)->shape[(na)->ndim-2]) {       \
        rb_raise(nary_eShapeError,"%s is not square matrix",name);      \
    }

#define CHECK_SIZE_GE(na,sz)                                    \
    if ((na)->size < (size_t)(sz)) {                            \
        rb_raise(nary_eShapeError,                              \
                 "NArray size must be >= %"SZF"u",(size_t)(sz));\
    }

#define CHECK_NON_EMPTY(na)                                     \
    if ((na)->size==0) {                                        \
        rb_raise(nary_eShapeError,"empty NArray");              \
    }

#define CHECK_SIZE_EQ(n,m)                                      \
    if ((n)!=(m)) {                                             \
        rb_raise(nary_eShapeError,                              \
                 "size mismatch: %"SZF"d != %"SZF"d",           \
                 (size_t)(n),(size_t)(m));                      \
    }

#define CHECK_SAME_SHAPE(na1,na2)                                \
    {   int i;                                                   \
        CHECK_DIM_EQ(na1,na2->ndim);                             \
        for (i=0; i<na1->ndim; i++) {                            \
            CHECK_SIZE_EQ(na1->shape[i],na2->shape[i]);          \
        }                                                        \
    }

#define CHECK_INT_EQ(sm,m,sn,n)                          \
    if ((m) != (n)) {                                    \
        rb_raise(nary_eShapeError,                       \
                 "%s must be == %s: %s=%d %s=%d",        \
                 sm,sn,sm,m,sn,n);                       \
    }

// Error Class ??
#define CHECK_LEADING_GE(sld,ld,sn,n)                    \
    if ((ld) < (n)) {                                    \
        rb_raise(nary_eShapeError,                       \
                 "%s must be >= max(%s,1): %s=%d %s=%d", \
                 sld,sn,sld,ld,sn,n);                    \
    }

#define COPY_OR_CAST_TO(a,T)                            \
    {                                                   \
        if (CLASS_OF(a) == (T)) {                       \
            if (!TEST_INPLACE(a)) {                     \
                a = na_copy(a);                         \
            }                                           \
        } else {                                        \
            a = rb_funcall(T,rb_intern("cast"),1,a);    \
        }                                               \
    }

#define swap(a,b) {tmp=a;a=b;b=tmp;}
