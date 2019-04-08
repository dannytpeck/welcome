import React, { Component } from 'react';

import Header from './header';
import Footer from './footer';
import Modal from './modal';

/* globals $ */
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: [],
      selectedClient: null,
      tiles: []
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <div id="app">
        <Header />

        <div className="form-group">
          <label htmlFor="employerName">EmployerName</label>
          <select id="employerName" className="form-control custom-select" onChange={(e) => this.setSelectedClient(e)}>
            <option defaultValue>Select Employer</option>
            {this.renderEmployerNames()}
          </select>
        </div>

        <button type="button" className="btn btn-primary" onClick={() => this.getActivitiesForOneClient(this.state.selectedClient)}>What on My Home Page?</button>
        <p>(show's the home page as seen by the Admin)</p>

        <div id="tileContainer">
          {this.renderTiles()}
        </div>

        <Footer />
        <Modal />
      </div>
    );
  }
}

export default App;
