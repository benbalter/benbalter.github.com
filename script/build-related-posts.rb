#!/usr/bin/env ruby
# frozen_string_literal: true

# Generates _data/related_posts.yml using LSI (not available via GitHub Pages)

require 'jekyll'
require 'psych'

options = {
  'source' => File.expand_path('../', __dir__),
  'lsi' => true,
  'verbose' => true
}

ignore_list = [
  '_posts/2011-11-29-towards-a-more-agile-government.md',
  '_posts/2012-12-26-securing-the-status-quo.md'
]

Jekyll.logger.info 'Building site'
config = Jekyll.configuration(options)
site = Jekyll::Site.new(config)

site.reset
site.read
site.posts.docs.delete_if { |post| ignore_list.include?(post.relative_path) || post.data['archived'] }

Jekyll.logger.info 'Building related posts'
relations = {}
site.posts.docs.each do |post|
  relations[post.relative_path] = post.related_posts.map(&:relative_path)
end

yaml = Psych.dump(relations, indentation: 2).gsub(/^- /, '  - ')
File.write '_data/related_posts.yml', yaml
