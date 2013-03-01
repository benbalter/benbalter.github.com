require 'json' 

module Jekyll

  class JSONPostGenerator < Generator
    safe true
    
    def generate(site)
        
      site.posts.each do |post|
        render_json(post,site)    
      end
      
      site.pages.each do |page|
        render_json(page,site)    
      end
      
    end
  
    def render_json(post, site)

      #add `json: false` to YAML to prevent JSONification
      if post.data.has_key? "json" and !post.data["json"]
        return
      end

      path = post.destination( site.source )
      
      #only act on post/pages index in /index.html
      return if /\/index\.html$/.match(path).nil?
      
      #change file path
      path['/index.html'] = '.json'
                
      #render post using no template(s)
      post.render( {}, site.site_payload)
      
      #prepare output for JSON
      post.data["related_posts"] = related_posts(post,site)
      output = post.to_liquid
      output["next"] = output["next"].id unless output["next"].nil?
      output["previous"] = output["previous"].id unless output["previous"].nil?

      #write
      #todo, figure out how to overwrite post.destination so we can just use post.write
      FileUtils.mkdir_p(File.dirname(path))
      File.open(path, 'w') do |f|
        f.write(output.to_json)
      end
      
    end
    
    def related_posts(post, site)
    
      related = []
      return related unless post.instance_of?(Post)
      
      post.related_posts(site.posts).each do |post|
        related.push :url => post.url, :id => post.id, :title => post.to_liquid["title"]
      end
      
      related
      
    end
    
  end

end