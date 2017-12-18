var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var hackerNews = [];
request("https://news.ycombinator.com/news", function(error, response, body) {
    if(error) {
      console.log("Error: " + error);
    }
    console.log("Status code: " + response.statusCode);

    var $ = cheerio.load(body);

    //$('tr.athing:has(td.votelinks)').each(function( index ) {
    $('tr.athing').each(function( index ) {
      var rank = $(this).find('td.title > span.rank').text().trim();
      var title = $(this).find('td.title > a').text().trim();
      //var link = $(this).find('td.title > a').attr('href');
      hackerNews.push({rank: rank, title: title});
      //fs.appendFileSync('hackernews.txt',index + '\n' + rank + '\n' + title + '\n');
    });

    //$('td.subtext:has(span.score)').each(function( index ) {
    $('td.subtext').each(function( index ) {
      var score = $(this).find('span.score').text().trim();
      var comments = $(this).find('a:contains("comments")').text().trim();
      //fs.appendFileSync('hackernews.txt',index + '\n' + score + '\n' + comments + '\n');

      hackerNews.forEach(function(element, i) {
        //console.log(element.title +" length: " + element.title.split(" ").length);
        if (i == index) {
          element.score = score;
          element.comments = comments;
        }
      });
    });

});




app.get('/scrape/:filter', function(req, res){
  console.log("filter: " + req.params.filter);
  var hackerNewsCopy = hackerNews.slice(0);
  if (req.params.filter == "more") {

    hackerNewsCopy.forEach(function(element, i) {
      console.log(element.title +" length: " + element.title.split(" ").length);
      if (element.title.split(" ").length <= 5) {
        console.log("element: " +element.title);
        hackerNewsCopy.splice(i, 1);
      }
    });

    hackerNewsCopy.sort(function(a, b){
      var scoreA = (a.score).match(/\d+/g);
      var scoreB = (b.score).match(/\d+/g);
      return scoreA - scoreB;
    })
  } else {
    hackerNewsCopy.forEach(function(element, i) {
      console.log(element.title +" length: " + element.title.split(" ").length);
      if (element.title.split(" ").length > 5) {
        console.log("element: " +element.title);
        hackerNewsCopy.splice(i, 1);
      }
    });

    hackerNewsCopy.sort(function(a, b){
      var commentsA = (a.comments).match(/\d+/g);
      var commentsB = (b.comments).match(/\d+/g);
      return commentsA - commentsB;
    })
  }


  res.send(hackerNewsCopy);
  hackerNewsCopy = [];
  //All the web scraping magic will happen here

})

app.listen('8081')

console.log('Magic happens on port 8081');

exports = module.exports = app;
