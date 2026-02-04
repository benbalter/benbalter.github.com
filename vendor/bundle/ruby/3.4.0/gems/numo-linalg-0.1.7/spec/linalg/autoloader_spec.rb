# frozen_string_literal: true

require 'spec_helper'

RSpec.describe Numo::Linalg::Autoloader do
  it 'succeses loading backend libraries' do
    expect { described_class.load_library }.to_not raise_error
    expect(described_class.libs).to_not be_nil
  end
end
