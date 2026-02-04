# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'matmul' do
    let(:m) { 5 }
    let(:n) { 3 }
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

    it 'calculates the dot product of matrices' do
      expect((described_class.matmul(mat_s, mat_s.transpose) - dot_mat_mat(mat_s, mat_s.transpose)).abs).to be < ERR_TOL
      expect((described_class.matmul(mat_s, mat_d.transpose) - dot_mat_mat(mat_s, mat_d.transpose)).abs).to be < ERR_TOL
      expect((described_class.matmul(mat_s, mat_c.transpose) - dot_mat_mat(mat_s, mat_c.transpose)).abs).to be < ERR_TOL
      expect((described_class.matmul(mat_s, mat_z.transpose) - dot_mat_mat(mat_s, mat_z.transpose)).abs).to be < ERR_TOL
      expect((described_class.matmul(mat_d, mat_d.transpose) - dot_mat_mat(mat_d, mat_d.transpose)).abs).to be < ERR_TOL
      expect((described_class.matmul(mat_d, mat_c.transpose) - dot_mat_mat(mat_d, mat_c.transpose)).abs).to be < ERR_TOL
      expect((described_class.matmul(mat_d, mat_z.transpose) - dot_mat_mat(mat_d, mat_z.transpose)).abs).to be < ERR_TOL
      expect((described_class.matmul(mat_c, mat_c.transpose) - dot_mat_mat(mat_c, mat_c.transpose)).abs).to be < ERR_TOL
      expect((described_class.matmul(mat_c, mat_z.transpose) - dot_mat_mat(mat_c, mat_z.transpose)).abs).to be < ERR_TOL
      expect((described_class.matmul(mat_z, mat_z.transpose) - dot_mat_mat(mat_z, mat_z.transpose)).abs).to be < ERR_TOL
    end
  end
end
