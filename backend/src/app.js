import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_URL = process.env.MONGO_URL;
const MONGODB = `mongodb://${MONGO_URL}:${MONGO_PORT}`;

mongoose.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

const PORT = process.env.PORT || 3000;
const app = express();

// const corsOptions = { origin: 'http://localhost:3000' };
app.use(cors());

app.get('/', (req, res) => {
  res.send('hi with ');
});

app.listen(PORT, (req, res) => {
  console.log(`Listening on port ${PORT}`);
});
