# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'lstsq' do
    #let(:m) { 5 }
    #let(:n) { 3 }
    let(:m) { 3 }
    let(:n) { 8 }
    let(:nrhs) { 2 }
    let(:mat_a) { rand_rect_real_mat(m, n) }
    let(:mat_b) { rand_rect_real_mat(m, nrhs) }
    let(:vec_b) { rand_real_vec(m) }
    let(:mat_c) { rand_rect_complex_mat(m, n) }
    let(:mat_d) { rand_rect_complex_mat(m, nrhs) }
    let(:vec_d) { rand_complex_vec(m) }

    it 'raises ArgumentError given a invalid driver option' do
      expect { described_class.lstsq(mat_a, vec_b, driver: 'foo') }.to raise_error(ArgumentError)
    end

    it 'solves a linear least square problem min||b-Ax|| using the singuar value decomposition' do
      vec_x, = described_class.lstsq(mat_a, vec_b, driver: 'lss')
      expect(((vec_b - mat_a.dot(vec_x))**2).sum).to be < ERR_TOL
      mat_x, = described_class.lstsq(mat_a, mat_b, driver: 'lss')
      expect(((mat_b - mat_a.dot(mat_x))**2).sum(0).max).to be < ERR_TOL
      vec_x, = described_class.lstsq(mat_a, vec_d, driver: 'lss')
      expect(((vec_d - mat_a.dot(vec_x))**2).abs.sum).to be < ERR_TOL
      mat_x, = described_class.lstsq(mat_a, mat_d, driver: 'lss')
      expect(((mat_d - mat_a.dot(mat_x))**2).abs.sum(0).max).to be < ERR_TOL
      vec_x, = described_class.lstsq(mat_c, vec_d, driver: 'lss')
      expect(((vec_d - mat_c.dot(vec_x))**2).abs.sum).to be < ERR_TOL
      mat_x, = described_class.lstsq(mat_c, mat_d, driver: 'lss')
      expect(((mat_d - mat_c.dot(mat_x))**2).abs.sum(0).max).to be < ERR_TOL
      vec_x, = described_class.lstsq(mat_c, vec_b, driver: 'lss')
      expect(((vec_b - mat_c.dot(vec_x))**2).abs.sum).to be < ERR_TOL
      mat_x, = described_class.lstsq(mat_c, mat_b, driver: 'lss')
      expect(((mat_b - mat_c.dot(mat_x))**2).abs.sum(0).max).to be < ERR_TOL
    end

    it 'solves a linear least square problem min||b-Ax|| using the singuar value decomposition with divide and conquer method' do
      vec_x, = described_class.lstsq(mat_a, vec_b, driver: 'lsd')
      expect(((vec_b - mat_a.dot(vec_x))**2).sum).to be < ERR_TOL
      mat_x, = described_class.lstsq(mat_a, mat_b, driver: 'lsd')
      expect(((mat_b - mat_a.dot(mat_x))**2).sum(0).max).to be < ERR_TOL
      vec_x, = described_class.lstsq(mat_a, vec_d, driver: 'lsd')
      expect(((vec_d - mat_a.dot(vec_x))**2).abs.sum).to be < ERR_TOL
      mat_x, = described_class.lstsq(mat_a, mat_d, driver: 'lsd')
      expect(((mat_d - mat_a.dot(mat_x))**2).abs.sum(0).max).to be < ERR_TOL
      vec_x, = described_class.lstsq(mat_c, vec_d, driver: 'lsd')
      expect(((vec_d - mat_c.dot(vec_x))**2).abs.sum).to be < ERR_TOL
      mat_x, = described_class.lstsq(mat_c, mat_d, driver: 'lsd')
      expect(((mat_d - mat_c.dot(mat_x))**2).abs.sum(0).max).to be < ERR_TOL
      vec_x, = described_class.lstsq(mat_c, vec_b, driver: 'lsd')
      expect(((vec_b - mat_c.dot(vec_x))**2).abs.sum).to be < ERR_TOL
      mat_x, = described_class.lstsq(mat_c, mat_b, driver: 'lsd')
      expect(((mat_b - mat_c.dot(mat_x))**2).abs.sum(0).max).to be < ERR_TOL
    end

    it 'solves a linear least square problem min||b-Ax|| using a complete orthogonal factorization of A' do
      vec_x, = described_class.lstsq(mat_a, vec_b, driver: 'lsy')
      expect(((vec_b - mat_a.dot(vec_x))**2).sum).to be < ERR_TOL
      mat_x, = described_class.lstsq(mat_a, mat_b, driver: 'lsy')
      expect(((mat_b - mat_a.dot(mat_x))**2).sum(0).max).to be < ERR_TOL
      vec_x, = described_class.lstsq(mat_a, vec_d, driver: 'lsy')
      expect(((vec_d - mat_a.dot(vec_x))**2).abs.sum).to be < ERR_TOL
      mat_x, = described_class.lstsq(mat_a, mat_d, driver: 'lsy')
      expect(((mat_d - mat_a.dot(mat_x))**2).abs.sum(0).max).to be < ERR_TOL
      vec_x, = described_class.lstsq(mat_c, vec_d, driver: 'lsy')
      expect(((vec_d - mat_c.dot(vec_x))**2).abs.sum).to be < ERR_TOL
      mat_x, = described_class.lstsq(mat_c, mat_d, driver: 'lsy')
      expect(((mat_d - mat_c.dot(mat_x))**2).abs.sum(0).max).to be < ERR_TOL
      vec_x, = described_class.lstsq(mat_c, vec_b, driver: 'lsy')
      expect(((vec_b - mat_c.dot(vec_x))**2).abs.sum).to be < ERR_TOL
      mat_x, = described_class.lstsq(mat_c, mat_b, driver: 'lsy')
      expect(((mat_b - mat_c.dot(mat_x))**2).abs.sum(0).max).to be < ERR_TOL
    end
  end
end
