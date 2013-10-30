require 'html/proofer'

namespace :assets do
  task :precompile do
    sh "bundle exec jekyll build"
  end
end

task :test do
  Rake::Task["assets:precompile"].execute
  HTML::Proofer.new("./_site", :href_ignore => ["#comments"]).run
end
