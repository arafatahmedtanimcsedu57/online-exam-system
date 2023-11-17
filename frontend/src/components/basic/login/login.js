import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Input, Button } from "antd";
import { login, logout } from "../../../actions/loginAction";

import auth from "../../../services/AuthServices";
import Alert from "../../common/alert";

import "./login.css";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        auth
          .LoginAuth(values.email, values.password)
          .then((response) => {
            if (response.data.success) {
              this.props.login(response.data.user);
              auth.storeToken(response.data.token);
              this.setState({
                isLoggedIn: true,
              });
            } else {
              return Alert("error", "Error!", response.data.message);
            }
          })
          .catch((error) => {
            return Alert("error", "Error!", "Server Error");
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    if (this.state.isLoggedIn) {
      return <Redirect to={this.props.user.userOptions[0].link} />;
    } else {
      return (
        <div className="login-container">
          <div>
            <Form onSubmit={this.handleSubmit}>
              <Form.Item label="Email" hasFeedback>
                {getFieldDecorator("email", {
                  rules: [
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                    {
                      required: true,
                      message: "Please input your E-mail!",
                    },
                  ],
                })(<Input size="large" placeholder="Email" />)}
              </Form.Item>
              <Form.Item label="Password" hasFeedback>
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: "Please input your Password!",
                    },
                  ],
                })(
                  <Input size="large" type="password" placeholder="Password" />
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" block>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      );
    }
  }
}

const LoginForm = Form.create({ name: "login" })(Login);

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  login,
  logout,
})(LoginForm);
