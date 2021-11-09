// Requiring modules
const fs = require('fs');
const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Define routes
/*
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' });
});
app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});
*/

// Read json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Handling get requests -> Get all tours
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// Responding to URL params
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);
  // Multiply by one convert the string into number
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// Handling post requests -> Create a new tour
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  // Persist data
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

// Starting server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
