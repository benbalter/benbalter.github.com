# frozen_string_literal: true

class AmazonLinkCheck < HTMLProofer::Check
  def affiliate_id
    @affiliate_id ||= YAML.load_file('_config.yml')['amazon']['affiliates_tag']
  end

  def uri
    @uri ||= URI.parse(@link.href)
  end

  def params
    @params ||= CGI.parse(uri.query) if uri.query
  end

  def amazon_link?
    uri.host =~ /amazon\.com/
  end

  def affiliate_id?
    return false unless params&.key?('tag')

    params['tag'].first == affiliate_id
  end

  def run
    @html.css('a').each do |node|
      @link = create_element(node)
      @uri = nil # Reset memoized URI for new link
      @params = nil # Reset memoized params for new link
      next if @link.data_proofer_ignore || @link.href.nil?

      if amazon_link? && !affiliate_id?
        msg = "Missing Amazon Affiliate ID: #{@link.href}"
        add_issue(msg, line: node.line)
      end
    end
  end
end
