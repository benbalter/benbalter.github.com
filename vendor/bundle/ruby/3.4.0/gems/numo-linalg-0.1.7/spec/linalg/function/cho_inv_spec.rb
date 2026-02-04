# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'cho_inv' do
    let(:m) { 5 }
    let(:mat_a) do
      a = rand_symmetric_mat(m)
      a.dot(a.transpose)
    end
    let(:mat_b) do
      b = rand_hermitian_mat(m)
      b.dot(b.transpose.conj)
    end

    it 'calculates the inverse of a symmetric positive-definite matrix' do
      mat_u = described_class.cho_fact(mat_a, uplo: 'U').triu
      tri_inv_mat_a = described_class.cho_inv(mat_u, uplo: 'U')
      inv_mat_a = tri_inv_mat_a + tri_inv_mat_a.transpose - tri_inv_mat_a.diagonal.diag
      expect((inv_mat_a.dot(mat_a) - Numo::DFloat.eye(m)).abs.max).to be < ERR_TOL
      # mat_l = described_class.cho_fact(mat_a, uplo: 'L').tril
      # tri_inv_mat_a = described_class.cho_inv(mat_l, uplo: 'L')
      # inv_mat_a = tri_inv_mat_a + tri_inv_mat_a.transpose - tri_inv_mat_a.diagonal.diag
      # expect((inv_mat_a.dot(mat_a) - Numo::DFloat.eye(m)).abs.max).to be < ERR_TOL
    end

    it 'calculates the inverse of a hermitian positive-definite matrix' do
      mat_u = described_class.cho_fact(mat_b, uplo: 'U').triu
      tri_inv_mat_b = described_class.cho_inv(mat_u, uplo: 'U')
      inv_mat_b = tri_inv_mat_b + tri_inv_mat_b.transpose.conj - tri_inv_mat_b.diagonal.diag
      expect((inv_mat_b.dot(mat_b) - Numo::DFloat.eye(m)).abs.max).to be < ERR_TOL
      # mat_l = described_class.cho_fact(mat_b, uplo: 'L').tril
      # tri_inv_mat_b = described_class.cho_inv(mat_l, uplo: 'L')
      # inv_mat_b = tri_inv_mat_b + tri_inv_mat_b.transpose.conj - tri_inv_mat_b.diagonal.diag
      # expect((inv_mat_b.dot(mat_b) - Numo::DFloat.eye(m)).abs.max).to be < ERR_TOL
    end
  end
end
