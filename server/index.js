const express = require('express');
const app = express();
const port = 5463;

app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(express.static(__dirname + './../client/dist'));


// app.get('/', (req, res) => {
//   res.send("hello from get")
// })

app.listen(port, () => {
  console.log('Listening on port: ', port)
})