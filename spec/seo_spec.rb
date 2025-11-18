# frozen_string_literal: true

require 'nokogiri'

RSpec.describe 'SEO' do
  def parse_html(page_or_doc)
    output = page_or_doc.output
    Nokogiri::HTML(output)
  end

  def meta_content(doc, selector)
    node = doc.at_css(selector)
    node['content'] if node
  end

  def meta_property(doc, property)
    meta_content(doc, "meta[property='#{property}']")
  end

  def meta_name(doc, name)
    meta_content(doc, "meta[name='#{name}']")
  end

  def site_url
    config['url']
  end

  context 'pages' do
    pages_to_check.each do |page|
      context "the #{File.join(page.dir, page.name)} page" do
        let(:doc) { parse_html(page) }

        it 'has a canonical URL' do
          canonical = doc.at_css("link[rel='canonical']")
          expect(canonical).not_to be_nil
          expect(canonical['href']).to start_with(site_url)
        end

        it 'has a meta description' do
          description = meta_name(doc, 'description')
          expect(description).not_to be_nil
          expect(description).not_to be_empty
        end

        it 'has Open Graph title' do
          og_title = meta_property(doc, 'og:title')
          expect(og_title).not_to be_nil
          expect(og_title).not_to be_empty
        end

        it 'has Open Graph description' do
          og_description = meta_property(doc, 'og:description')
          expect(og_description).not_to be_nil
          expect(og_description).not_to be_empty
        end

        it 'has Open Graph URL' do
          og_url = meta_property(doc, 'og:url')
          expect(og_url).not_to be_nil
          expect(og_url).to start_with(site_url)
        end

        it 'has Open Graph type' do
          og_type = meta_property(doc, 'og:type')
          expect(og_type).not_to be_nil
          expect(og_type).not_to be_empty
        end

        it 'has Open Graph site name' do
          og_site_name = meta_property(doc, 'og:site_name')
          expect(og_site_name).not_to be_nil
          expect(og_site_name).not_to be_empty
        end

        it 'has Twitter card type' do
          twitter_card = meta_name(doc, 'twitter:card')
          expect(twitter_card).not_to be_nil
          expect(twitter_card).to match(/^(summary|summary_large_image)$/)
        end

        it 'has Twitter title' do
          twitter_title = meta_property(doc, 'twitter:title')
          expect(twitter_title).not_to be_nil
          expect(twitter_title).not_to be_empty
        end

        it 'has Twitter site' do
          twitter_site = meta_name(doc, 'twitter:site')
          expect(twitter_site).not_to be_nil
          expect(twitter_site).to eq('@benbalter')
        end

        it 'has Twitter creator' do
          twitter_creator = meta_name(doc, 'twitter:creator')
          expect(twitter_creator).not_to be_nil
          expect(twitter_creator).not_to be_empty
        end
      end
    end
  end

  context 'blog posts' do
    site.posts.docs.each do |post|
      context "the #{post.relative_path} post" do
        let(:doc) { parse_html(post) }

        it 'has a canonical URL' do
          canonical = doc.at_css("link[rel='canonical']")
          expect(canonical).not_to be_nil
          expect(canonical['href']).to start_with(site_url)
        end

        it 'has a meta description' do
          description = meta_name(doc, 'description')
          expect(description).not_to be_nil
          expect(description).not_to be_empty
        end

        it 'has Open Graph title' do
          og_title = meta_property(doc, 'og:title')
          expect(og_title).not_to be_nil
          expect(og_title).not_to be_empty
        end

        it 'has Open Graph description' do
          og_description = meta_property(doc, 'og:description')
          expect(og_description).not_to be_nil
          expect(og_description).not_to be_empty
        end

        it 'has Open Graph URL' do
          og_url = meta_property(doc, 'og:url')
          expect(og_url).not_to be_nil
          expect(og_url).to start_with(site_url)
        end

        it 'has Open Graph type as article' do
          og_type = meta_property(doc, 'og:type')
          expect(og_type).to eq('article')
        end

        it 'has Open Graph site name' do
          og_site_name = meta_property(doc, 'og:site_name')
          expect(og_site_name).not_to be_nil
          expect(og_site_name).not_to be_empty
        end

        it 'has article published time' do
          published_time = meta_property(doc, 'article:published_time')
          expect(published_time).not_to be_nil
          expect(published_time).to match(/^\d{4}-\d{2}-\d{2}/)
        end

        it 'has Twitter card type' do
          twitter_card = meta_name(doc, 'twitter:card')
          expect(twitter_card).not_to be_nil
          expect(twitter_card).to match(/^(summary|summary_large_image)$/)
        end

        it 'has Twitter title' do
          twitter_title = meta_property(doc, 'twitter:title')
          expect(twitter_title).not_to be_nil
          expect(twitter_title).not_to be_empty
        end

        it 'has Twitter site' do
          twitter_site = meta_name(doc, 'twitter:site')
          expect(twitter_site).not_to be_nil
          expect(twitter_site).to eq('@benbalter')
        end

        it 'has Twitter creator' do
          twitter_creator = meta_name(doc, 'twitter:creator')
          expect(twitter_creator).not_to be_nil
          expect(twitter_creator).not_to be_empty
        end
      end
    end
  end
end
