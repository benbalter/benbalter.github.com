# frozen_string_literal: true

require 'numo/linalg/autoloader'

ERR_TOL = 1e-6

def rand_symmetric_mat(n)
  a = Numo::DFloat.new(n, n).rand
  0.5 * (a + a.transpose) - 0.5
end

def rand_hermitian_mat(n)
  a = rand_symmetric_mat(n)
  b = Numo::DFloat.new(n, n).rand
  b = 0.5 * (b + b.transpose)
  b = (b.triu - b.tril)
  b[b.diag_indices] = 0.0
  a + b * Complex::I
end

def rand_square_real_mat(m)
  Numo::DFloat.new(m, m).rand - 0.5
end

def rand_square_complex_mat(m)
  rand_rect_real_mat(m, m) + Complex::I * (rand_rect_real_mat(m, m) - 0.5)
end

def rand_rect_real_mat(m, n)
  Numo::DFloat.new(m, n).rand - 0.5
end

def rand_rect_complex_mat(m, n)
  rand_rect_real_mat(m, n) + Complex::I * (rand_rect_real_mat(m, n) - 0.5)
end

def rand_real_vec(m)
  Numo::DFloat.new(m).rand - 0.5
end

def rand_complex_vec(m)
  rand_real_vec(m) + Complex::I * (rand_real_vec(m) - 0.5)
end

RSpec.configure do |config|
  # Enable flags like --only-failures and --next-failure
  config.example_status_persistence_file_path = '.rspec_status'

  # Disable RSpec exposing methods globally on `Module` and `main`
  config.disable_monkey_patching!

  config.expect_with :rspec do |c|
    c.syntax = :expect
  end
end
