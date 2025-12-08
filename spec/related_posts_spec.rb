# frozen_string_literal: true

RSpec.describe 'related posts' do
  let(:related_posts_data) { YAML.load_file('_data/related_posts.yml', permitted_classes: [Symbol]) }

  context 'data file' do
    it 'exists' do
      expect(File).to exist('_data/related_posts.yml')
    end

    it 'is valid YAML' do
      expect(related_posts_data).to be_a(Hash)
    end

    it 'contains post paths as keys' do
      expect(related_posts_data.keys).to all(start_with('_posts/'))
    end

    it 'contains arrays of related post paths as values' do
      related_posts_data.each_value do |related|
        expect(related).to be_an(Array)
        expect(related).to all(start_with('_posts/'))
      end
    end

    it 'excludes archived posts' do
      # Check that archived posts are not in the related posts data
      archived_posts = site.posts.docs.select { |post| post.data['archived'] }
      archived_posts.each do |archived_post|
        expect(related_posts_data).not_to have_key(archived_post.relative_path)
      end
    end
  end

  context 'display in posts' do
    let(:post_with_related) { '_site/2023/08/04/remote-work-communicate-more-with-less/index.html' }

    before(:all) do
      # Ensure site is built
      unless File.exist?('_site')
        require 'jekyll'
        options = { 'source' => Dir.pwd }
        config = Jekyll.configuration(options)
        site = Jekyll::Site.new(config)
        site.process
      end
    end

    it 'displays related posts section when available' do
      expect(File).to exist(post_with_related)
      content = File.read(post_with_related)
      expect(content).to include('If you enjoyed this post, you might also enjoy:')
    end

    it 'shows related post links' do
      content = File.read(post_with_related)
      # The post should have links to related posts
      expect(content).to match(%r{<a href="[^"]+">.*</a>})
    end
  end

  context 'include template' do
    let(:template) { File.read('_includes/related_posts.html') }

    it 'exists' do
      expect(File).to exist('_includes/related_posts.html')
    end

    it 'uses related_posts data' do
      expect(template).to include('site.data.related_posts')
    end

    it 'displays a heading' do
      expect(template).to include('If you enjoyed this post')
    end

    it 'iterates through related posts' do
      expect(template).to include('{% for')
    end
  end
end
