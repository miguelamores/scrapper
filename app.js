var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){
  res.send('Hello World!mmmm');


  request("https://news.ycombinator.com/news", function(error, response, body) {
  if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);

  var $ = cheerio.load(body);

  $('tr.athing:has(td.votelinks)').each(function( index ) {
    var rank = $(this).find('td.title > span.rank').text().trim();
    var title = $(this).find('td.title > a').text().trim();
    var link = $(this).find('td.title > a').attr('href');
    fs.appendFileSync('hackernews.txt',rank + '\n' + title + '\n' + link + '\n');
  });

  // $('tbody').each(function( index ) {
  //   var rank = $(this).find('td.title > span.rank').text().trim();
  //   var title = $(this).find('td.title > a').text().trim();
  //   //var score = $(this).find('td.subtext > span.score').text().trim();
  //   var link = $(this).find('td.title > a').attr('href');
  //   fs.appendFileSync('hackernews.txt',rank + '\n' + title + '\n' + link + '\n');
  // });

});
  //All the web scraping magic will happen here

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
