puts <<EOL
#ifndef NUMO_CBLAS_T_H
#define NUMO_CBLAS_T_H

EOL

ARGF.each_line do |line|
  case line
  when /__cplusplus/
    puts line
    break
  end
end

type, name = nil,nil

ARGF.each_line do |line|
  line.sub!(/^(\w+)\s+cblas_(\w+)\s*\(/) do
    type, name = $1,$2
    "typedef #{type} (*#{name}_t)("
  end
  case name
  when /^[id]?z/; line.gsub!(/\bvoid\s*\*/,"dcomplex *")
  when /^[is]?c/; line.gsub!(/\bvoid\s*\*/,"scomplex *")
  end
  puts line
end
