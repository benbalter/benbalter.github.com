# frozen_string_literal: true

RSpec.describe 'SEO' do
  context 'all pages' do
    pages_to_check.each do |page|
      # Skip 404 page as it has different output structure
      next if page.name == '404.md'

      context "the #{File.join(page.dir, page.name)} page" do
        let(:file) do
          # Pages are output to directories with index.html
          File.join('_site', page.url, 'index.html')
        end
        let(:content) { File.read(file) }
        let(:doc) { Nokogiri::HTML(content) }

        it 'has a title tag' do
          title = doc.css('title').first
          expect(title).not_to be_nil, 'No title tag found'
          expect(title.text).not_to be_empty, 'Title tag is empty'
        end

        it 'has a title tag with reasonable length' do
          title = doc.css('title').first
          expect(title.text.length).to be <= 70, "Title is #{title.text.length} chars (recommended max 70)"
        end

        it 'has a meta description' do
          desc = doc.css('meta[name="description"]').first
          expect(desc).not_to be_nil, 'No meta description found'
          expect(desc['content']).not_to be_empty, 'Meta description content is empty'
        end

        it 'has a meta description with reasonable length' do
          desc = doc.css('meta[name="description"]').first
          next unless desc

          length = desc['content'].length
          # Soft recommendation for length (not a hard failure)
          # SEO best practice is 50-160 chars, but allow flexibility
          warn "Warning: Description is #{length} chars for #{page.name} (recommended 50-160)" if length < 50 || length > 160
          # Hard limit: at least 30 chars and max 500 chars
          expect(length).to be >= 30, "Description is #{length} chars (minimum 30)"
          expect(length).to be <= 500, "Description is #{length} chars (maximum 500)"
        end

        it 'has a canonical URL' do
          canonical = doc.css('link[rel="canonical"]').first
          expect(canonical).not_to be_nil, 'No canonical link found'
          expect(canonical['href']).not_to be_empty, 'Canonical href is empty'
        end

        it 'has Open Graph title' do
          og_title = doc.css('meta[property="og:title"]').first
          expect(og_title).not_to be_nil, 'No og:title found'
          expect(og_title['content']).not_to be_empty, 'og:title content is empty'
        end

        it 'has Open Graph description' do
          og_desc = doc.css('meta[property="og:description"]').first
          expect(og_desc).not_to be_nil, 'No og:description found'
          expect(og_desc['content']).not_to be_empty, 'og:description content is empty'
        end

        it 'has Open Graph URL' do
          og_url = doc.css('meta[property="og:url"]').first
          expect(og_url).not_to be_nil, 'No og:url found'
          expect(og_url['content']).not_to be_empty, 'og:url content is empty'
        end

        it 'has Open Graph type' do
          og_type = doc.css('meta[property="og:type"]').first
          expect(og_type).not_to be_nil, 'No og:type found'
          expect(og_type['content']).not_to be_empty, 'og:type content is empty'
        end

        it 'has Open Graph site name' do
          og_site_name = doc.css('meta[property="og:site_name"]').first
          expect(og_site_name).not_to be_nil, 'No og:site_name found'
          expect(og_site_name['content']).not_to be_empty, 'og:site_name content is empty'
        end

        it 'has Twitter card type' do
          twitter_card = doc.css('meta[name="twitter:card"]').first
          expect(twitter_card).not_to be_nil, 'No twitter:card found'
          expect(twitter_card['content']).not_to be_empty, 'twitter:card content is empty'
        end

        it 'has Twitter title' do
          twitter_title = doc.css('meta[property="twitter:title"]').first
          expect(twitter_title).not_to be_nil, 'No twitter:title found'
          expect(twitter_title['content']).not_to be_empty, 'twitter:title content is empty'
        end

        it 'has Twitter site' do
          twitter_site = doc.css('meta[name="twitter:site"]').first
          expect(twitter_site).not_to be_nil, 'No twitter:site found'
          expect(twitter_site['content']).not_to be_empty, 'twitter:site content is empty'
        end

        it 'has Twitter creator' do
          twitter_creator = doc.css('meta[name="twitter:creator"]').first
          expect(twitter_creator).not_to be_nil, 'No twitter:creator found'
          expect(twitter_creator['content']).not_to be_empty, 'twitter:creator content is empty'
        end

        it 'has JSON-LD structured data' do
          json_ld = doc.css('script[type="application/ld+json"]').first
          expect(json_ld).not_to be_nil, 'No JSON-LD script found'
          expect(json_ld.text).not_to be_empty, 'JSON-LD script is empty'
        end

        it 'has valid JSON-LD structured data' do
          json_ld = doc.css('script[type="application/ld+json"]').first
          next unless json_ld

          expect { JSON.parse(json_ld.text) }.not_to raise_error, 'JSON-LD is not valid JSON'
        end

        it 'has HTML lang attribute' do
          html = doc.css('html').first
          expect(html).not_to be_nil, 'No html tag found'
          expect(html['lang']).not_to be_empty, 'HTML lang attribute is empty'
        end

        it 'has author metadata' do
          author = doc.css('meta[name="author"]').first
          expect(author).not_to be_nil, 'No author meta tag found'
          expect(author['content']).not_to be_empty, 'Author content is empty'
        end
      end
    end
  end

  context 'blog posts' do
    site.posts.docs.each do |post|
      # Skip posts that are redirects (they don't have full SEO tags)
      next if post.data['redirect_to']

      context "the #{post.relative_path} post" do
        let(:file) { File.join('_site', post.url, 'index.html') }
        let(:content) { File.read(file) }
        let(:doc) { Nokogiri::HTML(content) }

        it 'has Open Graph type set to article' do
          og_type = doc.css('meta[property="og:type"]').first
          expect(og_type).not_to be_nil, 'No og:type found'
          expect(og_type['content']).to eq('article'), "Expected og:type to be 'article', got '#{og_type['content']}'"
        end

        it 'has article published time' do
          published_time = doc.css('meta[property="article:published_time"]').first
          expect(published_time).not_to be_nil, 'No article:published_time found'
          expect(published_time['content']).not_to be_empty, 'article:published_time content is empty'
        end

        it 'has JSON-LD with BlogPosting type' do
          json_ld = doc.css('script[type="application/ld+json"]').first
          next unless json_ld

          data = JSON.parse(json_ld.text)
          expect(data['@type']).to eq('BlogPosting'), "Expected @type to be 'BlogPosting', got '#{data['@type']}'"
        end

        it 'has JSON-LD with datePublished' do
          json_ld = doc.css('script[type="application/ld+json"]').first
          next unless json_ld

          data = JSON.parse(json_ld.text)
          expect(data).to have_key('datePublished'), 'JSON-LD missing datePublished'
          expect(data['datePublished']).not_to be_empty, 'datePublished is empty'
        end

        it 'has JSON-LD with headline' do
          json_ld = doc.css('script[type="application/ld+json"]').first
          next unless json_ld

          data = JSON.parse(json_ld.text)
          expect(data).to have_key('headline'), 'JSON-LD missing headline'
          expect(data['headline']).not_to be_empty, 'headline is empty'
        end

        context 'when og:image is present' do
          let(:og_image) { doc.css('meta[property="og:image"]').first }

          it 'has valid Open Graph image' do
            next unless og_image

            expect(og_image['content']).not_to be_empty, 'og:image content is empty'
          end

          it 'has Twitter image when og:image is present' do
            next unless og_image

            twitter_image = doc.css('meta[property="twitter:image"]').first
            expect(twitter_image).not_to be_nil, 'No twitter:image found but og:image exists'
            expect(twitter_image['content']).not_to be_empty, 'twitter:image content is empty'
          end

          it 'has JSON-LD image when og:image is present' do
            next unless og_image

            json_ld = doc.css('script[type="application/ld+json"]').first
            next unless json_ld

            data = JSON.parse(json_ld.text)
            expect(data).to have_key('image'), 'JSON-LD missing image'
            expect(data['image']).not_to be_empty, 'image is empty'
          end
        end
      end
    end
  end
end
