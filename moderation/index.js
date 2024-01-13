const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log(type);
  if (type === "CommentCreated") {
    if (data.content.includes("orange")) {
      data.status = "DECLINED";
    } else {
      data.status = "APPROVED";
    }
    console.log("Comment Moderated:", data);
    await axios.post("http://event-bus-srv:4005/events", {
      type: "CommentModerated",
      data,
    });
  }
  res.send({ status: "OK" });
});

app.listen(4003, () => {
  console.log(`Moderator service listening on port ${4003}...`);
});
