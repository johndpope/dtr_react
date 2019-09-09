/*
 * LoginPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeLogin, makeTimeIn, makeTimeOut } from './actions';

import injectSaga from 'utils/injectSaga'
import saga from './saga';

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
  MenuList
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

const options = ['Time In', 'Time Out', 'Login'];

class LoginPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      openGroup: false,
      anchorRef: null,
      selectedIndex: 0,
      email: '',
      password: '',
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

  handleClick = () => {
    const { selectedIndex, email, password } = this.state;
    const { onMakeLogin, onMakeTimeIn, onMakeTimeOut } = this.props;

    if (selectedIndex === 0) {
      onMakeTimeIn(email, password);
    }

    if (selectedIndex === 1) {
      onMakeTimeOut(email, password);
    }

    if (selectedIndex === 2) {
      onMakeLogin(email, password);
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

  render() {

    const { classes } = this.props;
    const { showPassword, anchorRef, openGroup, selectedIndex } = this.state;

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
                  
                  <Grid item container xs={12} style={{ marginTop: 20 }} alignItems="center" justify="center">
                    <ButtonGroup fullWidth variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                      <Button style={{ width: '90%' }} onClick={this.handleClick}>{options[selectedIndex]}</Button>
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
            
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  
});

export function mapDispatchToProps(dispatch) {
  return {
    onMakeLogin: (email, password) => dispatch(makeLogin(email, password)),
    onMakeTimeIn: (email, password) => dispatch(makeTimeIn(email, password)),
    onMakeTimeOut: (email, password) => dispatch(makeTimeOut(email, password))
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