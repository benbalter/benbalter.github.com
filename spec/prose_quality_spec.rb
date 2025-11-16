# frozen_string_literal: true

RSpec.describe 'prose quality' do
  context 'blog posts' do
    # Get all markdown files in _posts directory
    Dir.glob(File.join(File.expand_path('..', File.dirname(__FILE__)), '_posts', '*.md')).each do |file_path|
      relative_path = file_path.split('/_posts/').last

      context relative_path do
        let(:content) do
          raw_content = File.read(file_path)
          # Remove YAML front matter
          raw_content.gsub(/\A---\s*\n.*?\n---\s*\n/m, '')
        end

        it 'does not have multiple consecutive blank lines' do
          expect(content).not_to match(/\n{3,}/)
        end

        it 'does not have trailing whitespace' do
          lines_with_trailing_space = content.lines.grep(/[ \t]+\n?$/)
          expect(lines_with_trailing_space).to be_empty,
                                               "Found #{lines_with_trailing_space.count} lines with trailing whitespace"
        end

        it 'does not have doubled spaces in prose' do
          # Allow double spaces in code blocks (indented with 4 spaces or in fenced blocks)
          in_code_block = false
          lines_with_doubled_spaces = []

          content.lines.each_with_index do |line, idx|
            # Skip code fence markers themselves (may have leading whitespace)
            if line.match?(/^\s*```/)
              in_code_block = !in_code_block
              next
            end

            # Skip code blocks (fenced or indented), markdown tables, list items, and images with attributes
            next if in_code_block || line.start_with?('    ') || line.include?('|') || line.match?(/^\s*[\d*\-+]\.?\s/) || line.match?(/!\[.*\]\(.*\)\{/)

            # Check for double spaces (but allow after sentence-ending punctuation)
            lines_with_doubled_spaces << "Line #{idx + 1}: #{line.strip[0..80]}" if line.match?(/[^.?!]\s{2,}/) || line.match?(/\.\s{3,}/)
          end

          expect(lines_with_doubled_spaces).to be_empty,
                                               "Found doubled spaces:\n#{lines_with_doubled_spaces.join("\n")}"
        end

        it 'uses consistent heading capitalization' do
          headings = content.scan(/^#+\s+(.+)$/).flatten
          skip 'No headings to check' if headings.empty?

          # Check that headings don't end with periods (common style error)
          headings_with_periods = headings.select { |h| h.end_with?('.') }
          expect(headings_with_periods).to be_empty,
                                           "Headings should not end with periods: #{headings_with_periods.join(', ')}"
        end

        it 'does not have broken internal links' do
          site_path = File.expand_path('..', File.dirname(__FILE__))
          # Match markdown links that start with / (internal links)
          # Skip links with data-proofer-ignore attribute
          internal_links = []
          content.lines.each do |line|
            next if line.include?('data-proofer-ignore')

            # rubocop:disable Style/HashEachMethods
            line.scan(%r{\[([^\]]+)\]\((/[^)]+)\)}).each do |_text, url|
              # rubocop:enable Style/HashEachMethods
              # Skip generated files
              next if url.start_with?('/sitemap.xml')

              internal_links << url
            end
          end
          skip 'No internal links to check' if internal_links.empty?

          broken_links = internal_links.reject do |link|
            # Remove anchor
            path = link.split('#').first
            # Remove trailing slash
            path = path.sub(%r{/$}, '')

            # Convert Jekyll date-based permalink to filename
            # E.g., /2020/08/25/post-title -> _posts/2020-08-25-post-title.md
            if path.match?(%r{^/\d{4}/\d{2}/\d{2}/})
              date_and_slug = path.sub(%r{^/}, '').tr('/', '-')
              post_file = File.join(site_path, '_posts', "#{date_and_slug}.md")
              File.exist?(post_file)
            else
              # For non-post pages, check if file exists
              full_path = File.join(site_path, path.sub(%r{^/}, ''))
              File.exist?(full_path) || File.exist?("#{full_path}.md") || File.exist?("#{full_path}.html")
            end
          end

          expect(broken_links).to be_empty,
                                  "Found broken internal links: #{broken_links.join(', ')}"
        end
      end
    end
  end
end
