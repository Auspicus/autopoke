require('dotenv').config();
var SlackBotPoker = require('./lib/SlackBotPoker');

var poker = new SlackBotPoker(
  process.env.SLACK_TOKEN,
  process.env.GITHUB_TOKEN,
  process.env.GITHUB_REPO_OWNER,
  process.env.GITHUB_REPO,
  {
    usernameToPoke: process.env.SLACK_USER_TO_POKE,
    channel: process.env.SLACK_CHANNEL,
    labels: process.env.GITHUB_LABEL,
    pokeEvery: process.env.POKE_EVERY,
    pollEvery: process.env.POLL_EVERY
  }
);

poker.start();