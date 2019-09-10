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
  Fab
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import GetAppIcon from '@material-ui/icons/GetApp';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { withStyles } from '@material-ui/core/styles';
import { DEFAULT_STYLES } from './constants';
import MomentUtils from '@date-io/moment';

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { exportExcel } from './actions';

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

  handleExportExcel = async () => {
    const { startDate, endDate } = this.state;
    const { onExportExcel, userId } = this.props;
    const response = await onExportExcel(startDate, endDate, userId);
    // const binaryData = [];
    // binaryData.push(response.data);
    // await this.setState({
    //   data: response.data,
    //   url: window.URL.createObjectURL(new Blob(binaryData))
    // });
    // //this.downloadBlob(this.state.url);
  }

  render() {

    const { startDate, endDate } = this.state;

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
              <Button color="inherit">
                <ExitToAppIcon />
              </Button>
            </Toolbar>
          </AppBar>
          <div style={{ padding: 20, paddingTop: 30 }}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <div style={{ display: 'inline-block', marginLeft: 10 }}>
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
            
            <div style={{ display: 'inline-block', marginLeft: 15 }}>
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

            {
              this.state.url && (
                <a href={this.state.url} download="interim.xlsx">Download</a>
              )
            }
            

            <Fab color="primary" aria-label="add" style={{ position: 'absolute', bottom: 30, right: 30 }} onClick={this.handleExportExcel}>
              <GetAppIcon />
            </Fab>
            
            </MuiPickersUtilsProvider>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  userId: state.auth.user.id
});

export function mapDispatchToProps(dispatch) {
  return {
    onExportExcel: (startDate, endDate, userId) => dispatch(exportExcel(startDate, endDate, userId))
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