# frozen_string_literal: true
RSpec.describe 'front matter' do
  context 'pages' do
    pages_to_check.each do |page|
      context "the #{File.join(page.dir, page.name)} page" do
        required_front_matter['pages'].each do |field|
          it "has a #{field}" do
            msg = "Keys: #{page.data.keys.join(', ')}"
            expect(page.data).to have_key(field), msg
          end
        end
      end if required_front_matter['pages']
    end
  end

  context 'collections' do
    site.collections.each do |label, collection|
      context "the #{label} collection" do
        collection.docs.each do |doc|
          context "the #{doc.relative_path} #{label}" do
            required_front_matter[label].each do |field|
              it "has a #{field}" do
                msg = "Keys: #{doc.data.keys.join(', ')}"
                expect(doc.data).to have_key(field), msg
              end
            end if required_front_matter[label]
          end
        end
      end
    end
  end
end
