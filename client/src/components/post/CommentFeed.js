import React, { Component } from "react";
import PropTypes from "prop-types";
import CommentItem from "./CommentItem";

class CommentFeed extends Component {
  render() {
    const { comments } = this.props;
    let commentContent = null;

    commentContent = comments.map((comment) => (
      <CommentItem
        key={comment._id}
        comment={comment}
        postId={this.props.postId}
      />
    ));

    return <div className="comments">{commentContent}</div>;
  }
}

CommentFeed.defaultProps = {
  comments: [],
};

CommentFeed.propTypes = {
  comments: PropTypes.array.isRequired,
};

export default CommentFeed;
