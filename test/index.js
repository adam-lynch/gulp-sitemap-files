var sitemapFiles = require('../');
var fs = require('fs');
var path = require('path');
var mocha = require('mocha');
var gutil = require('gulp-util');
var Buffer = require('buffer').Buffer;
var chai = require('chai');
var expect = chai.expect;

var createFile = function(filename, contents){
    return new gutil.File({
        path: path.resolve('./test/fixtures/' + filename),
        contents: new Buffer(contents)
    });
};

describe('gulp-sitemap-files', function(){

    it("should throw an error if siteUrl isn't passed", function(){
        var file = createFile('simple.xml', '');

        expect(sitemapFiles).to.throw(Error);
    });


    it("should skip file if it's empty", function(done){
        var file = createFile('simple.xml', '');

        var numberOfOutputFiles = 0;
        var stream = sitemapFiles('http://www.example.com');

        stream.on('data', function(file){
            numberOfOutputFiles++;
            expect(file).not.to.have.property('sitemap');
            expect(file.contents.toString()).to.equal('');
        });

        stream.on('end', function(){
            expect(numberOfOutputFiles).to.equal(1);
            done();
        });

        stream.write(file);
        stream.end();
    });


    it("should skip ignore empty target documents", function(done){
        var file = createFile(
            'sitemap-a.xml',
            fs.readFileSync('./test/fixtures/simple.xml').toString()
                .replace('<loc>http://www.example.com/</loc>', '<loc>http://www.example.com/oops</loc>')
        );

        var numberOfOutputFiles = 0;
        var stream = sitemapFiles('http://www.example.com');

        stream.on('data', function(file){
            numberOfOutputFiles++;
        });

        stream.on('end', function(){
            expect(numberOfOutputFiles).to.equal(0);
            done();
        });

        stream.write(file);
        stream.end();
    });


    it("should add on the sitemap object to each non-empty file, with the correct contents and handling index defaults", function(done){
        var exampleContents = fs.readFileSync('./test/fixtures/simple.xml').toString();
        var files = [
            createFile('sitemap-a.xml', exampleContents),
            createFile('sitemap-b.xml', ''),
            createFile('sitemap-c.xml', exampleContents)
        ];

        var numberOfOutputFiles = 0;
        var stream = sitemapFiles('http://www.example.com');

        stream.on('data', function(file){
            if(numberOfOutputFiles === 1) {
                expect(file).not.to.have.property('sitemap');
                expect(file.contents.toString()).to.equal('');
            }
            else {
                expect(file).to.have.property('sitemap');
                expect(file.sitemap).to.be.an('object');
                expect(file.sitemap.loc).to.equal('http://www.example.com/');
                expect(file.sitemap.lastmod).to.equal('2005-01-01');
                expect(file.sitemap.changefreq).to.equal('monthly');
                expect(file.sitemap.priority).to.equal('0.8');
            }
            numberOfOutputFiles++;
        });

        stream.on('end', function(){
            expect(numberOfOutputFiles).to.equal(3);
            done();
        });

        for(var index in files){
            stream.write(files[index]);
        }
        stream.end();
    });


    it("should be fine if only the mandatory fields exist", function(done){
        var file = createFile('sitemap-a.xml', fs.readFileSync('./test/fixtures/simple-minimal.xml'));

        var numberOfOutputFiles = 0;
        var stream = sitemapFiles('http://www.example.com');

        stream.on('data', function(file){
            expect(file).to.have.property('sitemap');
            expect(file.sitemap).to.be.an('object');
            expect(file.sitemap.loc).to.equal('http://www.example.com/');
            expect(file.sitemap.lastmod).to.equal(undefined);
            expect(file.sitemap.changefreq).to.equal(undefined);
            expect(file.sitemap.priority).to.equal(undefined);
            numberOfOutputFiles++;
        });

        stream.on('end', function(){
            expect(numberOfOutputFiles).to.equal(1);
            done();
        });

        stream.write(file);
        stream.end();
    });


    it("should handle urls with named files, i.e. includes file extension", function(done){
        var file = createFile('sitemap-a.xml', fs.readFileSync('./test/fixtures/hierarchial.xml'));
        var expectedFiles = [
            {
                loc: 'http://www.example.com/',
                lastmod: '2005-01-01',
                changefreq: 'monthly',
                priority: '0.8'
            },
            {
                loc: 'http://www.example.com/a/',
                lastmod: '2005-02-01',
                changefreq: 'monthly',
                priority: '0.5'
            },
            {
                loc: 'http://www.example.com/a/b.html',
                changefreq: 'daily'
            }
        ];

        var numberOfOutputFiles = 0;
        var stream = sitemapFiles('http://www.example.com');

        stream.on('data', function(file){

            var expected = expectedFiles[numberOfOutputFiles];

            ['loc', 'lastmod', 'changefreq', 'priority'].forEach(function(property){
                expect(file.sitemap[property]).to.equal(expected[property]);
            });
            numberOfOutputFiles++;
        });

        stream.on('end', function(){
            expect(numberOfOutputFiles).to.equal(expectedFiles.length);
            done();
        });

        stream.write(file);
        stream.end();
    });
});
