import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
});

const user_id = 1;

db.connect();

const app = express();
const port = 4000;
const api_URL = "https://openlibrary.org";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function myListBooks() {
  const response = await db.query("SELECT * FROM saved_books");
  return response.rows;
}

async function deleteFromList(book_id, user_id) {
  await db.query("DELETE FROM book_reviews WHERE book_id = $1 AND user_id = $2;", [book_id, user_id]);
  await db.query("DELETE FROM saved_books WHERE book_id = $1 AND user_id = $2;", [book_id, user_id]);
}

async function updateReview(book_id, review) {
  const response = await db.query("UPDATE book_reviews SET review = $1 WHERE book_id = $2 RETURNING review;", [
    review,
    book_id,
  ]);
  return response;
}

async function reviewCheck(book_id) {
  const response = await db.query("SELECT review FROM book_reviews WHERE book_id=$1;", [book_id]);
  return response.rows[0];
}

async function dbCheck(book_id) {
  const response = await db.query("SELECT * FROM saved_books WHERE book_id=$1;", [book_id]);
  return response.rows.length;
}

async function saveBook(book_id, user_id, title, cover, author) {
  await db.query(
    "INSERT INTO saved_books (book_id,user_id,book_name,book_cover,book_author) VALUES ($1,$2,$3,$4,$5);",
    [book_id, user_id, title, cover, author]
  );
}

async function saveReview(book_id, user_id, review) {
  const response = await db.query(
    "INSERT INTO book_reviews (book_id,user_id,review) VALUES ($1,$2,$3) RETURNING review;",
    [book_id, user_id, review]
  );
  return response.rows[0];
}

app.get("/bestseller", async (req, res) => {
  try {
    const response = await axios.get(`${api_URL}/search.json?q=bestseller&limit=30`);
    try {
      const data = response.data.docs.map((book) => ({
        title: book.title,
        cover_i: book.cover_i,
        author_key: book.author_key,
        author_name: book.author_name,
        key: book.key,
      }));
      res.status(200).json(data);
    } catch (error) {
      res.status(500).end();
    }
  } catch (error) {
    res.status(500).end();
  }
});

app.get("/search/:input", async (req, res) => {
  const input = req.params.input;
  try {
    const response = await axios.get(`${api_URL}/search.json?q=${encodeURIComponent(input)}&limit=20`);
    res.status(200).json(response.data.docs);
  } catch (error) {
    res.status(500).end();
  }
});

app.get("/book/works/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await axios.get(`${api_URL}/works/${id}.json`);
    try {
      const author = await axios.get(`${api_URL}/${response.data.authors[0].author.key}.json`);
      try {
        const review = await reviewCheck(`/works/${id}`);
        res.status(200).json({
          title: response.data.title,
          description: response.data.description,
          covers: response.data.covers,
          author_key: author.data.key,
          author_name: author.data.name,
          key: response.data.key,
          review,
        });
      } catch (error) {
        res.status(500).end();
      }
    } catch (error) {
      res.status(500).end();
    }
  } catch (error) {
    res.status(500).end();
  }
});

app.get("/author/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const response = await axios.get(`${api_URL}/authors/${encodeURIComponent(id)}/works.json?limit=20`);
    try {
      const author = await axios.get(`${api_URL}/${response.data.links.author}.json`);
      res.status(200).json({
        content: response.data.entries,
        author: author.data,
      });
    } catch (error) {
      res.status(500).end();
    }
  } catch (error) {
    res.status(500).end();
  }
});

app.post("/savedbook", async (req, res) => {
  try {
    await saveBook(req.body.bookId, user_id, req.body.bookTitle, req.body.bookCover, req.body.bookAuthor);
    res.status(204).end();
  } catch (error) {
    res.status(500).end();
  }
});

app.post("/savedreview", async (req, res) => {
  try {
    if ((await dbCheck(req.body.bookId)) > 0) {
      const review = await saveReview(req.body.bookId, user_id, req.body.myReview);
      res.status(200).json(review);
    } else {
      await saveBook(req.body.bookId, user_id, req.body.bookTitle, req.body.bookCover, req.body.bookAuthor);
      const review = await saveReview(req.body.bookId, user_id, req.body.myReview);
      res.status(200).json(review);
    }
  } catch (error) {
    res.json({ message: "You already added a review" });
  }
});

app.post("/editreview", async (req, res) => {
  try {
    const response = await updateReview(req.body.bookId, req.body.myReview);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).end();
  }
});

app.post("/deletefromlist", async (req, res) => {
  try {
    const response = await deleteFromList(req.body.bookId, user_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).end();
  }
});

app.post("/mylist", async (req, res) => {
  try {
    const response = await myListBooks();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).end();
  }
});

app.listen(port, () => {
  console.log(`Api server is running on port ${port}`);
});
