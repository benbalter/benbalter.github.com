# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'det' do
    it 'raises ShapeError given a rectangular matrix as matrix A' do
      expect { described_class.expm(Numo::DFloat.new(2, 3).rand) }.to raise_error(Numo::NArray::ShapeError)
    end

    it 'calculates matrix exponential of matrix without full eigenvectors' do
      e = Math.exp(1)
      err = (described_class.expm(Numo::DFloat[[1, 2], [0, 1]]) - Numo::DFloat[[e, 2 * e], [0, e]]).abs.sum(1).max
      expect(err).to be < 1e-6
    end

    it 'calculates matrix exponential for matrix with large norm' do
      tmp = Numo::DFloat[[-0.0995741, 0.0746806], [-0.199148, 0.149361]]
      err = (described_class.expm(Numo::DFloat[[-147, 72], [-192, 93]]) - tmp).abs.sum(1).max
      expect(err).to be < 1e-6
    end

    it 'calculates matrix exponential for diagonal matrix' do
      err = (described_class.expm(Numo::DFloat[2, 3].diag) - Numo::NMath.exp(Numo::DFloat[2, 3]).diag).abs.sum(1).max
      expect(err).to be < 1e-6
    end

    it 'returns identity matrix when given zero matrix' do
      expect(described_class.expm(Numo::DFloat.zeros([2, 2]))).to eq(Numo::DFloat.eye(2))
    end

    it 'returns complex matrix when given complex matrix' do
      expect(described_class.expm(rand_rect_complex_mat(2, 2))).to be_a(Numo::DComplex)
    end
  end
end
