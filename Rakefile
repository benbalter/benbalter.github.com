# frozen_string_literal: true
require 'yaml'
require 'jekyll'
require 'cgi'
require 'uri'

begin
  require 'rspec/core/rake_task'
  RSpec::Core::RakeTask.new(:spec)
rescue LoadError
  puts "Can't find RSpec"
end

def test_config
  YAML.load_file('_config_test.yml')
end

def token
  path = File.expand_path('~/.token')
  File.read(path) if File.exist?(path)
end

def strip_whitespace(string)
  string.gsub(/\r?\n/, ' ').strip.squeeze(' ')
end

task :set_env do
  ENV['DISABLE_WHITELIST']   = 'true'
  ENV['JEKYLL_GITHUB_TOKEN'] = token
end

task :build do
  Rake::Task[:set_env].invoke
  options = {
    'config' => %w(_config.yml _config_test.yml)
  }
  Jekyll::Commands::Build.process(options)
end

task :serve do
  Rake::Task[:set_env].invoke
  options = {
    'serving'     => true,
    'watch'       => true,
    'incremental' => true,
    'config'      => %w(_config.yml _config_local.yml)
  }
  Jekyll::Commands::Build.process(options)
  Jekyll::Commands::Serve.process(options)
end

task :format_yaml do
  Dir['*/**.md'].each do |path|
    content = File.read(path)
    next unless content =~ Jekyll::Document::YAML_FRONT_MATTER_REGEXP
    parts = content.split Jekyll::Document::YAML_FRONT_MATTER_REGEXP
    yaml = YAML.safe_load(parts[1])
    %w(title description).each { |key| yaml[key] = strip_whitespace(yaml[key]) if yaml[key] }
    %w(tags category categories post_format).each { |key| yaml.delete(key) }
    File.write(path, yaml.to_yaml(line_width: -1) + "---\n\n" + parts[4].to_s)
  end
end

task :test do
  Rake::Task[:spec].invoke
  Rake::Task[:build].invoke
  require 'html-proofer'
  require_relative './spec/amazon_link_check'
  HTMLProofer.check_directory('./_site', test_config['proofer']).run
end
