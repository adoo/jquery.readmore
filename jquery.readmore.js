/** 
 * jquery.readmore
 * ===============
 * 
 * ## What is this?
 * jQuery plugin - Show/hide content in a nested DOM structure and add a "Read more" link.
 * 
 * Shorten long html documents to specified length. This script traverses recursively trough the DOM and splits text nodes into smaller *chunks*, using a customizable regexp. Each of these new *chunks* gets wrapped into a <span> which is then hidden. This way the document can be a complex structure and you can still cut text on words, sentences... pretty much anything you can define in a regexp.
 * 
 * # Options:
 * @minheight - Minimum height for the summary.
 * @maxheight - Maximum height of the summary.
 * @hide_me_classname - Classname used internally for identifying elements for hiding.
 * @ignore_children - List of tagnames whose children should be left alone. Specified elements here will still get hidden, their children will not be parsed.
 * @skip_elements - List of tagnames that you do not want hidden.
 * @split_using - Regexp used for splitting textnodes.
 * @readmore_link - jQuery object, link used to expand the summary into full document.
 * 
 * # Usage
 * This example will parse all .article elements and each .article will be shortened under 200px in height with a link saying "Read more". First and second level headings in each article will stay visible. Height will not be exactly 200px since the regexp being used is splitting on larger chunks.
 * 
 * $(".article").readmore({
 *   minheight         :50,
 *   maxheight         :200,
 *   hide_me_classname :'hide-me',
 *   ignore_children   :['a', 'i', 'strong', 'h1', 'h2', 'h3'],
 *   skip_elements     :['h1', 'h2'],
 *   split_using       :/(\.|,|-|–|\?|\!)/g,
 *   readmore_link     :$('<a href="">Read more</a>')
 * });
 * 
 * 
 * @date 9 dec 2012
 * @author Ado B (echo@ado.io)
 * @url https://github.com/adoo/jquery.readmore
 */

(function($){

  $.fn.readmore = function( options ) {  
    var $this;
    var opt = $.extend({
      minheight:          50,
      maxheight:          200,
      hide_me_classname:  'hideme',
      ignore_children:    ['a', 'i', 'strong', 'h1', 'h2', 'h3'],
      skip_elements:      [],
      split_using:        /(\.|,|-|–|\?|\!)/g,
      readmore_link:      $('<a href="" class="read-more">Read more</a>')
      
    }, options);


    // Adds the "read more link"
    function createReadMoreLink($container, $rlink, classname, cb) {
      var $rlclone = $rlink.clone();
      $rlclone.appendTo($container).bind('click', function(e) {
        // Show hidden content
        $rlclone.remove();
        $container.find('.'+classname).filter(':hidden').animate({'opacity' : 'toggle'},600);
        cb();
        e.preventDefault();
        return false;
      });
    }
    
    // Actual hiding of elements    
    function hideElements($container, classname, minheight, maxheight) {
      var chunks = $container.find('.'+classname),
          height = $container.outerHeight(), 
          hidden = false,
          $chunk,
          all_descendants, 
          all_descendants_hidden;
          
      for(var i = chunks.length; i--;) {
        $chunk = $(chunks[i]);
        all_descendants = $chunk.find('*').length;
        all_descendants_hidden = all_descendants != 0 && $chunk.find(':hidden').length == all_descendants;
        if(height > minheight && (height > maxheight || height == 0 || all_descendants_hidden)) {
          $chunk.hide();
          height = $container.outerHeight();          
          hidden = true;
        } else {
          break;
        }
      }
      return hidden;
    }
    
    // Element filter
    function skipElement(index, node) {
      var $n = $(node),
          tag = $n.prop('tagName') || '';
      var has_important_children = $n.children(opt.skip_elements.join(',')).length > 0;
      var is_important = $.inArray(tag.toLowerCase(), opt.skip_elements) > -1;
      return  !(is_important || has_important_children);
    }

    // Element filter    
    function skipElementByParents(index, node) {
      var $n = $(node),
          has_important_parent = false,
          tname,
          children_to_ignore = opt.ignore_children.join();
          
      $n.parentsUntil($this).each(function() {
        tname = $(this).prop('tagName') || '';
        if(children_to_ignore.indexOf(tname.toLowerCase()) > -1) {
          has_important_parent = true;
        }
      });
      return !has_important_parent;
    }
    
    // Mark elements with a class for easier hiding.
    function markForHiding($root, classname, ignore_children) {
      var txt, 
          $item, 
          all = $root.find("*"), 
          tagname, 
          istext, 
          isempty, 
          isofflimits, 
          marked = false;
          
      if(opt.skip_elements.length > 0) {
        all = all.filter(skipElement);
      }
      if(opt.ignore_children.length > 0) {
        all = all.filter(skipElementByParents);
      }      
      all.addClass(classname);
      all.contents().each(function(){
        $item = $(this);
        istext = this.nodeType === 3;
        isempty = $.trim($item.text()) == '';
        tagname = $item.parent().prop('tagName') || '';
        isofflimits = $.inArray(tagname.toLowerCase(), ignore_children) > -1;
        if(istext && !isempty && !isofflimits) {
          txt = '<span class="'+classname+'">' + $item  .text().replace(opt.split_using, '$1</span><span class="'+classname+'">') + '</span>';
          txt = txt.replace('<span class="'+classname+'"></span>', '');      
          $item.replaceWith($(txt));
          marked = true;
        }   
      });
      return marked;
    }
    
    return this.each(function() {
      var marked = false,
          didhide = false,
          $this = $(this); 
      if(marked === false){
        marked = markForHiding($this, opt.hide_me_classname, opt.ignore_children);
      }
      
      if(didhide === false && marked === true){
        didhide = hideElements($this, opt.hide_me_classname, opt.minheight, opt.maxheight);
      }  
      
      if(didhide === true && marked === true){
        createReadMoreLink($this, opt.readmore_link, opt.hide_me_classname, function() {
          didhide = false;
        });
      }          
      
    });

  };
})(jQuery);