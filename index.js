var fs = require('fs')
	, extname = require('path').extname
	, basename = require('path').basename
	, dirname = require('path').dirname
	, join = require('path').join
	, doWhile = require('dank-do-while')
	;

module.exports = find;
module.exports.find = find;
module.exports.findSync = findSync;

function find(path, extensions, cb) {
	var stat, i, dir, base, ext;
	if (!Array.isArray(extensions)) extensions = [extensions];

	check(path, function (err, result) {
		if (result) {
			return cb(null, path);
		}

		i = 0;
		dir = dirname(path);
		base = basename(path);
		ext = extname(base);
		base = basename(base, ext);

		doWhile(function (next) {
			ext = extensions[i++];

			if (!ext) {
				path = null;
				return next(false);
			}

			if (ext.substr(0,1) != '.') {
				ext = '.' + ext;
			}

			path = join(dir, base + ext);

			ck = check(path, function (err, result) {
				return next(!result)
			});

		}, function () {
			//done;
			return cb(null, path);
		});
	});

	function check(path, cb) {
		fs.stat(path, function (err, stat) {
			return cb(null, !!stat);
		});
	}
}

function findSync(path, extensions) {
	//first check if path exists;
	var ck, i, dir, base, ext;

	extensions = extensions || [];
	if (!Array.isArray(extensions)) extensions = [extensions];

	ck = check(path);

	if (ck) {
		return path;
	}

	dir = dirname(path);
	base = basename(path);
	ext = extname(base);
	base = basename(base, ext);

	//else keep looking
	for (i = 0; i < extensions.length; i++) {
		ext = extensions[i];

		if (ext.substr(0,1) != '.') {
			ext = '.' + ext;
		}

		path = join(dir, base + ext);

		ck = check(path);

		if (ck) {
			return path;
		}
	}

	return null;

	function check(path) {
		var stat;

		try {
			stat = fs.statSync(path);
		}
		catch (e) {
			return false;
		}

		if (stat) {
			return true;
		}
	}
}
