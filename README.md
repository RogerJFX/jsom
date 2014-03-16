# JSom #

### JSom is just another approach for handling HTML nodes via JavaScript. ###

**Version? No version, just a shameful thought, maybe a proof of concept.**

**Author: Roger F. Hösl**

**Date: 2014-03-17**

Completely based on plain old JavaScript, so no additional libs required. 

One may ask me, what's the benefit of just another try since jQuery is already there and well established. To be honest: 
I like jQuery, but I like JavaScript as well. And: thinking of e.g. game development or even sophisticated web development, jQuery is not always completely satisfying.  

Remember it's just a thought and a first approach.

Goals should be:

+ Keeping it all plain to pure JavaScript developers
+ Shortening routines like "document.createElement(arg)" or even document.getElementById("parentId").appendChild(document.createElement(arg)));
+ Keeping performance of "old school programming".
+ Proper bean handling, opportunity to create Registries. Important for e.g. node based games (so no canvas).
+ Strong references/pointers. We don't want to query all the time.

-

A first highlight:

~~~~~~~~~~~
var bean = jsom.arg.bean({"tag":"a", "html":"You never should read this in browser.", "parent":document.body, atts:{"href": "http://programming-motherfucker.com"}});

bean.html = "You should be able to read this.";

var myJSOM = jsom.append(bean);

// now lately changing the text (we have the references)
bean.html += " Updated lately.";

// and simply call update
myJSOM.update();
~~~~~~~~~~~

Will result in an anchor with text "You should be able to read this. Updated lately.".

Contributors are welcome.



