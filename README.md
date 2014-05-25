gulp-sitemap-files [![Build Status](https://travis-ci.org/adam-lynch/gulp-sitemap-files.svg?branch=master)](https://travis-ci.org/adam-lynch/gulp-sitemap-files)
=====================

# Work in progress, not ready yet

A [Gulp](http://github.com/gulpjs/gulp) plugin to get all files listed in a sitemap. See [sitemaps.org/protocol.html](http://www.sitemaps.org/protocol.html) and [pgilad/gulp-sitemap](https://github.com/pgilad/gulp-sitemap).

# Information
<table>
<tr>
<td>Package</td><td>gulp-sitemap-files</td>
</tr>
<tr>
<td>Description</td>
<td>A [Gulp](http://github.com/gulpjs/gulp) plugin to get all files listed in a sitemap.</td>
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

### Note
As far as default files go, only HTML files are supported right now (i.e. `http://www.example.com/` -> `http://www.example.com/index.html`). If you need anything more, create an issue explaining how you'd like it to work :).
