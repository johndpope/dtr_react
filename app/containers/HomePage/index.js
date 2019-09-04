/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import reducer from './reducer';
import saga from './saga';

const key = 'home';

class HomePage extends React.PureComponent {
  constructor(props) {
    super(props);

    useInjectReducer({ key, reducer });
    useInjectSaga({ key, saga });
  }

  render() {
    return (
      <div>

      </div>
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

export default compose(
  withConnect,
  memo,
)(HomePage);