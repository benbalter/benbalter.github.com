# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'matrix_power' do
    let(:m) { 5 }
    let(:mat_a) { rand_square_real_mat(m) }

    it 'raises ShapeError given a rectangular matrix' do
      expect { described_class.matrix_power(Numo::DFloat.new(2, 4).rand, 2) }.to raise_error(Numo::NArray::ShapeError)
    end

    it 'raises ArgumentError given a non-integer exponent' do
      expect { described_class.matrix_power(Numo::DFloat.new(2, 2).rand, 0.5) }.to raise_error(ArgumentError)
    end

    it 'calculates a square matrix to the n-th power' do
      expect(described_class.matrix_power(mat_a, 0)).to eq(Numo::DFloat.eye(m))
      pow_mat_a = described_class.matrix_power(mat_a, 2)
      expect((pow_mat_a - mat_a.dot(mat_a)).abs.max).to be < ERR_TOL
      pow_mat_a = described_class.matrix_power(mat_a, 5)
      expect((pow_mat_a - (((mat_a.dot(mat_a)).dot(mat_a)).dot(mat_a)).dot(mat_a)).abs.max).to be < ERR_TOL
    end

    it 'calculates the inverse of a square matrix' do
      inv_mat_a = described_class.matrix_power(mat_a, -1)
      expect((inv_mat_a.dot(mat_a) - Numo::DFloat.eye(m)).abs.max).to be < ERR_TOL
    end
  end
end
