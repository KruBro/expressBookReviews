// auth_users.js
const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js'); // Import books from booksdb.js
const regd_users = express.Router();
let users = []; // This should be replaced with a proper database or persistent store

const isValid = (username) => {
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

// Login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username }, 'kingdom', { expiresIn: '1h' });

    req.session.authorization = {
      accessToken,
      username
    };
    return res.status(200).json({ message: "User Successfully logged in", token: accessToken });
  } else {
    return res.status(403).json({ message: "Invalid login! Check username and password" });
  }
});

// Register route
regd_users.post("/register", (req, res) => {
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

// Update or add a book review
// Update or add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review || req.body.review;
  const username = req.session.authorization?.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review required" });
  }

  if (username) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    return res.status(403).json({ message: "Review added Successfully " });
  }
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Book review has been deleted" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
