import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroups from "../common/TextFieldGroups";
import TextAreaFieldGroups from "../common/TextAreaFieldGroups";
import { addExperience } from "../../actions/profileActions";

class AddExperience extends Component {
  constructor() {
    super();
    this.state = {
      company: "",
      title: "",
      location: "",
      from: "",
      to: "",
      current: false,
      description: "",
      errors: {},
      disabled: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCheck = this.onCheck.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    console.log(e.target.name, e.target.value);
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  onCheck(e) {
    //e.preventDefault();
    console.log(e.target.name, e.target.value);
    this.setState({
      current: !this.state.current,
      disabled: !this.state.current,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    console.log(e.target.name, e.target.value);
    const expData = {
      company: this.state.company,
      title: this.state.title,
      location: this.state.location,
      from: this.state.from,
      to: this.state.to,
      current: this.state.current,
      description: this.state.description,
    };

    this.props.addExperience(expData, this.props.history);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors !== this.state.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="section add-experience">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Add Your Experience</h1>
              <p className="lead text-center">
                Add any developer/programming positions that you have had in the
                past
              </p>
              <small className="d-block pb-3">* = required field</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroups
                  type="text"
                  name="title"
                  placeholder="* Job Title"
                  value={this.state.title}
                  error={errors.title}
                  onChange={this.onChange}
                />
                <TextFieldGroups
                  type="text"
                  name="company"
                  placeholder="* Company"
                  value={this.state.company}
                  error={errors.company}
                  onChange={this.onChange}
                />
                <TextFieldGroups
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={this.state.location}
                  error={errors.location}
                  onChange={this.onChange}
                />
                <h6>From Date</h6>
                <TextFieldGroups
                  type="date"
                  name="from"
                  value={this.state.from}
                  error={errors.from}
                  onChange={this.onChange}
                />
                <h6>To Date</h6>
                <TextFieldGroups
                  type="date"
                  name="to"
                  value={this.state.to}
                  error={errors.to}
                  onChange={this.onChange}
                  disabled={this.state.disabled ? "disabled" : ""}
                />
                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="current"
                    value={this.state.current}
                    checked={this.state.current}
                    onChange={this.onCheck}
                    id="current"
                  />
                  <label className="form-check-label" htmlFor="current">
                    Current Job
                  </label>
                </div>
                <TextAreaFieldGroups
                  name="description"
                  placeholder="Job Description"
                  value={this.state.description}
                  error={errors.description}
                  info=" Some of your responsabilities, etc"
                  onChange={this.onChange}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddExperience.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addExperience: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors,
});

const mapDispatchToProps = {
  addExperience,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddExperience));
