import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Button } from "antd";

import { SecurePost } from "../../../services/axiosCall";
import apis from "../../../services/Apis";

import {
  ChangeSubjectConfirmDirty,
  ChangeSubjectTableData,
  ChangeSubjectModalState,
} from "../../../actions/adminAction";

import Alert from "../../../components/common/alert";

import "./newtopic.css";
class NewTopics extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        SecurePost({
          url: `${apis.CREATE_SUBJECT}`,
          data: {
            _id: this.props.admin.SubjectId,
            topic: values.topic,
          },
        })
          .then((response) => {
            if (response.data.success) {
              this.props.ChangeSubjectModalState(false, null, "New Topic");
              Alert("success", "Success", response.data.message);
              this.props.ChangeSubjectTableData();
            } else {
              this.props.ChangeSubjectModalState(false, null, "New Topic");
              return Alert("warning", "Warning!", response.data.message);
            }
          })
          .catch((error) => {
            this.props.ChangeSubjectModalState(false, null, "New Topic");
            return Alert("error", "Error!", "Server Error");
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label="Topic Name" hasFeedback>
              {getFieldDecorator("topic", {
                initialValue: this.props.admin.subjectDetails.topic,
                rules: [
                  {
                    required: true,
                    message: "Please input topic name!",
                    whitespace: true,
                  },
                ],
              })(<Input size="large" />)}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                {this.props.admin.Subjectmode}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  admin: state.admin,
});

const NewSubjectForm = Form.create({ name: "register" })(NewTopics);

export default connect(mapStateToProps, {
  ChangeSubjectConfirmDirty,
  ChangeSubjectTableData,
  ChangeSubjectModalState,
})(NewSubjectForm);
