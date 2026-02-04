# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'norm' do
    let(:m) { 6 }
    let(:n) { 3 }
    let(:mat_a) { rand_rect_real_mat(m, n) }
    let(:mat_b) { rand_rect_complex_mat(m, n) }
    let(:vec_a) { rand_real_vec(m) }
    let(:vec_b) { rand_complex_vec(m) }
    let(:vec_s) do
      a = rand_real_vec(10)
      a * (a > 0.0)
    end
    let(:vec_t) do
      b = rand_real_vec(10) > 0.0
      rand_complex_vec(10) * b
    end

    it 'raises ArgumentError given an invalid order option' do
      expect { described_class.norm(mat_a, 0) }.to raise_error(ArgumentError)
      expect { described_class.norm(mat_a, 5) }.to raise_error(ArgumentError)
      expect { described_class.norm(mat_a, 'frobenius') }.to raise_error(ArgumentError)
      expect { described_class.norm(vec_a, 'fro') }.to raise_error(ArgumentError)
    end

    it 'calculates the Froubenius norm of a real matrix' do
      norm = Math.sqrt(mat_a.transpose.dot(mat_a).trace)
      expect(described_class.norm(mat_a)).to be_within(norm).of(ERR_TOL)
      expect(described_class.norm(mat_a, 'fro')).to be_within(norm).of(ERR_TOL)
    end

    it 'calculates the L1 norm of a real matrix' do
      expect(described_class.norm(mat_a, 1)).to be_within(mat_a.abs.sum(axis: -2).max).of(ERR_TOL)
    end

    it 'calculates the L2 norm of a real matrix' do
      expect(described_class.norm(mat_a, 2)).to be_within(described_class.svdvals(mat_a).max).of(ERR_TOL)
    end

    it 'calculates the inifinity norm of a real matrix' do
      expect(described_class.norm(mat_a, 'inf')).to be_within(mat_a.abs.sum(axis: -1).max).of(ERR_TOL)
    end

    it 'calculates the Froubenius norm of a complex matrix' do
      norm = Math.sqrt(mat_b.transpose.conj.dot(mat_b).trace.real)
      expect(described_class.norm(mat_b)).to be_within(norm).of(ERR_TOL)
      expect(described_class.norm(mat_b, 'fro')).to be_within(norm).of(ERR_TOL)
    end

    it 'calculates the L1 norm of a complex matrix' do
      expect(described_class.norm(mat_b, 1)).to be_within(mat_b.abs.sum(axis: -2).max).of(ERR_TOL)
    end

    it 'calculates the L2 norm of a complex matrix' do
      expect(described_class.norm(mat_b, 2)).to be_within(described_class.svdvals(mat_b).max).of(ERR_TOL)
    end

    it 'calculates the inifinity norm of a complex matrix' do
      expect(described_class.norm(mat_b, 'inf')).to be_within(mat_b.abs.sum(axis: -1).max).of(ERR_TOL)
    end

    it 'calculates the L0 norm of a complex vector' do
      expect(described_class.norm(vec_t, 0).real).to be_within((vec_t.abs.ne(0)).count).of(ERR_TOL)
    end

    it 'calculates the L1 norm of a complex vector' do
      expect(described_class.norm(vec_b, 1)).to be_within(vec_b.abs.sum).of(ERR_TOL)
    end

    it 'calculates the L2 norm of a complex vector' do
      expect(described_class.norm(vec_b, 2)).to be_within(Math.sqrt((vec_b.abs**2).sum)).of(ERR_TOL)
    end

    it 'calculates the infinity norm of a complex vector' do
      expect(described_class.norm(vec_b, 'inf')).to be_within(vec_b.abs.max).of(ERR_TOL)
    end
  end
end
