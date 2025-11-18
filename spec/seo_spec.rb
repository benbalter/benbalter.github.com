# frozen_string_literal: true

RSpec.describe 'SEO' do
  context 'pages' do
    pages_to_check.each do |page|
      context "the #{File.join(page.dir, page.name)} page" do
        let(:output) { page.output }
        let(:doc) { Nokogiri::HTML(output) }

        it 'has a title tag' do
          title = doc.css('title').first
          expect(title).not_to be_nil
          expect(title.text).not_to be_empty
        end

        it 'has a meta description' do
          description = doc.css('meta[name="description"]').first
          expect(description).not_to be_nil
          expect(description['content']).not_to be_empty
        end

        it 'has Open Graph title' do
          og_title = doc.css('meta[property="og:title"]').first
          expect(og_title).not_to be_nil
          expect(og_title['content']).not_to be_empty
        end

        it 'has Open Graph description' do
          og_description = doc.css('meta[property="og:description"]').first
          expect(og_description).not_to be_nil
          expect(og_description['content']).not_to be_empty
        end

        it 'has Open Graph URL' do
          og_url = doc.css('meta[property="og:url"]').first
          expect(og_url).not_to be_nil
          expect(og_url['content']).not_to be_empty
          expect(og_url['content']).to match(/^https?:\/\//)
        end

        it 'has Open Graph site name' do
          og_site_name = doc.css('meta[property="og:site_name"]').first
          expect(og_site_name).not_to be_nil
          expect(og_site_name['content']).not_to be_empty
        end

        it 'has Open Graph type' do
          og_type = doc.css('meta[property="og:type"]').first
          expect(og_type).not_to be_nil
          expect(og_type['content']).to match(/^(website|article)$/)
        end

        it 'has canonical URL' do
          canonical = doc.css('link[rel="canonical"]').first
          expect(canonical).not_to be_nil
          expect(canonical['href']).not_to be_empty
          expect(canonical['href']).to match(/^https?:\/\//)
        end

        it 'has Twitter card type' do
          twitter_card = doc.css('meta[name="twitter:card"]').first
          expect(twitter_card).not_to be_nil
          expect(twitter_card['content']).to match(/^(summary|summary_large_image)$/)
        end

        it 'has consistent title across meta tags' do
          title = doc.css('title').first&.text
          og_title = doc.css('meta[property="og:title"]').first&.[]('content')
          twitter_title = doc.css('meta[property="twitter:title"]').first&.[]('content')

          expect(title).not_to be_nil
          expect(og_title).not_to be_nil

          # Twitter title might not always be present, but if it is, it should match
          if twitter_title
            expect(twitter_title).to eq(og_title)
          end
        end

        it 'has consistent description across meta tags' do
          meta_description = doc.css('meta[name="description"]').first&.[]('content')
          og_description = doc.css('meta[property="og:description"]').first&.[]('content')

          expect(meta_description).not_to be_nil
          expect(og_description).not_to be_nil
          expect(meta_description).to eq(og_description)
        end

        it 'has consistent URL in canonical and og:url' do
          canonical = doc.css('link[rel="canonical"]').first&.[]('href')
          og_url = doc.css('meta[property="og:url"]').first&.[]('content')

          expect(canonical).not_to be_nil
          expect(og_url).not_to be_nil
          expect(canonical).to eq(og_url)
        end
      end
    end
  end

  context 'blog posts' do
    site.posts.docs.reject { |post| post.data['redirect_to'] }.each do |post|
      context "the #{post.relative_path} post" do
        let(:output) { post.output }
        let(:doc) { Nokogiri::HTML(output) }

        it 'has a title tag' do
          title = doc.css('title').first
          expect(title).not_to be_nil
          expect(title.text).not_to be_empty
        end

        it 'has a meta description' do
          description = doc.css('meta[name="description"]').first
          expect(description).not_to be_nil
          expect(description['content']).not_to be_empty
        end

        it 'has Open Graph type set to article' do
          og_type = doc.css('meta[property="og:type"]').first
          expect(og_type).not_to be_nil
          expect(og_type['content']).to eq('article')
        end

        it 'has article published time' do
          published_time = doc.css('meta[property="article:published_time"]').first
          expect(published_time).not_to be_nil
          expect(published_time['content']).not_to be_empty
          expect(published_time['content']).to match(/^\d{4}-\d{2}-\d{2}/)
        end

        it 'has structured data (JSON-LD)' do
          json_ld = doc.css('script[type="application/ld+json"]').first
          expect(json_ld).not_to be_nil
          
          json_data = JSON.parse(json_ld.text)
          expect(json_data['@context']).to eq('https://schema.org')
          expect(json_data['@type']).to eq('BlogPosting')
          expect(json_data['headline']).not_to be_empty
          expect(json_data['description']).not_to be_empty
          expect(json_data['author']).to be_a(Hash)
          expect(json_data['author']['@type']).to eq('Person')
          expect(json_data['datePublished']).not_to be_empty
        end

        it 'has Twitter card metadata' do
          twitter_card = doc.css('meta[name="twitter:card"]').first
          twitter_site = doc.css('meta[name="twitter:site"]').first
          twitter_creator = doc.css('meta[name="twitter:creator"]').first

          expect(twitter_card).not_to be_nil
          expect(twitter_card['content']).to match(/^(summary|summary_large_image)$/)
          expect(twitter_site).not_to be_nil
          expect(twitter_site['content']).to eq('@benbalter')
          expect(twitter_creator).not_to be_nil
          expect(twitter_creator['content']).to eq('@benbalter')
        end

        it 'has Twitter card with large image if post has an image' do
          if post.data['image']
            twitter_card = doc.css('meta[name="twitter:card"]').first
            expect(twitter_card['content']).to eq('summary_large_image')
            
            twitter_image = doc.css('meta[property="twitter:image"]').first
            expect(twitter_image).not_to be_nil
            expect(twitter_image['content']).not_to be_empty
            
            og_image = doc.css('meta[property="og:image"]').first
            expect(og_image).not_to be_nil
            expect(og_image['content']).not_to be_empty
          end
        end

        it 'has author information' do
          author = doc.css('meta[name="author"]').first
          expect(author).not_to be_nil
          expect(author['content']).to eq('Ben Balter')
        end
      end
    end
  end
end
