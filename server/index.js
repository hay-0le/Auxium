const express = require('express');
const app = express();
const port = 5463;

app.get('/', (req, res) => {
  res.send("hello from get")
})

app.listen(port, () => {
  console.log('Listening on port: ', port)
})