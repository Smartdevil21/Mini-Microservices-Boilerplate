const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log(type);

  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status: "PENDING" });
    console.log("Comment creation and initial insertion.", id);
  }

  if (type === "CommentUpdated") {
    // const { type, data } = req.body;
    console.log("Comment updated!", data.id);

    const comments = posts[data.postId].comments || [];
    const comment = comments.find((ele) => ele.id === data.id);
    comment.status = data.status;
    comment.content = data.content;
    console.log(comment, data);
  }

  res.send({});
});

app.listen(4002, () => {
  console.log("Listening on 4002");
});
