var test = require('tape');
var find = require('./')
var findSync= require('./').findSync;

test('basic sync test', function (t) {
	var result = findSync('./test.html', ['jade', 'ejs', 'js', 'dust']);
	t.equal(result, 'test.js');
	t.end();
});

test('basic async test', function (t) {
	find('./test.html', ['jade', 'ejs', '.js', 'dust'], function (err, result) {
		t.equal(result, 'test.js')
		t.end();
	})
});
