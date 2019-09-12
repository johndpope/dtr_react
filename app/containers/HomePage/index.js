/*
 * HomePage
 *
 *
 */

import React, { memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectSaga from 'utils/injectSaga'
import injectReducer from 'utils/injectReducer'
import reducer from './reducer';
import saga from './saga';

import {
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Fab,
  Select,
  MenuItem,
  TextField,
  CircularProgress
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import GetAppIcon from '@material-ui/icons/GetApp';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';

import { withStyles } from '@material-ui/core/styles';
import { DEFAULT_STYLES } from './constants';
import MomentUtils from '@date-io/moment';

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { exportExcel, setLoading } from './actions';
import { makeLogout } from '../LoginPage/actions';

const key = 'home';

const styles = () => (DEFAULT_STYLES);

const withReducer = injectReducer({ key, reducer });
const withSaga = injectSaga({ key, saga });

class LoginPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      template: 1,
      exportName: 'new_excel',
      project: 'Command Center',
      client: 'Metrobank',
      data: null,
      url: null
    }
  }

  downloadBlob = (url, filename = 'interim.xlsx') => {
    
    // Create a new anchor element
    const a = document.createElement('a');
    
    // Set the href and download attributes for the anchor element
    // You can optionally set other attributes like `title`, etc
    // Especially, if the anchor element will be attached to the DOM
    a.href = url;
    a.download = filename || 'interim.xlsx';
    const clickHandler = () => {
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        this.removeEventListener('click', clickHandler);
      }, 150);
    };
    
    // Add the click event listener on the anchor element
    // Comment out this line if you don't want a one-off download of the blob content
    a.addEventListener('click', clickHandler, false);
    
    // Programmatically trigger a click on the anchor element
    // Useful if you want the download to happen automatically
    // Without attaching the anchor element to the DOM
    // Comment out this line if you don't want an automatic download of the blob content
    a.click();
    
    // Return the anchor element
    // Useful if you want a reference to the element
    // in order to attach it to the DOM or use it in some other way
    return a;
  }

  handleStartDateChange = (date) => {
    this.setState({
      startDate: date
    });
  }

  handleEndDateChange = (date) => {
    this.setState({
      endDate: date
    });
  }

  handleChangeTemplate = (e) => {
    this.setState({
      template: e.target.value
    });
  }

  handleExportExcel = async () => {
    const { startDate, endDate, template, exportName, client, project } = this.state;
    const { onExportExcel } = this.props;
    const userId = await sessionStorage.getItem('userId');
    await onExportExcel({ startDate, endDate, userId, template, exportName, project, client });
    // const binaryData = [];
    // binaryData.push(response.data);
    // await this.setState({
    //   data: response.data,
    //   url: window.URL.createObjectURL(new Blob(binaryData))
    // });
    // //this.downloadBlob(this.state.url);
  }

  handleChangeExportName = (e) => {
    this.setState({
      exportName: e.target.value
    });
  }

  handleChangeProject = (e) => {
    this.setState({
      project: e.target.value
    });
  }

  handleChangeClient = (e) => {
    this.setState({
      client: e.target.value
    });
  }

  handleLogout = () => {
    const { onMakeLogout } = this.props;
    onMakeLogout();
  }

  render() {

    const { startDate, endDate, template, exportName, project, client } = this.state;
    const { loading } = this.props;

    return (
      <React.Fragment>
        <CssBaseline />
        <div style={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" style={{ flexGrow: 1 }}>
                Home
              </Typography>
              <Button color="inherit" onClick={this.handleLogout}>
                <ExitToAppIcon />
              </Button>
            </Toolbar>
          </AppBar>
          <div style={{ padding: 20, paddingTop: 30 }}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <div style={{ marginLeft: 15, marginTop: 20 }}>
                <KeyboardDatePicker
                  autoOk
                  variant="inline"
                  inputVariant="outlined"
                  label="Start Date"
                  format="MM/DD/YYYY"
                  value={startDate}
                  InputAdornmentProps={{ position: "start" }}
                  onChange={date => this.handleStartDateChange(date)}
                  style={{  }}
                />
              </div>
            
            <div style={{ marginLeft: 15, marginTop: 20 }}>
              <KeyboardDatePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                label="End Date"
                format="MM/DD/YYYY"
                value={endDate}
                InputAdornmentProps={{ position: "start" }}
                onChange={date => this.handleEndDateChange(date)}
              />
            </div>

            <div style={{ marginLeft: 15, marginTop: 20 }}>
              <Select
                value={template}
                onChange={this.handleChangeTemplate}
                style={{ width: 280 }}
                // inputProps={{
                //   name: 'age',
                //   id: 'age-simple',
                // }}
              >
                <MenuItem value={1}>Vertere Timesheets</MenuItem>
                <MenuItem value={2}>Vertere DTR</MenuItem>
              </Select>
            </div>
            
            <div style={{ marginLeft: 15, marginTop: 20 }}>
              <TextField
                value={exportName}
                onChange={this.handleChangeExportName}
                style={{ width: 280 }}
              />
            </div>

            <div style={{ marginLeft: 15, marginTop: 20 }}>
              <TextField
                value={project}
                onChange={this.handleChangeProject}
                style={{ width: 280 }}
              />
            </div>

            <div style={{ marginLeft: 15, marginTop: 20 }}>
              <TextField
                value={client}
                onChange={this.handleChangeClient}
                style={{ width: 280 }}
              />
            </div>

            {
              this.state.url && (
                <a href={this.state.url} download="interim.xlsx">Download</a>
              )
            }
            

            <Fab color="primary" aria-label="add" style={{ position: 'absolute', bottom: 30, right: 30 }} onClick={this.handleExportExcel}>
              {
                !loading ? <GetAppIcon /> : (
                  <CircularProgress color="white" size={24} />
                )
              }
            </Fab>
            
            </MuiPickersUtilsProvider>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  userId: state.auth.user.id,
  loading: state.home.loading,
});

export function mapDispatchToProps(dispatch) {
  return {
    onExportExcel: (startDate, endDate, userId) => dispatch(exportExcel(startDate, endDate, userId)),
    onSetLoading: (status) => dispatch(setLoading(status)),
    onMakeLogout: () => dispatch(makeLogout()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const styledComponent = withStyles(styles, { withTheme: true })(LoginPage);

export default compose(
  withConnect,
  memo,
  withReducer,
  withSaga,
)(styledComponent);