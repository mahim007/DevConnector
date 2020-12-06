import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextAreaFieldGroups from "../common/TextAreaFieldGroups";
import { addComment } from "../../actions/postActions";
import { withRouter } from "react-router-dom";

class CommentForm extends Component {
  constructor(props) {
    super();
    this.state = {
      text: "",
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors !== this.state.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    console.log("comment form: ", e.target.value);
    const { user } = this.props.auth;
    const newComment = {
      text: this.state.text,
      name: user.name,
      avatar: user.avatar,
    };

    this.props.addComment(this.props.match.params.id, newComment);
    this.setState({ text: "" });
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">
            Make a comment...
          </div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextAreaFieldGroups
                  placeholder="Reply to post"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={errors.text}
                />
              </div>
              <button type="submit" className="btn btn-dark">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

CommentForm.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
});

const mapDispatchToProps = {
  addComment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CommentForm));
