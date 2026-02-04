puts <<EOL
#ifndef NUMO_LAPACKE_T_H
#define NUMO_LAPACKE_T_H

EOL

ARGF.each_line do |line|
  case line
  when /C-LAPACK function prototypes/
    puts line
    break
  end
end

type, name = nil,nil

ARGF.each_line do |line|
  break if /^#define / =~ line
  line.sub!(/^(\w+)\s+LAPACKE_(\w+)\s*\(/) do
    type, name = $1,$2
    "typedef #{type} (*#{name}_t)("
  end
  case name
  when /^[id]?z/; line.gsub!(/\bvoid\s*\*/,"dcomplex *")
  when /^[is]?c/; line.gsub!(/\bvoid\s*\*/,"scomplex *")
  end
  puts line
end

puts <<EOL
#endif
EOL
