# frozen_string_literal: true

source 'https://rubygems.org'

gem 'faraday', '< 1.0.0'

#gem 'retlab', path: '../retlab'

group :jekyll_plugins do
  if ENV['JEKYLL4'] == '1'
    gem 'jekyll', '~> 4.0'
    gem 'retlab', github: 'benbalter/retlab'
  else
    gem 'github-pages'
  end

  gem 'jekyll-avatar'
  gem 'jekyll-feed'
  gem 'jekyll-github-metadata'
  gem 'jekyll-mentions'
  gem 'jekyll-redirect-from'
  gem 'jekyll-relative-links'
  gem 'jekyll-remote-theme'
  gem 'jekyll-sass-converter'
  gem 'jekyll-seo-tag'
  gem 'jekyll-sitemap'
  gem 'jemoji'
  gem 'liquid-c'
end

group :test, :development do
  gem 'classifier-reborn', github: 'jekyll/classifier-reborn'
  gem 'gsl', github: 'SciRuby/rb-gsl'
  gem 'html-proofer'
  gem 'nokogiri'
  gem 'pry'
  gem 'rake'
  gem 'rspec'
  gem 'rubocop'
  gem 'rubocop-performance'
  gem 'rubocop-rspec'
  gem 'webrick'
end
