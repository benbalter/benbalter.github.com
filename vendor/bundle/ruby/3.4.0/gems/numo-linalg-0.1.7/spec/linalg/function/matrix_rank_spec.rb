# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'matrix_rank' do
    let(:r) { 2 }
    let(:m) { 6 }
    let(:n) { 3 }
    let(:mat_a) { rand_rect_real_mat(m, r).dot(rand_rect_real_mat(r, n)) }
    let(:mat_b) { rand_rect_complex_mat(m, r).dot(rand_rect_complex_mat(r, n)) }

    it 'raises ArgumentError given a invalid driver option' do
      expect { described_class.matrix_rank(mat_a, driver: 'foo') }.to raise_error(ArgumentError)
    end

    it 'calculate the matrix rank of a real matrix' do
      expect(described_class.matrix_rank(mat_a)).to eq(r)
    end

    it 'calculate the matrix rank of a real matrix with divide and conquer method' do
      expect(described_class.matrix_rank(mat_a, driver: 'sdd')).to eq(r)
    end

    it 'calculate the matrix rank of a complex matrix' do
      expect(described_class.matrix_rank(mat_b)).to eq(r)
    end

    it 'calculate the matrix rank of a complex matrix with divide and conquer method' do
      expect(described_class.matrix_rank(mat_b, driver: 'sdd')).to eq(r)
    end
  end
end
