// 
// Copyright (c) Eric ShangKuan. All rights reserved.
// Licensed under the MIT license.
// 
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

var restify = require('restify');
var request = require('request');

var MBF_DIRECT_LINE_ENDPOINT = 'https://directline.botframework.com';
var MBF_DIRECT_LINE_SECRET = '';
var LINE_BOT_CHANNEL_ACCESS_TOKEN = '';

// Setup Restify Server
const server = restify.createServer({
    name: 'skweather',
    version: '0.0.1'
});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser({
    mapParams: false
}));

// Webhook URL
server.get("/", function(req, res, next){

    var replyToken = req.body.events[0].replyToken;
    var userId = req.body.events[0].source.userId;
    var lineMessage = req.body.events[0].message.text;

    // Bypass the message to bot fraemwork via Direct Line REST API
    // Ref: https://docs.botframework.com/en-us/restapi/directline3/#navtitle

    // Start a conversation
    request.post(MBF_DIRECT_LINE_ENDPOINT + '/v3/directline/conversations',
        {
            auth: {
                'bearer': MBF_DIRECT_LINE_SECRET
            },
            json: {}
        },
        function (error, response, body) {
            // retrive the conversaion info
            var conversationId = body.conversationId;
            var token = body.token;
            var streamUrl = body.streamUrl;
            
            // send message
            request.post(MBF_DIRECT_LINE_ENDPOINT + '/v3/directline/conversations/' + conversationId + '/activities',
                {
                    auth: {
                        'bearer': token
                    },
                    json: {
                        'type': 'message',
                        'from': {
                            'id': userId
                        },
                        'text': lineMessage
                    }
                },
                function(error, response, sendBody){

                    // receive reply from stream url
                    request.get(streamUrl + '?t=' + token, 
                        {}, 
                        function(error, response, streamBody){
                            // reply to Line user
                            request.post('https://api.line.me/v2/bot/message/reply',
                                {
                                    auth: {
                                        'bearer': LINE_BOT_CHANNEL_ACCESS_TOKEN
                                    },
                                    json: {
                                        replyToken: replyToken,
                                        messages: [
                                            {
                                                "type": "text",
                                                "text": streamBody.activities[0].text
                                            }
                                        ]
                                    }
                                },
                                function (error, response, streamResultBody) {
                                    console.log(streamResultBody);
                                });
                         });
                });
        });
    res.send(200);
    return next();
});

server.listen(process.env.port || process.env.PORT || 5000, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

