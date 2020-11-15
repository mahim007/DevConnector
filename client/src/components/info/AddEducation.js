import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroups from "../common/TextFieldGroups";
import TextAreaFieldGroups from "../common/TextAreaFieldGroups";
import { addEducation } from "../../actions/profileActions";

class AddEducation extends Component {
  constructor() {
    super();
    this.state = {
      school: "",
      degree: "",
      fieldOfStudy: "",
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
    const eduData = {
      school: this.state.school,
      degree: this.state.degree,
      fieldOfStudy: this.state.fieldOfStudy,
      from: this.state.from,
      to: this.state.to,
      current: this.state.current,
      description: this.state.description,
    };

    console.log("edu data: ", eduData);

    this.props.addEducation(eduData, this.props.history);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors !== this.state.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="section add-education">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Add Your Education</h1>
              <p className="lead text-center">
                Add any school, bootcamp that you have attended
              </p>
              <small className="d-block pb-3">* = required field</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroups
                  type="text"
                  name="school"
                  placeholder="* School"
                  value={this.state.school}
                  error={errors.school}
                  onChange={this.onChange}
                />
                <TextFieldGroups
                  type="text"
                  name="degree"
                  placeholder="* Degree or Certification"
                  value={this.state.degree}
                  error={errors.degree}
                  onChange={this.onChange}
                />
                <TextFieldGroups
                  type="text"
                  name="fieldOfStudy"
                  placeholder="* Field of study"
                  value={this.state.fieldOfStudy}
                  error={errors.fieldOfStudy}
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
                    Current School
                  </label>
                </div>
                <TextAreaFieldGroups
                  name="description"
                  placeholder="Program Description"
                  value={this.state.description}
                  error={errors.description}
                  info=" Tell us about the program that you are in"
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

AddEducation.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addEducation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors,
});

const mapDispatchToProps = {
  addEducation,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AddEducation));
