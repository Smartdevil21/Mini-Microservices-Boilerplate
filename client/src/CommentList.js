import React from "react";

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content;

    if (comment.status === "APPROVED") {
      content = comment.content;
    }

    if (comment.status === "PENDING") {
      content = "This comment is awaiting moderation";
    }

    if (comment.status === "DECLINED") {
      content = "This comment has been rejected";
    }

    return <li key={comment.id}>{content}</li>;
  });

  // console.log({ renderedComments, comments });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
