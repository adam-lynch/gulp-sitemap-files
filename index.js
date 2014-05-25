'use strict';
var fs = require('fs');
var path = require('path');
var through = require('through');
var parseXML = require('xml2js').parseString;
var Vinyl = require('vinyl');

module.exports = function(siteUrl){
    var pluginName = 'gulp-sitemap-files';
    if(siteUrl) siteUrl = siteUrl + (siteUrl.slice(-1) === '/' ? '' : '/');

    function bufferContents(file) {
        if (file.isNull()) return; // ignore
        if (file.isStream()) return this.emit('error', new Error(pluginName + ': Streaming not supported'));
        if(!siteUrl) return this.emit('error', new Error(pluginName + ': siteUrl argument missing!'));

        var self = this;
        var xml = file.contents.toString();
        if(xml) {
            parseXML(xml, function (err, result) {
                if(err) return self.emit('error', err);

                result.urlset.url.forEach(function(url){
                    var relativePathToFile = url.loc.toString().replace(new RegExp('^' + siteUrl), '');
                    relativePathToFile = relativePathToFile + (!relativePathToFile || relativePathToFile.slice(-1) === '/' ? 'index.html' : '');

                    var fullFilePath = path.join(path.dirname(file.path), relativePathToFile);
                    var fileContents = fs.readFileSync(fullFilePath);

                    var vinyl = new Vinyl({
                        cwd: file.cwd,
                        base: file.base,
                        path: fullFilePath,
                        contents: fileContents,
                        stat: fs.statSync(fullFilePath)
                    });

                    vinyl.sitemap = {};
                    ['loc', 'lastmod', 'changefreq', 'priority'].forEach(function(property){
                        if(url[property]) {
                            vinyl.sitemap[property] = url[property][0];
                        }
                    });

                    self.push(vinyl);
                });
            });
        }
        else
        {
            this.push(file);
        }
    }

    return through(bufferContents);
};