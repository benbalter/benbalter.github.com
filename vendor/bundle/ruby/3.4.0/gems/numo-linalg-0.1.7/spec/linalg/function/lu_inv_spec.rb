# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'lu_inv' do
    let(:m) { 5 }
    let(:mat_a) { rand_square_real_mat(m) }
    let(:mat_b) { rand_square_complex_mat(m) }

    it 'calculates the inverse of a square real matrix' do
      inv_mat_a = described_class.inv(mat_a)
      expect((inv_mat_a.dot(mat_a) - Numo::DFloat.eye(m)).abs.max).to be < ERR_TOL
    end

    it 'calculates the inverse of a square complex matrix' do
      inv_mat_b = described_class.inv(mat_b)
      expect((inv_mat_b.dot(mat_b) - Numo::DFloat.eye(m)).abs.max).to be < ERR_TOL
    end
  end
end
