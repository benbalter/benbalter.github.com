# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'null_space' do
    let(:r) { 2 }
    let(:m) { 6 }
    let(:n) { 4 }
    let(:mat_a) { rand_rect_real_mat(m, r).dot(rand_rect_real_mat(r, n)) }
    let(:mat_b) { rand_rect_complex_mat(m, r).dot(rand_rect_complex_mat(r, n)) }
    let(:mat_c) { mat_a + 1.0e-6 * Numo::DFloat.new(m, n).rand }

    it 'raises ShapeError given a vector' do
      expect { described_class.lu(Numo::DFloat.new(3).rand) }.to raise_error(Numo::NArray::ShapeError)
    end

    it 'calculates an orthonormal basis for the null space of a real matrix' do
      basis = described_class.null_space(mat_a)
      expect(basis.shape[0]).to eq(n)
      expect(basis.shape[1]).to eq(r)
      expect((basis.transpose.dot(basis) - Numo::DFloat.eye(r)).abs.max).to be < ERR_TOL
    end

    it 'calculates an orthonormal basis for the null space of a complex matrix' do
      basis = described_class.null_space(mat_b)
      expect(basis.shape[0]).to eq(n)
      expect(basis.shape[1]).to eq(r)
      expect((basis.transpose.conj.dot(basis) - Numo::DFloat.eye(r)).abs.max).to be < ERR_TOL
    end

    it 'calculates an orthonormal basis according to the given rcond value' do
      basis = described_class.null_space(mat_c, rcond: 1.0e-4)
      expect(basis.shape[0]).to eq(n)
      expect(basis.shape[1]).to eq(r)
      expect((basis.transpose.dot(basis) - Numo::DFloat.eye(r)).abs.max).to be < ERR_TOL
      basis = described_class.null_space(mat_c, rcond: 1.0e-8)
      expect(basis.shape).to be_empty
    end
  end
end
