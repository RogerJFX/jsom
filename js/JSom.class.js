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
		if (json.tag === null) {
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
		var att, i;
		if (json.atts !== null && typeof json.atts !== 'undefined') {
			setAttributeBulk(elem, json.atts);
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
		var result = new Node_(n);
		return result;
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
	 * Description
	 * @method _node_
	 * @param {} elem
	 * @return 
	 */
	var Node_ = function(elem, json) {
		this.elem = elem;
		this.bean = json;
		this.update = function() {
			this.elem.innerHTML = this.bean.html;
			//TODO update more Attributes
		};
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
					throw "Exception: unknown arg " + key;
				}
			}
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
		"atts" : [["key1", "value1"], ["keyN", "valueN"]]
	});
	
}(this.jsom = this.jsom || {}));

var Utils = {
	/**
	 * Description
	 * @method hasClassAttribute
	 * @param {Object} node
	 * @param {String} strClassAtt
	 * @return BinaryExpression
	 */
	hasClassAttribute : function(node, strClassAtt) {
		var clazz = node.getAttribute("class");
		return clazz.indexOf(strClassAtt) !== -1;
	},
	/**
	 * Description
	 * @method removeClassAttribute
	 * @param {Object} node
	 * @param {String} strClassAtt
	 * @return void
	 */
	removeClassAttribute : function (node, strClassAtt) {
		var clazz = node.getAttribute("class");
		if(clazz !== null) {
			var arr = clazz.split(" ");
			var nClazz = "";
			for (var i = 0; i < arr.length; i++) {
				if(arr[i] != strClassAtt) {
					nClazz += arr[i] + " ";
				}
			}
			node.removeAttribute("class");
			nClazz = nClazz.trim();
			node.setAttribute("class", nClazz);
		}
	},
	/**
	 * Description
	 * @method removeClassAttributeForClass
	 * @param {String} forClass
	 * @param {String} strClassAtt
	 * @return void
	 */
	removeClassAttributeForClass : function (forClass, strClassAtt) {
		var nodes = document.querySelectorAll("." + forClass);
		var i;
		for (i = 0; i < nodes.length; i++) {
			Utils.removeClassAttribute(nodes[i], strClassAtt);
		}
	},
	/**
	 * Description
	 * @method addClassAttribute
	 * @param {Object} node
	 * @param {String} strClassAtt
	 * @return void
	 */
	addClassAttribute : function (node, strClassAtt) {
		strClassAtt = strClassAtt.trim();
		if(node === null) {
			return false;
		}
		var clazz = node.getAttribute("class");
		if(clazz !== null && clazz.length > 0 && clazz.indexOf(strClassAtt) < 0) {
			clazz += " " + strClassAtt;
		} else {
			clazz =strClassAtt ;
		}
		node.removeAttribute("class");
		node.setAttribute("class", clazz);
	},
	/**
	 * Description
	 * @method addEventListener
	 * @param {Object} iTarget
	 * @param {String} iEvent
	 * @param {Function} method
	 * @return void
	 */
	addEventListener : function (iTarget, iEvent, method) {
		if(window.addEventListener) { // reasonable browsers
			iTarget.addEventListener(iEvent, method, false);
		} else if(window.attachEvent && method !== null && typeof method != 'undefined') { 
			iTarget.attachEvent("on" + iEvent, method);
		}
	}
};
	
