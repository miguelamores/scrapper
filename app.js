var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res){



  request("https://news.ycombinator.com/news", function(error, response, body) {
  if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);

  var $ = cheerio.load(body);
  var hackerNews = [];
  //$('tr.athing:has(td.votelinks)').each(function( index ) {
  $('tr.athing').each(function( index ) {
    var rank = $(this).find('td.title > span.rank').text().trim();
    var title = $(this).find('td.title > a').text().trim();
    //var link = $(this).find('td.title > a').attr('href');
    hackerNews.push({rank: rank, title: title});
    fs.appendFileSync('hackernews.txt',index + '\n' + rank + '\n' + title + '\n');
  });

  //$('td.subtext:has(span.score)').each(function( index ) {
  $('td.subtext').each(function( index ) {
    var score = $(this).find('span.score').text().trim();
    var comments = $(this).find('a:contains("comments")').text().trim();
    fs.appendFileSync('hackernews.txt',index + '\n' + score + '\n' + comments + '\n');

    hackerNews.forEach(function(element, i) {
      if (i == index) {
        element.score = score;
        element.comments = comments;
      }
        console.log("index "+ i + "indexsubel "+ index);
    });

  });


  // $('table.itemlist > tbody > tr').each(function( index ) {
  //
  //     if ($(this).has('tr.athing')) {
  //       var rank = $(this).find('tr.athing > td.title > span.rank').text().trim();
  //     }
  //
  //     var title = $(this).find('tr.athing > td.title > a').text().trim();
  //     //var link = $(this).find('tr.athing > td.title > a').attr('href');
  //
  //     var score = $(this).find('tr > td.subtext > span.score').text().trim();
  //     var comments = $(this).find('tr > td.subtext > a:contains("comments")').text().trim();
  //     hackerNews.push({rank: rank, title: title, score: score, comments: comments});
  //     fs.appendFileSync('hackernews.txt',rank + '\n' + title + '\n' + score + '\n' + comments + '\n');
  //
  //
  //
  // });

  res.send(hackerNews);

});
  //All the web scraping magic will happen here

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
