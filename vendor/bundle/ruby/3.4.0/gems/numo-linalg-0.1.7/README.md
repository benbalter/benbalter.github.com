# Numo::Linalg : Linear Algebra library with BLAS/LAPACK binding to Numo::NArray

[![Binder](http://mybinder.org/badge.svg)](http://mybinder.org/repo/ruby-numo/numo-linalg)
[![Build Status](https://github.com/ruby-numo/numo-linalg/workflows/build/badge.svg)](https://github.com/ruby-numo/numo-linalg/actions)

[GitHub](https://github.com/ruby-numo/numo-linalg) |
[RubyGems](https://rubygems.org/gems/numo-linalg)

Under development!

## Introduction

This is a binding of BLAS/LAPACK for Numo::NArray using dynamic linking loader.
This design allows you to change backend libraries without re-compiling.

### [Numo::Linalg API](http://ruby-numo.github.io/numo-linalg/yard/Numo/Linalg.html)

* Matrix and vector products
    * dot, matmul
* Decomposition
    * lu, lu\_fact, lu\_inv, lu\_solve, ldl, cholesky, cho\_fact, cho\_inv, cho\_solve,
      qr, svd, svdvals, orth, null_space
* Matrix eigenvalues
    * eig, eigh, eigvals, eigvalsh
* Norms and other numbers
    * norm, cond, det, slogdet, matrix\_rank, matrix\_power
* Solving equations and inverting matrices
    * solve, lstsq, inv, pinv

### Low-level modules

* [Numo::Linalg::Blas](http://ruby-numo.github.io/numo-linalg/yard/Numo/Linalg/Blas.html) - Low-level BLAS functions
* [Numo::Linalg::Lapack](http://ruby-numo.github.io/numo-linalg/yard/Numo/Linalg/Lapack.html) - Low-level LAPACK functions

## Installation

* Install [Numo::NArray](https://github.com/ruby-numo/narray)

* Install [LAPACK](http://www.netlib.org/lapack/) or alternative package.

    * Numo::Linalg requires C-interface
      [CBLAS](http://www.netlib.org/blas/#_cblas) and
      [LAPACKE](http://www.netlib.org/lapack/lapacke.html) interface.
      These are included in LAPACK package.

    * Recommended: use one of following faster libraries:
        * [ATLAS](https://sourceforge.net/projects/math-atlas/)
        * [OpenBLAS](http://www.openblas.net/)
        * [Intel MKL](https://software.intel.com/intel-mkl)

    * Note that the performance depends on the backend library as shown in
      [benchmark](https://github.com/ruby-numo/numo-linalg/tree/master/bench).

* Install Numo::Linalg

```shell
$ gem install numo-linalg
```

or

```shell
$ git clone https://github.com/ruby-numo/numo-linalg.git
$ cd linalg
$ rake build
$ gem install pkg/numo-linalg-*.gem
```

## Using

* Load Numo::Linalg module with default backend:

```ruby
require "numo/linalg"
```

* Read also instruction for [Selecting Backend Library](https://github.com/ruby-numo/numo-linalg/tree/master/doc/select-backend.md).

## Authors

* Masahiro Tanaka
* Makoto Kishimoto
* Atsushi Tatsuma

## Acknowledgments

* This work is partly supported by 2016 Ruby Association Grant.

## ToDo

* More functions
* write test
* Documentation
