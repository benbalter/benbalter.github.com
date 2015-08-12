require 'html/proofer'
require 'yaml'

namespace :assets do
  task :precompile do
    sh "bundle exec jekyll build"
  end
end

task :test do
  config = YAML.load_file('_config_test.yml')
  puts "Running with the following test configuration:"
  puts config.to_yaml
  sh "bundle exec jekyll build -c _config.yml,_config_test.yml --drafts"
  config["proofer"] = config["proofer"].inject({}){|memo,(k,v)| memo[k.to_sym] = v; memo}
  HTML::Proofer.new("./_site", config["proofer"]).run
end
