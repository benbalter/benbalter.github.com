# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'ldl' do
    let(:m) { 5 }
    let(:mat_s) { rand_symmetric_mat(m) }
    let(:mat_c) { rand_symmetric_mat(m) + Complex::I * rand_symmetric_mat(m) }
    let(:mat_h) { rand_hermitian_mat(m) }

    it 'raises ShapeError given a vector' do
      expect { described_class.ldl(Numo::DFloat.new(3).rand) }.to raise_error(Numo::NArray::ShapeError)
    end

    it 'raises ShapeError given a rectangular matrix' do
      expect { described_class.ldl(Numo::DFloat.new(2, 4).rand) }.to raise_error(Numo::NArray::ShapeError)
    end

    it 'raises ArgumentError given an invalid uplo option' do
      expect { described_class.ldl(mat_s, uplo: 'A') }.to raise_error(ArgumentError)
    end

    it 'calculates the LDLt or Bunch-Kaufman factorization of a symmetric real matrix' do
      mat_u, mat_d, perm = described_class.ldl(mat_s, uplo: 'U')
      expect((mat_s - mat_u.dot(mat_d.dot(mat_u.transpose))).abs.max).to be < ERR_TOL
      expect(mat_u[perm, true].tril(-1)).to eq(Numo::DFloat.zeros(m, m))
      mat_l, mat_d, perm = described_class.ldl(mat_s, uplo: 'L')
      expect((mat_s - mat_l.dot(mat_d.dot(mat_l.transpose))).abs.max).to be < ERR_TOL
      expect(mat_l[perm, true].triu(1)).to eq(Numo::DFloat.zeros(m, m))
    end

    it 'calculates the LDLt or Bunch-Kaufman factorization of a symmetric complex matrix' do
      mat_u, mat_d, perm = described_class.ldl(mat_c, uplo: 'U', hermitian: false)
      expect((mat_c - mat_u.dot(mat_d.dot(mat_u.transpose))).abs.max).to be < ERR_TOL
      expect(mat_u[perm, true].tril(-1)).to eq(Numo::DComplex.zeros(m, m))
      mat_l, mat_d, perm = described_class.ldl(mat_c, uplo: 'L', hermitian: false)
      expect((mat_c - mat_l.dot(mat_d.dot(mat_l.transpose))).abs.max).to be < ERR_TOL
      expect(mat_l[perm, true].triu(1)).to eq(Numo::DComplex.zeros(m, m))
    end

    it 'calculates the LDLt or Bunch-Kaufman factorization of a hermitian matrix' do
      mat_u, mat_d, perm = described_class.ldl(mat_h, uplo: 'U')
      expect((mat_h - mat_u.dot(mat_d.dot(mat_u.transpose.conj))).abs.max).to be < ERR_TOL
      expect(mat_u[perm, true].tril(-1)).to eq(Numo::DComplex.zeros(m, m))
      mat_l, mat_d, perm = described_class.ldl(mat_h, uplo: 'L')
      expect((mat_h - mat_l.dot(mat_d.dot(mat_l.transpose.conj))).abs.max).to be < ERR_TOL
      expect(mat_l[perm, true].triu(1)).to eq(Numo::DComplex.zeros(m, m))
    end
  end
end
