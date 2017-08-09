app.use(express.static('public'));

// mywebsite.com/api/pigeon

app.get("/api/:argOne/:argTwo?", function(req, res)){
	res.end("")
});