require 'json' 

module Jekyll

  class JSONPost < Post
    def initialize( post, site )
        
        #set destination
        path = post.destination( site.config['source'] )
        
        #set extension
        path['/index.html'] = '.json'
        
        #parse content, e.g., markdown
        post.transform
        
        #handle related posts
        related = []
        post.related_posts( site.posts ).each do |rel|
          related.push( {"url" => rel.url, "title" => rel.to_liquid["title"] })
        end
        
        #run through liquid with no layout to proccess liquid tags
        post.do_layout( { "page" => post.to_liquid }, {} )
        
        #write to file
        FileUtils.mkdir_p( File.dirname(path) )
        File.open( path, 'w') do |f|
            f.write( post.to_liquid.deep_merge( { "related_posts" => related } ).to_json )
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