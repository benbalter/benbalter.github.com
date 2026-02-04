# frozen_string_literal: true

module GitHubPages
  module HealthCheck
    module Errors
      class WildcardRecordError < GitHubPages::HealthCheck::Error
        DOCUMENTATION_PATH = "/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages/"

        attr_reader :parent_domain

        def initialize(repository: nil, domain: nil, parent_domain: nil)
          super(:repository => repository, :domain => domain)
          @parent_domain = parent_domain
        end

        def message
          <<-MSG
            The DNS record for your domain appears to be *.#{parent_domain}, a wildcard record.
            Your GitHub Pages site will still work, but unless you verify ownership of #{parent_domain},
            any GitHub Pages user can serve their content from an arbitrary subdomain of it.
          MSG
        end
      end
    end
  end
end
