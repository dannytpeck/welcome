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
      programGuideUrl: null,
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

  changeProgramGuideUrl(e) {
    this.setState({ programGuideUrl: e.target.value });
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

    const statusHtmls = {
      status0: `<p>Welcome to EA Wellness! This is your opportunity to:</p><ul><li>Learn about your current health opportunities to help you Grow!</li><li>Participate in challenges that motivate you to Flourish!</li><li>Enroll in wellness events that will inspire you to Thrive and live your best life!</li></ul><p>Read through the <a href="${this.state.programGuideUrl}" target="_blank">program guide</a> to learn what is included in your EA Wellness program.</p><p style="padding-top:10px"><img src="https://cdn.adurolife.com/assets/ea/images/EA_Branding_R1_Incentive_Image_1.png" width="90%" /></p>`,
      status1: `<p>Welcome to EA Wellness! This is your opportunity to:</p><ul><li>Sign up for a Health Check and learn about your current health opportunities to help you Grow!</li><li>Participate in challenges that motivate you to Flourish!</li><li>Enroll in wellness events that will inspire you to Thrive and live your best life!</li></ul><p>Read through the <a href="${this.state.programGuideUrl}" target="_blank">program guide</a> to learn what is included in your EA Wellness program.</p><p>Stay tuned for details regarding your onsite Health Check! Once the event is scheduled, registration information will be posted here. Until then, take advantage of the many resources and engaging challenges on this site, and start earning points!</p><p style="padding-top:10px"><img src="https://cdn.adurolife.com/assets/ea/images/EA_Branding_R1_Incentive_Image_1.png" width="90%" /></p>`,
      status2A: `<p>Welcome to EA Wellness! This is your opportunity to:</p><ul><li>Sign up for a Health Check and learn about your current health opportunities to help you Grow!</li><li>Participate in challenges that motivate you to Flourish!</li><li>Enroll in wellness events that will inspire you to Thrive and live your best life!</li></ul><p>Read through the <a href="${this.state.programGuideUrl}" target="_blank">program guide</a> to learn what is included in your EA Wellness program.</p><p>Sign up for your onsite Health Check event here using the <a href="${this.state.schedulerUrl}" target="_blank">online scheduler</a>.</p><p><strong>Note: </strong>Use the same ID as when you activated your account! Enter your Medical Mutual ID # followed by <strong>00</strong> (primary subscriber), <strong>01</strong> (spouse), or <strong>02</strong>+ (dependents), with no spaces.</p><p>If you are unable to attend the event, please contact EA Wellness at <a href="mailto:eawellness@theea.org">eawellness@theea.org</a> to determine what alternatives may be available.</p><p><img src="https://cdn.adurolife.com/assets/ea/images/EA_Branding_R1_Incentive_Image_1.png" alt="" width="90%" /></p>`,
      status2B: `<p>Welcome to EA Wellness! This is your opportunity to:</p><ul><li>Sign up for a Health Check and learn about your current health opportunities to help you Grow!</li><li>Participate in challenges that motivate you to Flourish!</li><li>Enroll in wellness events that will inspire you to Thrive and live your best life!</li></ul><p>Read through the <a href="${this.state.programGuideUrl}" target="_blank">program guide</a> to learn what is included in your EA Wellness program.</p><p>Your Health Check event is coming up; keep an eye out for an e-mail with your appointment information. If you need to switch to a different time, please contact your HR department to see if there are other available time slots.</p><p style="padding-top:10px"><p style="padding-top:10px"><img src="https://cdn.adurolife.com/assets/ea/images/EA_Branding_R1_Incentive_Image_1.png" width="90%" /></p>`,
      status2C: `<p>Welcome to EA Wellness! This is your opportunity to:</p><ul><li>Sign up for a Health Check and learn about your current health opportunities to help you Grow!</li><li>Participate in challenges that motivate you to Flourish!</li><li>Enroll in wellness events that will inspire you to Thrive and live your best life!</li></ul><p>Read through the <a href="${this.state.programGuideUrl}" target="_blank">program guide</a> to learn what is included in your EA Wellness program.</p><p>Your Health Check event is coming up; keep an eye out for communications from your HR Department or a paper sign-up sheet to schedule your appointment. Please contact your HR Department if you have any questions about reserving a time slot.</p><p style="padding-top: 10px;"><img src="https://cdn.adurolife.com/assets/ea/images/EA_Branding_R1_Incentive_Image_1.png" alt="" width="90%" /></p>`,
      status3: `<p>Welcome to EA Wellness! This is your opportunity to:</p><ul><li>Sign up for a Health Check and learn about your current health opportunities to help you Grow!</li><li>Participate in challenges that motivate you to Flourish!</li><li>Enroll in wellness events that will inspire you to Thrive and live your best life!</li></ul><p>Read through the <a href="${this.state.programGuideUrl}" target="_blank">program guide</a> to learn what is included in your EA Wellness program.</p><p>Your onsite Health Check event for the year has passed. However, you still may have options for completing your Health Check requirement! If you were unable to attend the event, please contact EA Wellness at <a href="mailto:eawellness@theea.org">eawellness@theea.org</a> to determine what alternatives may be available.</p><p style="padding-top:10px"><img src="https://cdn.adurolife.com/assets/ea/images/EA_Branding_R1_Incentive_Image_1.png" width="90%" /></p>`
    };

    const employerName = this.state.selectedClient.fields['Limeade e='];
    const eventId = $('#eventId').val();
    const htmlDescription = statusHtmls[this.state.selectedStatus];
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
            <label htmlFor="status">Status</label>
            <select id="status" className="form-control custom-select" onChange={(e) => this.selectStatus(e)}>
              <option defaultValue>Select a Status</option>
              <option value="status0">Status 0</option>
              <option value="status1">Status 1</option>
              <option value="status2A">Status 2A</option>
              <option value="status2B">Status 2B</option>
              <option value="status2C">Status 2C</option>
              <option value="status3">Status 3</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="programGuideUrl">Program Guide URL</label>
            <input type="text" className="form-control" id="programGuideUrl" onChange={(e) => this.changeProgramGuideUrl(e)} />
          </div>

          <div className="form-group">
            <label htmlFor="schedulerUrl">Scheduler URL (if applicable)</label>
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
