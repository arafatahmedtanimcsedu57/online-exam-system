import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Button, Typography, Divider, Modal, Popconfirm } from "antd";

import {
  ChangeTrainerSearchText,
  ChangeTrainerTableData,
  ChangeTrainerModalState,
} from "../../../actions/adminAction";

import Alert from "../../../components/common/alert";
import NewTrainerForm from "../newTrainer/newtrainer";

import { SecurePost } from "../../../services/axiosCall";
import apis from "../../../services/Apis";

import "./alltrainer.css";

class AllTrainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TrainertableLoading: false,
    };
  }

  openModal = (id, mode) => {
    this.props.ChangeTrainerModalState(true, id, mode);
  };

  closeModal = () => {
    this.props.ChangeTrainerModalState(false, null, "Register");
  };

  componentDidMount() {
    this.props.ChangeTrainerTableData();
  }

  deleteTrainer = (id) => {
    SecurePost({
      url: `${apis.DELETE_TRAINER}`,
      data: {
        _id: id,
      },
    })
      .then((response) => {
        if (response.data.success) {
          Alert("success", "Success", response.data.message);
          this.props.ChangeTrainerTableData();
        } else {
          return Alert("warning", "Warning!", response.data.message);
        }
      })
      .catch((error) => {
        return Alert("error", "Error!", "Server Error");
      });
  };

  render() {
    const { Title } = Typography;
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: "25%",
      },
      {
        title: "Email Id",
        dataIndex: "emailid",
        key: "emailid",
        width: "25%",
      },
      {
        title: "Contact Number",
        dataIndex: "contact",
        key: "contact",
      },
      {
        title: "Action",
        key: "_id",
        dataIndex: "_id",
        render: (key) => (
          <div className="trainer-list__table-actions">
            <Button
              type="primary"
              shape="circle"
              icon="edit"
              onClick={() => this.openModal(key, "Save Changes")}
            />
            <Divider type="vertical" />
            <Popconfirm
              title="Are you sure？"
              cancelText="No"
              okText="Yes"
              onConfirm={() => {
                this.deleteTrainer(key);
              }}
              // icon={<Icon type="delete" style={{ color: "red" }} />}
            >
              <Button type="danger" shape="circle" icon="delete" />
            </Popconfirm>
          </div>
        ),
      },
    ];
    return (
      <div className="trainer-list">
        <div className="trainer-list__heading">
          <Title level={3}>List of Trainer</Title>

          <Button
            type="primary"
            onClick={() => this.openModal(null, "Register")}
            size="large"
          >
            Add New
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={this.props.admin.trainerTableData}
          size="large"
          pagination={{ pageSize: 5 }}
          loading={this.props.admin.trainerTableLoadingStatus}
          rowKey="_id"
          className="trainer-list__table"
        />

        <Modal
          visible={this.props.admin.TrainermodalOpened}
          title="Add New Trainer"
          onOk={this.handleOk}
          onCancel={this.closeModal}
          destroyOnClose={true}
          footer={[]}
        >
          <NewTrainerForm />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  admin: state.admin,
});

export default connect(mapStateToProps, {
  ChangeTrainerSearchText,
  ChangeTrainerTableData,
  ChangeTrainerModalState,
})(AllTrainer);
