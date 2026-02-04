# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'lu' do
    let(:m) { 5 }
    let(:n) { 3 }
    let(:mat_a) { rand_rect_real_mat(m, n) }
    let(:mat_b) { rand_rect_real_mat(n, m) }
    let(:mat_c) { rand_rect_complex_mat(m, n) }
    let(:mat_d) { rand_rect_complex_mat(n, m) }

    it 'raises ShapeError given a vector' do
      expect { described_class.lu(Numo::DFloat.new(3).rand) }.to raise_error(Numo::NArray::ShapeError)
    end

    it 'calculates the LU factorization of a rectangular real matrix' do
      mat_p, mat_l, mat_u = described_class.lu(mat_a)
      expect((mat_a - mat_p.dot(mat_l.dot(mat_u))).abs.max).to be < ERR_TOL
      mat_p, mat_l, mat_u = described_class.lu(mat_b)
      expect((mat_b - mat_p.dot(mat_l.dot(mat_u))).abs.max).to be < ERR_TOL
    end

    it 'calculates the LU factorization of a rectangular real matrix including permutation of L' do
      mat_l, mat_u = described_class.lu(mat_a, permute_l: true)
      expect((mat_a - mat_l.dot(mat_u)).abs.max).to be < ERR_TOL
      mat_l, mat_u = described_class.lu(mat_b, permute_l: true)
      expect((mat_b - mat_l.dot(mat_u)).abs.max).to be < ERR_TOL
    end

    it 'calculates the LU factorization of a rectangular complex matrix' do
      mat_p, mat_l, mat_u = described_class.lu(mat_c)
      expect((mat_c - mat_p.dot(mat_l.dot(mat_u))).abs.max).to be < ERR_TOL
      mat_p, mat_l, mat_u = described_class.lu(mat_d)
      expect((mat_d - mat_p.dot(mat_l.dot(mat_u))).abs.max).to be < ERR_TOL
    end

    it 'calculates the LU factorization of a rectangular complex matrix including permutation of L' do
      mat_l, mat_u = described_class.lu(mat_c, permute_l: true)
      expect((mat_c - mat_l.dot(mat_u)).abs.max).to be < ERR_TOL
      mat_l, mat_u = described_class.lu(mat_d, permute_l: true)
      expect((mat_d - mat_l.dot(mat_u)).abs.max).to be < ERR_TOL
    end
  end
end
