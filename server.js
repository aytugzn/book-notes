import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const api_URL = "http://localhost:4000";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${api_URL}/bestseller`);
    res.render("index", {
      books: response.data,
    });
  } catch (error) {
    console.error(error.response.data);
    res.status(500);
  }
});

app.post("/search", async (req, res) => {
  const input = req.body.searchInput;
  try {
    const response = await axios.get(`${api_URL}/search/${input}`);
    if (response.data < 1) {
      res.render("index", { error: "Invalid book name.." });
    } else {
      res.render("index", { books: response.data, author: "Unknown" });
    }
  } catch (error) {
    res.render("index", { error: "Invalid book name.." });
  }
});

app.post("/book", async (req, res) => {
  const id = req.body.bookId;
  try {
    const response = await axios.get(`${api_URL}/book${id}`);
    const data = response.data;

    try {
      const userReviewText = data.review.review;
      res.render("bookInfo", { book: data, usersReview: userReviewText });
    } catch (error) {
      res.render("bookInfo", { book: data });
    }
  } catch (error) {
    res.render("bookInfo", { message: "Something went wrong" });
  }
});

app.post("/author", async (req, res) => {
  const id = req.body.authorId;
  try {
    const response = await axios.get(`${api_URL}/author/${id}`);
    res.render("index", { books: response.data.content, author: response.data.author });
  } catch (error) {
    res.render("index", console.error(error.message));
    res.status(500);
    res.render("index", {
      error: "An error occurred while getting author information.",
    });
  }
});

app.post("/savedbook", async (req, res) => {
  const bookInfo = req.body;
  try {
    await axios.post(`${api_URL}/savedbook`, bookInfo);
  } catch (error) {
    console.error(error);
  }
});

app.post("/savedreview", async (req, res) => {
  const id = req.body.bookId;
  const reviewInfo = req.body;
  try {
    const response = await axios.post(`${api_URL}/savedreview`, reviewInfo);
    try {
      const result = await axios.get(`${api_URL}/book${id}`);
      res.render("bookInfo", { book: result.data, usersReview: response.data.review });
    } catch (error) {
      res.render("bookInfo", console.error(error.response.data));
    }
  } catch (error) {
    res.render("bookInfo", console.error(error.response.data));
  }
});

app.post("/editreview", async (req, res) => {
  const review = req.body;
  const id = req.body.bookId;
  try {
    const result = await axios.get(`${api_URL}/book${id}`);
    try {
      const response = await axios.post(`${api_URL}/editreview`, review);
      res.render("bookInfo", { book: result.data, usersReview: response.data.rows[0].review });
    } catch (error) {
      res.render("bookInfo", { book: result.data });
    }
  } catch (error) {
    res.render("bookInfo", console.error(error.response.data));
  }
});

app.post("/deletefromlist", async (req, res) => {
  const request = req.body;
  const id = req.body.bookId;
  try {
    const result = await axios.get(`${api_URL}/book${id}`);

    try {
      await axios.post(`${api_URL}/deletefromlist`, request);
      res.render("bookInfo", { book: result.data });
    } catch (error) {
      res.render("bookInfo", { book: result.data });
    }
  } catch (error) {
    res.render("bookInfo", console.error(error.response.data));
  }
});

app.post("/mylist", async (req, res) => {
  try {
    const response = await axios.post(`${api_URL}/mylist`);
    res.render("index", { books: response.data, author: response.data.author || null });
  } catch (error) {
    res.render("index", console.error(error.response.data));
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
