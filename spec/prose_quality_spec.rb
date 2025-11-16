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
          lines_with_trailing_space = content.lines.select { |line| line.match?(/\s+$/) && line != "\n" }
          expect(lines_with_trailing_space).to be_empty,
                                               "Found #{lines_with_trailing_space.count} lines with trailing whitespace"
        end

        it 'does not have doubled spaces in prose' do
          # Allow double spaces in code blocks (indented with 4 spaces or in fenced blocks)
          in_code_block = false
          lines_with_doubled_spaces = []

          content.lines.each_with_index do |line, idx|
            # Track code fence blocks
            in_code_block = !in_code_block if line.match?(/^```/)

            # Skip code blocks (fenced or indented)
            next if in_code_block || line.start_with?('    ')

            # Check for double spaces (but allow after sentence-ending punctuation)
            lines_with_doubled_spaces << "Line #{idx + 1}: #{line.strip[0..80]}" if line.match?(/[^.?!]\s{2,}/) || line.match?(/\.\s{3,}/)
          end

          expect(lines_with_doubled_spaces).to be_empty,
                                               "Found doubled spaces:\n#{lines_with_doubled_spaces.join("\n")}"
        end

        it 'uses consistent heading capitalization' do
          headings = content.scan(/^#+\s+(.+)$/).flatten
          next if headings.empty?

          # Check that headings don't end with periods (common style error)
          headings_with_periods = headings.select { |h| h.end_with?('.') }
          expect(headings_with_periods).to be_empty,
                                           "Headings should not end with periods: #{headings_with_periods.join(', ')}"
        end

        it 'does not have broken internal links' do
          site_path = File.expand_path('..', File.dirname(__FILE__))
          # Match markdown links that start with / (internal links)
          internal_links = content.scan(%r{\[([^\]]+)\]\((/[^)]+)\)}).map { |_text, url| url }
          next if internal_links.empty?

          broken_links = internal_links.reject do |link|
            # Remove anchor
            path = link.split('#').first
            # Check if file exists
            full_path = File.join(site_path, path.sub(%r{^/}, ''))
            File.exist?(full_path) || File.exist?("#{full_path}.md")
          end

          expect(broken_links).to be_empty,
                                  "Found broken internal links: #{broken_links.join(', ')}"
        end
      end
    end
  end
end
