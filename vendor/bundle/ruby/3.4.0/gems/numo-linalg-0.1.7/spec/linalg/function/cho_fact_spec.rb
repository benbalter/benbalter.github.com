# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'cho_fact' do
    let(:m) { 5 }
    let(:mat_a) do
      a = rand_symmetric_mat(m)
      a.dot(a.transpose)
    end
    let(:mat_b) do
      b = rand_hermitian_mat(m)
      b.dot(b.transpose.conj)
    end

    it 'calculates the cholesky factorization of a symmetric positive-definite matrix' do
      mat_u = described_class.cho_fact(mat_a, uplo: 'U').triu
      expect((mat_a - mat_u.transpose.dot(mat_u)).abs.max).to be < ERR_TOL
      # mat_l = described_class.cho_fact(mat_a, uplo: 'L').tril
      # expect((mat_a - mat_l.dot(mat_l.transpose)).abs.max).to be < ERR_TOL
    end

    it 'calculates the cholesky factorization of a hermitian positive-definite matrix' do
      mat_u = described_class.cho_fact(mat_b, uplo: 'U').triu
      expect((mat_b - mat_u.transpose.conj.dot(mat_u)).abs.max).to be < ERR_TOL
      # mat_l = described_class.cho_fact(mat_b, uplo: 'L').tril
      # expect((mat_b - mat_l.dot(mat_l.transpose)).abs.max).to be < ERR_TOL
    end
  end
end
