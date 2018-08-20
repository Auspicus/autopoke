#!/usr/bin/env node

'use strict';

require('dotenv').config();
var SlackBot = require('../SlackBot');
var GitHubHelper = require('../GitHubHelper');

function generatePossibleMessages(
  username,
  labels,
  issueNumbers,
  numberOfIssues,
  issuesList
) {
  return [
    "@" + username + " There's " + numberOfIssues + " issue" + (numberOfIssues > 1 ? 's' : '') + " tagged " + labels + " for you to review: " + issuesList
  ];
}

function SlackBotPoker (
  slackBotToken,
  githubToken,
  githubRepoOwner,
  githubRepo,
  options
) {
  this.slackBotToken = slackBotToken;
  this.githubToken = githubToken;
  this.githubRepoOwner = githubRepoOwner;
  this.githubRepo = githubRepo;
  this.usernameToPoke = options.usernameToPoke || 'everyone';
  this.channel = options.channel || 'general';
  this.labels = options.labels || 'enhancement,bug';
  this.pokeEvery = options.pokeEvery || 1000 * 60 * 10;
  this.pollEvery = options.pollEvery || 1000;
  this.githubHelper = new GitHubHelper(
    { token: githubToken },
    githubRepoOwner,
    githubRepo
  );
  this.slackBot = new SlackBot(this.slackBotToken || '', function (slack) {
    var lastPoke = 0;
    var loop = setInterval(function () {
      var now = Date.now();
      this.githubHelper
      .getIssuesByLabel(this.labels)
      .then(this.githubHelper.getIssueNumbers)
      .then(function (issueNumbers) {
        if (now - lastPoke >= this.pokeEvery) {
          var message = this.getMessage(this.usernameToPoke, this.labels, issueNumbers);
          if (message) {
            lastPoke = now;
            slack.chat.postMessage(this.channel, message, { as_user: true, link_names: true });
          }
        }
      }.bind(this))
      .catch(function (err) {
        console.error(Date.now(), err);
      });
    }.bind(this), this.pollEvery);
  }.bind(this));
}

SlackBotPoker.prototype.start = function () {
  this.slackBot.start();
}

SlackBotPoker.prototype.getMessage = function (username, labels, issueNumbers) {
  var n = issueNumbers.length;
  if (n < 1) return null;
  var issuesList = issueNumbers.map(function (number) {
    return "<https://github.com/" + 
      this.githubRepoOwner + 
      "/" +
      this.githubRepo + 
      "/issues/" + number + "|#" + number + ">";
  }.bind(this)).join(' ');
  var messages = generatePossibleMessages(
    username,
    labels,
    issueNumbers,
    issueNumbers.length,
    issuesList
  );
  return messages[Math.floor(Math.random() * messages.length)];
}

module.exports = SlackBotPoker;