require 'json' 

module Jekyll

  class JSONPost < Post
  
    def initialize( post, site )
        
        #404 pages, css, etc. err out, skip
        return unless isJSONable(post)
        
        #set destination
        path = post.destination( site.config['source'] )
        path['/index.html'] = '.json'
        
        #parse content, e.g., markdown
        post.transform
        
        #run through liquid with no layout to proccess liquid tags
        post.do_layout( { "page" => post.to_liquid }, {} )
        
        #calculate related posts
        post = post.to_liquid.deep_merge( { "related_posts" => related(post, site.posts) } )
        
        #rather than passing the entire next/previous post, just pass the id
        post["next"] = post["next"].id if post["next"]        
        post["previous"] = post["previous"].id if post["previous"] 
        
        #write to file
        FileUtils.mkdir_p( File.dirname(path) )
        File.open( path, 'w') do |f|
            f.write( post.to_json )
        end
        
    end
    
    def related(post, posts)
    
      related = []
      
      return related unless post.instance_of? Post
      
      post.related_posts( posts ).each do |rel|
        related.push( {"url" => rel.url, "title" => rel.to_liquid["title"] })
      end
      
      related
    
    end
    
    def isJSONable(post)
      return true if post.instance_of? Post
      return true if /index\.html$/.match( post.destination('') )
      false
    end
    
  end

  class JSONPostGenerator < Generator
    safe true
    
    def generate(site)
        
        site.posts.each do |post|
          JSONPost.new( post, site )
        end

        site.pages.each do |post|
          JSONPost.new( post, site )
        end

    end
  end

end