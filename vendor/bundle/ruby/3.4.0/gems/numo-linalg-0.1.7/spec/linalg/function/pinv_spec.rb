# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'pinv' do
    let(:m) { 5 }
    let(:n) { 3 }
    let(:mat_a) { rand_rect_real_mat(m, n) }
    let(:mat_b) { rand_rect_complex_mat(m, n) }

    it 'raises ArgumentError given a invalid driver option' do
      expect { described_class.pinv(mat_a, driver: 'foo') }.to raise_error(ArgumentError)
    end

    it 'calculates the (Moore-Penrose) pseudo-inverse of a rectangular real matrix using svd' do
      inv_mat_a = described_class.pinv(mat_a, driver: 'svd')
      expect((inv_mat_a.dot(mat_a) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
      inv_mat_a = described_class.pinv(mat_a, driver: 'sdd')
      expect((inv_mat_a.dot(mat_a) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
    end

    it 'calculates the (Moore-Penrose) pseudo-inverse of a rectangular complex matrix using svd' do
      inv_mat_b = described_class.pinv(mat_b, driver: 'svd')
      expect((inv_mat_b.dot(mat_b) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
      inv_mat_b = described_class.pinv(mat_b, driver: 'sdd')
      expect((inv_mat_b.dot(mat_b) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
    end

    it 'calculates the (Moore-Penrose) pseudo-inverse of a rectangular real matrix using lstsq' do
      inv_mat_a = described_class.pinv(mat_a, driver: 'lsd')
      expect((inv_mat_a.dot(mat_a) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
      inv_mat_a = described_class.pinv(mat_a, driver: 'lss')
      expect((inv_mat_a.dot(mat_a) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
      inv_mat_a = described_class.pinv(mat_a, driver: 'lsy')
      expect((inv_mat_a.dot(mat_a) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
    end

    it 'calculates the (Moore-Penrose) pseudo-inverse of a rectangular complex matrix using lstsq' do
      inv_mat_b = described_class.pinv(mat_b, driver: 'lsd')
      expect((inv_mat_b.dot(mat_b) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
      inv_mat_b = described_class.pinv(mat_b, driver: 'lss')
      expect((inv_mat_b.dot(mat_b) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
      inv_mat_b = described_class.pinv(mat_b, driver: 'lsy')
      expect((inv_mat_b.dot(mat_b) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
    end
  end
end
