# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'eigh' do
    let(:m) { 5 }
    let(:n) { 3 }
    let(:mat_a) { rand_symmetric_mat(m) }
    let(:mat_b) { rand_symmetric_mat(m) + 5.1 * Numo::DFloat.eye(m) } # for avoiding non-singular matrix
    let(:mat_c) { rand_hermitian_mat(m) }
    let(:mat_d) { rand_hermitian_mat(m) + 5.1 * Numo::DFloat.eye(m) } # for avoiding non-singular matrix

    it 'raises ShapeError given a rectangular matrix' do
      expect { described_class.eigh(Numo::DFloat.new(2, 4).rand) }.to raise_error(Numo::NArray::ShapeError)
    end

    it 'finds eigenvalues and eigenvectors by solving eigenvalue problem for a symmetric matrix' do
      v, w = described_class.eigh(mat_a)
      r = w.transpose.dot(mat_a.dot(w))
      r = r[r.diag_indices]
      expect((v - r).abs.mean).to be < ERR_TOL
    end

    it 'finds eigenvalues and eigenvectors by solving eigenvalue problem for a hermitian matrix' do
      v, w = described_class.eigh(mat_c)
      r = w.transpose.conj.dot(mat_c.dot(w))
      r = r[r.diag_indices].real
      expect((v - r).abs.mean).to be < ERR_TOL
    end

    it 'finds eigenvalues and eigenvectors by solving generalized eigenvalue problem for symmetric matrices' do
      v, w = described_class.eigh(mat_a, mat_b)
      r = w.transpose.dot(mat_a.dot(w))
      r = r[r.diag_indices]
      e = w.transpose.dot(mat_b.dot(w))
      e = e[e.diag_indices]
      expect((v - r).abs.mean).to be < ERR_TOL
      expect((Numo::DFloat.ones(m) - e).abs.mean).to be < ERR_TOL
    end

    it 'finds eigenvalues and eigenvectors by solving generalized eigenvalue problem for hermitian matrices' do
      v, w = described_class.eigh(mat_c, mat_d)
      r = w.transpose.conj.dot(mat_c.dot(w))
      r = r[r.diag_indices].real
      e = w.transpose.conj.dot(mat_d.dot(w))
      e = e[e.diag_indices].real
      expect((v - r).abs.mean).to be < ERR_TOL
      expect((Numo::DFloat.ones(m) - e).abs.mean).to be < ERR_TOL
    end

    it 'finds eigenvalues and eigenvectors by solving generalized eigenvalue problem for symmetric and hermitian matrices' do
      v, w = described_class.eigh(mat_a, mat_d)
      r = w.transpose.conj.dot(mat_a.dot(w))
      r = r[r.diag_indices].real
      e = w.transpose.conj.dot(mat_d.dot(w))
      e = e[e.diag_indices].real
      expect((v - r).abs.mean).to be < ERR_TOL
      expect((Numo::DFloat.ones(m) - e).abs.mean).to be < ERR_TOL
    end

    it 'finds eigenvalues and eigenvectors for a symmetric matrix with divide and conquer algorithm' do
      v, w = described_class.eigh(mat_a, turbo: true)
      r = w.transpose.dot(mat_a.dot(w))
      r = r[r.diag_indices]
      expect((v - r).abs.mean).to be < ERR_TOL
    end

    it 'finds eigenvalues and eigenvectors in the range of the specified indices' do
      v1, w1 = described_class.eigh(mat_a, mat_b)
      v2, w2 = described_class.eigh(mat_a, mat_b, vals_range: 0...n)
      r = w2.transpose.dot(mat_a.dot(w2))
      r = r[r.diag_indices]
      e = w2.transpose.dot(mat_b.dot(w2))
      e = e[e.diag_indices]
      expect((v2 - r).abs.mean).to be < ERR_TOL
      expect((v1[0...n] - r).abs.mean).to be < ERR_TOL
      expect((Numo::DFloat.ones(n) - e).abs.mean).to be < ERR_TOL
    end
  end
end
