/*
Copyright 2012 Adobe Systems Inc.;
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var file = function (path) {
	return path.split('/').pop().split('.')[0];
};

var submitData = function (stdout, path, args) {
	var querystring = require('querystring');
	var http        = require('http');
	var fs          = require('fs');
	var parse       = require('./csvToJSON');
	var postOptions = require('./settings');

	var post_data = {};
	
	parse(path, function (j) {
		post_data = {
			resultName : j
		};

		var version = stdout.split(' ');

		post_data.commit = version[0];
		post_data.date   = version[1];
		post_data.test   = args.test || file(path);
		post_data.device = args.device || 'device?';

		post_data = querystring.stringify({data : JSON.stringify(post_data)});

		post_options = postOptions(post_data.length);

		// Set up the request
		var post_req = http.request(post_options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				console.log(chunk);
			});
		});

		// post the data
		post_req.write(post_data);
		post_req.end();
		
	});

};

module.exports = submitData;