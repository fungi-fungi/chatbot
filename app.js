/*-----------------------------------------------------------------------------
A simple "Hello World" bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var jwt = require('express-jwt');


//=========================================================
// GWES clien Setup
//=========================================================

var client = restify.createJsonClient('https://test-sf-connect.herokuapp.com');
var tocken = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiaXVyaWlAZ3dleGhpYml0cy5jb20iLCJlbWFpbCI6Iml1cmlpQGd3ZXhoaWJpdHMuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInVzZXJfbWV0YWRhdGEiOnsic2ZfaWQiOiIwMDEzNjAwMDAwTlN5Q1JBQTEifSwiaXNzIjoiaHR0cHM6Ly9hcHA1MjI3MjYzNS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NTc2MmE4YjNkYzhiNTgwZTFlMWU1Zjc3IiwiYXVkIjoiT2FhUnpzTGNKU29kWDFMb3lDTExrYU1hS1N3R3B4a0MiLCJleHAiOjE0NzcwNTE5NDUsImlhdCI6MTQ3NzAxNTk0NSwiYW1yIjpbXX0.y1_xoL_UwGXRnbQNcJM7UEuFhxxGOQ4Alg7KSJmRibY';


//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3000, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {


    session.send("Hi... I am test bot!!! How can I help you ?");
    session.beginDialog('/menu');
});

bot.dialog('/help', [
    function (session) {
        session.endDialog("You can ask me about:\n\n* orders\n* events\n* configurations \n\n\n If you will need help just type help");
    }
]);

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "What demo would you like to ask?", "orders|configurations|events");
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
]).reloadAction('reloadMenu', null, { matches: /^menu|show menu/i });

bot.dialog('/orders', [
    function(session){
        client.get({
            path: '/api/v1/order_requests',
            headers: {
               Authorization : tocken
            }
        }, function(err, req, res, obj) {        
            session.send('%j', obj);
        });
    }
]);

bot.dialog('/configurations', [
    function(session){

        client.get({
            path: '/api/v1/configurations',
            headers: {
               Authorization : tocken
            }
        }, function(err, req, res, obj) {        
            session.send('%j', obj);
        });
    }
]);

bot.dialog('/events', [
    function(session){
        session.send("Hi... I am test bot!!! How can I help you ?");
        session.beginDialog('/help');

        client.get({
            path: '/api/v1/events',
            headers: {
               Authorization : tocken
            }
        }, function(err, req, res, obj) {        
            session.send('%j', obj);
        });
    }
]);