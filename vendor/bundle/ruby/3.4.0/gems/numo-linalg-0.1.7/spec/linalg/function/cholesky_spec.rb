# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'cholesky' do
    let(:m) { 5 }
    let(:mat_a) do
      a = rand_symmetric_mat(m)
      a.dot(a.transpose)
    end
    let(:mat_b) do
      b = rand_hermitian_mat(m)
      b.dot(b.transpose.conj)
    end

    it 'raises ShapeError given a vector' do
      expect { described_class.cholesky(Numo::DFloat.new(3).rand) }.to raise_error(Numo::NArray::ShapeError)
    end

    it 'raises ShapeError given a rectangular matrix' do
      expect { described_class.cholesky(Numo::DFloat.new(2, 4).rand) }.to raise_error(Numo::NArray::ShapeError)
    end

    it 'raises ArgumentError given an invalid uplo option' do
      expect { described_class.cholesky(mat_a, uplo: 'A') }.to raise_error(ArgumentError)
    end

    it 'calculates the cholesky factorization of a symmetric positive-definite matrix' do
      mat_u = described_class.cholesky(mat_a, uplo: 'U')
      expect((mat_a - mat_u.transpose.dot(mat_u)).abs.max).to be < ERR_TOL
      mat_l = described_class.cholesky(mat_a, uplo: 'L')
      expect((mat_a - mat_l.dot(mat_l.transpose)).abs.max).to be < ERR_TOL
    end

    it 'calculates the cholesky factorization of a hermitian positive-definite matrix' do
      mat_u = described_class.cholesky(mat_b, uplo: 'U')
      expect((mat_b - mat_u.transpose.conj.dot(mat_u)).abs.max).to be < ERR_TOL
      mat_l = described_class.cholesky(mat_b, uplo: 'L')
      expect((mat_b - mat_l.dot(mat_l.transpose.conj)).abs.max).to be < ERR_TOL
    end
  end
end
