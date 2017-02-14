//shows all documents in public/docs
//allows for the user to traverse the docs tree and
//share documents by copying a url

var express = require('express');
var	router = express.Router();
var glob = require('glob');

module.exports = function(app) {
	app.use('/', router);
};

//show the documents page
router.get('/documents*', function serveDocsHome(req, res) {
	//this removes %20 from the requested url to match links with spaces
	var reqUrl = req.originalUrl.replace(/%20/g, ' ');
	

	//fun string stuff to make links work
	var dir = '/docs' + reqUrl.substr(10);
	var url = reqUrl + '/';

	//for moving up a directory
	var goUp = false;
	var folderName = 'Home';
	if (reqUrl != '/documents') {
		var end = reqUrl.lastIndexOf('/');
		folderName = reqUrl.substr(end + 1);
		goUp = true;
	}

	//get all the folders
	var folders = glob.sync('*/', {
		cwd : 'public' + dir
	});
	for (var i = 0; i < folders.length; i++) {
		folders[i] = folders[i].substr(0, folders[i].length - 1);
	}
	
	//get all the files
	var files = glob.sync('*', {
		cwd : 'public' + dir,
		nodir : true
	});

	//attach the files and folders
	res.locals.folders = folders;
	res.locals.files = files;
	res.locals.loc = dir + '/';
	res.locals.goUp = goUp;
	res.locals.url = url;
	res.locals.folderName = folderName;

	//render the doc
	res.render('documents', {
		title : 'Docs: ' + folderName
	});
});