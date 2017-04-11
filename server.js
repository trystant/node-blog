const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const app = express();

const {BlogPosts} = require('./models');

// log the http layer
app.use(morgan('common'));

// Add a couple of blog posts on server load so you'll automatically have some data to look at when the server starts
// TODO: figure out how to initialize these
BlogPosts.create();
BlogPosts.create();
BlogPosts.create();

// TODO: Use Express router and modularize routes to /blog-posts.

// GET and POST requests should go to /blog-posts.

app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});

app.post('/blog-posts', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body - TODO: fix this with proper fields
  const requiredFields = ['name', 'budget'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = BlogPosts.create(req.body.name, req.body.budget); // TODO: this too
  res.status(201).json(item);
});

// DELETE and PUT requests should go to /blog-posts/:id.
app.put('/blog-posts/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'budget', 'id']; // TODO: replace with proper fields
  for (let i=0; i<requiredFields.length; i++) {		// TODO: post date is optional; use today by default
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post item \`${req.params.id}\``);
  // TODO: replace with proper fields
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    name: req.body.name,
    budget: req.body.budget
  });
  res.status(204).json(updatedItem);
});

app.delete('/blog-posts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.ID}\``);
  res.status(204).end();
});
