posts = Dir["_posts/*.md"]
regex = /---\n\n\[\^/

posts.each do |path|
  content = File.read(path)
  next unless content =~ regex
  content.gsub!(regex, "[^")
  File.write(path, content)
end
