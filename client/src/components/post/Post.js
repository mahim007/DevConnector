import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getPost } from "../../actions/postActions";
import { Link } from "react-router-dom";
import CommentForm from "./CommentForm";
import PostItem from "../posts/PostItem";
import Spinner from "../common/Spinner";
import CommentFeed from "./CommentFeed";

class Post extends Component {
  componentDidMount() {
    this.props.getPost(this.props.match.params.id);
  }

  render() {
    const { post, loading } = this.props.posts;
    let postContent;

    if (post === null || loading || Object.keys(post).length === 0) {
      postContent = <Spinner />;
    } else {
      postContent = <PostItem post={post} showActions={false} />;
    }

    return (
      <div className="post">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to={"/feed"} className="btn btn-light mb-3">
                Bact to feed
              </Link>
              {/* <!-- Post Item --> */}
              {postContent}
              {/* <!-- Comment Form --> */}
              <CommentForm />
              {/* <!-- Comment Feed --> */}
              <CommentFeed comments={post.comments} postId={post._id} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  posts: PropTypes.object.isRequired,
  getPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
});

const mapDispatchToProps = {
  getPost,
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
