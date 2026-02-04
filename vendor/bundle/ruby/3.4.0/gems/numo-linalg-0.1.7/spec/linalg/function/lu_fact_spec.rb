# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'lu_fact' do
    let(:m) { 5 }
    let(:n) { 3 }
    let(:mat_a) { rand_rect_real_mat(m, n) }
    let(:mat_b) { rand_rect_complex_mat(m, n) }

    def permutation_mat(ipiv)
      Numo::DFloat.eye(m).tap do |mat|
        ipiv.to_a.each_with_index { |a, b| mat[[a - 1, b], true] = mat[[b, a - 1], true].dup }
      end
    end

    it 'calculates the LU factorization of a rectangular real matrix' do
      lu, ipiv = described_class.lu_fact(mat_a)
      mat_l = lu.tril.tap { |mat| mat[mat.diag_indices(0)] = 1.0 }
      mat_u = lu.triu[0...n, 0...n]
      mat_p = permutation_mat(ipiv)
      expect((mat_p.dot(mat_a) - mat_l.dot(mat_u)).abs.max).to be < ERR_TOL
    end

    it 'calculates the LU factorization of a rectangular complex matrix' do
      lu, ipiv = described_class.lu_fact(mat_b)
      mat_l = lu.tril.tap { |mat| mat[mat.diag_indices(0)] = 1.0 }
      mat_u = lu.triu[0...n, 0...n]
      mat_p = permutation_mat(ipiv)
      expect((mat_p.dot(mat_b) - mat_l.dot(mat_u)).abs.max).to be < ERR_TOL
    end
  end
end
