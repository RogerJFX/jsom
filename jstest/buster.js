/*
 * For 
 * 	Buster.JS version 0.7.7 Beta 5
 * Install on any OS with (requires Node.js)
 * 	npm install -g buster
 * Run
 *  buster-server (from any location)
 * Then (from this folder(res))
 * 	buster-test [-v]
 * or
 *  buster-autotest
 */
var config = module.exports;
config["JSom tests"] = {
    rootPath: "../",
    environment: "browser", // "browser" or "node"
    libs: [],
    sources: [
      "js/JSom.class.js"
    ],
    tests: [
        "jstest/jstest/JSomTest.js"
    ],
    resources: [{
       path: "/",
       file: "index.html",
       headers: {
			"Content-Type": "text/html"
       } 
    }]  		
};