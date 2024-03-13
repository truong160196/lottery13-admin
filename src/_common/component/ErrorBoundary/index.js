import React from 'react';
import { isEqual, omit } from 'lodash';

import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error_page">
          <div className="inner">
            <div className="error_title">
              <h1>Oops!</h1>
              <h2>Hệ thông đang bảo trì tính năng này!!!</h2>
            </div>
            <a type="button" href="/" className="btn btn-success">
              Trở về trang chủ
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
