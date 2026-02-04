# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'cho_solve' do
    let(:m) { 5 }
    let(:n) { 3 }
    let(:mat_a) do
      a = rand_symmetric_mat(m)
      a.dot(a.transpose)
    end
    let(:mat_h) do
      b = rand_hermitian_mat(m)
      b.dot(b.transpose.conj)
    end
    let(:mat_b) { rand_rect_real_mat(m, n) }
    let(:vec_b) { rand_real_vec(m) }
    let(:mat_c) { rand_square_complex_mat(m) }
    let(:mat_d) { rand_rect_complex_mat(m, n) }
    let(:vec_d) { rand_complex_vec(m) }


    it 'solves the linear equation A x = b with a symmetric positive-definite matrix A' do
      mat_u = described_class.cho_fact(mat_a, uplo: 'U').triu
      vec_x = described_class.cho_solve(mat_u, vec_b, uplo: 'U')
      expect((mat_a.dot(vec_x) - vec_b).abs.max).to be < ERR_TOL
      mat_x = described_class.cho_solve(mat_u, mat_b, uplo: 'U')
      expect((mat_a.dot(mat_x) - mat_b).abs.max).to be < ERR_TOL
      vec_x = described_class.cho_solve(mat_u, vec_d, uplo: 'U')
      expect((mat_a.dot(vec_x) - vec_d).abs.max).to be < ERR_TOL
      mat_x = described_class.cho_solve(mat_u, mat_d, uplo: 'U')
      expect((mat_a.dot(mat_x) - mat_d).abs.max).to be < ERR_TOL
      # mat_l = described_class.cho_fact(mat_a, uplo: 'L').tril
      # vec_x = described_class.cho_solve(mat_l, vec_b, uplo: 'L')
      # expect((mat_a.dot(vec_x) - vec_b).abs.max).to be < ERR_TOL
      # mat_x = described_class.cho_solve(mat_l, mat_b, uplo: 'L')
      # expect((mat_a.dot(mat_x) - mat_b).abs.max).to be < ERR_TOL
      # vec_x = described_class.cho_solve(mat_l, vec_d, uplo: 'L')
      # expect((mat_a.dot(vec_x) - vec_d).abs.max).to be < ERR_TOL
      # mat_x = described_class.cho_solve(mat_l, mat_d, uplo: 'L')
      # expect((mat_a.dot(mat_x) - mat_d).abs.max).to be < ERR_TOL
    end

    it 'solves the linear equation A x = b with a hermitian positive-definite matrix' do
      mat_u = described_class.cho_fact(mat_h, uplo: 'U').triu
      vec_x = described_class.cho_solve(mat_u, vec_b, uplo: 'U')
      expect((mat_h.dot(vec_x) - vec_b).abs.max).to be < ERR_TOL
      mat_x = described_class.cho_solve(mat_u, mat_b, uplo: 'U')
      expect((mat_h.dot(mat_x) - mat_b).abs.max).to be < ERR_TOL
      vec_x = described_class.cho_solve(mat_u, vec_d, uplo: 'U')
      expect((mat_h.dot(vec_x) - vec_d).abs.max).to be < ERR_TOL
      mat_x = described_class.cho_solve(mat_u, mat_d, uplo: 'U')
      expect((mat_h.dot(mat_x) - mat_d).abs.max).to be < ERR_TOL
      # mat_l = described_class.cho_fact(mat_h, uplo: 'L').tril
      # vec_x = described_class.cho_solve(mat_l, vec_b, uplo: 'L')
      # expect((mat_h.dot(vec_x) - vec_b).abs.max).to be < ERR_TOL
      # mat_x = described_class.cho_solve(mat_l, mat_b, uplo: 'L')
      # expect((mat_h.dot(mat_x) - mat_b).abs.max).to be < ERR_TOL
      # vec_x = described_class.cho_solve(mat_l, vec_d, uplo: 'L')
      # expect((mat_h.dot(vec_x) - vec_d).abs.max).to be < ERR_TOL
      # mat_x = described_class.cho_solve(mat_l, mat_d, uplo: 'L')
      # expect((mat_h.dot(mat_x) - mat_d).abs.max).to be < ERR_TOL
    end
  end
end
