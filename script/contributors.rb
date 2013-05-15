require 'open-uri'
require 'json'

humans_txt = File.read "humans.txt" 
humans_txt = humans_txt.split /\/\* TEAM \*\//
humans_txt = humans_txt[0] + "/* TEAM */\n"

contributors = JSON.parse(open("https://api.github.com/repos/benbalter/benbalter.github.com/contributors").read)
contributors.each do |contributor|
  humans_txt = humans_txt + "Name: " + contributor["login"] + "\nSite: " + contributor["html_url"] + "\n\n"
end

File.open("humans.txt", 'w') { |file| file.write humans_txt }
