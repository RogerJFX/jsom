/**
 * Tiny DOM-Manipulator for Javascript. Just for people who don't like to
 * use jQuery but prefer to write plain JavaScript.
 * 
 * Version? Ouh, this is just a Proof Of Concept. Currently thinking of 
 * making it a bit more object orientated. On the other hand one then should
 * simply use jQuery...
 * 
 * Ok, version 0.0.0.1
 * 
 * @Author Roger F. Hösl
 */
( function JSom(me) {"use strict";
	var trimString = function(str) {
		return str.replace (/^\s+/, '').replace (/\s+$/, '');
	};
	/**
	 * Private error message.
	 */
	var ERROR_NO_PARENT = "Error: No parent node to append to.";
	/**
	 * Private error message.
	 */
	var ERROR_NO_TAGNAME = "Error: Cannot create element - no tag name provided. Call dom.arg.toString()";
	/**
	 * Not yet used Registry. Not easy to implement, especially for nodes found by css-class since 
	 * class attributes may be changed.
	 * Any ideas?
	 */
	var idNodeRegistry = [];
	/**
	 * Description
	 * @method append
	 * @param {Object} json
	 * @return node
	 */
	me.append = function(json) {
		_arg.validate(json);
		if (json.parent === null) {
			throw ERROR_NO_PARENT;
		}
		var parent;
		if ( typeof json.parent === 'string') {
			var tmp = _get(json.parent);
			if (tmp === null || typeof tmp !== 'object' || (!tmp.length && tmp.length === 0)) {
				throw ERROR_NO_PARENT;
			}
			if (!tmp.length) {
				parent = tmp;
			} else {
				parent = tmp[0];
			}
		} else {
			parent = json.parent;
		}
		var node = me.create(json, true);
		if(parent.append && parent.elem) {
			parent.elem.appendChild(node.elem);
		} else {
			parent.appendChild(node.elem);
		}
		//json = null;
		return node;
	};
	/**
	 * Description
	 * @method create
	 * @param {Object} json
	 * @param {Boolean} validated
	 * @return node
	 */
	me.create = function(json, validated) {
		if (!validated || typeof validated !== 'boolean') {
			_arg.validate(json);
		}
		if (json.tag == null) {
			throw ERROR_NO_TAGNAME;
		}
		var elem = document.createElement(json.tag.toUpperCase());
		elem.innerHTML = json.html || "";
		if (json.id) {
			elem.setAttribute("id", json.id);
		}
		if (json.clazz) {
			elem.setAttribute("class", json.clazz);
		}
		if (json.value) {
			elem.value = json.value;
		}
		//var att, i;
		if (json.atts !== null && typeof json.atts !== 'undefined') {
			setAttributeBulk(elem, json.atts);
		}
		if (json.style !== null && typeof json.style !== 'undefined') {
			setStyleBulk(elem, json.style);
		}
		//json = null;
		return new Node_(elem, json);
	};
	/**
	 * Description
	 * @method _get
	 * @param {String} arg
	 * @return CallExpression
	 */
	var _get = function(arg) {
		var pound = arg.indexOf('#');
		if (pound !== -1) {
			return document.getElementById(arg.substring(pound + 1));
		}
		return document.querySelectorAll(arg);
	};
	/**
	 * Description
	 * @method node
	 * @param {String} arg
	 * @return NewExpression
	 */
	me.node = function(arg) {
		var n = arg ? _get(arg) : null;
		if(n === null) 
			return null;
		if(n.length) {
			var result = [], i;
			for (i = 0; i < n.length; i++) {
				result.push(new Node_(n[i]));
			}
			return result;
		}
		var result = new Node_(n);
		return result;
	};
	me.wrap = function(node) {
		return new Node_(node);
	};
	/**
	 * Description
	 * @method each
	 * @param {Object} arg
	 * @param {Function} func
	 * @return 
	 */
	me.each = function(arg, func) {
		var all = _get(arg);
		var i;
		for (i=0; i < all.length; i++) {
			func(new Node_(all[i]));
		}
	};
	/**
	 * Description
	 * @method setStyleBulk
	 * @param {} node
	 * @param {} json
	 * @return 
	 */
	var setAttributeBulk = function(node, json) {
		var key;
		for(key in json) {
			node.setAttribute(key, json[key]);
		}	
	};
	/**
	 * Description
	 * @method setStyleBulk
	 * @param {} node
	 * @param {} json
	 * @return 
	 */
	var setStyleBulk = function(node, json) {
		var key;
		for(key in json) {
			node.style[key] = json[key];
		}	
	};
	me.arg = {};
	/**
	 * Description
	 * @method bean
	 * @param {} json
	 * @return CallExpression
	 */
	me.arg.bean = function(json) {
		return _arg.bean(json);
	};
	/**
	 * Description
	 * @method toString
	 * @return CallExpression
	 */
	me.arg.toString = function() {
		return JSON.stringify(_arg._bean);
	};
	/**
	 * Ctor.
	 * @method _node_
	 * @param {} elem
	 * @return 
	 */
	var Node_ = function(elem, json) {
		this.elem = elem;
		this.bean = json;
		this.update = function() {
			this.html(this.bean.html);
			//TODO update more Attributes
		};
	};
	/**
	 * Setting attributes from json.
	 * @method atts
	 * @param {Object} json
	 * @return ThisExpression
	 */
	Node_.prototype.atts = function(json) {
		setAttributeBulk(this.elem, json);
		return this;
	};
	/**
	 * Description
	 * @method style
	 * @param {} json
	 * @return ThisExpression
	 */
	Node_.prototype.style = function(json) {
		setStyleBulk(this.elem, json);
		return this;
	};
	Node_.prototype.removeClazz = function(strClass) {
		var clazz = this.elem.getAttribute("class");
		if(clazz != null) {
			var arr = clazz.split(" ");
			var nClazz = "";
			for (var i = 0; i < arr.length; i++) {
				if(arr[i] != strClass) {
					nClazz += arr[i] + " ";
				}
			}
			this.elem.removeAttribute("class");
			this.elem.setAttribute("class", trimString(nClazz));
		}
		return this;
	};
	Node_.prototype.addClazz = function(strClass) {
		strClass = trimString(strClass);
		var clazz = this.elem.getAttribute("class");
		if(clazz != null && clazz.length > 0 && clazz.indexOf(strClass) < 0) {
			clazz += " " + strClass;
		} 

		this.elem.removeAttribute("class");
		this.elem.setAttribute("class", clazz);
		return this;
	};
	Node_.prototype.isClazz = function(strClass) {
		var clazz = this.elem.getAttribute("class");
		return clazz.indexOf(strClass) !== -1;
	};
	Node_.prototype.html = function(html) {
		this.elem.innerHTML = html;
		return this;
	};
	Node_.prototype.value = function(value) {
		this.elem.value = value;
		return this;
	};
	/**
	 * Description
	 * @method append
	 * @param {} json
	 * @return ThisExpression
	 */
	Node_.prototype.append = function(json) {
		json.parent = this.elem;
		me.append(json);
		return this;
	};
	Node_.prototype.appendNode = function(other) {
		this.elem.appendChild(other.elem);
		return this;
	};
	Node_.prototype.prependNode = function(other) {
		var fc = this.elem.firstChild;
		if(fc) {
			this.elem.insertBefore(other.elem, fc);
		} else {
			this.elem.appendChild(other.elem);
		}
		return this;
	};
	Node_.prototype.addEvent = function(strEvent, func) {
		if(this.elem.addEventListener) { // Mozilla
			this.elem.addEventListener(strEvent, func, false);
		} else if(this.elem.attachEvent) { // F IE
			this.elem.attachEvent("on" + strEvent, func);
		}
		return this;
	};
	Node_.prototype.removeEvent = function(strEvent, func) {
		if(this.elem.removeEventListener) { // Mozilla
			this.elem.removeEventListener(strEvent, func, false);
		} else if(this.elem.detachEvent) { // F IE
			this.elem.detachEvent("on" + strEvent, func);
		}
		return this;
	};
	/**
	 * Description
	 * @method addNodeFunction
	 * @param {} name
	 * @param {} func
	 * @return 
	 */
	me.addNodeFunction = function(name, func) {
		Node_.prototype[name] = func;
	};
	var _arg = {
		/* jshint -W030 */
		/**
		 * Description
		 * @method bean
		 * @param {} json
		 * @return $n
		 */
		bean : function(json) {
			var $n = {};
			$n.tag = json && json.tag || null;
			$n.id = json && json.id || null;
			$n.clazz = json && json.clazz || null,
			$n.html = json && json.html || null;
			$n.value = json && json.value || null;
			$n.parent = json && json.parent || null;
			$n.atts = json && json.atts || null;
			return $n;	
		},
		/* jshint +W030 */
		/**
		 * Description
		 * @method validate
		 * @param {} inp
		 * @return 
		 */
		validate : function(inp) {
			var key;
			for (key in inp) {
				if ( typeof this._bean[key] === 'undefined') {
					return false;
					//throw "Exception: unknown arg " + key;
				}
			}
			return true;
		}
	};
	// Just for the helper "toString"
	_arg._bean = _arg.bean({
		"tag" : "tag name",
		"id" : "html id",
		"clazz" : "css class",
		"html" : "innerHtml",
		"value" : "value for input",
		"parent" : "parent node",
		"atts" : {"key1" : "value1", "keyN" : "valueN"}
	});
	
}(this.jsom = this.jsom || {}));

	
