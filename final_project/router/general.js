const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    // return res.status(300).json({ message: "Yet to be implemented" });
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered."});
        } else {
            return res.status(404).json({message: "Username invalid."});
        }
    }

    return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/books', (req, res) => {
    res.json(books);
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    // res.send(JSON.stringify(books, null, 4));

    axios.get('https://brendanalm3-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books')
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            console.error("Error fetching books:", error.message);
            res.status(500).json({ message: "Unable to fetch books." });
        });

    //   return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/book/:isbn', function (req, res) {
    //Write your code here
    // return res.status(300).json({ message: "Yet to be implemented" });
    const ISBN = req.params.isbn;
    res.send(books[ISBN])
});

public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    axios.get(`https://brendanalm3-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/book/${isbn}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(404).json({ message: "Book not found via Axios." });
        });
});

// Get book details based on author
public_users.get('/books/author/:author', function (req, res) {
    //Write your code here
    // return res.status(300).json({ message: "Yet to be implemented" });
    const author = req.params.author;
    let booksByAuthor = [];

    for (let isbn in books) {
        if (books[isbn].author === author) {
            booksByAuthor.push({isbn, ...books[isbn]})
        }
    }

    res.send(booksByAuthor);
});

public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;

    axios.get(`https://brendanalm3-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/author/${author}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(404).json({ message: "No books found for this author via Axios." });
        });
});

// Get all books based on title
public_users.get('/books/title/:title', function (req, res) {
    //Write your code here
    // return res.status(300).json({ message: "Yet to be implemented" });
    const title = req.params.title;
    let booksByTitle = [];

    for (let isbn in books) {
        if (books[isbn].title === title) {
            booksByTitle.push({isbn, ...books[isbn]})
        }
    }

    res.send(booksByTitle);

});

public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;

    axios.get(`https://brendanalm3-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/title/${title}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(404).json({ message: "No books found for this title via Axios." });
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    // return res.status(300).json({ message: "Yet to be implemented" });
    const ISBN = req.params.isbn;

    res.send(books[ISBN]["reviews"]);
});

module.exports.general = public_users;
