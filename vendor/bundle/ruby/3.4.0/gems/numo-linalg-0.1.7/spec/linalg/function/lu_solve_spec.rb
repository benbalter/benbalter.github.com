# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'lu_solve' do
    let(:m) { 5 }
    let(:n) { 3 }
    let(:mat_a) { rand_square_real_mat(m) }
    let(:mat_b) { rand_rect_real_mat(m, n) }
    let(:vec_b) { rand_real_vec(m) }
    let(:mat_c) { rand_square_complex_mat(m) }
    let(:mat_d) { rand_rect_complex_mat(m, n) }
    let(:vec_d) { rand_complex_vec(m) }

    it 'solves the linear equation A x = b with a square real matrix A' do
      lu, ipiv = described_class.lu_fact(mat_a)
      vec_x = described_class.lu_solve(lu, ipiv, vec_b)
      expect((mat_a.dot(vec_x) - vec_b).abs.max).to be < ERR_TOL
      mat_x = described_class.lu_solve(lu, ipiv, mat_b)
      expect((mat_a.dot(mat_x) - mat_b).abs.max).to be < ERR_TOL
      vec_x = described_class.lu_solve(lu, ipiv, vec_d)
      expect((mat_a.dot(vec_x) - vec_d).abs.max).to be < ERR_TOL
      mat_x = described_class.lu_solve(lu, ipiv, mat_d)
      expect((mat_a.dot(mat_x) - mat_d).abs.max).to be < ERR_TOL
    end

    it 'solves the linear equation A x = b with a square complex matrix A' do
      lu, ipiv = described_class.lu_fact(mat_c)
      vec_x = described_class.lu_solve(lu, ipiv, vec_b)
      expect((mat_c.dot(vec_x) - vec_b).abs.max).to be < ERR_TOL
      mat_x = described_class.lu_solve(lu, ipiv, mat_b)
      expect((mat_c.dot(mat_x) - mat_b).abs.max).to be < ERR_TOL
      vec_x = described_class.lu_solve(lu, ipiv, vec_d)
      expect((mat_c.dot(vec_x) - vec_d).abs.max).to be < ERR_TOL
      mat_x = described_class.lu_solve(lu, ipiv, mat_d)
      expect((mat_c.dot(mat_x) - mat_d).abs.max).to be < ERR_TOL
    end
  end
end
