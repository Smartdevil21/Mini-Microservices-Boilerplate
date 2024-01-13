const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });

  commentsByPostId[req.params.id] = comments;

  console.log("Comment Created!", { commentId, content });

  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "PENDING",
    },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log(type);
  if (req.body.type === "CommentModerated") {
    const comments = commentsByPostId[data.postId] || [];
    const comment = comments.find((ele) => ele.id === data.id);
    comment.status = data.status;
    console.log("moderated Comment:", data.id);
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentUpdated",
      data,
    });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
