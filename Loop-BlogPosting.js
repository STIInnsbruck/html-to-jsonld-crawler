var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

request('https://www.waldhart.at/blog.html', function(error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $('.pagination ul li a').each(function() {
            if ($(this).text().indexOf("Page") >= 0) {
                request('https://www.waldhart.at/'+$(this).prop('href'), function(error, response, html) {
                    if (!error && response.statusCode == 200) {
                        var $ = cheerio.load(html);
                        $('.togglediv.blog-list .togglewrap').each(function() {
                            $(this).find('.blogimage a').prop('href');
                            console.log($(this).find('.blogimage a').prop('href'));
                            var blogurl = 'https://www.waldhart.at/' + $(this).find('.blogimage a').prop('href');
                            request(blogurl, function(error, response, html) {
                                if (!error && response.statusCode == 200) {
                                    var $ = cheerio.load(html);
                                    var arr = [];
                                    var main = {};
                                    main["@context"] = "http://schema.org";
                                    main["@type"] = "BlogPosting";
                                    main.headline = $('h1.newsh1').html();
                                    main.datePublished = $('p.dates').html().split('.').join('/');
                                    main.articleBody = $('div.pauschalen-single').find('p.bodytext').text();
                                    main.author = {};
                                    main.author = {};
                                    main.author["@type"] = "Organization";
                                    main.author["name"] = "Waldhart Software";
                                    main.author["url"] = "https://www.waldhart.at/firma/impressum.html";
                                    main.author.image = {};
                                    main.author.image["@type"] = "ImageObject"
                                    main.author.image["url"] = "https://www.waldhart.at/fileadmin/templates/images/logo.png";
                                    main.author.image["width"] = "126";
                                    main.author.image["height"] = "41.78";
                                    main.publisher = {};
                                    main.publisher["@type"] = "Organization";
                                    main.publisher["name"] = "Waldhart Software";
                                    main.publisher["url"] = "https://www.waldhart.at/firma/impressum.html";
                                    main.publisher.logo = {};
                                    main.publisher.logo["@type"] = "ImageObject";
                                    main.publisher.logo["url"] = "https://www.waldhart.at/fileadmin/templates/images/logo.png";
                                    main.publisher.logo["width"] = "126";
                                    main.publisher.logo["height"] = "41.78";

                                    if ($('.news-single-img').find('img').prop('src') != null) {
                                        main.image = {};
                                        main.image["@type"] = "ImageObject";
                                        main.image.url = "https://www.waldhart.at/" + $('.news-single-img').find('img').prop('src');
                                        main.image.width = $('.news-single-img').find('img').prop('width');
                                        main.image.height = $('.news-single-img').find('img').prop('height');
                                    }
                                    fs.writeFile("/home/borbal/Desktop/waldhart/js/result/" + encodeURIComponent(blogurl.substring(8)) + ".jsonld", JSON.stringify(main), function(err) {
                                        if (err) {
                                            return console.log(err);
                                        }
                                        console.log(encodeURIComponent(blogurl) + ".json named file saved");

                                    });
                                }
                            })
                        })
                    }
                });
            }
        })
    }
})
