const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Catching uncaught esceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! SHUTTING DOWN...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Connect to remote database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB conection successful!'));

// Starting server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handling unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! SHUTTING DOWN...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋SIGTERM RECEIVED. Shutting down gracefully. ');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
