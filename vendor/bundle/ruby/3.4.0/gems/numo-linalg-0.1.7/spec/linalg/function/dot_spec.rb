# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'dot' do
    let(:m) { 5 }
    let(:n) { 3 }
    let(:vec_s) { Numo::SFloat.new(m).rand }
    let(:vec_d) { Numo::DFloat.new(m).rand }
    let(:vec_c) { Numo::SComplex.new(m).rand }
    let(:vec_z) { Numo::DComplex.new(m).rand }
    let(:mat_s) { Numo::SFloat.new(m, n).rand }
    let(:mat_d) { Numo::DFloat.new(m, n).rand }
    let(:mat_c) { Numo::SComplex.new(m, n).rand }
    let(:mat_z) { Numo::DComplex.new(m, n).rand }

    def dot_vec_vec(a, b)
      Array.new(a.size) { |idx| a[idx] * b[idx] }.reduce(&:+)
    end

    def dot_mat_vec(a, b)
      n, = a.shape
      Numo::NArray.asarray(Array.new(n) { |idx| dot_vec_vec(a[idx, true], b) })
    end

    def dot_mat_mat(a, b)
      _m, n = b.shape
      Numo::NArray.asarray(Array.new(n) { |idx| dot_mat_vec(a, b[true, idx]) })
    end

    it 'calculates the dot product of vectors' do
      expect(described_class.dot(vec_s, vec_s)).to be_within(dot_vec_vec(vec_s, vec_s)).of(ERR_TOL)
      expect(described_class.dot(vec_s, vec_d)).to be_within(dot_vec_vec(vec_s, vec_d)).of(ERR_TOL)
      expect(described_class.dot(vec_d, vec_d)).to be_within(dot_vec_vec(vec_d, vec_d)).of(ERR_TOL)
      expect((described_class.dot(vec_s, vec_c) - dot_vec_vec(vec_s, vec_c)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_s, vec_z) - dot_vec_vec(vec_s, vec_z)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_d, vec_c) - dot_vec_vec(vec_d, vec_c)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_d, vec_z) - dot_vec_vec(vec_d, vec_z)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_c, vec_c) - dot_vec_vec(vec_c, vec_c)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_c, vec_z) - dot_vec_vec(vec_c, vec_z)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_z, vec_z) - dot_vec_vec(vec_z, vec_z)).abs).to be < ERR_TOL
    end

    it 'calculates the dot product of matrices' do
      expect((described_class.dot(mat_s, mat_s.transpose) - dot_mat_mat(mat_s, mat_s.transpose)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_s, mat_d.transpose) - dot_mat_mat(mat_s, mat_d.transpose)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_s, mat_c.transpose) - dot_mat_mat(mat_s, mat_c.transpose)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_s, mat_z.transpose) - dot_mat_mat(mat_s, mat_z.transpose)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_d, mat_d.transpose) - dot_mat_mat(mat_d, mat_d.transpose)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_d, mat_c.transpose) - dot_mat_mat(mat_d, mat_c.transpose)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_d, mat_z.transpose) - dot_mat_mat(mat_d, mat_z.transpose)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_c, mat_c.transpose) - dot_mat_mat(mat_c, mat_c.transpose)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_c, mat_z.transpose) - dot_mat_mat(mat_c, mat_z.transpose)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_z, mat_z.transpose) - dot_mat_mat(mat_z, mat_z.transpose)).abs).to be < ERR_TOL
    end

    it 'calculates the dot product of matrix and vector' do
      expect((described_class.dot(mat_s.transpose, vec_s) - dot_mat_vec(mat_s.transpose, vec_s)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_d.transpose, vec_s) - dot_mat_vec(mat_d.transpose, vec_s)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_c.transpose, vec_s) - dot_mat_vec(mat_c.transpose, vec_s)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_z.transpose, vec_s) - dot_mat_vec(mat_z.transpose, vec_s)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_d.transpose, vec_d) - dot_mat_vec(mat_d.transpose, vec_d)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_c.transpose, vec_d) - dot_mat_vec(mat_c.transpose, vec_d)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_z.transpose, vec_d) - dot_mat_vec(mat_z.transpose, vec_d)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_c.transpose, vec_c) - dot_mat_vec(mat_c.transpose, vec_c)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_z.transpose, vec_c) - dot_mat_vec(mat_z.transpose, vec_c)).abs).to be < ERR_TOL
      expect((described_class.dot(mat_z.transpose, vec_z) - dot_mat_vec(mat_z.transpose, vec_z)).abs).to be < ERR_TOL
    end

    it 'calculates the dot product of vector and matrix' do
      expect((described_class.dot(vec_s, mat_s) - dot_mat_vec(mat_s.transpose, vec_s)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_s, mat_d) - dot_mat_vec(mat_d.transpose, vec_s)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_s, mat_c) - dot_mat_vec(mat_c.transpose, vec_s)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_s, mat_z) - dot_mat_vec(mat_z.transpose, vec_s)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_d, mat_d) - dot_mat_vec(mat_d.transpose, vec_d)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_d, mat_c) - dot_mat_vec(mat_c.transpose, vec_d)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_d, mat_z) - dot_mat_vec(mat_z.transpose, vec_d)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_c, mat_c) - dot_mat_vec(mat_c.transpose, vec_c)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_c, mat_z) - dot_mat_vec(mat_z.transpose, vec_c)).abs).to be < ERR_TOL
      expect((described_class.dot(vec_z, mat_z) - dot_mat_vec(mat_z.transpose, vec_z)).abs).to be < ERR_TOL
    end
  end
end
