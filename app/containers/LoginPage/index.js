/*
 * LoginPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeLogin, makeTimeIn, makeTimeOut, setDialog, setUser, setRecords, setRecord, makeTodayLogs, setLoading } from './actions';

import injectSaga from 'utils/injectSaga'
import saga from './saga';

import ProfileImage from '../../images/profile.png';
import moment from 'moment';

import MomentUtils from '@date-io/moment';

import {
  DateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import {
  Avatar,
  Container,
  CssBaseline,
  Typography,
  TextField,
  FormControlLabel,
  Button,
  Grid,
  Box,
  Link,
  Checkbox,
  Input,
  InputLabel,
  InputAdornment,
  FormControl,
  IconButton,
  ButtonGroup,
  Paper,
  Popper,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from '@material-ui/core';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { DEFAULT_STYLES } from './constants';

const key = 'login';

const styles = () => (DEFAULT_STYLES);

const withSaga = injectSaga({ key, saga });

const options = ['Time In', 'Time Out', 'Login', 'Check Today Logs'];
let dialogTimer;
class LoginPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      openGroup: false,
      anchorRef: null,
      selectedIndex: 0,
      countInterval: 10,
      email: '',
      password: '',
      timeDate: null,
      remarks: '',
      customDate: false,
    }
  }

  handleClickShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleMenuItemClick = (event, index) => {
    this.setState({
      selectedIndex: index,
      openGroup: false,
    });
  }

  handleToggle = () => {
    this.setState({
      openGroup: !this.state.openGroup,
    });
  }

  handleClose = (event) => {
    const { anchorRef } = this.state;

    if (anchorRef && anchorRef.contains(event.target)) {
      return;
    }

    this.setState({
      openGroup: false,
    });
  }

  handleTimeDateChange = (date) => {
    this.setState({
      timeDate: date
    });
  }

  handleClick = () => {
    const { selectedIndex, email, password, timeDate, remarks, customDate } = this.state;
    const { onMakeLogin, onMakeTimeIn, onMakeTimeOut, onMakeTodayLogs, onSetLoading } = this.props;

    onSetLoading(true);

    if (selectedIndex === 0) {
      onMakeTimeIn({
        email, password, time: timeDate, remarks, customDate
      });
    }

    if (selectedIndex === 1) {
      onMakeTimeOut({
        email, password, time: timeDate, remarks, customDate
      });
    }

    if (selectedIndex === 2) {
      onMakeLogin(email, password);
    }

    if (selectedIndex === 3) {
      onMakeTodayLogs(email, password);
    }
  }

  handleChangeEmail = (e) => {
    this.setState({
      email: e.target.value
    });
  }

  handleChangePassword = (e) => {
    this.setState({
      password: e.target.value
    });
  }

  handleOpenDialog = () => {
    dialogTimer = setInterval(() => {
      if (this.state.countInterval === 0) {
        this.setState({
          countInterval: 10
        }, () => {
          this.props.onSetDialog(false);
          this.props.onSetUser({});
          this.props.onSetRecords([]);
          this.props.onSetRecord({});
          clearInterval(dialogTimer);
        });
      } else {
        this.setState({
          countInterval: this.state.countInterval - 1
        });
      }
    }, 1000);
  }

  handleCloseDialog = () => {
    this.setState({
      countInterval: 10
    }, () => {
      this.props.onSetDialog(false);
      this.props.onSetUser({});
      this.props.onSetRecords([]);
      this.props.onSetRecord({});
      clearInterval(dialogTimer);
    });
  }

  handleChangeRemarks = (e) => {
    this.setState({
      remarks: e.target.value
    });  
  }

  handleCheckCustomDate = (e) => {
    this.setState({
      customDate: e.target.checked
    });
  }

  render() {

    const { classes, openDialog, user, records, record, loading } = this.props;
    const { showPassword, anchorRef, openGroup, selectedIndex, countInterval, timeDate, remarks, customDate } = this.state;

    return (
      <React.Fragment>
        <CssBaseline />

        <Grid container justify="center" alignItems="center" className={classes.container}>
          <Grid item container xs={12} md={4} alignItems="center" justify="center" className={classes.formContainer}>
            <Grid item xs={12}>
              <form className={classes.form} noValidate>
                <Grid container justify="center" alignItems="center">
                  <Grid item xs={12}>
                    <TextField
                      id="input-with-icon-textfield"
                      label="Email"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="email"
                            >
                              <AccountCircle />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      className={classes.input}
                      value={this.state.email}
                      onChange={this.handleChangeEmail}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      id="input-with-icon-textfield"
                      label="Password"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={this.handleClickShowPassword}
                              onMouseDown={this.handleMouseDownPassword}
                            >
                              {showPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      fullWidth
                      className={classes.input}
                      type={showPassword ? 'text' : 'password'}
                      value={this.state.password}
                      onChange={this.handleChangePassword}
                    />
                  </Grid>

                  <Grid item xs={10}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DateTimePicker 
                        value={timeDate} 
                        onChange={this.handleTimeDateChange} 
                        label="Pick Time" 
                        style={{ marginTop: 0, marginLeft: 5, width: '100%' }}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item xs={2} style={{ paddingTop: 20, paddingLeft: 20 }}>
                    <Checkbox
                      checked={customDate}
                      onChange={this.handleCheckCustomDate}
                      value="checkedA"
                      inputProps={{
                        'aria-label': 'primary checkbox',
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      value={remarks}
                      onChange={this.handleChangeRemarks}
                      fullWidth
                      placeholder="Remarks"
                      type="text"
                      style={{ marginTop: 15, marginLeft: 5 }}
                    />
                  </Grid>
                  
                  <Grid item container xs={12} style={{ marginTop: 20 }} alignItems="center" justify="center">
                    <ButtonGroup fullWidth variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                      <Button style={{ width: '90%' }} onClick={this.handleClick}>{
                        !loading ? options[selectedIndex] : (
                          <CircularProgress size={24} color="white" />
                        ) 
                      }</Button>
                      <Button
                        color="primary"
                        size="small"
                        aria-owns={openGroup ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={this.handleToggle}
                        style={{ width: '10%' }}
                      >
                        <ArrowDropDownIcon />
                      </Button>
                    </ButtonGroup>

                    <Popper open={openGroup} anchorEl={anchorRef} transition disablePortal>
                      {({ TransitionProps, placement }) => (
                        <Grow
                          {...TransitionProps}
                          style={{
                            transformOrigin: placement === 'bottom',
                          }}
                        >
                          <Paper id="menu-list-grow" style={{ width: 200, marginTop: 0 }}>
                            <ClickAwayListener onClickAway={this.handleClose}>
                              <MenuList>
                                {options.map((option, index) => (
                                  <MenuItem
                                    key={option}
                                    selected={index === selectedIndex}
                                    onClick={event => this.handleMenuItemClick(event, index)}
                                  >
                                    {option}
                                  </MenuItem>
                                ))}
                              </MenuList>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  </Grid>
                  
                </Grid>
              </form>
            </Grid>
            
            <Dialog open={openDialog} onEnter={this.handleOpenDialog}>
              <DialogContent style={{ height: 700, width: 450 }}>
                <span onClick={this.handleCloseDialog}>X</span>
                <Grid container justify="center" alignItems="center">
                  <Grid item xs={12} style={{ height: 60 }}>
                    <Typography style={{ textAlign: 'center', fontSize: 25, color: 'gray' }}>
                      {user.hasOwnProperty('firstName') ? `${user.firstName} ${user.lastName}` : ''}
                    </Typography>
                  </Grid>

                  {
                    user.hasOwnProperty('profilePic') ? (
                      <Avatar src={`http://localhost:5000/images/${user.profilePic}`} style={{ height: 100, width: 100 }} />
                    ) : (
                      <Avatar src={ProfileImage} style={{ height: 80, width: 80 }} />
                    )
                  }
                  

                  {
                    record && Object.keys(record).length > 0 && !record.hasOwnProperty('timeoutDate') ? 
                    (
                      <Grid item xs={12} style={{ height: 80, marginTop: 20 }}>
                        <Typography style={{ textAlign: 'center', fontSize: 35, color: 'orange' }}>
                          {Object.keys(record).length > 0 ? `${moment(record.timeInDate).format('MMMM DD, YYYY hh:mm a')}` : ''}
                        </Typography>
                      </Grid>      
                    ) : (
                      <Grid item xs={12} style={{ height: 80, marginTop: 20 }}>
                        <Typography style={{ textAlign: 'center', fontSize: 35, color: 'orange' }}>
                          {Object.keys(record).length > 0 ? `${moment(record.timeoutDate).format('MMMM DD, YYYY hh:mm a')}` : ''}
                        </Typography>
                      </Grid>
                    )
                  }
                  
                  <Table className={classes.table} style={{ marginTop: 35 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Time In</TableCell>
                        <TableCell>Time Out</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        records.map((rec, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {rec.hasOwnProperty('timeInDate') && moment(rec.timeInDate).format('hh:mm a')}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {rec.hasOwnProperty('timeoutDate') && moment(rec.timeoutDate).format('hh:mm a')}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      } 
                    </TableBody>
                  </Table>                        

                  <Typography style={{ position: 'absolute', bottom: 40, right: 30, fontSize: 20, color: 'gray' }}>
                    {countInterval}
                  </Typography>
                </Grid>
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  openDialog: state.auth.openDialog,
  user: state.auth.currentUser,
  records: state.auth.records,
  record: state.auth.record,
  loading: state.auth.loading,
});

export function mapDispatchToProps(dispatch) {
  return {
    onMakeLogin: (email, password) => dispatch(makeLogin(email, password)),
    onMakeTimeIn: (email, password) => dispatch(makeTimeIn(email, password)),
    onMakeTimeOut: (email, password) => dispatch(makeTimeOut(email, password)),
    onMakeTodayLogs: (email, password) => dispatch(makeTodayLogs(email, password)),
    onSetDialog: (status) => dispatch(setDialog(status)),
    onSetUser: (user) => dispatch(setUser(user)),
    onSetRecords: (records) => dispatch(setRecords(records)),
    onSetRecord: (record) => dispatch(setRecord(record)),
    onSetLoading: (status) => dispatch(setLoading(status)),
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
  withSaga,
)(styledComponent);