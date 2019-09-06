/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import injectSaga from 'utils/injectSaga'
import injectReducer from 'utils/injectReducer'
import reducer from './reducer';
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

const key = 'home';

const styles = () => (DEFAULT_STYLES);

const withReducer = injectReducer({ key, reducer });
const withSaga = injectSaga({ key, saga });

const options = ['Time In', 'Time Out', 'Login'];

class HomePage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      openGroup: false,
      anchorRef: null,
      selectedIndex: 0,
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
    
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const styledComponent = withStyles(styles, { withTheme: true })(HomePage);

export default compose(
  withConnect,
  memo,
  withReducer,
  withSaga,
)(styledComponent);