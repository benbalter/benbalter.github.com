# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'eigvals' do
    let(:m) { 5 }
    let(:mat_a) { Numo::DFloat.new(m, m).rand - 0.5 }
    let(:mat_b) { mat_a + Complex::I * (Numo::DFloat.new(m, m).rand - 0.5) }

    it 'raises ShapeError given a rectangular matrix' do
      expect { described_class.eigh(Numo::DFloat.new(2, 4).rand) }.to raise_error(Numo::NArray::ShapeError)
    end

    it 'finds eigenvalues for a square nonsymmetric matrix' do
      w1 = described_class.eigvals(mat_a)
      w2, = described_class.eig(mat_a, left: false, right: false)
      expect((w1 - w2).abs.max).to be < ERR_TOL
    end

    it 'finds eigenvalues for a square complex nonsymmetric matrix' do
      w1 = described_class.eigvals(mat_b)
      w2, = described_class.eig(mat_b, left: false, right: false)
      expect((w1 - w2).abs.max).to be < ERR_TOL
    end
  end
end
