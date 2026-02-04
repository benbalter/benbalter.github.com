module Numo; module Linalg

  module Blas

    FIXNAME =
    {
     cnrm2: :csnrm2,
     znrm2: :dznrm2,
    }

    # Call BLAS function prefixed with BLAS char ([sdcz])
    # defined from data-types of arguments.
    # @param [Symbol] func  function name without BLAS char.
    # @param args  arguments passed to Blas function.
    # @param kwargs  keyword arguments passed to Blas function.
    # @example
    #      c = Numo::Linalg::Blas.call(:gemm, a, b)
    def self.call(func, *args, **kwargs)
      fn = (Linalg.blas_char(*args) + func.to_s).to_sym
      fn = FIXNAME[fn] || fn
      if kwargs.empty?
        # This conditional branch is necessary to prevent ArgumentError
        # that occurs in Ruby 2.6 or earlier.
        send(fn, *args)
      else
        send(fn, *args, **kwargs)
      end
    end

  end

  module Lapack

    FIXNAME =
    {
     corgqr: :cungqr,
     zorgqr: :zungqr,
    }

    # Call LAPACK function prefixed with BLAS char ([sdcz])
    # defined from data-types of arguments.
    # @param [Symbol,String] func  function name without BLAS char.
    # @param args  arguments passed to Lapack function.
    # @param kwargs  keyword arguments passed to Lapack function.
    # @example
    #      s = Numo::Linalg::Lapack.call(:gesv, a)
    def self.call(func, *args, **kwargs)
      fn = (Linalg.blas_char(*args) + func.to_s).to_sym
      fn = FIXNAME[fn] || fn
      if kwargs.empty?
        # This conditional branch is necessary to prevent ArgumentError
        # that occurs in Ruby 2.6 or earlier.
        send(fn, *args)
      else
        send(fn, *args, **kwargs)
      end
    end

  end

  BLAS_CHAR =
  {
   SFloat => "s",
   DFloat => "d",
   SComplex => "c",
   DComplex => "z",
  }

  module_function

  def blas_char(*args)
    t = Float
    args.each do |a|
      k =
        case a
        when NArray
          a.class
        when Array
          NArray.array_type(a)
        end
      if k && k < NArray
        t = k::UPCAST[t] || t::UPCAST[k]
      end
    end
    BLAS_CHAR[t] || raise(TypeError,"invalid data type for BLAS/LAPACK")
  end

  # module methods

  ## Matrix and vector products

  # Dot product.
  # @param a [Numo::NArray] matrix or vector (>= 1-dimensinal NArray)
  # @param b [Numo::NArray] matrix or vector (>= 1-dimensinal NArray)
  # @return [Numo::NArray] result of dot product
  def dot(a, b)
    a = NArray.asarray(a)
    b = NArray.asarray(b)
    case a.ndim
    when 1
      case b.ndim
      when 1
        func = blas_char(a, b) =~ /c|z/ ? :dotu : :dot
        Blas.call(func, a, b)
      else
        if b.contiguous?
          trans = 't'
        else
          if b.fortran_contiguous?
            trans = 'n'
            b = b.transpose
          else
            trans = 't'
            b = b.dup
          end
        end
        Blas.call(:gemv, b, a, trans:trans)
      end
    else
      case b.ndim
      when 1
        if a.contiguous?
          trans = 'n'
        else
          if a.fortran_contiguous?
            trans = 't'
            a = a.transpose
          else
            trans = 'n'
            a = a.dup
          end
        end
        Blas.call(:gemv, a, b, trans:trans)
      else
        if a.contiguous?
          transa = 'n'
        else
          if a.fortran_contiguous?
            transa = 't'
            a = a.transpose
          else
            transa = 'n'
            a = a.dup
          end
        end
        if b.contiguous?
          transb = 'n'
        else
          if b.fortran_contiguous?
            transb='t'
            b = b.transpose
          else
            transb='n'
            b = b.dup
          end
        end
        Blas.call(:gemm, a, b, transa:transa, transb:transb)
      end
    end
  end

  # Matrix product.
  # @param a [Numo::NArray] matrix (>= 2-dimensinal NArray)
  # @param b [Numo::NArray] matrix (>= 2-dimensinal NArray)
  # @return [Numo::NArray] result of matrix product
  def matmul(a, b)
    Blas.call(:gemm, a, b)
  end

  # Compute a square matrix `a` to the power `n`.
  #
  #  * If n > 0: return `a**n`.
  #  * If n == 0: return identity matrix.
  #  * If n < 0: return `(a*\*-1)*\*n.abs`.
  #
  # @param a [Numo::NArray] square matrix (>= 2-dimensinal NArray).
  # @param n [Integer] the exponent.
  # @example
  #     i = Numo::DFloat[[0, 1], [-1, 0]]
  #     => Numo::DFloat#shape=[2,2]
  #     [[0, 1],
  #      [-1, 0]]
  #     Numo::Linalg.matrix_power(i,3)
  #     => Numo::DFloat#shape=[2,2]
  #     [[0, -1],
  #      [1, 0]]
  #     Numo::Linalg.matrix_power(i,0)
  #     => Numo::DFloat#shape=[2,2]
  #     [[1, 0],
  #      [0, 1]]
  #     Numo::Linalg.matrix_power(i,-3)
  #     => Numo::DFloat#shape=[2,2]
  #     [[0, 1],
  #      [-1, 0]]
  #
  #     q = Numo::DFloat.zeros(4,4)
  #     q[0..1,0..1] = -i
  #     q[2..3,2..3] = i
  #     q
  #     => Numo::DFloat#shape=[4,4]
  #     [[-0, -1, 0, 0],
  #      [1, -0, 0, 0],
  #      [0, 0, 0, 1],
  #      [0, 0, -1, 0]]
  #     Numo::Linalg.matrix_power(q,2)
  #     => Numo::DFloat#shape=[4,4]
  #     [[-1, 0, 0, 0],
  #      [0, -1, 0, 0],
  #      [0, 0, -1, 0],
  #      [0, 0, 0, -1]]

  def matrix_power(a, n)
    a = NArray.asarray(a)
    m,k = a.shape[-2..-1]
    unless m==k
      raise NArray::ShapeError, "input must be a square array"
    end
    unless Integer===n
      raise ArgumentError, "exponent must be an integer"
    end
    if n == 0
      return a.class.eye(m)
    elsif n < 0
      a = inv(a)
      n = n.abs
    end
    if n <= 3
      r = a
      (n-1).times do
        r = matmul(r,a)
      end
    else
      while (n & 1) == 0
        a = matmul(a,a)
        n >>= 1
      end
      r = a
      while n != 0
        a = matmul(a,a)
        n >>= 1
        if (n & 1) != 0
          r = matmul(r,a)
        end
      end
    end
    r
  end


  ## factorization

  # Computes a QR factorization of a complex M-by-N matrix A: A = Q \* R.
  #
  # @param a [Numo::NArray] m-by-n matrix A (>= 2-dimensinal NArray)
  # @param mode [String]
  #   - "reduce"   -- returns both Q and R,
  #   - "r"        -- returns only R,
  #   - "economic" -- returns both Q and R but computed in economy-size,
  #   - "raw"      -- returns QR and TAU used in LAPACK.
  # @return [r]        if mode:"r"
  # @return [[q,r]]    if mode:"reduce" or "economic"
  # @return [[qr,tau]] if mode:"raw" (LAPACK geqrf result)

  def qr(a, mode:"reduce")
    qr,tau, = Lapack.call(:geqrf, a)
    *shp,m,n = qr.shape
    r = (m >= n && %w[economic raw].include?(mode)) ?
      qr[false, 0...n, true].triu : qr.triu
    mode = mode.to_s.downcase
    case mode
    when "r"
      return r
    when "raw"
      return [qr,tau]
    when "reduce","economic"
      # skip
    else
      raise ArgumentError, "invalid mode:#{mode}"
    end
    if m < n
      q, = Lapack.call(:orgqr, qr[false, 0...m], tau)
    elsif mode == "economic"
      q, = Lapack.call(:orgqr, qr, tau)
    else
      qqr = qr.class.zeros(*(shp+[m,m]))
      qqr[false,0...n] = qr
      q, = Lapack.call(:orgqr, qqr, tau)
    end
    return [q,r]
  end


  # Computes the Singular Value Decomposition (SVD) of a M-by-N matrix A,
  # and the left and/or right singular vectors.  The SVD is written
  #
  #     A = U * SIGMA * transpose(V)
  #
  # where SIGMA is an M-by-N matrix which is zero except for its
  # min(m,n) diagonal elements, U is an M-by-M orthogonal matrix, and
  # V is an N-by-N orthogonal matrix. The diagonal elements of SIGMA
  # are the singular values of A; they are real and non-negative, and
  # are returned in descending order. The first min(m,n) columns of U
  # and V are the left and right singular vectors of A. Note that the
  # routine returns V**T, not V.
  #
  # @param a [Numo::NArray] m-by-n matrix A (>= 2-dimensinal NArray)
  # @param driver [String or Symbol] choose LAPACK solver from 'svd',
  #   'sdd'. (optional, default='svd')
  # @param job [String or Symbol]
  #   - 'A': all M columns of U and all N rows of V\*\*T are returned in
  #     the arrays U and VT.
  #   - 'S': the first min(M,N) columns of U and the first min(M,N)
  #     rows of V\*\*T are returned in the arrays U and VT.
  #   - 'N':  no columns of U or rows of V\*\*T are computed.
  # @return [[sigma,u,vt]] SVD result. Array<Numo::NArray>

  def svd(a, driver:'svd', job:'A')
    unless /^[ASN]/i =~ job
      raise ArgumentError, "invalid job: #{job.inspect}"
    end
    case driver.to_s
    when /^(ge)?sdd$/i, "turbo"
      Lapack.call(:gesdd, a, jobz:job)[0..2]
    when /^(ge)?svd$/i
      Lapack.call(:gesvd, a, jobu:job, jobvt:job)[0..2]
    else
      raise ArgumentError, "invalid driver: #{driver}"
    end
  end

  # Computes the Singular Values of a M-by-N matrix A.
  # The SVD is written
  #
  #     A = U * SIGMA * transpose(V)
  #
  # where SIGMA is an M-by-N matrix which is zero except for its
  # min(m,n) diagonal elements. The diagonal elements of SIGMA
  # are the singular values of A; they are real and non-negative, and
  # are returned in descending order.
  #
  # @param a [Numo::NArray] m-by-n matrix A (>= 2-dimensinal NArray)
  # @param driver [String or Symbol] choose LAPACK solver from 'svd',
  #   'sdd'. (optional, default='svd')
  # @return [Numo::NArray] returns SIGMA (singular values).

  def svdvals(a, driver:'svd')
    case driver.to_s
    when /^(ge)?sdd$/i, "turbo"
      Lapack.call(:gesdd, a, jobz:'N')[0]
    when /^(ge)?svd$/i
      Lapack.call(:gesvd, a, jobu:'N', jobvt:'N')[0]
    else
      raise ArgumentError, "invalid driver: #{driver}"
    end
  end

  # Computes an orthonormal basis for the range of matrix A.
  #
  # @param a [Numo::NArray] m-by-n matrix A (>= 2-dimensional NArray).
  # @param rcond [Float] (optional)
  #   rcond is used to determine the effective rank of A.
  #   Singular values `s[i] <= rcond * s.max` are treated as zero.
  #   If rcond < 0, machine precision is used instead.
  # @return [Numo::NArray] The orthonormal basis for the range of matrix A.

  def orth(a, rcond: -1)
    raise NArray::ShapeError, '2-d array is required' if a.ndim < 2
    s, u, = svd(a)
    tol = s.max * (rcond.nil? || rcond < 0 ? a.class::EPSILON * a.shape.max : rcond)
    k = (s > tol).count
    u[true, 0...k]
  end

  # Computes an orthonormal basis for the null space of matrix A.
  #
  # @param a [Numo::NArray] m-by-n matrix A (>= 2-dimensional NArray).
  # @param rcond [Float] (optional)
  #   rcond is used to determine the effective rank of A.
  #   Singular values `s[i] <= rcond * s.max` are treated as zero.
  #   If rcond < 0, machine precision is used instead.
  # @return [Numo::NArray] The orthonormal basis for the null space of matrix A.

  def null_space(a, rcond: -1)
    raise NArray::ShapeError, '2-d array is required' if a.ndim < 2
    s, _u, vh = svd(a)
    tol = s.max * (rcond.nil? || rcond < 0 ? a.class::EPSILON * a.shape.max : rcond)
    k = (s > tol).count
    return a.class.new if k == vh.shape[0]
    r = vh[k..-1, true].transpose.dup
    blas_char(vh) =~ /c|z/ ? r.conj : r
  end

  # Computes an LU factorization of a M-by-N matrix A
  # using partial pivoting with row interchanges.
  #
  # The factorization has the form
  #
  #     A = P * L * U
  #
  # where P is a permutation matrix, L is lower triangular with unit
  # diagonal elements (lower trapezoidal if m > n), and U is upper
  # triangular (upper trapezoidal if m < n).
  #
  # @param a [Numo::NArray] m-by-n matrix A (>= 2-dimensinal NArray)
  # @param permute_l [Bool] (optional) If true, perform the matrix product of P and L.
  # @return [[p,l,u]] if permute_l == false
  # @return [[pl,u]]  if permute_l == true
  #
  #   - **p** [Numo::NArray] -- The permutation matrix P.
  #   - **l** [Numo::NArray] -- The factor L.
  #   - **u** [Numo::NArray] -- The factor U.

  def lu(a, permute_l: false)
    raise NArray::ShapeError, '2-d array is required' if a.ndim < 2
    m, n = a.shape
    k = [m, n].min
    lu, ip = lu_fact(a)
    l = lu.tril.tap { |mat| mat[mat.diag_indices(0)] = 1.0 }[true, 0...k]
    u = lu.triu[0...k, 0...n]
    p = Numo::DFloat.eye(m).tap do |mat|
          ip.to_a.each_with_index { |i, j| mat[true, [i - 1, j]] = mat[true, [j, i - 1]].dup }
        end
    permute_l ? [p.dot(l), u] : [p, l, u]
  end

  # Computes an LU factorization of a M-by-N matrix A
  # using partial pivoting with row interchanges.
  #
  # The factorization has the form
  #
  #     A = P * L * U
  #
  # where P is a permutation matrix, L is lower triangular with unit
  # diagonal elements (lower trapezoidal if m > n), and U is upper
  # triangular (upper trapezoidal if m < n).
  #
  # @param a [Numo::NArray] m-by-n matrix A (>= 2-dimensinal NArray)
  # @return [[lu, ipiv]]
  #   - **lu** [Numo::NArray] -- The factors L and U from the factorization
  #     `A = P*L*U`; the unit diagonal elements of L are not stored.
  #   - **ipiv** [Numo::NArray] -- The pivot indices; for 1 <= i <= min(M,N),
  #      row i of the matrix was interchanged with row IPIV(i).

  def lu_fact(a)
    Lapack.call(:getrf, a)[0..1]
  end

  # Computes the inverse of a matrix using the LU factorization
  # computed by Numo::Linalg.lu_fact.
  #
  # This method inverts U and then computes inv(A) by solving the system
  #
  #     inv(A)*L = inv(U)
  #
  # for inv(A).
  #
  # @param lu [Numo::NArray] matrix containing the factors L and U
  #   from the factorization `A = P*L*U` as computed by
  #   Numo::Linalg.lu_fact.
  # @param ipiv [Numo::NArray] The pivot indices from
  #   Numo::Linalg.lu_fact; for 1<=i<=N, row i of the matrix was
  #   interchanged with row IPIV(i).
  # @return [Numo::NArray]  the inverse of the original matrix A.

  def lu_inv(lu, ipiv)
    Lapack.call(:getri, lu, ipiv)[0]
  end

  # Solves a system of linear equations
  #
  #     A * X = B  or  A**T * X = B
  #
  # with a N-by-N matrix A using the LU factorization computed by
  # Numo::Linalg.lu_fact
  #
  # @param lu [Numo::NArray] matrix containing the factors L and U
  #   from the factorization `A = P*L*U` as computed by
  #   Numo::Linalg.lu_fact.
  # @param ipiv [Numo::NArray] The pivot indices from
  #   Numo::Linalg.lu_fact; for 1<=i<=N, row i of the matrix was
  #   interchanged with row IPIV(i).
  # @param b [Numo::NArray] the right hand side matrix B.
  # @param trans [String or Symbol]
  #   Specifies the form of the system of equations:
  #     - If 'N': `A * X = B` (No transpose).
  #     - If 'T': `A*\*T* X = B` (Transpose).
  #     - If 'C': `A*\*T* X = B` (Conjugate transpose = Transpose).
  # @return [Numo::NArray]  the solution matrix X.

  def lu_solve(lu, ipiv, b, trans:"N")
    Lapack.call(:getrs, lu, ipiv, b, trans:trans)[0]
  end

  # Computes the LDLt or Bunch-Kaufman factorization of a symmetric/Hermitian matrix A.
  # The factorization has the form
  #
  #     A = U*D*U**T  or  A = L*D*L**T
  #
  # where U (or L) is a product of permutation and unit upper (lower) triangular matrices
  # and D is symmetric and block diagonal with 1-by-1 and 2-by-2 diagonal blocks.
  #
  # @param a [Numo::NArray] m-by-m matrix A (>= 2-dimensinal NArray)
  # @param uplo [String or Symbol] optional, default='U'. Access upper or ('U') lower ('L') triangle.
  # @param hermitian [Bool] optional, default=true. If true, hermitian matrix is assumed.
  #   (omitted when real-value matrix is given)
  #
  # @return [[lu,d,perm]]
  #
  #   - **lu** [Numo::NArray] -- The permutated upper (lower) triangular matrix U (L).
  #   - **d** [Numo::NArray] -- The block diagonal matrix D.
  #   - **perm** [Numo::NArray] -- The row-permutation index for changing lu into triangular form.

  def ldl(a, uplo: 'U', hermitian: true)
    raise NArray::ShapeError, '2-d array is required' if a.ndim < 2
    raise NArray::ShapeError, 'matrix a is not square matrix' if a.shape[0] != a.shape[1]

    is_complex = blas_char(a) =~ /c|z/
    func = is_complex && hermitian ? 'hetrf' : 'sytrf'
    lud, ipiv, = Lapack.call(func.to_sym, a, uplo: uplo)

    lu = (uplo == 'U' ? lud.triu : lud.tril).tap { |mat| mat[mat.diag_indices(0)] = 1.0 }
    d = lud[lud.diag_indices(0)].diag

    m = a.shape[0]
    n = m - 1
    changed_2x2 = false
    perm = Numo::Int32.new(m).seq
    m.times do |t|
      i = uplo == 'U' ? t : n - t
      j = uplo == 'U' ? i - 1 : i + 1;
      r = uplo == 'U' ? 0..i : i..n;
      if ipiv[i] > 0
        k = ipiv[i] - 1
        lu[[k, i], r] = lu[[i, k], r].dup
        perm[[k, i]] = perm[[i, k]].dup
      elsif j.between?(0, n) && ipiv[i] == ipiv[j] && !changed_2x2
        k = ipiv[i].abs - 1
        d[j, i] = lud[j, i]
        d[i, j] = is_complex && hermitian ? lud[j, i].conj : lud[j, i]
        lu[j, i] = 0.0
        lu[[k, j], r] = lu[[j, k], r].dup
        perm[[k, j]] = perm[[j, k]].dup
        changed_2x2 = true
        next
      end
      changed_2x2 = false
    end

    [lu, d, perm.sort_index]
  end

  # Computes the Cholesky factorization of a symmetric/Hermitian
  # positive definite matrix A. The factorization has the form
  #
  #     A = U**H * U,  if UPLO = 'U', or
  #     A = L  * L**H,  if UPLO = 'L',
  #
  # where U is an upper triangular matrix and L is a lower triangular matrix.
  # @param a [Numo::NArray] n-by-n symmetric matrix A (>= 2-dimensinal NArray)
  # @param uplo [String or Symbol] optional, default='U'. Access upper
  #   or ('U') lower ('L') triangle.
  # @return [Numo::NArray] The factor U or L.

  def cholesky(a, uplo: 'U')
    raise NArray::ShapeError, '2-d array is required' if a.ndim < 2
    raise NArray::ShapeError, 'matrix a is not square matrix' if a.shape[0] != a.shape[1]
    factor = Lapack.call(:potrf, a, uplo: uplo)[0]
    if uplo == 'U'
      factor.triu
    else
      # TODO: Use the tril method if the verision of Numo::NArray
      #       in the runtime dependency list becomes 0.9.1.3 or higher.
      m, = a.shape
      factor * Numo::DFloat.ones(m, m).triu.transpose
    end
  end

  # Computes the Cholesky factorization of a symmetric/Hermitian
  # positive definite matrix A. The factorization has the form
  #
  #     A = U**H * U,  if UPLO = 'U', or
  #     A = L  * L**H,  if UPLO = 'L',
  #
  # where U is an upper triangular matrix and L is a lower triangular matrix.
  # @param a [Numo::NArray] n-by-n symmetric matrix A (>= 2-dimensinal NArray)
  # @param uplo [String or Symbol] optional, default='U'. Access upper
  #   or ('U') lower ('L') triangle.
  # @return [Numo::NArray] The matrix which has the Cholesky factor in upper or lower triangular part.
  #   Remain part consists of random values.

  def cho_fact(a, uplo:'U')
    Lapack.call(:potrf, a, uplo:uplo)[0]
  end

  # Computes the inverse of a symmetric/Hermitian
  # positive definite matrix A using the Cholesky factorization
  # `A = U**T*U` or `A = L*L**T` computed by Linalg.cho_fact.
  #
  # @param a [Numo::NArray] the triangular factor U or L from the
  #   Cholesky factorization, as computed by Linalg.cho_fact.
  # @param uplo [String or Symbol] optional, default='U'. Access upper
  #   or ('U') lower ('L') triangle.
  # @return [Numo::NArray] the upper or lower triangle of the
  #   (symmetric) inverse of A.

  def cho_inv(a, uplo:'U')
    Lapack.call(:potri, a, uplo:uplo)[0]
  end

  # Solves a system of linear equations
  #     A*X = B
  # with a symmetric/Hermitian positive definite matrix A
  # using the Cholesky factorization
  # `A = U**T*U` or `A = L*L**T` computed by Linalg.cho_fact.
  # @param a [Numo::NArray] the triangular factor U or L from the
  #   Cholesky factorization, as computed by Linalg.cho_fact.
  # @param b [Numo::NArray] the right hand side matrix B.
  # @param uplo [String or Symbol] optional, default='U'. Access upper
  #   or ('U') lower ('L') triangle.
  # @return [Numo::NArray] the solution matrix X.

  def cho_solve(a, b, uplo:'U')
    Lapack.call(:potrs, a, b, uplo:uplo)[0]
  end


  ## Matrix eigenvalues

  # Computes the eigenvalues and, optionally, the left and/or right
  # eigenvectors for a square nonsymmetric matrix A.
  #
  # @param a [Numo::NArray] square nonsymmetric matrix (>= 2-dimensinal NArray)
  # @param left [Bool] (optional) If true, left eigenvectors are computed.
  # @param right [Bool] (optional) If true, right eigenvectors are computed.
  # @return [[w,vl,vr]]
  #   - **w**  [Numo::NArray] -- The eigenvalues.
  #   - **vl** [Numo::NArray] -- The left eigenvectors if left is true, otherwise nil.
  #   - **vr** [Numo::NArray] -- The right eigenvectors if right is true, otherwise nil.

  def eig(a, left:false, right:true)
    jobvl, jobvr = left, right
    case blas_char(a)
    when /c|z/
      w, vl, vr, info = Lapack.call(:geev, a, jobvl:jobvl, jobvr:jobvr)
    else
      wr, wi, vl, vr, info = Lapack.call(:geev, a, jobvl:jobvl, jobvr:jobvr)
      w  = wr + wi * Complex::I
      vl = _make_complex_eigvecs(w,vl) if left
      vr = _make_complex_eigvecs(w,vr) if right
    end
    [w,vl,vr] #.compact
  end

  # Obtains the eigenvalues and, optionally, the eigenvectors
  # by solving an ordinary or generalized eigenvalue problem
  # for a square symmetric / Hermitian matrix.
  #
  # @param a [Numo::NArray] square symmetric matrix (>= 2-dimensinal NArray)
  # @param b [Numo::NArray] (optional) square symmetric matrix (>= 2-dimensinal NArray)
  #   If nil, identity matrix is assumed.
  # @param vals_only [Bool] (optional) If false, eigenvectors are computed.
  # @param vals_range [Range] (optional)
  #   The range of indices of the eigenvalues (in ascending order) and corresponding eigenvectors to be returned.
  #   If nil or 0...N (N is the size of the matrix a), all eigenvalues and eigenvectors are returned.
  # @param uplo [String or Symbol] (optional, default='U')
  #   Access upper ('U') or lower ('L') triangle.
  # @param turbo [Bool] (optional) If true, divide and conquer algorithm is used.
  # @return [[w,v]]
  #   - **w** [Numo::NArray] -- The eigenvalues.
  #   - **v** [Numo::NArray] -- The eigenvectors if vals_only is false, otherwise nil.

  def eigh(a, b=nil, vals_only:false, vals_range:nil, uplo:'U', turbo:false)
    jobz = vals_only ? 'N' : 'V' # jobz: Compute eigenvalues and eigenvectors.
    b = a.class.eye(a.shape[0]) if b.nil?
    func = blas_char(a, b) =~ /c|z/ ? 'hegv' : 'sygv'
    if vals_range.nil?
      func << 'd' if turbo
      v, u_, w, = Lapack.call(func.to_sym, a, b, uplo: uplo, jobz: jobz)
      v = nil if vals_only
      [w, v]
    else
      func << 'x'
      il = vals_range.first(1)[0]
      iu = vals_range.last(1)[0]
      a_, b_, w, v, = Lapack.call(func.to_sym, a, b, uplo: uplo, jobz: jobz, range: 'I', il: il + 1, iu: iu + 1)
      v = nil if vals_only
      [w, v]
    end
  end

  # Computes the eigenvalues only for a square nonsymmetric matrix A.
  #
  # @param a [Numo::NArray] square nonsymmetric matrix (>= 2-dimensinal NArray)
  # @return [Numo::NArray] eigenvalues

  def eigvals(a)
    jobvl, jobvr = 'N','N'
    case blas_char(a)
    when /c|z/
      w, = Lapack.call(:geev, a, jobvl:jobvl, jobvr:jobvr)
    else
      wr, wi, = Lapack.call(:geev, a, jobvl:jobvl, jobvr:jobvr)
      w  = wr + wi * Complex::I
    end
    w
  end

  # Obtains the eigenvalues by solving an ordinary or generalized eigenvalue problem
  # for a square symmetric / Hermitian matrix.
  #
  # @param a [Numo::NArray] square symmetric/hermitian matrix
  #   (>= 2-dimensinal NArray)
  # @param b [Numo::NArray] (optional) square symmetric matrix (>= 2-dimensinal NArray)
  #   If nil, identity matrix is assumed.
  # @param vals_range [Range] (optional)
  #   The range of indices of the eigenvalues (in ascending order) to be returned.
  #   If nil or 0...N (N is the size of the matrix a), all eigenvalues are returned.
  # @param uplo [String or Symbol] (optional, default='U')
  #   Access upper ('U') or lower ('L') triangle.
  # @return [Numo::NArray] eigenvalues

  def eigvalsh(a, b=nil, vals_range:nil, uplo:'U', turbo:false)
    eigh(a, b, vals_only: true, vals_range: vals_range, uplo: uplo, turbo: turbo).first
  end


  ## Norms and other numbers

  # Compute matrix or vector norm.
  #
  #     |  ord  |  matrix norm           | vector norm                 |
  #     | ----- | ---------------------- | --------------------------- |
  #     |  nil  | Frobenius norm         | 2-norm                      |
  #     | 'fro' | Frobenius norm         |  -                          |
  #     | 'inf' | x.abs.sum(axis:-1).max | x.abs.max                   |
  #     |    0  |  -                     | (x.ne 0).sum                |
  #     |    1  | x.abs.sum(axis:-2).max | same as below               |
  #     |    2  | 2-norm (max sing_vals) | same as below               |
  #     | other |  -                     | (x.abs**ord).sum**(1.0/ord) |
  #
  # @param a [Numo::NArray] matrix or vector (>= 1-dimensinal NArray)
  # @param ord [String or Symbol] Order of the norm .
  # @param axis [Integer or Array] Applied axes (optional).
  # @param keepdims [Bool] If true, the applied axes are left in
  #   result with size one (optional).
  # @return [Numo::NArray] norm result

  def norm(a, ord=nil, axis:nil, keepdims:false)
    a = Numo::NArray.asarray(a)

    # check axis
    if axis
      case axis
      when Integer
        axis = [axis]
      when Array
        if axis.size < 1 || axis.size > 2
          raise ArgmentError, "axis option should be 1- or 2-element array"
        end
      else
        raise ArgumentError, "invalid option for axis: #{axis}"
      end
      # swap axes
      if a.ndim > 1
        idx = (0...a.ndim).to_a
        tmp = []
        axis.each do |i|
          x = idx[i]
          if x.nil?
            raise ArgmentError, "axis contains same dimension"
          end
          tmp << x
          idx[i] = nil
        end
        idx.compact!
        idx.concat(tmp)
        a = a.transpose(*idx)
      end
    else
      case a.ndim
      when 0
        raise ArgumentError, "zero-dimensional array"
      when 1
        axis = [-1]
      else
        axis = [-2,-1]
      end
    end

    # calculate norm
    case axis.size

    when 1  # vector
      k = keepdims
      ord ||= 2  # default
      case ord.to_s
      when "0"
        r = a.class.cast(a.ne(0)).sum(axis:-1, keepdims:k)
      when "1"
        r = a.abs.sum(axis:-1, keepdims:k)
      when "2"
        r = Blas.call(:nrm2, a, keepdims:k)
      when /^-?\d+$/
        o = ord.to_i
        r = (a.abs**o).sum(axis:-1, keepdims:k)**(1.0/o)
      when /^inf(inity)?$/i
        r = a.abs.max(axis:-1, keepdims:k)
      when /^-inf(inity)?$/i
        r = a.abs.min(axis:-1, keepdims:k)
      else
        raise ArgumentError, "ord (#{ord}) is invalid for vector norm"
      end

    when 2  # matrix
      if keepdims
        fixdims = [true] * a.ndim
        axis.each do |i|
          if i < -a.ndim || i >= a.ndim
            raise ArgmentError, "axis (%d) is out of range", i
          end
          fixdims[i] = :new
        end
      end
      ord ||= "fro"  # default
      case ord.to_s
      when "1"
        r, = Lapack.call(:lange, a, '1')
      when "-1"
        r = a.abs.sum(axis:-2).min(axis:-1)
      when "2"
        svd, = Lapack.call(:gesvd, a, jobu:'N', jobvt:'N')
        r = svd.max(axis:-1)
      when "-2"
        svd, = Lapack.call(:gesvd, a, jobu:'N', jobvt:'N')
        r = svd.min(axis:-1)
      when /^f(ro)?$/i
        r, = Lapack.call(:lange, a, 'F')
      when /^inf(inity)?$/i
        r, = Lapack.call(:lange, a, 'I')
      when /^-inf(inity)?$/i
        r = a.abs.sum(axis:-1).min(axis:-1)
      else
        raise ArgumentError, "ord (#{ord}) is invalid for matrix norm"
      end
      if keepdims
        if NArray===r
          r = r[*fixdims]
        else
          r = a.class.new(1,1).store(r)
        end
      end
    end
    return r
  end

  # Compute the condition number of a matrix
  # using the norm with one of the following order.
  #
  #     |  ord  |  matrix norm           |
  #     | ----- | ---------------------- |
  #     |  nil  | 2-norm using SVD       |
  #     | 'fro' | Frobenius norm         |
  #     | 'inf' | x.abs.sum(axis:-1).max |
  #     |    1  | x.abs.sum(axis:-2).max |
  #     |    2  | 2-norm (max sing_vals) |
  #
  # @param a [Numo::NArray] matrix or vector (>= 1-dimensinal NArray)
  # @param ord [String or Symbol] Order of the norm.
  # @return [Numo::NArray] cond result
  # @example
  #     a = Numo::DFloat[[1, 0, -1], [0, 1, 0], [1, 0, 1]]
  #     => Numo::DFloat#shape=[3,3]
  #     [[1, 0, -1],
  #      [0, 1, 0],
  #      [1, 0, 1]]
  #     LA = Numo::Linalg
  #     LA.cond(a)
  #     => 1.4142135623730951
  #     LA.cond(a, 'fro')
  #     => 3.1622776601683795
  #     LA.cond(a, 'inf')
  #     => 2.0
  #     LA.cond(a, '-inf')
  #     => 1.0
  #     LA.cond(a, 1)
  #     => 2.0
  #     LA.cond(a, -1)
  #     => 1.0
  #     LA.cond(a, 2)
  #     => 1.4142135623730951
  #     LA.cond(a, -2)
  #     => 0.7071067811865475
  #     (LA.svdvals(a)).min*(LA.svdvals(LA.inv(a))).min
  #     => 0.7071067811865475

  def cond(a,ord=nil)
    if ord.nil?
      s = svdvals(a)
      s[false, 0]/s[false, -1]
    else
      norm(a, ord, axis:[-2,-1]) * norm(inv(a), ord, axis:[-2,-1])
    end
  end

  # Determinant of a matrix
  #
  # @param a [Numo::NArray] matrix (>= 2-dimensional NArray)
  # @return [Float or Complex or Numo::NArray]

  def det(a)
    lu, piv, = Lapack.call(:getrf, a)
    idx = piv.new_narray.store(piv.class.new(piv.shape[-1]).seq(1))
    m = piv.eq(idx).count_false(axis:-1) % 2
    sign = m * -2 + 1
    lu.diagonal.prod(axis:-1) * sign
  end

  # Natural logarithm of the determinant of a matrix
  #
  # @param a [Numo::NArray] matrix (>= 2-dimensional NArray)
  # @return [[sign,logdet]]
  #   - **sign** -- A number representing the sign of the determinant.
  #   - **logdet** -- The natural log of the absolute value of the determinant.

  def slogdet(a)
    lu, piv, = Lapack.call(:getrf, a)
    idx = piv.new_narray.store(piv.class.new(piv.shape[-1]).seq(1))
    m = piv.eq(idx).count_false(axis:-1) % 2
    sign = m * -2 + 1

    lud = lu.diagonal
    if (lud.eq 0).any?
      return 0, (-Float::INFINITY)
    end
    lud_abs = lud.abs
    sign *= (lud/lud_abs).prod
    [sign, NMath.log(lud_abs).sum(axis:-1)]
  end

  # Compute matrix rank of array using SVD
  # *Rank* is the number of singular values greater than *tol*.
  #
  # @param m [Numo::NArray] matrix (>= 2-dimensional NArray)
  # @param tol [Float] threshold below which singular values are
  #   considered to be zero. If *tol* is nil,
  #   `tol = sing_vals.max() * m.shape.max * EPSILON`.
  # @param driver [String or Symbol] choose LAPACK solver from 'svd',
  #   'sdd'. (optional, default='svd')

  def matrix_rank(m, tol:nil, driver:'svd')
    m = Numo::NArray.asarray(m)
    if m.ndim < 2
      m.ne(0).any? ? 1 : 0
    else
      case driver.to_s
      when /^(ge)?sdd$/, "turbo"
        s = Lapack.call(:gesdd, m, jobz:'N')[0]
      when /^(ge)?svd$/
        s = Lapack.call(:gesvd, m, jobu:'N', jobvt:'N')[0]
      else
        raise ArgumentError, "invalid driver: #{driver}"
      end
      tol ||= s.max(axis:-1, keepdims:true) *
        (m.shape[-2..-1].max * s.class::EPSILON)
      (s > tol).count(axis:-1)
    end
  end


  ## Solving equations and inverting matrices

  # Solves linear equation `a * x = b` for `x`
  # from square matrix `a`
  # @param a [Numo::NArray] n-by-n square matrix  (>= 2-dimensinal NArray)
  # @param b [Numo::NArray] n-by-nrhs right-hand-side matrix (>=
  #  1-dimensinal NArray)
  # @param driver [String or Symbol] choose LAPACK diriver from
  #   'gen','sym','her' or 'pos'. (optional, default='gen')
  # @param uplo [String or Symbol] optional, default='U'. Access upper
  #   or ('U') lower ('L') triangle. (omitted when driver:"gen")
  # @return [Numo::NArray] The solusion matrix/vector X.

  def solve(a, b, driver:"gen", uplo:'U')
    case driver.to_s
    when /^gen?(sv)?$/i
      # returns lu, x, ipiv, info
      Lapack.call(:gesv, a, b)[1]
    when /^(sym?|her?|pos?)(sv)?$/i
      func = driver[0..1].downcase+"sv"
      Lapack.call(func, a, b, uplo:uplo)[1]
    else
      raise ArgumentError, "invalid driver: #{driver}"
    end
  end

  # Inverse matrix from square matrix `a`
  # @param a [Numo::NArray] n-by-n square matrix  (>= 2-dimensinal NArray)
  # @param driver [String or Symbol] choose LAPACK diriver
  #   ('ge'|'sy'|'he'|'po') + ("sv"|"trf")
  #   (optional, default='getrf')
  # @param uplo [String or Symbol] optional, default='U'. Access upper
  #   or ('U') lower ('L') triangle. (omitted when driver:"ge")
  # @return [Numo::NArray] The inverse matrix.
  # @example
  #   Numo::Linalg.inv(a,driver:'getrf')
  #   => Numo::DFloat#shape=[2,2]
  #   [[-2, 1],
  #    [1.5, -0.5]]
  #   a.dot(Numo::Linalg.inv(a,driver:'getrf'))
  #   => Numo::DFloat#shape=[2,2]
  #   [[1, 0],
  #    [8.88178e-16, 1]]

  def inv(a, driver:"getrf", uplo:'U')
    case driver
    when /(ge|sy|he|po)sv$/
      d = $1
      b = a.new_zeros.eye
      solve(a, b, driver:d, uplo:uplo)
    when /(ge|sy|he)tr[fi]$/
      d = $1
      lu, piv = lu_fact(a)
      lu_inv(lu, piv)
    when /potr[fi]$/
      lu = cho_fact(a, uplo:uplo)
      cho_inv(lu, uplo:uplo)
    else
      raise ArgumentError, "invalid driver: #{driver}"
    end
  end

  # Computes the minimum-norm solution to a linear least squares
  # problem:
  #
  #         minimize 2-norm(| b - A*x |)
  #
  # using the singular value decomposition (SVD) of A.
  # A is an M-by-N matrix which may be rank-deficient.
  # @param a [Numo::NArray] m-by-n matrix A (>= 2-dimensinal NArray)
  # @param b [Numo::NArray] m-by-nrhs right-hand-side matrix b
  #   (>= 1-dimensinal NArray)
  # @param driver [String or Symbol] choose LAPACK driver from
  #   'lsd','lss','lsy' (optional, default='lsd')
  # @param rcond [Float] (optional, default=-1)
  #   RCOND is used to determine the effective rank of A.
  #   Singular values `S(i) <= RCOND*S(1)` are treated as zero.
  #   If RCOND < 0, machine precision is used instead.
  # @return [[x, resids, rank, s]]
  #   - **x** -- The solution matrix/vector X.
  #   - **resids** -- Sums of residues, squared 2-norm for each column in
  #     `b - a x`. If matrix_rank(a) < N or > M, or 'gelsy' is used,
  #     this is an empty array.
  #   - **rank** --  The effective rank of A, i.e.,
  #     the number of singular values which are greater than RCOND*S(1).
  #   - **s** --  The singular values of A in decreasing order.
  #     Returns nil if 'gelsy' is used.

  def lstsq(a, b, driver:'lsd', rcond:-1)
    a = NArray.asarray(a)
    b = NArray.asarray(b)
    b_orig = nil
    if b.shape.size==1
      b_orig = b
      b = b_orig[true,:new]
    end
    m = a.shape[-2]
    n = a.shape[-1]
    #nrhs = b.shape[-1]
    if m != b.shape[-2]
      raise NArray::ShapeError, "size mismatch: A-row and B-row"
    end
    if m < n   # need to extend b matrix
      shp = b.shape
      shp[-2] = n
      b2 = b.class.zeros(*shp)
      b2[false,0...m,true] = b
      b = b2
    end
    case driver.to_s
    when /^(ge)?lsd$/i
      # x, s, rank, info
      x, s, rank, = Lapack.call(:gelsd, a, b, rcond:rcond)
    when /^(ge)?lss$/i
      # v, x, s, rank, info
      _, x, s, rank, = Lapack.call(:gelss, a, b, rcond:rcond)
    when /^(ge)?lsy$/i
      jpvt = Int32.zeros(*a[false,0,true].shape)
      # v, x, jpvt, rank, info
      _, x, _, rank, = Lapack.call(:gelsy, a, b, jpvt, rcond:rcond)
      s = nil
    else
      raise ArgumentError, "invalid driver: #{driver}"
    end
    resids = nil
    if m > n
      if /ls(d|s)$/i =~ driver
        case rank
        when n
          resids = (x[n..-1,true].abs**2).sum(axis:0)
        when NArray
          resids = (x[false,n..-1,true].abs**2).sum(axis:-2)
          ## NArray does not suppurt this yet.
          # resids = x[false,0,true].new_zeros
          # mask = rank.eq(n)
          # resids[mask,true] = (x[mask,n..-1,true].abs**2).sum(axis:-2)
        end
      end
      x = x[false,0...n,true]
    end
    if b_orig && b_orig.shape.size==1
      x = x[true,0]
      resids &&= resids[false,0]
    end
    [x, resids, rank, s]
  end

  # Compute the (Moore-Penrose) pseudo-inverse of a matrix
  # using svd or lstsq.
  #
  # @param a [Numo::NArray] m-by-n matrix A (>= 2-dimensinal NArray)
  # @param driver [String or Symbol] choose LAPACK driver from
  #   SVD ('svd', 'sdd') or Least square ('lsd','lss','lsy')
  #   (optional, default='svd')
  # @param rcond [Float] (optional, default=-1)
  #   RCOND is used to determine the effective rank of A.
  #   Singular values `S(i) <= RCOND*S(1)` are treated as zero.
  #   If RCOND < 0, machine precision is used instead.
  # @return [Numo::NArray]
  # @example
  #   a = Numo::DFloat.new(5,3).rand_norm
  #   => Numo::DFloat#shape=[5,3]
  #   [[-0.581255, -0.168354, 0.586895],
  #    [-0.595142, -0.802802, -0.326106],
  #    [0.282922, 1.68427, 0.918499],
  #    [-0.0485384, -0.464453, -0.992194],
  #    [0.413794, -0.60717, -0.699695]]
  #   b = Numo::Linalg.pinv(a,driver:"svd")
  #   => Numo::DFloat(view)#shape=[3,5]
  #   [[-0.360863, -0.813125, -0.353367, -0.891963, 0.877253],
  #    [-0.227645, 0.162939, 0.696655, 0.787685, -0.469346],
  #    [0.408671, -0.308323, -0.337807, -1.13833, 0.228051]]
  #   (a-a.dot(b.dot(a))).abs.max
  #   => 5.551115123125783e-16

  def pinv(a, driver:"svd", rcond:nil)
    a = NArray.asarray(a)
    if a.ndim < 2
      raise NArray::ShapeError, "2-d array is required"
    end
    case driver
    when /^(ge)?s[dv]d$/
      s, u, vh = svd(a, driver:driver, job:'S')
      if rcond.nil? || rcond < 0
        rcond = ((SFloat===s) ? 1e3 : 1e6) * s.class::EPSILON
      elsif ! Numeric === rcond
        raise ArgumentError, "rcond must be Numeric"
      end
      cond = (s > rcond * s.max(axis:-1, keepdims:true))
      if cond.all?
        r = s.reciprocal
      else
        r = s.new_zeros
        r[cond] = s[cond].reciprocal
      end
      u *= r[false,:new,true]
      dot(u,vh).conj.swapaxes(-2,-1)
    when /^(ge)?ls[dsy]$/
      b = a.class.eye(a.shape[-2])
      x, = lstsq(a, b, driver:driver, rcond:rcond)
      x
    else
      raise ArgumentError, "#{driver.inspect} is not one of drivers: "+
        "svd, sdd, lsd, lss, lsy"
    end
  end

  # Compute the matrix exponential using Pade approximation method.
  #
  # @param a [Numo::NArray] square matrix (>= 2-dimensinal NArray)
  # @param ord [Integer] order of approximation
  # @return [Numo::NArray]
  # @example
  #   a = Numo::Linalg.expm(Numo::DFloat.zeros([2,2]))
  #   => Numo::DFloat#shape=[2,2]
  #   [[1, 0],
  #    [0, 1]]
  #   b = Numo::Linalg.expm(Numo::DFloat[[1, 2], [-1, 3]] * Complex::I)
  #   => Numo::DComplex#shape=[2,2]
  #   [[0.426459+1.89218i, -2.13721-0.978113i],
  #    [1.06861+0.489056i, -1.71076+0.914063i]]

  def expm(a, ord=8)
    raise NArray::ShapeError, 'matrix a is not square matrix' if a.shape[0] != a.shape[1]

    inf_norm = norm(a, 'inf')
    n_squarings = inf_norm.zero? ? 0 : [0, Math.log2(inf_norm).ceil.to_i].max
    a = a / (2**n_squarings)

    sz_mat = a.shape[0]
    c = 1
    s = -1
    x = Numo::DFloat.eye(sz_mat)
    n = Numo::DFloat.eye(sz_mat)
    d = Numo::DFloat.eye(sz_mat)

    (1..ord).each do |k|
      c *= (ord - k + 1).fdiv((2 * ord - k + 1) * k)
      x = a.dot(x)
      cx = c * x
      n += cx
      d += s * cx
      s *= -1
    end

    res = solve(d, n)
    n_squarings.times { res = res.dot(res) }
    res
  end

  # @!visibility private
  def _make_complex_eigvecs(w, vin) # :nodoc:
    v = w.class.cast(vin)
    # broadcast to vin.shape
    m = ((w.imag > 0) | Bit.zeros(*vin.shape)).where
    v[m].imag = vin[m+1]
    v[m+1] = v[m].conj
    v
  end

  private_class_method :_make_complex_eigvecs

end
end
