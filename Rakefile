require 'html/proofer'
require 'ra11y'
require 'yaml'

namespace :assets do
  task :precompile do
    sh "bundle exec jekyll build"
  end
end

def config
  config = YAML.load_file('_config_test.yml')
  config["proofer"] = config["proofer"].inject({}){|memo,(k,v)| memo[k.to_sym] = v; memo}
  config
end

def build_site
  sh "bundle exec jekyll build -c _config.yml,_config_test.yml --drafts"
end

def ra11y
  puts "Pa11y version: #{Ra11y.executable_version}"
  puts "Pa11y path: #{Cliver.detect('pa11y')}"
  Ra11y.options = config["ra11y"]
  Ra11y::Site.new("./_site").run
end

def html_proofer
  puts "HTML Proofer version: #{HTML::Proofer::VERSION}"
  HTML::Proofer.new("./_site", config["proofer"]).run
end

task :test do
  puts "Running with the following test configuration:"
  puts config.to_yaml
  puts "---"
  build_site

  # Use environmental variable to run tests in parallel
  if ENV["TRAVIS_BUILD"] == "html_proofer"
    html_proofer
  elsif ENV["TRAVIS_BUILD"] == "ra11y"
    ra11y
  else
    html_proofer && ra11y
  end
end
