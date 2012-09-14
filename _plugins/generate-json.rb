require 'json' 

module Jekyll

  class JSONPost < Post
    def initialize( post, site )
        path = post.destination( site.config['source'] )
        path['/index.html'] = '.json'
        post.transform
        FileUtils.mkdir_p( File.dirname(path) )
        File.open( path, 'w') do |f|
            f.write( post.to_liquid.to_json )
        end
    end
  end

  class JSONPostGenerator < Generator
    safe true
    
    def generate(site)
        
        site.posts.each do |post|
          JSONPost.new( post, site )
        end

    end
  end

end