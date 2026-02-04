def_id "order"
def_id "trans"
def_id "transa"
def_id "transb"
def_id "uplo"
def_id "diag"
def_id "side"
def_id "alpha"
def_id "beta"
def_id "sb"
def_id "axis"
def_id "keepdims"

if /[cz]/ =~ blas_char
  def_id "real"
  def_id "imag"
end

case blas_char
when "c"
  real_char = "s"
when "z"
  real_char = "d"
end

# level-1 blas

case blas_char
when /[sd]/
  decl "?dot"
  decl "?nrm2"
  decl "?asum", "nrm2"
  if "s" == blas_char
    decl "dsdot", "dot"
    decl "sdsdot"
  end
when /[cz]/
  decl "?dotc", "dot", "?dotc_sub"
  decl "?dotu", "dot", "?dotu_sub"
  decl real_char+"?nrm2", "nrm2"
  decl real_char+"?asum", "nrm2"
end

decl "?swap"
decl "?copy"
decl "?axpy"

case blas_char
when /[sd]/
  decl "?rot"
  decl "?rotm"
else
  #decl blas_char+real_char+"rot", "rot"
end

decl "?scal"
case blas_char
when /[cz]/
  decl blas_char+real_char+"scal", "scal"
end

# level-2 blas

decl "?gemv", "mv"
decl "?trmv", "mv"

case blas_char
when /[sd]/
  decl "?symv", "mv"  # [cz]symv missing in CBLAS
  decl "?syr"         # [cz]syr  missing in CBLAS
  decl "?ger"
  decl "?syr2"
when /[cz]/
  decl "?hemv", "mv"
  decl "?gerc", "ger"
  decl "?geru", "ger"
  decl "?her",  "syr"
  decl "?her2", "syr2"
  decl "?herk", "syrk"
end

# level-3 blas

decl "?gemm", "mm"
decl "?symm", "mm"
decl "?trmm", "mm"

case blas_char
when /[cz]/
  decl "?hemm", "mm"
end
decl "?syrk"
decl "?syr2k"
