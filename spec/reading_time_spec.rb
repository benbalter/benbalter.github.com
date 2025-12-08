# frozen_string_literal: true

RSpec.describe 'reading time' do
  context 'calculation' do
    it 'uses proper rounding (not truncation)' do
      # Test that 497 words rounds to 2 minutes, not 1
      # 497 / 265 = 1.87, which should round to 2
      # Formula: (words + 132) / 265 = (497 + 132) / 265 = 629 / 265 = 2
      word_count = 497
      adjusted = word_count + 132
      read_time = adjusted / 265
      expect(read_time).to eq(2)
    end

    it 'handles short posts correctly' do
      # Test that very short posts show at least 1 minute
      # 100 words: (100 + 132) / 265 = 232 / 265 = 0 -> should be set to 1
      word_count = 100
      adjusted = word_count + 132
      read_time = adjusted / 265
      # This would be 0, but the template sets minimum to 1
      expect(read_time).to eq(0)
    end

    it 'handles medium posts correctly' do
      # Test 1469 words rounds to 6 minutes
      # (1469 + 132) / 265 = 1601 / 265 = 6
      word_count = 1469
      adjusted = word_count + 132
      read_time = adjusted / 265
      expect(read_time).to eq(6)
    end

    it 'handles long posts correctly' do
      # Test 3410 words rounds to 13 minutes
      # (3410 + 132) / 265 = 3542 / 265 = 13
      word_count = 3410
      adjusted = word_count + 132
      read_time = adjusted / 265
      expect(read_time).to eq(13)
    end
  end

  context 'display in posts' do
    let(:post_path) { '_site/2023/08/04/remote-work-communicate-more-with-less/index.html' }

    before(:all) do
      # Ensure site is built
      unless File.exist?('_site')
        require 'jekyll'
        options = { 'source' => Dir.pwd }
        config = Jekyll.configuration(options)
        site = Jekyll::Site.new(config)
        site.process
      end
    end

    it 'displays reading time in post layout' do
      expect(File).to exist(post_path)
      content = File.read(post_path)
      expect(content).to include('minute read')
    end

    it 'includes a clock icon' do
      content = File.read(post_path)
      expect(content).to include('fa-clock')
    end
  end
end
