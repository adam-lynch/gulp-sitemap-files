'use strict';
var fs = require('fs');
var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var parseXML = require('xml2js').parseString;

var PluginError = gutil.PluginError;
var sitemapFields = ['loc', 'lastmod', 'changefreq', 'priority'];
var pluginName = 'gulp-sitemap-files';

module.exports = function(siteUrl){
    //append trailing slash
    if(siteUrl && siteUrl.slice(-1) !== '/') siteUrl += '/';

    if(!siteUrl) throw new Error(pluginName + ': siteUrl argument missing!');

    function bufferContents(file, enc, cb) {
        //pass through null files
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        //don't support stream for now
        if (file.isStream()) {
            cb(new PluginError(pluginName, 'Streaming not supported'));
            return;
        }

        var xml = file.contents.toString();
        //early exit if no data
        if (!xml) {
            cb(null, file);
            return;
        }

        var self = this;
        parseXML(xml, function (err, result) {
            if(err) return cb(new PluginError(pluginName, err));

            result.urlset.url.forEach(function(url){
                var relativePathToFile = url.loc.toString().replace(new RegExp('^' + siteUrl), '');
                if (!relativePathToFile || relativePathToFile.slice(-1) === '/') {
                    relativePathToFile = relativePathToFile + 'index.html';
                }

                var fullFilePath = path.join(path.dirname(file.path), relativePathToFile);
                // ignore if target document doesn't exist
                // TODO: think about outputting a warning here
                if(!fs.existsSync(fullFilePath)) return;
                var fileContents = fs.readFileSync(fullFilePath);

                var vinyl = new gutil.File({
                    cwd: file.cwd,
                    base: file.base,
                    path: fullFilePath,
                    contents: fileContents,
                    stat: fs.statSync(fullFilePath)
                });

                vinyl.sitemap = {};
                sitemapFields.forEach(function(property){
                    if(url[property]) {
                        vinyl.sitemap[property] = url[property][0];
                    }
                });

                self.push(vinyl);
            });
        });
        cb();
    }

    return through.obj(bufferContents);
};
