require 'html-proofer'
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

def html_proofer
  puts "HTML Proofer version: #{HTMLProofer::VERSION}"
  HTMLProofer.check_directory("./_site", config["proofer"]).run
end

task :test do
  build_site
  html_proofer
end
