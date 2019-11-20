const { Song, db } = require('./index.js');
const mongoose = require('mongoose');
const { data } = require('./dummydata.js');

//drop database whenever reseeding
db.dropDatabase();
console.log('in seed', data.length)

for (var i = 0; i < data.length; i++) {
  console.log(i)
  var song = new Song(data[i]);
  console.log('song', song)

  song.save((err, results) => {
    if (err) {
      console.log('Error seeding songs... ', err)
    }
  })
  if (i === data.length - 1) {
    console.log('Seeding complete')
  }
}
