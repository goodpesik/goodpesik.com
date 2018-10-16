let fs = require('fs');
let express = require("express");
let app = express();

function getData() {
	return new Promise(function(resolve, reject) {
		fs.readFile('./data.json', function(err, obj) {
			if(err) {
				reject();
			} else {
				resolve(JSON.parse(obj));
			}
		});
	});
}

function setHeaders(res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

app.get("/getPosts", function(req, res) {
		setHeaders(res);
		getData().then(function(data) {
			res.json(data);
		})
});

app.get("/getPost/*", function(req, res) {
	setHeaders(res);
	getData().then(function(data) {
		res.json(data.filter(post => post.id === parseFloat(req.params[0])));
	})
});

 app.post("/user/add", function(req, res) { 
   res.send("OK");
 });

app.get(/^(.+)$/, function(req, res){ 
	console.log('static file request : ' + req.params);
	res.sendfile( __dirname + req.params[0]); 
});

var port = process.env.PORT || 4300;
app.listen(port, function() {
  console.log("Listening on " + port);
});





