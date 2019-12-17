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
      selectedStatus: null,
      schedulerUrl: null
    };

    this.createCSV = this.createCSV.bind(this);
    this.uploadToLimeade = this.uploadToLimeade.bind(this);
  }

  componentDidMount() {
    $.getJSON('https://api.airtable.com/v0/appHXXoVD1tn9QATh/Clients?api_key=keyCxnlep0bgotSrX&view=sorted').done(data => {
      let records = data.records.filter(record => record.fields['Limeade e='].includes('EAWellness'));

      if (data.offset) {
        $.getJSON(`https://api.airtable.com/v0/appHXXoVD1tn9QATh/Clients?api_key=keyCxnlep0bgotSrX&view=sorted&offset=${data.offset}`).done(data => {
          this.setState({
            clients: [...records, ...data.records.filter(record => record.fields['Limeade e='].includes('EAWellness'))]
          });
        });
      } else {
        this.setState({
          clients: records
        });
      }

    });
  }

  selectClient(e) {
    this.state.clients.forEach(client => {
      if (client.fields['Limeade e='] === e.target.value) {
        this.setState({ selectedClient: client });
      }
    });
  }

  selectStatus(e) {
    this.setState({ selectedStatus: e.target.value });
  }

  changeSchedulerUrl(e) {
    this.setState({ schedulerUrl: e.target.value });
  }

  createCSV() {
    let data = [[
      'EmployerName',
      'EventId',
      'EventName',
      'DisplayPriority',
      'RewardType',
      'PointsAwarded',
      'RewardDescription',
      'AllowSameDayDuplicates',
      'IsOngoing',
      'IsDisabled',
      'ShowInProgram',
      'IsSelfReport',
      'DataFeedMode',
      'Notify',
      'ButtonText',
      'TargetUrl',
      'EventImageUrl',
      'MaxOccurrences',
      'StartDate',
      'EndDate',
      'ViewPages',
      'Dimensions',
      'ShortDescription',
      'HtmlDescription',
      'SubgroupId',
      'Field1Name',
      'Field1Value',
      'Field2Name',
      'Field2Value',
      'Field3Name',
      'Field3Value'
    ]];

    const optionHtmls = {
      optionA: `<p>Welcome to EA Wellness! This is your opportunity to:</p><ul><li>Sign up for a Health Check and learn about your current health opportunities to help you Grow!</li><li>Participate in challenges that motivate you to Flourish!</li><li>Enroll in wellness events that will inspire you to Thrive and live your best life!</li></ul><p>Sign up for your onsite Health Check event here using the <strong><a href="${this.state.schedulerUrl}" target="_blank" rel="noopener">online scheduler</a>.</strong></p><p>If you are unable to attend the event, please contact EA Wellness at <a href="mailto:eawellness@theea.org">eawellness@theea.org</a> to determine what alternatives may be available.</p><p><img src="https://cdn.adurolife.com/assets/ea/images/EA_Branding_R1_Incentive_Image_1.png" alt="" width="90%" /></p>`,
      optionB: '<p>Welcome to EA Wellness! This is your opportunity to:</p><ul><li>Sign up for a Health Check and learn about your current health opportunities to help you Grow!</li><li>Participate in challenges that motivate you to Flourish!</li><li>Enroll in wellness events that will inspire you to Thrive and live your best life!</li></ul><p>When an onsite event is scheduled, HR will reach out with instructions on how to sign up.</p><p><img src="https://cdn.adurolife.com/assets/ea/images/EA_Branding_R1_Incentive_Image_1.png" alt="" width="90%" /></p>',
      optionC: '<p>Welcome to EA Wellness! This is your opportunity to:</p><ul><li>Learn about your current health opportunities to help you Grow!</li><li>Participate in challenges that motivate you to Flourish!</li><li>Enroll in wellness events that will inspire you to Thrive and live your best life!</li></ul><p style="padding-top: 10px;"><img src="https://mywellnessnumbers.com/EmployersAssociation/images/EA_Branding_R1_Incentive_Image_1.png" width="90%" /></p>'
    };

    const employerName = this.state.selectedClient.fields['Limeade e='];
    const eventId = $('#eventId').val();
    const htmlDescription = optionHtmls[this.state.selectedStatus];
    const groupTargetingValue = $('#targetingGroup').val();

    const cie = [
      employerName,
      eventId,
      'Welcome to EA Wellness',
      '1',
      'IncentivePoints',
      '0',
      '',
      '0',
      '0',
      '0',
      '1',
      '0',
      '0',
      '0',
      '',
      '',
      'https://d2qv7eqemtyl41.cloudfront.net/PDW/f37a28f2-007f-48c3-a8e7-21a75065f0c4-large.jpg',
      '1',
      '',
      '',
      '',
      '',
      '',
      htmlDescription.replace(/,/g, '&comma;'),
      '',
      'Group',
      groupTargetingValue,
      '',
      '',
      '',
      ''
    ];

    data.push(cie);

    return data;
  }

  uploadToLimeade(csv) {
    const headers = csv[0].join(',');
    const url = 'https://calendarbuilder.dev.adurolife.com/limeade-upload/';

    const oneIncentiveEvent = csv[1].join(',');

    const params = {
      e: this.state.selectedClient.fields['Limeade e='],
      psk: this.state.selectedClient.fields['Limeade PSK'],
      data: headers + '\n' + oneIncentiveEvent,
      type: 'IncentiveEvents'
    };

    // Open Modal
    $('#uploadModal').modal('show');
    $('#uploadModalBody').html('<p>Uploading...</p>');

    $.post(url, params).done(function(response) {
      $('#uploadModalBody').append(`<p>${response}</p>`);
      console.log(response);
    });

  }

  sendToLimeade(e) {
    e.preventDefault();

    const csv = this.createCSV();
    console.log(csv);
    this.uploadToLimeade(csv);
  }

  // Unused, could be a good future feature but I just created it for debugging
  downloadCSV(e) {
    e.preventDefault();

    let data = this.createCSV();
    let csvContent = '';
    data.forEach(function (infoArray, index) {
      var dataString = infoArray.join(',');
      csvContent += index < (data.length - 1) ? dataString + '\n' : dataString;
    });

    let file = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    let filename = 'download.csv';

    let link = document.createElement('a');
    link.setAttribute('download', filename);
    link.setAttribute('href', file);
    link.click();
  }

  render() {
    return (
      <div id="app">
        <Header />

        <form>
          <div className="form-group">
            <label htmlFor="platform">Platform</label>
            <select id="platform" className="form-control custom-select" onChange={(e) => this.selectClient(e)}>
              <option defaultValue>Select a Platform</option>
              <option value="EAWellnessJanuary">January</option>
              <option value="EAWellnessFebruary">February</option>
              <option value="EAWellnessMarch">March</option>
              <option value="EAWellnessApril">April</option>
              <option value="EAWellnessMay">May</option>
              <option value="EAWellnessJune">June</option>
              <option value="EAWellnessJuly">July</option>
              <option value="EAWellnessAugust">August</option>
              <option value="EAWellnessSeptember">September</option>
              <option value="EAWellnessOctober">October</option>
              <option value="EAWellnessNovember">November</option>
              <option value="EAWellnessDecember">December</option>
              <option value="EAWellnessMifflin">Mifflin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="eventId">Event ID</label>
            <input type="text" className="form-control" id="eventId" />
          </div>

          <div className="form-group">
            <label htmlFor="status">Welcome Tile Option</label>
            <select id="status" className="form-control custom-select" onChange={(e) => this.selectStatus(e)}>
              <option defaultValue>Select an Option</option>
              <option value="optionA">Option A: Online Scheduler</option>
              <option value="optionB">Option B: Talk to HR</option>
              <option value="optionC">Option C: No Event Ever</option>
            </select>
          </div>

          <div className="form-group" style={{ display: this.state.selectedStatus === 'optionA' ? 'block' : 'none' }}>
            <label htmlFor="schedulerUrl">Scheduler URL</label>
            <input type="text" className="form-control" id="schedulerUrl" onChange={(e) => this.changeSchedulerUrl(e)} />
          </div>

          <div className="form-group">
            <label htmlFor="targetingGroup">Targeting Group</label>
            <input type="text" className="form-control" id="targetingGroup" />
          </div>

          <button type="submit" className="btn btn-primary" onClick={(e) => this.sendToLimeade(e)}>Submit</button>
        </form>


        <Footer />
        <Modal />
      </div>
    );
  }
}

export default App;
