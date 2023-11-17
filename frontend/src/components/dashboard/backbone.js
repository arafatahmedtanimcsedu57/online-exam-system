import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import queryString from "query-string";
import { Layout, Menu, Icon } from "antd";

import AllTrainer from "../admin/allTrainer/alltrainer";
import AllTopics from "../admin/allTopics/alltopics.js";

import AllQuestions from "../trainer/allquestions/allquestion";
import AllTests from "../trainer/alltests/alltest";
import ConductTest from "../trainer/conducttest/conducttest";
import NewTest from "../trainer/newtest/newtest";

import Welcome from "./welcome";
import AdminInstraction from "./adminInstraction.js";
import TrainerInstraction from "./trainerInstruction.js";
import ErrorPage from "./errorPage";

import Alert from "../common/alert";

import { login, logout } from "../../actions/loginAction";
import { changeActiveRoute } from "../../actions/useraction";

import auth from "../../services/AuthServices";

import "./backbone.css";

const { Sider, Content } = Layout;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LocalIsLoggedIn: this.props.user.isLoggedIn,
      collapsed: true,
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  logOut = () => {
    auth.deleteToken();
    window.location.href = "/";
  };

  componentWillMount() {
    var t = auth.retriveToken();
    if (this.state.LocalIsLoggedIn) {
    } else if (t && t !== "undefined") {
      auth
        .FetchAuth(t)
        .then((response) => {
          this.props.login(response.data.user);
          this.setState({
            LocalIsLoggedIn: true,
          });
          var subUrl = this.props.match.params.options;
          var obj = this.props.user.userOptions.find((o, i) => {
            if (o.link === `/user/${subUrl}`) {
              return o;
            }
          });
          var tt = this.props.user.userOptions.indexOf(obj);
          if (tt === -1) {
            window.location.href = `${this.props.user.userOptions[0].link}`;
          } else {
            this.props.changeActiveRoute(String(tt));
          }
        })
        .catch((error) => {
          Alert("warning", "Warning!", "Server Error.");
          auth.deleteToken();
          window.location.href = "/";
        });
    } else {
      window.location = "/";
    }
  }

  render() {
    let torender = null;
    if (this.props.match.params.options === "listtrainers") {
      torender = <AllTrainer />;
    } else if (this.props.match.params.options === "listsubjects") {
      torender = <AllTopics />;
    } else if (this.props.match.params.options === "listquestions") {
      torender = <AllQuestions />;
    } else if (this.props.match.params.options === "listtests") {
      torender = <AllTests />;
    } else if (this.props.match.params.options === "home") {
      torender = (
        <Welcome>
          {this.props.user.userDetails.type === "TRAINER" && (
            <TrainerInstraction />
          )}
          {this.props.user.userDetails.type === "ADMIN" && <AdminInstraction />}
        </Welcome>
      );
    } else if (this.props.match.params.options === "newtest") {
      torender = <NewTest />;
    } else if (this.props.match.params.options === "conducttest") {
      let params = queryString.parse(this.props.location.search);
      torender = <ConductTest {...params} />;
    } else {
      torender = <ErrorPage />;
    }

    console.log(this.props.user, this.props.user.userDetails.type);

    return (
      <Layout className="wrapper--backbone">
        <Sider
          theme="light"
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.toggle}
        >
          <div className="logo11" />
          <Menu
            defaultSelectedKeys={[this.props.user.activeRoute]}
            mode="inline"
            theme="light"
          >
            {this.props.user.userOptions.map((d, i) => {
              return (
                <Menu.Item key={i}>
                  <Icon type={d.icon} />
                  <span>{d.display}</span>
                  <Link to={d.link}></Link>
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>

        {/* <Tooltip placement="bottom" title="Log Out">
                  <Button
                    type="primary"
                    size="large"
                    shape="circle"
                    onClick={this.logOut}
                    className="logout-button"
                  >
                    <Icon type="logout" />
                  </Button>
                </Tooltip> */}

        <Content>
          <div style={{ width: "100%" }}>{torender}</div>
        </Content>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  changeActiveRoute,
  login,
  logout,
})(Dashboard);
