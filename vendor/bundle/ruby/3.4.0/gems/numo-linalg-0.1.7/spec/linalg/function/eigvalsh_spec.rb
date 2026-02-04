# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'eigvash' do
    let(:m) { 5 }
    let(:n) { 3 }
    let(:mat_a) { rand_symmetric_mat(m) }
    let(:mat_b) { rand_symmetric_mat(m) + 5.1 * Numo::DFloat.eye(m) } # for avoiding non-singular matrix
    let(:mat_c) { rand_hermitian_mat(m) }
    let(:mat_d) { rand_hermitian_mat(m) + 5.1 * Numo::DFloat.eye(m) } # for avoiding non-singular matrix

    it 'raises ShapeError given a rectangular matrix' do
      expect { described_class.eigh(Numo::DFloat.new(2, 4).rand) }.to raise_error(Numo::NArray::ShapeError)
    end

    it 'finds eigenvalues by solving eigenvalue problem for a symmetric matrix' do
      v1 = described_class.eigvalsh(mat_a)
      v2, = described_class.eigh(mat_a)
      expect((v1 - v2).abs.mean).to be < ERR_TOL
    end

    it 'finds eigenvalues by solving eigenvalue problem for a hermitian matrix' do
      v1 = described_class.eigvalsh(mat_c)
      v2, = described_class.eigh(mat_c)
      expect((v1 - v2).abs.mean).to be < ERR_TOL
    end

    it 'finds eigenvalues by solving generalized eigenvalue problem for symmetric matrices' do
      v1 = described_class.eigvalsh(mat_a, mat_b)
      v2, = described_class.eigh(mat_a, mat_b)
      expect((v1 - v2).abs.mean).to be < ERR_TOL
    end

    it 'finds eigenvalues by solving generalized eigenvalue problem for hermitian matrices' do
      v1 = described_class.eigvalsh(mat_c, mat_d)
      v2, = described_class.eigh(mat_c, mat_d)
      expect((v1 - v2).abs.mean).to be < ERR_TOL
    end

    it 'finds eigenvalues by solving generalized eigenvalue problem for symmetric and hermitian matrices' do
      v1 = described_class.eigvalsh(mat_a, mat_d)
      v2, = described_class.eigh(mat_a, mat_d)
      expect((v1 - v2).abs.mean).to be < ERR_TOL
    end

    it 'finds eigenvalues for a symmetric matrix with divide and conquer algorithm' do
      v1 = described_class.eigvalsh(mat_a, turbo: true)
      v2, = described_class.eigh(mat_a, turbo: true)
      expect((v1 - v2).abs.mean).to be < ERR_TOL
    end

    it 'finds eigenvalues in the range of the specified indices' do
      v1 = described_class.eigvalsh(mat_a, mat_b, vals_range: 0...n)
      v2, = described_class.eigh(mat_a, mat_b, vals_range: 0...n)
      expect((v1 - v2).abs.mean).to be < ERR_TOL
    end
  end
end
