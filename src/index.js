const express = require('express');
const connection = require('./db/connection');
const { talkers, login } = require('./routes');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || '3001';

app.use('/talker', talkers);

app.use('/login', login);

app.listen(PORT, async () => {
  console.log('Online');
  const [result] = await connection.execute('SELECT 1');
  if (result) console.log('Database connected');
});
