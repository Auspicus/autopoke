var GitHub = require('github-api');

function GitHubHelper(auth, repoOwner, repo) {
  this.repoOwner = repoOwner;
  this.repo = repo;
  this.gh = new GitHub(auth);
}

/**
 * Gets issue numbers by label
 * 
 * @param {String} labels comma separated string of labels eg. 'hub,bug,big issue'
 */
GitHubHelper.prototype.getIssueNumbersByLabel = function (labels) {
  return this.getIssuesByLabel(labels).then(getIssueNumbers);
}

/**
 * Gets issues by label
 * 
 * @param {String} labels comma separated string of labels eg. 'hub,bug,big issue'
 */
GitHubHelper.prototype.getIssuesByLabel = function (labels) {
  return new Promise(function (resolve, reject) {
    this.gh.getIssues(
      this.repoOwner,
      this.repo
    ).listIssues({
      labels: labels // filter by the label
    }).then(function (result) {
      resolve(result.data);
    }).catch(function (err) {
      reject(err);
    });
  }.bind(this));
}

/**
 * Gets issue numbers from an issue array
 * 
 * @param {Array} issues an issues array from the GitHub api
 */
GitHubHelper.prototype.getIssueNumbers = function (issues) {
  return issues.map(function (issue) {
    return issue.number;
  });
}

module.exports = GitHubHelper;