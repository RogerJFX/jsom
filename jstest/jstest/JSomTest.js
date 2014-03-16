buster.spec.expose();
 
describe(":: JSom testing ::", function () {
	
	var parent = null;
	
	var appended = false;
	
	var EXPECTED_HTML = 'Hello JSom! <span class="mSpan">How are you?</span>';
	
	before(function() {
		parent = jsom.create({tag:"div", id:"testDiv1234", html:"Hello JSom! "});
		jsom.append({tag:"span", clazz:"mSpan", html:"How are you?", parent:parent});
		document.body.appendChild(parent.elem);
	});
	
    it("append()/create()", function () {
		console.log("testing append and create");
    	buster.expect(EXPECTED_HTML).toEqual(parent.elem.innerHTML);
    });
    
    it("node()", function(){
		console.log("testing picker function node()");
    	buster.expect(EXPECTED_HTML).toEqual(jsom.node("#testDiv1234").elem.innerHTML);
    });
    
    it("new instance", function() {
		console.log("some silly tests");
    	var bean1 = jsom.arg.bean({tag: "div"});
    	var bean2 = jsom.arg.bean({tag: "span"});
    	// does "new" work? :D
    	buster.expect(bean1).not.toEqual(bean2);
    	// is it private? :D
    	var priv = jsom._arg;
    	buster.expect(priv).not.toBeDefined();
    });
    
    after(function() {
		document.body.removeChild(parent.elem);
    });
    
});