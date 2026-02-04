# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'svdvals' do
    let(:m) { 5 }
    let(:n) { 3 }
    let(:mat_a) { rand_rect_real_mat(m, n) }
    let(:mat_b) { rand_rect_complex_mat(m, n) }

    it 'raises ArgumentError given a invalid driver option' do
      expect { described_class.svdvals(mat_a, driver: 'foo') }.to raise_error(ArgumentError)
    end

    it 'calculates the singular values of a rectangular real matrix' do
      s1, = described_class.svd(mat_a, driver: 'svd', job: 'N')
      s2 = described_class.svdvals(mat_a, driver: 'svd')
      expect((s1 - s2).abs.max).to be < ERR_TOL
    end

    it 'calculates the singular values of a rectangular complex matrix' do
      s1, = described_class.svd(mat_b, driver: 'svd', job: 'N')
      s2 = described_class.svdvals(mat_b, driver: 'svd')
      expect((s1 - s2).abs.max).to be < ERR_TOL
    end

    it 'calculates the singular values of a rectangular real matrix with divide and conquer algorithm' do
      s1, = described_class.svd(mat_a, driver: 'sdd', job: 'N')
      s2 = described_class.svdvals(mat_a, driver: 'sdd')
      expect((s1 - s2).abs.max).to be < ERR_TOL
    end

    it 'calculates the singular values of a rectangular complex matrix with divide and conquer algorithm' do
      s1, = described_class.svd(mat_b, driver: 'sdd', job: 'N')
      s2 = described_class.svdvals(mat_b, driver: 'sdd')
      expect((s1 - s2).abs.max).to be < ERR_TOL
    end
  end
end
