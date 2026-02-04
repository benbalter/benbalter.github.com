# frozen_string_literal: true
#
require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'eig' do
    let(:m) { 5 }
    let(:mat_a) { rand_square_real_mat(m) }
    let(:mat_b) { rand_square_complex_mat(m) }

    it 'raises ShapeError given a rectangular matrix' do
      expect { described_class.eigh(Numo::DFloat.new(2, 4).rand) }.to raise_error(Numo::NArray::ShapeError)
    end

    it 'finds eigenvalues and eigenvectors for a square nonsymmetric matrix' do
      w, vl, vr = described_class.eig(mat_a, left: true, right: true)
      expect(vl).not_to be_nil
      expect(vr).not_to be_nil
      expect((mat_a.dot(vr) - vr.dot(w.diag)).abs.max).to be < ERR_TOL
      expect((vl.transpose.conj.dot(mat_a) - w.diag.dot(vl.transpose.conj)).abs.max).to be < ERR_TOL
    end

    it 'finds eigenvalues and right eigenvectors for a square nonsymmetric matrix' do
      w, vl, vr = described_class.eig(mat_a, left: false, right: true)
      expect(vl).to be_nil
      expect((mat_a.dot(vr) - vr.dot(w.diag)).abs.max).to be < ERR_TOL
    end

    it 'finds eigenvalues and left eigenvectors for a square nonsymmetric matrix' do
      w, vl, vr = described_class.eig(mat_a, left: true, right: false)
      expect((vl.transpose.conj.dot(mat_a) - w.diag.dot(vl.transpose.conj)).abs.max).to be < ERR_TOL
    end

    it 'finds eigenvalues and eigenvectors for a square complex nonsymmetric matrix' do
      w, vl, vr = described_class.eig(mat_b, left: true, right: true)
      expect(vl).not_to be_nil
      expect(vr).not_to be_nil
      expect((mat_b.dot(vr) - vr.dot(w.diag)).abs.max).to be < ERR_TOL
      expect((vl.transpose.conj.dot(mat_b) - w.diag.dot(vl.transpose.conj)).abs.max).to be < ERR_TOL
    end

    it 'finds eigenvalues and right eigenvectors for a square complex nonsymmetric matrix' do
      w, vl, vr = described_class.eig(mat_b, left: false, right: true)
      expect(vl).to be_nil
      expect((mat_b.dot(vr) - vr.dot(w.diag)).abs.max).to be < ERR_TOL
    end

    it 'finds eigenvalues and left eigenvectors for a square complex nonsymmetric matrix' do
      w, vl, vr = described_class.eig(mat_b, left: true, right: false)
      expect((vl.transpose.conj.dot(mat_b) - w.diag.dot(vl.transpose.conj)).abs.max).to be < ERR_TOL
    end
  end
end
