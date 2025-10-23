const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    grade:  { type: Number, required: true, min: 0, max: 5 } // 0..5
  },
  { _id: false }
);

const bookSchema = new mongoose.Schema({
  userId:   { type: String },                 // id de l'utilisateur 
  title:    { type: String, required: true },
  author:   { type: String, required: true },
  imageUrl: { type: String, required: true },
  year:     { type: Number },
  genre:    { type: String },              
  ratings:       { type: [ratingSchema], default: [] },
  averageRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Book', bookSchema);
