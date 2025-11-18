# frozen_string_literal: true

require 'jekyll'
require 'nokogiri'
require 'json'

RSpec.configure do |config|
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.shared_context_metadata_behavior = :apply_to_host_groups
  config.example_status_persistence_file_path = 'spec/examples.txt'
  config.disable_monkey_patching!

  config.default_formatter = 'doc' if config.files_to_run.one?
  config.order = :random

  Kernel.srand config.seed
  Jekyll.logger.log_level = :error
end

def site_path
  @site_path ||= File.expand_path('../', File.dirname(__FILE__))
end

def config
  @config ||= Jekyll.configuration('source' => site_path,
                                   'config' => [
                                     '_config.yml',
                                     '_config_test.yml'
                                   ])
end

def site
  @site ||= begin
    site = Jekyll::Site.new(config)
    site.reset
    site.read
    site.generate
    site.render
    site
  end
end

def required_front_matter
  config['required_front_matter'] || {}
end

def pages_to_check
  blacklist = ['redirect.html', 'index.html']
  site.pages.select { |page| page.output_ext == '.html' && !blacklist.include?(page.path) }
end
