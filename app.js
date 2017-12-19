var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var hackerNews = [];
app.get('/scrape', function (req,res) {
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
        hackerNews.push({rank: rank, title: title});
      });

      //$('td.subtext:has(span.score)').each(function( index ) {
      $('td.subtext').each(function( index ) {
        var score = $(this).find('span.score').text().trim();
        var comments = $(this).find('a:contains("comment")').text().trim();

        hackerNews.forEach(function(element, i) {
          //console.log(element.title +" length: " + element.title.split(" ").length);
          if (i == index) {
            element.score = score;
            element.comments = comments;
          }
        });
      });

      res.send(hackerNews);

  });
})


app.get('/scrape/:filter', function(req, res){
  console.log("filter: " + req.params.filter);
  var hackerNewsCopy = hackerNews.slice(0);
  if (req.params.filter == "more") {

    hackerNewsCopy.forEach(function(element, i) {
      //console.log(element.title +" length: " + element.title.split(" ").length);
      if (element.title.split(" ").length <= 5) {
        console.log("element: " +element.title);
        hackerNewsCopy.splice(i, 1);
      }
      console.log("no elimina: " +element.title);
    });

    hackerNewsCopy.sort(function(a, b){
      var scoreA = (a.score).match(/\d+/g);
      var scoreB = (b.score).match(/\d+/g);
      return scoreA - scoreB;
    })
  } else {

    hackerNewsCopy.forEach(function(element, i) {
      console.log(element.title +" length: " + element.title.split(" ").length);
      //console.log(element.title + ":    " +i);
      if (element.title.split(" ").length > 5) {
        //console.log("element: " +element.title);
        hackerNewsCopy.splice(i, 1);
      } else {
        //console.log("no elimina: " +element.title);
      }

    });

    hackerNewsCopy.sort(function(a, b){
      var commentsA = (a.comments).match(/\d+/g);
      var commentsB = (b.comments).match(/\d+/g);
      return commentsA - commentsB;
    })
  }

  res.send(hackerNewsCopy);
})

app.listen('8083');

console.log('Magic happens on port 8081');

exports = module.exports = app;
