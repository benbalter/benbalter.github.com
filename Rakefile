# frozen_string_literal: true
require 'html-proofer'
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

class AmazonLinkCheck < ::HTMLProofer::Check
  def affiliate_id
    @affiliate_id ||= YAML.load_file('_config.yml')['amazon']['affiliates_tag']
  end

  def uri
    URI.parse(@link.href)
  end

  def params
    CGI.parse(uri.query) if uri.query
  end

  def amazon_link?
    uri.host =~ /amazon\.com/
  end

  def afiiliate_id?
    return false unless params && params.key?('tag')
    params['tag'].first == affiliate_id
  end

  def run
    @html.css('a').each do |node|
      @link = create_element(node)
      next if @link.data_proofer_ignore || @link.href.nil?

      if amazon_link? && !afiiliate_id?
        msg = "Misssing Amazon Affiliate ID: #{@link.href}"
        add_issue(msg, line: node.line)
      end
    end
  end
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
    yaml = YAML.load(parts[1])
    %w(title description).each { |key| yaml[key] = strip_whitespace(yaml[key]) if yaml[key] }
    %w(tags category categories post_format).each { |key| yaml.delete(key) }
    File.write(path, yaml.to_yaml(line_width: -1) + "---\n\n" + parts[4].to_s)
  end
end

task :test do
  Rake::Task[:spec].invoke
  Rake::Task[:build].invoke
  HTMLProofer.check_directory('./_site', test_config['proofer']).run
end
