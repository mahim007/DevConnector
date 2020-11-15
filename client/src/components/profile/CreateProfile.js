import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import TextFieldGroups from "../common/TextFieldGroups";
import SelectListGroup from "../common/SelectListGroups";
import TextAreaFieldGroups from "../common/TextAreaFieldGroups";
import InputGroups from "../common/InputGroups";
import { createProfile, getCurrentProfile } from "../../actions/profileActions";
import { Link, withRouter } from "react-router-dom";
import isEmpty from "../../validation/is-empty";

class CreateProfile extends Component {
  constructor(props) {
    super();
    this.state = {
      displaySocialInputs: false,
      handle: "",
      company: "",
      website: "",
      location: "",
      status: "",
      skills: "",
      githubUserName: "",
      bio: "",
      twitter: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      instagram: "",
      errors: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.location.pathname === "/edit-profile") {
      this.props.getCurrentProfile();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors !== this.state.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (!isEmpty(nextProps.profile.profile)) {
      const { profile } = nextProps.profile;

      let skills = profile.skills.join(",");

      profile.social = profile.social || {};

      this.setState({
        handle: profile.handle,
        company: profile.company || "",
        website: profile.website || "",
        location: profile.location || "",
        status: profile.status,
        skills: skills,
        githubUserName: profile.githubUserName || "",
        bio: profile.bio || "",
        twitter: profile.social.twitter || "",
        facebook: profile.social.facebook || "",
        linkedin: profile.social.linkedin || "",
        youtube: profile.social.youtube || "",
        instagram: profile.social.instagram || "",
      });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      handle: this.state.handle,
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      githubUserName: this.state.githubUserName,
      bio: this.state.bio,
      twitter: this.state.twitter,
      facebook: this.state.facebook,
      linkedin: this.state.linkedin,
      youtube: this.state.youtube,
      instagram: this.state.instagram,
    };

    this.props.createProfile(userData, this.props.history);
  }

  onClick(e) {
    e.preventDefault();
    this.setState((prevState) => ({
      displaySocialInputs: !prevState.displaySocialInputs,
    }));
  }

  render() {
    const { errors, displaySocialInputs } = this.state;

    let socialInputs;
    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroups
            placeholder="Twitter Profile URL"
            name="twitter"
            icon="fab fa-twitter"
            value={this.state.twitter}
            error={errors.twitter}
            onChange={this.onChange}
          />
          <InputGroups
            placeholder="Facebook Profile URL"
            name="facebook"
            icon="fab fa-facebook"
            value={this.state.facebook}
            error={errors.facebook}
            onChange={this.onChange}
          />
          <InputGroups
            placeholder="Youtube Profile URL"
            name="youtube"
            icon="fab fa-youtube"
            value={this.state.youtube}
            error={errors.youtube}
            onChange={this.onChange}
          />
          <InputGroups
            placeholder="Linkedin Profile URL"
            name="linkedin"
            icon="fab fa-linkedin"
            value={this.state.linkedin}
            error={errors.linkedin}
            onChange={this.onChange}
          />
          <InputGroups
            placeholder="Instagram Profile URL"
            name="instagram"
            icon="fab fa-instagram"
            value={this.state.instagram}
            error={errors.instagram}
            onChange={this.onChange}
          />
        </div>
      );
    }

    const options = [
      { label: "* Select Professional Status", value: 0 },
      { label: "Developer", value: "Developer" },
      { label: "Junior Developer", value: "Junior Developer" },
      { label: "Senior Developer", value: "Senior Developer" },
      { label: "Manager", value: "Manager" },
      { label: "Student or Learning", value: "Student or Learning" },
      { label: "Instructor or Teacher", value: "Instructor or Teacher" },
      { label: "Intern", value: "Intern" },
      { label: "Other", value: "Other" },
    ];

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Create Your Profile</h1>
              <p className="lead text-center">
                Let's get some information to make your profile stand out
              </p>
              <small className="d-block pb-3">* = require fields</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroups
                  placeholder="* Profile handle"
                  name="handle"
                  value={this.state.handle}
                  onChange={this.onChange}
                  error={errors.handle}
                  info="A unique handle for your profile URL. Your full name, company name, nickname"
                />
                <SelectListGroup
                  placeholder="Status"
                  name="status"
                  value={this.state.status}
                  onChange={this.onChange}
                  error={errors.status}
                  info="Give us an idea about where you are at in your career"
                  options={options}
                />
                <TextFieldGroups
                  placeholder="Company"
                  name="company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.company}
                  info="Could be your own company or the one work for"
                />
                <TextFieldGroups
                  placeholder="Website"
                  name="website"
                  value={this.state.website}
                  onChange={this.onChange}
                  error={errors.website}
                  info="Could be your own website or a company one"
                />
                <TextFieldGroups
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                  info="City or the city & state suggested"
                />
                <TextFieldGroups
                  placeholder="* Skills"
                  name="skills"
                  value={this.state.skills}
                  onChange={this.onChange}
                  error={errors.skills}
                  info="Please use comma separated values (eg. HTML, CSS, JavaScript, PHP)"
                />
                <TextFieldGroups
                  placeholder="Gihub Username"
                  name="githubUserName"
                  value={this.state.githubUserName}
                  onChange={this.onChange}
                  error={errors.githubUserName}
                  info="If you want your latest repos and a Github link, include your username"
                />
                <TextAreaFieldGroups
                  placeholder="Short Bio"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={errors.bio}
                  info="Tell us a little about yourself"
                />

                <div className="mb-3">
                  <button className="btn btn-light" onClick={this.onClick}>
                    Add Social Netword Links
                  </button>
                  <span className="text-muted">Optional</span>
                </div>
                {socialInputs}
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors,
});

const mapDispatchToProps = {
  createProfile,
  getCurrentProfile,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreateProfile));
