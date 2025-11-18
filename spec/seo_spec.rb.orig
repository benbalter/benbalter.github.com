# frozen_string_literal: true

require 'nokogiri'

RSpec.describe 'SEO' do
  let(:doc) { Nokogiri::HTML(page.output) }

  # Helper method to get meta tag content
  def meta_tag_content(doc, name_or_property)
    tag = doc.at_css("meta[name='#{name_or_property}']") ||
          doc.at_css("meta[property='#{name_or_property}']")
    tag&.attr('content')
  end

  # Helper method to check if JSON-LD exists
  def json_ld_data(doc)
    script_tag = doc.at_css('script[type="application/ld+json"]')
    return nil unless script_tag

    JSON.parse(script_tag.content)
  rescue JSON::ParserError
    nil
  end

  context 'pages' do
    pages_to_check.each do |page|
      context "the #{File.join(page.dir, page.name)} page" do
        let(:page) { page }

        it 'has a title tag' do
          title = doc.at_css('title')
          expect(title).not_to be_nil, 'No title tag found'
          expect(title.content).not_to be_empty, 'Title tag is empty'
        end

        it 'has a meta description' do
          description = meta_tag_content(doc, 'description')
          expect(description).not_to be_nil, 'No meta description found'
          expect(description).not_to be_empty, 'Meta description is empty'
        end

        it 'has a meta description with appropriate length' do
          description = meta_tag_content(doc, 'description')
          next unless description

          expect(description.length).to be >= 50, "Meta description is too short (#{description.length} chars)"
          expect(description.length).to be <= 500, "Meta description is excessively long (#{description.length} chars)"
        end

        it 'has a canonical URL' do
          canonical = doc.at_css('link[rel="canonical"]')
          expect(canonical).not_to be_nil, 'No canonical URL found'
          expect(canonical.attr('href')).not_to be_empty, 'Canonical URL is empty'
        end

        it 'has Open Graph title' do
          og_title = meta_tag_content(doc, 'og:title')
          expect(og_title).not_to be_nil, 'No og:title found'
          expect(og_title).not_to be_empty, 'og:title is empty'
        end

        it 'has Open Graph description' do
          og_description = meta_tag_content(doc, 'og:description')
          expect(og_description).not_to be_nil, 'No og:description found'
          expect(og_description).not_to be_empty, 'og:description is empty'
        end

        it 'has Open Graph URL' do
          og_url = meta_tag_content(doc, 'og:url')
          expect(og_url).not_to be_nil, 'No og:url found'
          expect(og_url).not_to be_empty, 'og:url is empty'
        end

        it 'has Open Graph site name' do
          og_site_name = meta_tag_content(doc, 'og:site_name')
          expect(og_site_name).not_to be_nil, 'No og:site_name found'
          expect(og_site_name).not_to be_empty, 'og:site_name is empty'
        end

        it 'has Open Graph type' do
          og_type = meta_tag_content(doc, 'og:type')
          expect(og_type).not_to be_nil, 'No og:type found'
          expect(og_type).not_to be_empty, 'og:type is empty'
        end

        it 'has Twitter card type' do
          twitter_card = meta_tag_content(doc, 'twitter:card')
          expect(twitter_card).not_to be_nil, 'No twitter:card found'
          expect(twitter_card).not_to be_empty, 'twitter:card is empty'
        end

        it 'has Twitter title' do
          twitter_title = meta_tag_content(doc, 'twitter:title')
          expect(twitter_title).not_to be_nil, 'No twitter:title found'
          expect(twitter_title).not_to be_empty, 'twitter:title is empty'
        end

        it 'has Twitter site' do
          twitter_site = meta_tag_content(doc, 'twitter:site')
          expect(twitter_site).not_to be_nil, 'No twitter:site found'
          expect(twitter_site).not_to be_empty, 'twitter:site is empty'
        end

        it 'has Twitter creator' do
          twitter_creator = meta_tag_content(doc, 'twitter:creator')
          expect(twitter_creator).not_to be_nil, 'No twitter:creator found'
          expect(twitter_creator).not_to be_empty, 'twitter:creator is empty'
        end

        it 'has JSON-LD structured data' do
          json_ld = json_ld_data(doc)
          expect(json_ld).not_to be_nil, 'No JSON-LD structured data found'
          expect(json_ld['@context']).to eq('https://schema.org')
          expect(json_ld['@type']).not_to be_empty
        end
      end
    end
  end

  context 'blog posts' do
    site.posts.docs.each do |post|
      # Skip redirect posts as they use a minimal redirect layout
      next if post.data['redirect_to']

      context "the #{post.relative_path} post" do
        let(:page) { post }

        it 'has a title tag' do
          title = doc.at_css('title')
          expect(title).not_to be_nil, 'No title tag found'
          expect(title.content).not_to be_empty, 'Title tag is empty'
        end

        it 'has a meta description' do
          description = meta_tag_content(doc, 'description')
          expect(description).not_to be_nil, 'No meta description found'
          expect(description).not_to be_empty, 'Meta description is empty'
        end

        it 'has a meta description with appropriate length' do
          description = meta_tag_content(doc, 'description')
          next unless description

          expect(description.length).to be >= 50, "Meta description is too short (#{description.length} chars)"
          expect(description.length).to be <= 500, "Meta description is excessively long (#{description.length} chars)"
        end

        it 'has a canonical URL' do
          canonical = doc.at_css('link[rel="canonical"]')
          expect(canonical).not_to be_nil, 'No canonical URL found'
          expect(canonical.attr('href')).not_to be_empty, 'Canonical URL is empty'
        end

        it 'has Open Graph title' do
          og_title = meta_tag_content(doc, 'og:title')
          expect(og_title).not_to be_nil, 'No og:title found'
          expect(og_title).not_to be_empty, 'og:title is empty'
        end

        it 'has Open Graph description' do
          og_description = meta_tag_content(doc, 'og:description')
          expect(og_description).not_to be_nil, 'No og:description found'
          expect(og_description).not_to be_empty, 'og:description is empty'
        end

        it 'has Open Graph URL' do
          og_url = meta_tag_content(doc, 'og:url')
          expect(og_url).not_to be_nil, 'No og:url found'
          expect(og_url).not_to be_empty, 'og:url is empty'
        end

        it 'has Open Graph site name' do
          og_site_name = meta_tag_content(doc, 'og:site_name')
          expect(og_site_name).not_to be_nil, 'No og:site_name found'
          expect(og_site_name).not_to be_empty, 'og:site_name is empty'
        end

        it 'has Open Graph type set to article' do
          og_type = meta_tag_content(doc, 'og:type')
          expect(og_type).to eq('article'), "Expected og:type to be 'article', got '#{og_type}'"
        end

        it 'has Open Graph image' do
          og_image = meta_tag_content(doc, 'og:image')
          expect(og_image).not_to be_nil, 'No og:image found'
          expect(og_image).not_to be_empty, 'og:image is empty'
        end

        it 'has article published time' do
          published_time = meta_tag_content(doc, 'article:published_time')
          expect(published_time).not_to be_nil, 'No article:published_time found'
          expect(published_time).not_to be_empty, 'article:published_time is empty'
        end

        it 'has Twitter card type' do
          twitter_card = meta_tag_content(doc, 'twitter:card')
          expect(twitter_card).not_to be_nil, 'No twitter:card found'
          expect(twitter_card).not_to be_empty, 'twitter:card is empty'
        end

        it 'has Twitter image' do
          twitter_image = meta_tag_content(doc, 'twitter:image')
          expect(twitter_image).not_to be_nil, 'No twitter:image found'
          expect(twitter_image).not_to be_empty, 'twitter:image is empty'
        end

        it 'has Twitter title' do
          twitter_title = meta_tag_content(doc, 'twitter:title')
          expect(twitter_title).not_to be_nil, 'No twitter:title found'
          expect(twitter_title).not_to be_empty, 'twitter:title is empty'
        end

        it 'has Twitter site' do
          twitter_site = meta_tag_content(doc, 'twitter:site')
          expect(twitter_site).not_to be_nil, 'No twitter:site found'
          expect(twitter_site).not_to be_empty, 'twitter:site is empty'
        end

        it 'has Twitter creator' do
          twitter_creator = meta_tag_content(doc, 'twitter:creator')
          expect(twitter_creator).not_to be_nil, 'No twitter:creator found'
          expect(twitter_creator).not_to be_empty, 'twitter:creator is empty'
        end

        it 'has JSON-LD structured data' do
          json_ld = json_ld_data(doc)
          expect(json_ld).not_to be_nil, 'No JSON-LD structured data found'
          expect(json_ld['@context']).to eq('https://schema.org')
          expect(json_ld['@type']).to eq('BlogPosting')
        end

        it 'has JSON-LD with headline' do
          json_ld = json_ld_data(doc)
          next unless json_ld

          expect(json_ld['headline']).not_to be_empty, 'JSON-LD headline is empty'
        end

        it 'has JSON-LD with description' do
          json_ld = json_ld_data(doc)
          next unless json_ld

          expect(json_ld['description']).not_to be_empty, 'JSON-LD description is empty'
        end

        it 'has JSON-LD with author' do
          json_ld = json_ld_data(doc)
          next unless json_ld

          expect(json_ld['author']).not_to be_nil, 'JSON-LD author is missing'
          expect(json_ld['author']['@type']).to eq('Person')
        end

        it 'has JSON-LD with datePublished' do
          json_ld = json_ld_data(doc)
          next unless json_ld

          expect(json_ld['datePublished']).not_to be_empty, 'JSON-LD datePublished is empty'
        end
      end
    end
  end
end
