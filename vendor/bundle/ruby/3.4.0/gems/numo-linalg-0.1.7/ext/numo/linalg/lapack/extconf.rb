require 'mkmf'
require 'numo/narray'
require_relative '../mkmf_linalg'

srcs = %w(
lapack
lapack_s
lapack_d
lapack_c
lapack_z
)
$objs = srcs.collect{|i| i+".o"}

dir_config("narray")

find_narray_h
if !have_header("numo/narray.h")
  puts "
  Header numo/narray.h was not found. Give pathname as follows:
  % ruby extconf.rb --with-narray-include=narray_h_dir"
  exit(1)
end

if RUBY_PLATFORM =~ /cygwin|mingw/
  find_libnarray_a
  unless have_library("narray","nary_new")
    puts "libnarray.a not found"
    exit(1)
  end
end

if have_header("dlfcn.h")
  exit(1) unless have_library("dl")
  exit(1) unless have_func("dlopen")
elsif have_header("windows.h")
  exit(1) unless have_func("LoadLibrary")
end

create_depend(__dir__)
create_makefile('numo/linalg/lapack')
