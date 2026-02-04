# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'svd' do
    let(:m) { 5 }
    let(:n) { 3 }
    let(:mat_a) { rand_rect_real_mat(m, n) }
    let(:mat_b) { rand_rect_complex_mat(m, n) }

    it 'raises ArgumentError given a invalid driver option' do
      expect { described_class.svd(mat_a, driver: 'foo') }.to raise_error(ArgumentError)
    end

    it 'raises ArgumentError given a invalid job option' do
      expect { described_class.svd(mat_a, job: '@') }.to raise_error(ArgumentError)
    end

    it 'perfoms the singular value decomposition of a rectangular real matrix' do
      s, u, vt = described_class.svd(mat_a, driver: 'svd')
      expect((u.transpose.dot(u) - Numo::DFloat.eye(m)).abs.max).to be < ERR_TOL
      expect((vt.dot(vt.transpose) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
      mat_a_rec = u.dot(Numo::NArray.vstack([s.diag.dot(vt), Numo::DFloat.zeros(m - n, n)]))
      expect((mat_a - mat_a_rec).abs.max).to be < ERR_TOL
    end

    it 'perfoms the singular value decomposition of a rectangular complex matrix' do
      s, u, vt = described_class.svd(mat_b, driver: 'svd')
      expect((u.transpose.conj.dot(u) - Numo::DFloat.eye(m)).abs.max).to be < ERR_TOL
      expect((vt.dot(vt.transpose.conj) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
      mat_b_rec = u.dot(Numo::NArray.vstack([s.diag.dot(vt), Numo::DFloat.zeros(m - n, n)]))
      expect((mat_b - mat_b_rec).abs.max).to be < ERR_TOL
    end

    it 'perfoms the singular value decomposition of a rectangular real matrix with S job option' do
      s, u, vt = described_class.svd(mat_a, driver: 'svd', job: 'S')
      expect(u.shape[0]).to eq(m)
      expect(u.shape[1]).to eq(n)
      expect((u.transpose.dot(u) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
      expect((vt.dot(vt.transpose) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
      mat_a_rec = u.dot(s.diag.dot(vt))
      expect((mat_a - mat_a_rec).abs.max).to be < ERR_TOL
    end

    it 'perfoms the singular value decomposition of a rectangular complex matrix with S job option' do
      s, u, vt = described_class.svd(mat_b, driver: 'svd', job: 'S')
      expect(u.shape[0]).to eq(m)
      expect(u.shape[1]).to eq(n)
      expect((u.transpose.conj.dot(u) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
      expect((vt.dot(vt.transpose.conj) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
      mat_b_rec = u.dot(s.diag.dot(vt))
      expect((mat_b - mat_b_rec).abs.max).to be < ERR_TOL
    end

    it 'calculates the singular values of a rectangular real matrix' do
      s1, = described_class.svd(mat_a, driver: 'svd')
      s2, u, vt = described_class.svd(mat_a, driver: 'svd', job: 'N')
      expect(u).to be_nil
      expect(vt).to be_nil
      expect((s1 - s2).abs.max).to be < ERR_TOL
    end

    it 'calculates the singular values of a rectangular complex matrix' do
      s1, = described_class.svd(mat_b, driver: 'svd')
      s2, u, vt = described_class.svd(mat_b, driver: 'svd', job: 'N')
      expect(u).to be_nil
      expect(vt).to be_nil
      expect((s1 - s2).abs.max).to be < ERR_TOL
    end

    it 'perfoms the singular value decomposition of a rectangular real matrix with divide and conquer algorithm' do
      s, u, vt = described_class.svd(mat_a, driver: 'sdd')
      mat_a_rec = u.dot(Numo::NArray.vstack([s.diag.dot(vt), Numo::DFloat.zeros(m - n, n)]))
      expect((u.dot(u.transpose) - Numo::DFloat.eye(m)).abs.max).to be < ERR_TOL
      expect((vt.transpose.dot(vt) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
      expect((mat_a - mat_a_rec).abs.max).to be < ERR_TOL
    end

    it 'perfoms the singular value decomposition of a rectangular complex matrix with divide and conquer algorithm' do
      s, u, vt = described_class.svd(mat_b, driver: 'sdd')
      mat_b_rec = u.dot(Numo::NArray.vstack([s.diag.dot(vt), Numo::DFloat.zeros(m - n, n)]))
      expect((u.dot(u.transpose.conj) - Numo::DFloat.eye(m)).abs.max).to be < ERR_TOL
      expect((vt.transpose.conj.dot(vt) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
      expect((mat_b - mat_b_rec).abs.max).to be < ERR_TOL
    end
  end
end
