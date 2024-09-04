const express = require('express');
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register route
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  } else {
    return res.status(400).json({ message: "Unable to register. Username and password are required" });
  }
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  res.send(JSON.stringify(books, null, 4));
});

// Get the book list Using Async-Await Axios
public_users.get('/fetch-books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/'); // Assuming your server is running on localhost:5000 and serving the books list
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

public_users.get('/fetch-books-by-isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`); // Assuming your server is running on localhost:5000 and serving the books list
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});


// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.trim().toLowerCase();
  const matchingBooks = Object.values(books).filter(book => 
    book.author.trim().toLowerCase().includes(author)
  );

  if (matchingBooks.length > 0) {
    res.status(200).json(matchingBooks);
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

public_users.get('/fetch-books-by-author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`); // Assuming your server is running on localhost:5000 and serving the books list
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.trim().toLowerCase();
  const matchingTitles = Object.values(books).filter(book => 
    book.title.trim().toLowerCase().includes(title)
  );

  if (matchingTitles.length > 0) {
    res.status(200).json(matchingTitles);
  } else {
    res.status(404).json({ message: "No books found by this title" });
  }
});

public_users.get('/fetch-books-by-title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`); // Assuming your server is running on localhost:5000 and serving the books list
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
