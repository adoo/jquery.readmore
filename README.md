jquery.readmore
===============

## What is this?
jQuery plugin - Show/hide content in a nested DOM structure and add a "Read more" link.

Shorten long html documents to specified length. This script traverses recursively trough the DOM and splits text nodes into smaller *chunks*, using a customizable regexp. Each of these new *chunks* gets wrapped into a <span> which is then hidden. This way the document can be a complex structure and you can still cut text on words, sentences... pretty much anything you can define in a regexp.

## Options
* **minheight** - Minimum height for the summary: ```50```
* **maxheight** - Maximum height of the summary: ```200```
* **hide_me_classname** - Classname used internally for identifying elements for hiding: ```"hide-me"```
* **ignore_children** - List of tagnames whose children should be left alone. Specified elements here will still get hidden, their children will not be parsed: ```['a', 'i', 'strong', 'h1', 'h2', 'h3']```
* **skip_elements** - List of tagnames that you do not want hidden: ```['h1', 'h2']```
* **split_using** - Regexp used for splitting textnodes: ```/(\.|,|-|–|\?|\!)/g```
* **readmore_link** - jQuery object, link used to expand the summary into full document: ```$('<a href="">Read more</a>')```

## Usage
This example will parse all .article elements and each .article will be shortened under 200px in height with a link saying "Read more". First and second level headings in each article will stay visible. Height will not be exactly 200px since the regexp being used ```/(\.|,|-|–|\?|\!)/g``` is splitting on larger chunks.

```javascript
$(".article").readmore({
  minheight         :50,
  maxheight         :200,
  hide_me_classname :'hide-me',
  ignore_children   :['a', 'i', 'strong', 'h1', 'h2', 'h3'],
  skip_elements     :['h1', 'h2'],
  split_using       :/(\.|,|-|–|\?|\!)/g,
  readmore_link     :$('<a href="">Read more</a>')
});
```