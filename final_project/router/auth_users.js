const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    return true;
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    return (users.indexOf({"username": username, "password": password}));
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    // return res.status(300).json({ message: "Yet to be implemented" });
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    // return res.status(300).json({ message: "Yet to be implemented" });
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!username) {
        return res.status(401).json({ message: "You must be logged in to post a review." });
    }

    if (!review) {
        return res.status(400).json({ message: "Review query is required." });
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    book.reviews[username] = review;
    return res.status(200).json({
        message: "Review successfully added/updated.",
        reviews: book.reviews
    });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
