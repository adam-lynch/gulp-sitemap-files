gulp-sitemap-files 
==========

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Windows Build Status][appveyor-image]][appveyor-url] [![Dependency Status][depstat-image]][depstat-url] 

---

A [Gulp](http://github.com/gulpjs/gulp) plugin to get all files listed in a sitemap. See [sitemaps.org/protocol.html](http://www.sitemaps.org/protocol.html) and [pgilad/gulp-sitemap](https://github.com/pgilad/gulp-sitemap).

# Information
<table>
<tr>
<td>Package</td><td>gulp-sitemap-files</td>
</tr>
<tr>
<td>Description</td>
<td>A Gulp plugin to get all files listed in a sitemap.</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.9</td>
</tr>
</table>

# Installation
```js
npm install gulp-sitemap-files
```

# Usage
```js
var gulp = require('gulp');
var sitemapFiles = require('gulp-sitemap-files');
var clean = require('gulp-clean');

gulp.task('clean', function() {
    gulp.src('./sitemap.xml')
        .pipe(sitemapFiles('http://www.example.com/'))
        .pipe(clean());
});

gulp.task('default', ['clean']);
```

## Arguments

`sitemapFiles(siteUrl)`

- `siteUrl` - string.

## Notes

- It it assumed the sitemap is at the root.
- As far as default files go, only HTML files are supported right now (i.e. `http://www.example.com/` -> `http://www.example.com/index.html`). If you need anything more, create an issue explaining how you'd like it to work :).


[npm-url]: https://npmjs.org/package/gulp-sitemap-files
[npm-image]: http://img.shields.io/npm/v/gulp-sitemap-files.svg?style=flat

[travis-url]: http://travis-ci.org/adam-lynch/gulp-sitemap-files
[travis-image]: http://img.shields.io/travis/adam-lynch/gulp-sitemap-files.svg?style=flat

[appveyor-url]: https://ci.appveyor.com/project/adam-lynch/gulp-sitemap-files/branch/master
[appveyor-image]: https://ci.appveyor.com/api/projects/status/7602fkeeaxruxc22/branch/master?svg=true

[depstat-url]: https://david-dm.org/adam-lynch/gulp-sitemap-files
[depstat-image]: https://david-dm.org/adam-lynch/gulp-sitemap-files.svg?style=flat
