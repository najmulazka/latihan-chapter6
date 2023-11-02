require('dotenv').config();
const express = require('express');
const app = express();
const { PORT } = process.env;
const router = require('./routes/index');

app.use(express.json());
app.get('/', (req, res) => {
  return res.json({
    status: true,
    messages: 'WELCOME TO RAILWAY',
    err: null,
    data: null,
  });
});
app.use('/api/v1', router);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
