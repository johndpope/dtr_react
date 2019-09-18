/*
 * LoginPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectSaga from 'utils/injectSaga'
import saga from './saga';

import ProfileImage from '../../images/profile.png';
import moment from 'moment';

import MomentUtils from '@date-io/moment';

import {
  DateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import SpeechRecognition from "react-speech-recognition";
import { loadModels, getFullFaceDescription, createMatcher } from '../../api/face';

import Webcam from 'react-webcam';
import { basePath } from '../../config';

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
import CameraIcon from '@material-ui/icons/CameraAlt';

import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { makeLogin, makeTimeIn, makeTimeOut, setDialog, setUser, setRecords, setRecord, makeTodayLogs, setLoading, makeGetDescriptors, makeRegisterUser } from './actions';
import { DEFAULT_STYLES } from './constants';
// import * as faceapi from 'face-api.js';
// const MODEL_URL = 'models';

// const testImg = require('../../images/test.jpg');

const JSON_PROFILE = require('../../descriptors/bnk48.json');

const WIDTH = 330;
const HEIGHT = 330;
const inputSize = 160;

// Initial State
// const INIT_STATE = {
//   imageURL: testImg,
//   fullDesc: null,
//   detections: null,
//   descriptors: null,
//   match: null
// };

const key = 'login';

const styles = () => DEFAULT_STYLES;

const withSaga = injectSaga({ key, saga });

const options = ['Time In', 'Time Out', 'Login', 'Check Today Logs'];
let dialogTimer;
class LoginPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
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
      transcript: '',
      fullDesc: null,
      detections: null,
      descriptors: null,
      faceMatcher: null,
      match: null,
      facingMode: null,
      newDescriptors: null,
      openFaceDetector: false,
      openRegisterUser: false,
      registration: {
        email: '',
        username: '',
        password: '',
        employeeId: '',
        firstName: '',
        lastName: '',
      },
      newProfile: {}
    };
  }

  componentWillMount = async () => {
    const { onMakeGetDescriptors, descriptors } = this.props;
    await loadModels();
    await this.setState({ faceMatcher: await createMatcher(JSON_PROFILE) });
    this.setInputDevice();
    await onMakeGetDescriptors();
  };

  componentWillReceiveProps = async newProps => {
    const { descriptors } = newProps;
    if (descriptors !== null) {
      this.setState({
        newDescriptors: descriptors,
        faceMatcher: await createMatcher(descriptors),
        // detections: fullDesc.map(fd => fd.detection),
        // descriptors: fullDesc.map(fd => fd.descriptor)
      });
    }
  };

  setInputDevice = async () => {
    // await this.setState({
    //   facingMode: 'user',
    // });

    // this.startCapture();
    navigator.mediaDevices.enumerateDevices().then(async devices => {
      let inputDevice = await devices.filter(
        device => device.kind === 'videoinput'
      );
      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: 'user'
        });
      } else {
        await this.setState({
          facingMode: { exact: 'environment' }
        });
      }
      this.startCapture();
    });
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture();
    }, 3000);
  };

  startContiniousCapture = () => {
    this.interval = setInterval(() => {
      this.continuousCapture();
    }, 1500);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  capture = async () => {
    if (this.webcam.current) {
      await getFullFaceDescription(
        this.webcam.current.getScreenshot(),
        inputSize,
      ).then(fullDesc => {
        if (fullDesc) {
          this.setState({
            detections: fullDesc.map(fd => fd.detection),
            descriptors: fullDesc.map(fd => fd.descriptor),
          });
        }
      });

      if (!!this.state.descriptors && !!this.state.faceMatcher) {
        const match = await this.state.descriptors.map(descriptor =>
          this.state.faceMatcher.findBestMatch(descriptor),
        );
        // clearInterval(this.interval);
        this.setState({ match });
      }
    }
  };

  continuousCapture = async () => {
    if (this.webcam.current) {
      await getFullFaceDescription(
        this.webcam.current.getScreenshot(),
        inputSize,
      ).then(fullDesc => {
        if (fullDesc) {
          this.setState({
            detections: fullDesc.map(fd => fd.detection),
            descriptors: fullDesc.map(fd => fd.descriptor),
          });
        }
      });

      if (!!this.state.descriptors && !!this.state.faceMatcher) {
        const match = await this.state.descriptors.map(descriptor =>
          this.state.faceMatcher.findBestMatch(descriptor),
        );
        this.setState({ match });
      }
    }
  };

  saveDescriptor = async () => {
    if(this.state.registration.username !== '') {
      const username = this.state.registration.username;
      if (this.webcam.current) {
        await getFullFaceDescription(
          this.webcam.current.getScreenshot(),
          inputSize,
        ).then(async fullDesc => {
          if (fullDesc) {
            const descriptor = fullDesc.map(fd => fd.descriptor);
            const newProfile = {
              [`${username}`]: {
                name: this.state.registration.username,
                descriptors: descriptor,
              },
            };
            this.setState({
              newProfile
            });
          }
        });
      }
    }
  };

  // saveDescriptor = async () => {
  //   if (this.webcam.current) {
  //     await getFullFaceDescription(
  //       this.webcam.current.getScreenshot(),
  //       inputSize,
  //     ).then(async fullDesc => {
  //       if (fullDesc) {
  //         const descriptor = fullDesc.map(fd => fd.descriptor);
  //         const newProfile = {
  //           Alvin: {
  //             name: 'alvin',
  //             descriptors: descriptor,
  //           },
  //         };
  //         this.setState({
  //           newDescriptors: newProfile,
  //           faceMatcher: await createMatcher(newProfile),
  //         });
  //       }
  //     });
  //   }
  // };

  // handleImage = async (image = this.state.imageURL) => {
  //   await getFullFaceDescription(image).then(fullDesc => {
  //     if (!!fullDesc) {
  //       this.setState({
  //         fullDesc,
  //         detections: fullDesc.map(fd => fd.detection),
  //         descriptors: fullDesc.map(fd => fd.descriptor)
  //       });
  //     }
  //   });

  //   if (!!this.state.descriptors && !!this.state.faceMatcher) {
  //     let match = await this.state.descriptors.map(descriptor =>
  //       this.state.faceMatcher.findBestMatch(descriptor)
  //     );
  //     this.setState({ match });
  //   }
  // };

  // handleFileChange = async event => {
  //   this.resetState();
  //   await this.setState({
  //     imageURL: URL.createObjectURL(event.target.files[0]),
  //     loading: true
  //   });
  //   this.handleImage();
  // };

  // resetState = () => {
  //   this.setState({ ...INIT_STATE });
  // };

  componentWillReceiveProps(nextProps) {
    if (nextProps.transcript.includes('time in')) {
      alert('time in');
    } else if (nextProps.transcript.includes('time in')) {
      alert('time out');
    }
  }

  handleClickShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword,
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
  };

  handleToggle = () => {
    this.setState({
      openGroup: !this.state.openGroup,
    });
  };

  handleClose = event => {
    const { anchorRef } = this.state;

    if (anchorRef && anchorRef.contains(event.target)) {
      return;
    }

    this.setState({
      openGroup: false,
    });
  };

  handleTimeDateChange = date => {
    this.setState({
      timeDate: date,
    });
  };

  handleClick = () => {
    const {
      selectedIndex,
      email,
      password,
      timeDate,
      remarks,
      customDate,
    } = this.state;
    const {
      onMakeLogin,
      onMakeTimeIn,
      onMakeTimeOut,
      onMakeTodayLogs,
      onSetLoading,
    } = this.props;

    onSetLoading(true);

    if (selectedIndex === 0) {
      onMakeTimeIn({
        email,
        password,
        time: timeDate,
        remarks,
        customDate,
      });
    }

    if (selectedIndex === 1) {
      onMakeTimeOut({
        email,
        password,
        time: timeDate,
        remarks,
        customDate,
      });
    }

    if (selectedIndex === 2) {
      onMakeLogin(email, password);
    }

    if (selectedIndex === 3) {
      onMakeTodayLogs(email, password);
    }
  };

  handleChangeEmail = e => {
    this.setState({
      email: e.target.value,
    });
  };

  handleChangePassword = e => {
    this.setState({
      password: e.target.value,
    });
  };

  handleOpenDialog = () => {
    dialogTimer = setInterval(() => {
      if (this.state.countInterval === 0) {
        this.setState(
          {
            countInterval: 10,
          },
          () => {
            this.props.onSetDialog(false);
            this.props.onSetUser({});
            this.props.onSetRecords([]);
            this.props.onSetRecord({});
            clearInterval(dialogTimer);
          },
        );
      } else {
        this.setState({
          countInterval: this.state.countInterval - 1,
        });
      }
    }, 1000);
  };

  handleCloseDialog = () => {
    this.setState(
      {
        countInterval: 10,
      },
      () => {
        this.props.onSetDialog(false);
        this.props.onSetUser({});
        this.props.onSetRecords([]);
        this.props.onSetRecord({});
        clearInterval(dialogTimer);
      },
    );
  };

  handleChangeRemarks = e => {
    this.setState({
      remarks: e.target.value,
    });
  };

  handleCheckCustomDate = e => {
    this.setState({
      customDate: e.target.checked,
    });
  };

  handleOpenFaceDetector = () => {
    this.startCapture();
    this.setState({
      facingMode: 'user',
      openFaceDetector: true
    });
  }

  handleCloseFaceDetector = () => {
    clearInterval(this.interval);
    this.setState({
      fullDesc: null,
      detections: null,
      descriptors: null,
      match: null,
      openFaceDetector: false,
    })
  }

  handleOpenRegisterUser = () => {
    this.startCapture();
    this.setState({
      facingMode: 'user',
      openRegisterUser: true
    });
  }

  handleCloseRegisterUser = () => {
    clearInterval(this.interval);
    this.setState({
      fullDesc: null,
      detections: null,
      descriptors: null,
      match: null,
      openRegisterUser: false
    });
  }

  handleChangeInputRegistration = (e, field) => {
    const stateReg = this.state.registration;
    let registration = {
      ...stateReg,
      [field]: e.target.value,
    }
    this.setState({
      registration
    });
  }

  handleRegisterUser = () => {
    const { registration, newProfile } = this.state;
    this.props.onMakeRegisterUser(registration, newProfile);
  }

  render() {
    const {
      classes,
      openDialog,
      user,
      records,
      record,
      loading,
      descriptors,
    } = this.props;
    const {
      showPassword,
      anchorRef,
      openGroup,
      selectedIndex,
      countInterval,
      timeDate,
      remarks,
      customDate,
      detections,
      match,
      facingMode,
    } = this.state;

    // if (!browserSupportsSpeechRecognition) {
    //   return null;
    // }

    // console.log('descriptors', descriptors);

    let videoConstraints = null;
    let camera = '';
    if (facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode
      };
      if (facingMode === 'user') {
        camera = 'Front';
      } else {
        camera = 'Back';
      }
    }

    let drawBox = null;
    if (detections) {
      drawBox = detections.map((detection, i) => {
        const _H = detection.box.height;
        const _W = detection.box.width;
        const _X = detection.box._x;
        const _Y = detection.box._y;

        if (this.state.openRegisterUser) {
          return null;
        }

        return (
          <div key={i}>
            <div
              style={{
                position: 'absolute',
                border: 'solid',
                borderColor: '#285584',
                height: _H,
                width: _W,
                transform: `translate(${_X}px,${_Y}px)`,
              }}
            >
              {!!match && !!match[i] ? (
                <p
                  style={{
                    backgroundColor: '#285584',
                    border: 'solid',
                    borderColor: '#285584',
                    width: _W,
                    marginTop: 0,
                    color: '#fff',
                    transform: `translate(-3px,${_H}px)`,
                  }}
                >
                  {match[i]._label}
                </p>
              ) : null}
            </div>
          </div>
        );
      });
    }

    return (
      <React.Fragment>
        <CssBaseline />

        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.container}
        >
          <Grid
            item
            container
            xs={12}
            md={4}
            alignItems="center"
            justify="center"
            className={classes.formContainer}
          >
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
                            <IconButton aria-label="email">
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
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
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

                  <Grid
                    item
                    container
                    xs={12}
                    style={{ marginTop: 20 }}
                    alignItems="center"
                    justify="center"
                  >
                    <ButtonGroup
                      fullWidth
                      variant="contained"
                      color="primary"
                      ref={anchorRef}
                      aria-label="split button"
                    >
                      <Button
                        style={{ width: '90%' }}
                        onClick={this.handleClick}
                      >
                        {!loading ? (
                          options[selectedIndex]
                        ) : (
                          <CircularProgress size={24} color="white" />
                        )}
                      </Button>
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

                    <Popper
                      open={openGroup}
                      anchorEl={anchorRef}
                      transition
                      disablePortal
                    >
                      {({ TransitionProps, placement }) => (
                        <Grow
                          {...TransitionProps}
                          style={{
                            transformOrigin: placement === 'bottom',
                          }}
                        >
                          <Paper
                            id="menu-list-grow"
                            style={{ width: 200, marginTop: 0 }}
                          >
                            <ClickAwayListener onClickAway={this.handleClose}>
                              <MenuList>
                                {options.map((option, index) => (
                                  <MenuItem
                                    key={option}
                                    selected={index === selectedIndex}
                                    onClick={event =>
                                      this.handleMenuItemClick(event, index)
                                    }
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

                  <Grid
                    item
                    container
                    xs={12}
                    style={{ marginTop: 20 }}
                  >
                    <IconButton onClick={this.handleOpenFaceDetector}>
                      <CameraIcon />
                    </IconButton>

                    <IconButton onClick={this.handleOpenRegisterUser}>
                      <AccountCircle />
                    </IconButton>
                    
                  </Grid>
                </Grid>
              </form>
              {/* <span>{this.props.listening ? 'listening': 'not listening'}</span> */}
              {/* <p>{`Transcript: ${this.props.transcript}`}</p> */}
              
            </Grid>

            <Dialog open={this.state.openRegisterUser}>
              <DialogContent style={{ overflowX: 'hidden' }}>
                <span onClick={this.handleCloseRegisterUser}>X</span>
                <Grid container style={{ width: WIDTH + 80, marginTop: 10 }}>
                        <Grid item xs={12}> 
                          {videoConstraints ? (
                            <div>
                              <Webcam
                                audio={false}
                                width={WIDTH + 60}
                                height={HEIGHT}
                                ref={this.webcam}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                              />
                            </div>
                          ) : null}
                          {drawBox ? drawBox : null}
                          {/* <Button onClick={this.saveDescriptor}>
                            Save Descriptor
                          </Button> */}
                        </Grid>

                        <Grid item xs={12}>
                          <IconButton onClick={this.saveDescriptor} style={{
                            color: Object.keys(this.state.newProfile).length > 0 ? 'red' : 'gray'
                          }}>
                            <CameraIcon />
                          </IconButton>
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            value={this.state.registration.email}
                            onChange={(e) => this.handleChangeInputRegistration(e, 'email')}
                            fullWidth
                            placeholder="Email"
                            type="text"
                            style={{ marginTop: 15, marginLeft: 5 }}
                          />
                        </Grid> 

                        <Grid item xs={12}>
                          <TextField
                            value={this.state.registration.username}
                            onChange={(e) => this.handleChangeInputRegistration(e, 'username')}
                            fullWidth
                            placeholder="Username"
                            type="text"
                            style={{ marginTop: 15, marginLeft: 5 }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            value={this.state.registration.password}
                            onChange={(e) => this.handleChangeInputRegistration(e, 'password')}
                            fullWidth
                            placeholder="Password"
                            type="password"
                            style={{ marginTop: 15, marginLeft: 5 }}
                          />
                        </Grid> 

                        <Grid item xs={12}>
                          <TextField
                            value={this.state.registration.firstName}
                            onChange={(e) => this.handleChangeInputRegistration(e, 'firstName')}
                            fullWidth
                            placeholder="First Name"
                            type="text"
                            style={{ marginTop: 15, marginLeft: 5 }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            value={this.state.registration.lastName}
                            onChange={(e) => this.handleChangeInputRegistration(e, 'lastName')}
                            fullWidth
                            placeholder="Last Name"
                            type="text"
                            style={{ marginTop: 15, marginLeft: 5 }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            value={this.state.registration.employeeId}
                            onChange={(e) => this.handleChangeInputRegistration(e, 'employeeId')}
                            fullWidth
                            placeholder="Employee ID"
                            type="text"
                            style={{ marginTop: 15, marginLeft: 5 }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Button 
                            fullWidth
                            variant="contained"
                            color="primary" 
                            onClick={this.handleRegisterUser}
                            style={{ marginTop: 15 }}
                          >
                            Register
                          </Button>  
                        </Grid>         
                </Grid>
                
              </DialogContent>
            </Dialog>

            <Dialog open={this.state.openFaceDetector}>
                <DialogContent style={{ overflow: 'hidden' }}>
                  <span onClick={this.handleCloseFaceDetector}>X</span>
                  <div
                    className="Camera"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    {/* <p>Camera: {camera}</p> */}
                    <CameraIcon size={150} />
                    <div
                      style={{
                        width: WIDTH + 1,
                        height: HEIGHT + 1,
                        marginTop: 20,
                        border: '1px solid gray'
                      }}
                    >
                      <div style={{ position: 'relative', width: WIDTH }}>
                        {videoConstraints ? (
                          <div style={{ position: 'absolute' }}>
                            <Webcam
                              audio={false}
                              width={WIDTH}
                              height={HEIGHT}
                              ref={this.webcam}
                              screenshotFormat="image/jpeg"
                              videoConstraints={videoConstraints}
                            />
                          </div>
                        ) : null}
                        {drawBox ? drawBox : null}
                        {/* <Button onClick={this.saveDescriptor}>
                          Save Descriptor
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </DialogContent>
            </Dialog>

            <Dialog open={openDialog} onEnter={this.handleOpenDialog}>
              <DialogContent style={{ height: 700, width: 450 }}>
                <span onClick={this.handleCloseDialog}>X</span>
                <Grid container justify="center" alignItems="center">
                  <Grid item xs={12} style={{ height: 60 }}>
                    <Typography
                      style={{
                        textAlign: 'center',
                        fontSize: 25,
                        color: 'gray',
                      }}
                    >
                      {user.hasOwnProperty('firstName')
                        ? `${user.firstName} ${user.lastName}`
                        : ''}
                    </Typography>
                  </Grid>

                  {user.hasOwnProperty('profilePic') ? (
                    <Avatar
                      src={`${basePath}/images/${user.profilePic}`}
                      style={{ height: 100, width: 100 }}
                    />
                  ) : (
                    <Avatar
                      src={ProfileImage}
                      style={{ height: 80, width: 80 }}
                    />
                  )}

                  {record &&
                  Object.keys(record).length > 0 &&
                  !record.hasOwnProperty('timeoutDate') ? (
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
                      )}

                  <Table className={classes.table} style={{ marginTop: 35 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Time In</TableCell>
                        <TableCell>Time Out</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {records.map((rec, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {rec.hasOwnProperty('timeInDate') && moment(rec.timeInDate).format('hh:mm a')}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {rec.hasOwnProperty('timeoutDate') && moment(rec.timeoutDate).format('hh:mm a')}
                              </TableCell>
                            </TableRow>
                          ))
                      } 
                    </TableBody>
                  </Table>

                  <Typography
                    style={{
                      position: 'absolute',
                      bottom: 40,
                      right: 30,
                      fontSize: 20,
                      color: 'gray',
                    }}
                  >
                    {countInterval}
                  </Typography>
                </Grid>
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  openDialog: state.auth.openDialog,
  user: state.auth.currentUser,
  records: state.auth.records,
  record: state.auth.record,
  loading: state.auth.loading,
  descriptors: state.auth.descriptors,
});

export function mapDispatchToProps(dispatch) {
  return {
    onMakeLogin: (email, password) => dispatch(makeLogin(email, password)),
    onMakeTimeIn: (email, password) => dispatch(makeTimeIn(email, password)),
    onMakeTimeOut: (email, password) => dispatch(makeTimeOut(email, password)),
    onMakeTodayLogs: (email, password) =>
      dispatch(makeTodayLogs(email, password)),
    onSetDialog: status => dispatch(setDialog(status)),
    onSetUser: user => dispatch(setUser(user)),
    onSetRecords: records => dispatch(setRecords(records)),
    onSetRecord: record => dispatch(setRecord(record)),
    onSetLoading: status => dispatch(setLoading(status)),
    onMakeGetDescriptors: () => dispatch(makeGetDescriptors()),
    onMakeRegisterUser: (registration, newProfile) => dispatch(makeRegisterUser(registration, newProfile)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const styledComponent = withStyles(styles, { withTheme: true })(LoginPage);
const speechEnabled = SpeechRecognition(styledComponent);

export default compose(
  withConnect,
  memo,
  withSaga,
)(styledComponent);
