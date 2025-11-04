const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

// GET /api/books
exports.getAll = async (_req, res) => {
  const books = await Book.find();
  res.json(books);
};

// GET /api/books/:id
exports.getOne = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Livre introuvable' });
  return res.json(book);
};

// POST /api/books (auth, multipart: image + book JSON string)
exports.create = (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    return book.save()
      .then(() => res.status(201).json(book))
      .catch(error => res.status(400).json({ message: error.message }));
  } catch (e) {
    return res.status(400).json({ message: 'Format du champ "book" invalide' });
  }
};

// PUT /api/books/:id (auth) — version JSON simple
exports.update = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre introuvable' });
    if (book.userId && book.userId.toString() !== req.auth.userId)
      return res.status(403).json({ message: 'Non autorisé' });

    book.title = req.body.title ?? book.title;
    book.author = req.body.author ?? book.author;
    book.imageUrl = req.body.imageUrl ?? book.imageUrl;
    book.year = req.body.year ?? book.year;
    book.genre = req.body.genre ?? book.genre;

    const saved = await book.save();
    return res.json(saved);
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

// DELETE /api/books/:id (auth) — supprime aussi l'image
exports.remove = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre introuvable' });
      }
      if (book.userId != req.auth.userId) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
          .catch(error => res.status(401).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// TOP 3 — GET /api/books/bestrating
exports.getBest = async (_req, res) => {
  const top = await Book.find().sort({ averageRating: -1 }).limit(3);
  res.json(top);
};


// NOTATION — POST /api/books/:id/rating (auth)
exports.rate = (req, res) => {
  const bookId = req.params.id;

  // On accepte "rating" OU "grade"
  const grade = Number(req.body.rating != null ? req.body.rating : req.body.grade);
  if (isNaN(grade) || grade < 0 || grade > 5) {
    return res.status(400).json({ message: 'Note invalide (0 à 5)' });
  }

  Book.findOne({ _id: bookId })
    .then((book) => {
      if (!book) {
        res.status(404).json({ message: 'Livre introuvable' });
        return null; // stoppe la chaîne
      }

      const alreadyRated = book.ratings.find((r) => r.userId === req.auth.userId);
      if (alreadyRated) {
        res.status(400).json({ message: 'Déjà noté par cet utilisateur' });
        return null; // stoppe la chaîne
      }

      // ajouter la note
      book.ratings.push({ userId: req.auth.userId, grade });

      // recalculer la moyenne (arrondi au dixième)
      const total = book.ratings.reduce((acc, r) => acc + r.grade, 0);
      const avg = total / book.ratings.length;
      book.averageRating = Math.round(avg * 10) / 10;

      return book.save();
    })
    .then((saved) => {
      if (!saved) return;           // on a déjà répondu (404/400)
      res.status(200).json(saved);  // réponse unique
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error });
    });
};
