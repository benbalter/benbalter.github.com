# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'det' do
    let(:m) { 5 }
    let(:mat_a) { rand_square_real_mat(m) }
    let(:mat_b) { rand_square_complex_mat(m) }

    it 'calculates the dererminant of a square real matrix' do
      det = described_class.eigvals(mat_a).prod.real
      expect(described_class.det(mat_a)).to be_within(det).of(ERR_TOL)
    end

    it 'calculates the dererminant of a square complex matrix' do
      det = described_class.eigvals(mat_b).prod
      expect((described_class.det(mat_b) - det).abs).to be < ERR_TOL
    end
  end
end
