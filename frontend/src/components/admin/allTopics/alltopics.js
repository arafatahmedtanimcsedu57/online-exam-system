import React, { Component } from "react";
import { Table, Button, Typography, Modal } from "antd";
import { connect } from "react-redux";

import {
  ChangeSubjectSearchText,
  ChangeSubjectTableData,
  ChangeSubjectModalState,
} from "../../../actions/adminAction";

import NewSubjectForm from "../newTopics/newtopics";

import "./alltopics.css";

class AllTopics extends Component {
  openModal = (id, mode) => {
    this.props.ChangeSubjectModalState(true, id, mode);
  };

  closeModal = () => {
    this.props.ChangeSubjectModalState(false, null, "New Topic");
  };

  componentDidMount() {
    this.props.ChangeSubjectTableData();
  }

  render() {
    const { Title } = Typography;
    const columns = [
      {
        title: "Name",
        dataIndex: "topic",
        key: "topic",
        width: "70%",
      },
      {
        title: "Action",
        key: "_id",
        dataIndex: "_id",
        render: (key) => (
          <span>
            <Button
              type="primary"
              shape="circle"
              icon="edit"
              onClick={() => this.openModal(key, "Save Changes")}
            />
          </span>
        ),
      },
    ];
    return (
      <div className="subject-list">
        <div className="trainer-list__heading">
          <Title level={3}>List of Subjects</Title>
          <Button
            type="primary"
            onClick={() => this.openModal(null, "New Topic")}
            size="large"
          >
            Add New
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={this.props.admin.subjectTableData}
          size="large"
          pagination={{ pageSize: 5 }}
          loading={this.props.admin.SubjectTableLoading}
          rowKey="_id"
          className="subject-list__table"
        />

        <Modal
          visible={this.props.admin.SubjectmodalOpened}
          title="Add New Subject"
          onOk={this.handleOk}
          onCancel={this.closeModal}
          destroyOnClose={true}
          footer={[]}
        >
          <NewSubjectForm />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  admin: state.admin,
});

export default connect(mapStateToProps, {
  ChangeSubjectSearchText,
  ChangeSubjectTableData,
  ChangeSubjectModalState,
})(AllTopics);
