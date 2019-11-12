/* eslint-disable no-undef */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { toast } from "components/Toast";
import _ from "lodash";
import { axios } from "utils.js";
import { withRouter } from "react-router-dom";

const uuidv4 = require("uuid/v4");

class CTA extends Component {
  state = {
    email: null
  };

  handleEmailChange = event => {
    this.setState({
      email: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.startTrackingLead();

    if (this.props.variant === "mobile") {
      this.sendEmail();
      toast(
        "We sent you an email with this link. Check it out when you're back on your computer!"
      );
    } else {
      toast("Thanks! We've added you to the waitlist.");
    }
    this.setState({
      email: null
    });
  };

  startTrackingLead = () => {
    const id = uuidv4();
    const source = _.upperCase(this.props.source);

    // @ts-ignore
    analytics.identify(id, {
      email: this.state.email,
      status: source,
      page: `https://www.modulo.blog${this.props.location.pathname}`
    });

    // @ts-ignore
    if (this.props.variant === "mobile") analytics.track("Link Requested");
    // @ts-ignore
    else analytics.track("Lead Captured");
  };

  sendEmail = () => {
    const url = `https://www.modulo.blog${this.props.location.pathname}`;
    // console.log("Sent email to", url);
    axios.post("/v1/send_article", { url, email: this.state.email });
  };

  renderLarge() {
    return (
      <form onSubmit={this.handleSubmit} className="flex flex-col">
        <div className="w-full sm:w-88">
          <input
            id="cta-email-input"
            type="email"
            placeholder="Email"
            className="rounded py-2 pl-3 text-dark-black w-full bg-white mb-2 text-lg border border-gray-300"
            onChange={this.handleEmailChange}
            required
          />
          <button className="bg-pink-100 hover:bg-pink-200 text-pink-500 border-2 border-pink-500 font-semibold rounded py-3 px-3 w-full text-lg shadow-md focus:shadow-none">
            Get Early Access
          </button>
        </div>
      </form>
    );
  }

  renderSmall() {
    return (
      <form onSubmit={this.handleSubmit} className="flex">
        <input
          id="cta-email-input"
          type="email"
          placeholder="Email"
          className="rounded h-12 pl-3 text-dark-black w-80 bg-gray-200 mb-2 text-lg border-1 border-gray-300"
          onChange={this.handleEmailChange}
          required
        />
        <button className="ml-2 bg-pink-500 hover:bg-pink-600 text-pink-100 font-semibold rounded h-12 px-5 text-lg shadow-md focus:shadow-none">
          Get Early Access
        </button>
      </form>
    );
  }

  renderMobile() {
    return (
      <form onSubmit={this.handleSubmit} className="flex w-full justify-center">
        <input
          id="cta-email-input"
          type="email"
          placeholder="Email"
          className="rounded h-10 pl-3 text-black w-2/3 max-w-xs bg-white mb-2 text-base border-1 border-gray-300"
          onChange={this.handleEmailChange}
          required
        />
        <button
          style={{ maxWidth: "8rem", minWidth: "7rem" }}
          className="w-1/3 ml-2 bg-black-2 hover:bg-black text-white font-medium rounded h-10 px-3 text-base shadow-md focus:shadow-none"
        >
          Remind Me
        </button>
      </form>
    );
  }

  render() {
    return (
      (this.props.variant === "large" && this.renderLarge()) ||
      (this.props.variant === "small" && this.renderSmall()) ||
      (this.props.variant === "mobile" && this.renderMobile())
    );
  }
}

export default withRouter(CTA);

CTA.propTypes = {
  source: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["mobile", "small", "large"])
};

CTA.defaultProps = {
  variant: "large"
};
