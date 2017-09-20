# frozen_string_literal: true

class AmazonLinkCheck < HTMLProofer::Check
  def affiliate_id
    @affiliate_id ||= YAML.load_file('_config.yml')['amazon']['affiliates_tag']
  end

  def uri
    URI.parse(@link.href)
  end

  def params
    CGI.parse(uri.query) if uri.query
  end

  def amazon_link?
    uri.host =~ /amazon\.com/
  end

  def afiiliate_id?
    return false unless params&.key?('tag')
    params['tag'].first == affiliate_id
  end

  def run
    @html.css('a').each do |node|
      @link = create_element(node)
      next if @link.data_proofer_ignore || @link.href.nil?

      if amazon_link? && !afiiliate_id?
        msg = "Misssing Amazon Affiliate ID: #{@link.href}"
        add_issue(msg, line: node.line)
      end
    end
  end
end
