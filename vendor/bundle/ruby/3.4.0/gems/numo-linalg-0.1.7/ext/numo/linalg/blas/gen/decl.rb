require_relative 'erbpp2'

module Decl

  def decl(meth, tmpl=nil, fn=nil, **h)
    c = get(:blas_char)
    tmpl = meth.dup.gsub(/\?/,"") unless tmpl
    meth = meth.gsub(/\?/,c)
    h[:func_name] ||= (fn && fn.gsub(/\?/,c)) || meth
    #h[:description] ||= get_desc(meth)

    case meth
    when /^s/
      result_dtype = "float"
      result_class = "numo_cSFloat"
      class_name = "Numo::SFloat"
      real_class_name = "Numo::SFloat"
      complex_class_name = "Numo::SComplex"
    when /^d/
      result_dtype = "double"
      result_class = "numo_cDFloat"
      class_name = "Numo::DFloat"
      real_class_name = "Numo::DFloat"
      complex_class_name = "Numo::DComplex"
    when /^c/
      result_dtype = "scomplex"
      result_class = "numo_cSComplex"
      class_name = "Numo::SComplex"
      real_class_name = "Numo::SFloat"
      complex_class_name = "Numo::SComplex"
    when /^z/
      result_dtype = "dcomplex"
      result_class = "numo_cDComplex"
      class_name = "Numo::DComplex"
      real_class_name = "Numo::DFloat"
      complex_class_name = "Numo::DComplex"
    end
    h[:result_dtype] ||= result_dtype
    h[:result_class] ||= result_class
    h[:class_name] ||= class_name
    h[:real_class_name] ||= real_class_name
    h[:complex_class_name] ||= complex_class_name

    case c
    when /c|z/
      h[:is_complex] ||= true
    else
      h[:is_complex] ||= false
    end

    DefLinalgFunction.new(self, tmpl, name:meth, **h)
  end
end


class DefLinalgFunction < DefModuleFunction

  def escape!(s)
    s.gsub!(/\*/,"\\*")
    s.gsub!(/_/,"\\_")
    s
  end

  def outparam(vars)
    m = get(:module_desc)[name]
    h = m && m['param']
    return "" if h.nil?
    result = [""]
    v = vars.split(/,\s*/)
    v.each do |var|
      if content = h[var.upcase]
        result << "    - **#{var}** -- "
        content[1..-1].each{|s| result << "  "+escape!(s)}
      end
      result << ""
    end
    result.join("\n")
  end

  def description
    indent = false
    lines = []
    h = get(:module_desc)[name]
    input = h && h['summary']
    if input.nil?
      puts "no description: #{name}"
      return ""
    end
    re_trim = /^(\s+)/=~input[0] ? /^#{$1}/ : nil
    input.each do |line|
      line.sub!(re_trim,"") if re_trim
      case line
      when /^\s*\d+\. /, /^\s*\(\d+\)/   # itemize
        lines << ""
        indent ||= ""
        line = indent+line
      when /^(\s+)/ #, /^(\s*)\w+\s*=/  # indent
        n_space = $1.size
        if !indent
          lines << ""
          indent = " " * [0,8-n_space].max
        end
        line = indent+line
      else  # standard
        if indent
          lines << ""
          indent = false
        end
      end
      if /^\s{8,}/ !~ line
        escape!(line)
      end
      lines << line
    end
    lines.join("\n")+"\n"
  end

  def vec(v,*a,**h)
    tp = h[:type] || class_name
    a.map!{|x| x==:inplace ? "inplace allowed" : x}
    a.unshift ">=1-dimentional NArray"
    "@param #{v} [#{tp}]  vector (#{a.join(', ')})."
  end

  def mat(v,*a,**h)
    tp = h[:type] || class_name
    a.map!{|x| x==:inplace ? "inplace allowed" : x}
    a.unshift ">=2-dimentional NArray"
    "@param #{v} [#{tp}]  matrix (#{a.join(', ')})."
  end

  def opt(v,tp=nil,*a)
    tp ||= "String or Symbol"
    case v
    when /^order$/
      "@param #{v} [#{tp}]  if 'R': Row-major, if 'C': Column-major. (default='R')"
    when /^uplo$/
      "@param #{v} [#{tp}]  if 'U': Upper triangle, if 'L': Lower triangle. (default='U')"
    when /^side$/
      "@param #{v} [#{tp}]  if 'L': op(A)\\*B (left-side op), if 'R': B\\*op(A) (right-side op). (default='L')"
    when /^diag$/
      "@param #{v} [#{tp}]  if 'U': assumed to be unit triangular, if 'N': not assumed to be unit triangular. (default='U')"
    when /^trans(\w+)?$/
      b = a[0] || $1
      "@param #{v} [#{tp}]  if 'N': Not transpose #{b}, if 'T': Transpose #{b}. (default='N')"
    when "alpha"
      "@param #{v} [Float]  (default=1.0)"
    when "beta"
      "@param #{v} [Float]  (default=0.0)"
    else
      "@param #{v} [#{tp}]  #{a[0]}"
    end
  end

  def jobe(v)
    tp = "String or Symbol"
    a =
      case v
      when /jobvl$/i; "left eigenvectors"
      when /jobvr$/i; "right eigenvectors"
      when /jobz$/i ; "eigenvectors"
      end
    if a
      return "@param #{v} [#{tp}]  if 'V': Compute #{a}, if 'N': Not compute #{a} (default='V')"
    end
  end

  def jobs(v)
    tp = "String or Symbol"
    a =
      case v
      when /jobu/
        "If 'A': all M columns of U are returned in array U, " +
          "If 'S': the first min(m,n) columns of U (the left " +
          "singular vectors) are returned in the array U, " +
          "If 'O': the first min(m,n) columns of U (the left " +
          "singular vectors) are overwritten on the array A, " +
          "If 'N': no columns of U (no left singular vectors) are computed."
      when /jobvt/
        "If 'A': all N rows of V\\*\\*T are returned in the array VT;" +
          "If 'S': the first min(m,n) rows of V\\*\\*T (the right singular" +
          " vectors) are returned in the array VT;" +
          "If 'O': the first min(m,n) rows of V\\*\\*T (the right singular" +
          " vectors) are overwritten on the array A;" +
          "If 'N': no rows of V\\*\\*T (no right singular vectors) are" +
          " computed."
      when /jobz/
        "If 'A':  all M columns of U and all N rows of V\\*\\*H are" +
          " returned in the arrays U and VT;" +
          " If 'S':  the first min(M,N) columns of U and the first" +
          " min(M,N) rows of V\\*\\*H are returned in the arrays U" +
          " and VT;" +
          "If 'O':  If M >= N, the first N columns of U are overwritten" +
          " in the array A and all rows of V\\*\\*H are returned in" +
          " the array VT;" +
          " otherwise, all columns of U are returned in the" +
          " array U and the first M rows of V\\*\\*H are overwritten" +
          " in the array A;" +
          "If 'N':  no columns of U or rows of V\\*\\*H are computed."
      end
    "@param #{v} [#{tp}]  #{a} (default='A')"
  end
end
