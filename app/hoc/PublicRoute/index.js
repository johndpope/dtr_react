import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';

const PublicRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={
                (props) => !rest.auth.token ? (
                    <Component {...props} />
                ) :
                (
                    <Redirect
                        to={{
                            pathname: "/home",
                            state: { from: props.location }
                        }}
                    />
                )
            }
        />
    )
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PublicRoute);