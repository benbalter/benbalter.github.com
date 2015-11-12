source "https://rubygems.org"

gem 'github-pages', :github => "github/pages-gem", branch: "jekyll-3"
["feed", "sitemap", "mentions", "redirect-from"].each do |plugin|
  gem "jekyll-#{plugin}", :github => "jekyll/jekyll-#{plugin}"
end

gem "jekyll-seo-tag", :github => "benbalter/jekyll-seo-tag"

group :test, :development do
  gem 'html-proofer', :github => "gjtorikian/html-proofer"
  gem 'ra11y',        :github => "benbalter/ra11y"
  gem 'rake'
  gem 'pry'
end
