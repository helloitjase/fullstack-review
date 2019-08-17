const express = require('express');
let app = express();
const bodyParser = require('body-parser');
const githubAPIcall = require('../helpers/github.js');
const mongooseDB = require('../database/index.js');
const Promise = require('bluebird')

app.use(bodyParser.json());


app.use(express.static(__dirname + '/../client/dist'));

app.post('/repos', function (req, res) {
  // TODO - your code here!
  // This route should take the github username provided
  // and get the repo information from the github API, then
  // save the repo information in the database

  githubAPIcall.getReposByUsername(req.body.user, (err, repos) => {
    if (err) {
      res.sendStatus(500);
    } else {
      let arr = [];
      for(let i = 0; i < repos.length; i++) {
        arr.push(mongooseDB.save(repos[i]));
      }
      Promise.all(arr)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log('ugh', err);
      })
    }

  })


});

app.get('/repos', function (req, res) {
  // TODO - your code here!
  // This route should send back the top 25 repos
});

let port = 1128;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});

//allrepos come in as an array of objects
//rank repos by size
