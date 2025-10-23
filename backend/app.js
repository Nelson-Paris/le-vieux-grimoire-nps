const express = require('express');
const mongoose = require('mongoose');
const path = require('path');  
const app = express();


const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(err => console.error('Connexion à MongoDB échouée :', err.message));  // repris du cours pour implémenter

app.use(express.json());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); 
  next();  
});


app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res) => res.status(404).json({ message: 'Not found' }));

module.exports = app;
