static VALUE
<%=c_func(1)%>(VALUE mod, VALUE prefix)
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
