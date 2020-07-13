//if (process.env.NODE_ENV !== 'production') {
require('dotenv').config();
//}

const express = require('express');
const app = express();

// Add a middleware. Since a path was not defined, it will be executed for every request.
app.use(express.json());

// mocking some database/api response
const courses = [
  { id: 1, name: 'couser1' },
  { id: 2, name: 'couser2' },
  { id: 3, name: 'couser3' },
];

// Routers

// root
app.get('/', (req, res) => {
  res.send('Hello World');
});

// all courses
app.get('/courses', (req, res) => {
  res.send(courses);
});

// single course
app.get('/courses/:id', (req, res) => {
  const course = findCourse(courses, req);
  // (404) Not Found
  if (!course)
    return res.status(404).send('The course with the given ID was not found.');
  res.send(course);
});

// work with params and query requests
app.get('/courses/:course/:type/:number', (req, res) => {
  res.send({
    query: req.query,
    params: req.params,
  });
});

app.post('/courses', (req, res) => {
  // could use some schema validator (express-validator, joi)
  // (400) Bad Request
  if (!req.body.name || req.body.name.length < 3)
    return res.status(400).send('Name is required and minimum 3 characters.');

  // mocking database insertion
  // use postman to test
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

app.put('/courses/:id', (req, res) => {
  // Look up the course
  // If not exist, return 404
  const course = findCourse(courses, req);
  if (!course)
    return res.status(404).send('This course with the given ID was not found.');

  // Validate
  // If invalid, return 400 - Bad Request
  if (!req.body.name || req.body.name.length < 3)
    return res.status(400).send('Name is required and minimum 3 characters.');

  // Upadate the course
  course.name = req.body.name;
  // Return the updated course
  res.send(course);
});

app.delete('/courses/:id', (req, res) => {
  // Look up the course
  // If not exist, return 404
  const course = findCourse(courses, req);
  if (!course)
    return res.status(404).send('This course with the given ID was not found.');

  // Delete the course
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return the deleted course
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`));

function findCourse(courses, req) {
  return courses.find((c) => c.id === parseInt(req.params.id));
}
