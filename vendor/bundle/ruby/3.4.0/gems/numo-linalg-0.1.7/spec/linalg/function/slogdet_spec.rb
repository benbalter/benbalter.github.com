# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg do
  describe 'slogdet' do
    let(:m) { 5 }
    let(:mat_a) { rand_square_real_mat(m) }
    let(:mat_b) { rand_square_complex_mat(m) }

    it 'calculates natural logarithm of the dererminant of a square real matrix' do
      logdet = Math.log(described_class.eigvals(mat_a).prod.abs)
      expect((described_class.slogdet(mat_a)[1] - logdet).abs).to be < ERR_TOL
    end

    it 'calculates natural logarithm of the dererminant of a square complex matrix' do
      logdet = Math.log(described_class.eigvals(mat_b).prod.abs)
      expect((described_class.slogdet(mat_b)[1] - logdet).abs).to be < ERR_TOL
    end
  end
end
