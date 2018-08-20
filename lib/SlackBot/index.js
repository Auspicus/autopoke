var WebClient = require('@slack/client').WebClient;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

function SlackBot (token, logic) {
  this.token = token;
  this.web = new WebClient(token);
  this.channels = {};
  this.logic = logic || function () { throw Error('This bot is stupid.'); };
}

SlackBot.prototype.start = function () {
  this.logic(this.web);
}

module.exports = SlackBot;