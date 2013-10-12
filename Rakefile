require 'html/proofer'

namespace :assets do
  task :precompile do
    sh "bundle exec jekyll build"
  end
end

task :test do
  Rake::Task["assets:precompile"].execute
  tester = HTML::Proofer.new "./_site"
  tester.run
end
