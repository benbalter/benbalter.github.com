require "bundler/gem_tasks"

task :doc do
  srcs = []
  Dir.glob("ext/numo/linalg/*").each do |d|
    if File.exist?(d+"/extconf.rb")
      sh "cd #{d}; ruby extconf.rb; make clean; make src"
      srcs << d+"/*.c"
    end
  end
  srcs << "lib/numo/linalg.rb"
  srcs << "lib/numo/linalg/*.rb"
  sh "yard -m markdown -o yard -r README.md #{srcs.join(' ')}"
end

task :cleandoc do
  sh "rm -r yard .yardoc"
end

require 'rake/extensiontask'
Rake::ExtensionTask.new 'numo/linalg/blas'
Rake::ExtensionTask.new 'numo/linalg/lapack'

CLOBBER.include('lib/numo/linalg/site_conf.rb')
task :compile do
  site_conf = Dir['./tmp/**/numo/linalg/blas/**/lib/site_conf.rb'].first
  cp site_conf, 'lib/numo/linalg'
end

require 'rspec/core/rake_task'
RSpec::Core::RakeTask.new(:spec) do |t|
  t.rspec_opts = '--color --format documentation --require spec_helper'
end

task :default => [:clobber, :compile, :spec]
