import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Moment from "react-moment";
import { deleteExperience } from "../../actions/profileActions";

class Experience extends Component {
  onClickDelete(id) {
    console.log("on click delete getting called inside Experience component");
    this.props.deleteExperience(id);
  }
  render() {
    const experience = this.props.experience.map((exp) => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment> -{" "}
          {exp.to ? <Moment format="YYYY/MM/DD">{exp.to}</Moment> : "Present"}
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={this.onClickDelete.bind(this, exp._id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
    return (
      <div>
        <h4 className="mb-4">Experience Credentials</h4>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Years</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{experience}</tbody>
        </table>
      </div>
    );
  }
}

const mapDispatchToProps = {
  deleteExperience,
};

export default connect(null, mapDispatchToProps)(Experience);
