# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'cond' do
    let(:m) { 6 }
    let(:n) { 3 }
    let(:mat_a) { rand_square_real_mat(m) }
    let(:mat_b) { rand_square_complex_mat(m) }

    def cond(mat, ord)
      described_class.norm(mat, ord) * described_class.norm(described_class.inv(mat), ord)
    end

    it 'raises ArgumentError given an invalid order option' do
      expect { described_class.cond(mat_a, 0) }.to raise_error(ArgumentError)
      expect { described_class.cond(mat_a, 'frobenius') }.to raise_error(ArgumentError)
    end

    it 'calculates the condition number of a real matrix with Froubenius norm' do
      expect(described_class.cond(mat_a, 'fro')).to be_within(cond(mat_a, 'fro')).of(ERR_TOL)
    end

    it 'calculates the condition number of a real matrix with L1 norm' do
      expect(described_class.cond(mat_a, 1)).to be_within(cond(mat_a, 1)).of(ERR_TOL)
    end

    it 'calculates the condition number of a real matrix with L2 norm' do
      condnum = cond(mat_a, 2)
      expect(described_class.cond(mat_a)).to be_within(condnum).of(ERR_TOL)
      expect(described_class.cond(mat_a, 2)).to be_within(condnum).of(ERR_TOL)
    end

    it 'calculates the condition number of a real matrix with inifinity norm' do
      expect(described_class.cond(mat_a, 'inf')).to be_within(cond(mat_a, 'inf')).of(ERR_TOL)
    end

    it 'calculates the condition number of a complex matrix with Froubenius norm' do
      expect(described_class.cond(mat_b, 'fro')).to be_within(cond(mat_b, 'fro')).of(ERR_TOL)
    end

    it 'calculates the condition number of a complex matrix with L1 norm' do
      expect(described_class.cond(mat_b, 1)).to be_within(cond(mat_b, 1)).of(ERR_TOL)
    end

    it 'calculates the condition number of a complex matrix with L2 norm' do
      condnum = cond(mat_b, 2)
      expect(described_class.cond(mat_b)).to be_within(condnum).of(ERR_TOL)
      expect(described_class.cond(mat_b, 2)).to be_within(condnum).of(ERR_TOL)
    end

    it 'calculates the condition number of a complex matrix with inifinity norm' do
      expect(described_class.cond(mat_b, 'inf')).to be_within(cond(mat_b, 'inf')).of(ERR_TOL)
    end
  end
end
