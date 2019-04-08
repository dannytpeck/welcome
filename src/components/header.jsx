import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <header id="header">
        <img src="images/logo.svg" />
        <h1 className="title">Welcome</h1>
        <h3>Please take off your shoes</h3>
      </header>
    );
  }
}

export default Header;
