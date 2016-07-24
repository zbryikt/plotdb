var fs = require("fs");
var bluebird = require("bluebird");
var page = require("webpage").create();
var url = function(key) { return "http://localhost.io/v/chart/" + key; };
//-fsExtra.mkdirs("snapshot");
page.onConsoleMessage = function(msg) {
  system.stderr.writeLine('console: ' + msg);
};
page.viewportSize = { width: 350, height: 254 };
page.clipRect = { top: 0, left: 0, width: 350, height: 229 };
phantom.onError = function(msg, trace) {
  console.log(msg);
  console.log(trace);
};

function snapshot(key) {
  return new bluebird(function(res,rej) {
    page.open(url(key), function(s) {
      setTimeout(function() {
        page.render("snapshot/" + key + ".png");
        res();
      }, 2000);
    });
  });
}

var list = JSON.parse(fs.read("chart-to-update.json") || "[]")
var count = 0;
function batch() {
  if(!list.length) {
    console.log("snapshot " + count +" images done.");
    phantom.exit();
    return;
  }
  item = list.splice(0,1)[0];
  console.log("snapshot " + item + " ...");
  snapshot(item).then(function() {
    batch();
  });
}

batch();
