source "https://rubygems.org"

gem 'github-pages', :github => "github/pages-gem"
["feed", "sitemap", "mentions", "redirect-from"].each do |plugin|
  gem "jekyll-#{plugin}", :github => "jekyll/jekyll-#{plugin}"
end

group :test, :development do
  gem 'html-proofer', :github => "gjtorikian/html-proofer"
  gem 'ra11y',        :github => "benbalter/ra11y"
  gem 'rake'
  gem 'pry'
end
