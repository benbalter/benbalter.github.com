# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'qr' do
    let(:m) { 5 }
    let(:n) { 3 }
    let(:mat_a) { rand_rect_real_mat(m, n) }
    let(:mat_b) { rand_rect_complex_mat(m, n) }

    it 'raises ArgumentError given a invalid mode option' do
      expect { described_class.qr(Numo::DFloat.new(2, 4).rand, mode: 'foo') }.to raise_error(ArgumentError)
    end

    it 'calculates the QR factorization of a real matrix with reduce mode' do
      q, r = described_class.qr(mat_a, mode: 'reduce')
      expect((q.dot(r) - mat_a).abs.max).to be < ERR_TOL
      expect((q.transpose.dot(q) - Numo::DFloat.eye(m)).abs.max).to be < ERR_TOL
      q, r = described_class.qr(mat_a.transpose, mode: 'reduce')
      expect((q.dot(r) - mat_a.transpose).abs.max).to be < ERR_TOL
      expect((q.transpose.dot(q) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
    end

    it 'calculates the QR factorization of a complex matrix with reduce mode' do
      q, r = described_class.qr(mat_b, mode: 'reduce')
      expect((q.dot(r) - mat_b).abs.max).to be < ERR_TOL
      expect((q.transpose.conj.dot(q) - Numo::DFloat.eye(m)).abs.max).to be < ERR_TOL
      q, r = described_class.qr(mat_b.transpose.conj, mode: 'reduce')
      expect((q.dot(r) - mat_b.transpose.conj).abs.max).to be < ERR_TOL
      expect((q.transpose.conj.dot(q) - Numo::DFloat.eye(n)).abs.max).to be < ERR_TOL
    end

    it 'calculates the QR factorization of a real matrix with r mode' do
      q_, r = described_class.qr(mat_a, mode: 'reduce')
      r2 = described_class.qr(mat_a, mode: 'r')
      expect((r - r2).abs.max).to be < ERR_TOL
      q_, r = described_class.qr(mat_a.transpose, mode: 'reduce')
      r2 = described_class.qr(mat_a.transpose, mode: 'r')
      expect((r - r2).abs.max).to be < ERR_TOL
    end

    it 'calculates the QR factorization of a complex matrix with r mode' do
      q_, r = described_class.qr(mat_b, mode: 'reduce')
      r2 = described_class.qr(mat_b, mode: 'r')
      expect((r - r2).abs.max).to be < ERR_TOL
      q_, r = described_class.qr(mat_b.transpose.conj, mode: 'reduce')
      r2 = described_class.qr(mat_b.transpose.conj, mode: 'r')
      expect((r - r2).abs.max).to be < ERR_TOL
    end

    it 'calculates the QR factorization of a real matrix with economic mode' do
      q, r = described_class.qr(mat_a, mode: 'economic')
      expect(q.shape[0]).to eq(m)
      expect(q.shape[1]).to eq(n)
      expect(r.shape[0]).to eq(n)
      expect(r.shape[1]).to eq(n)
      expect((q.dot(r) - mat_a).abs.max).to be < ERR_TOL
    end

    it 'calculates the QR factorization of a complex matrix with economic mode' do
      q, r = described_class.qr(mat_b, mode: 'economic')
      expect(q.shape[0]).to eq(m)
      expect(q.shape[1]).to eq(n)
      expect(r.shape[0]).to eq(n)
      expect(r.shape[1]).to eq(n)
      expect((q.dot(r) - mat_b).abs.max).to be < ERR_TOL
    end

    it 'calculates the QR factorization of a real matrix with raw mode' do
      q_, r =  described_class.qr(mat_a)
      q, tau = described_class.qr(mat_a, mode: 'raw')
      expect((q.triu - r).abs.max).to be < ERR_TOL
    end

    it 'calculates the QR factorization of a complex matrix with raw mode' do
      q_, r =  described_class.qr(mat_b)
      q, tau = described_class.qr(mat_b, mode: 'raw')
      expect((q.triu - r).abs.max).to be < ERR_TOL
    end
  end
end
