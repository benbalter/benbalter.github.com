require 'html/proofer'
require 'yaml'

namespace :assets do
  task :precompile do
    sh "bundle exec jekyll build"
  end
end

task :test do
  Rake::Task["assets:precompile"].execute
  config = YAML.load_file('_config.yml')["proofer"]
  config = config.inject({}){|memo,(k,v)| memo[k.to_sym] = v; memo}
  HTML::Proofer.new("./_site", config).run
end
