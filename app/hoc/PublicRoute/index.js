import React from 'react';
import { Redirect, Route } from 'react-router-dom';

const PublicRoute = ({ component: Component, ...rest }) => {
    let token = sessionStorage.getItem('token');
    return (
        <Route
            {...rest}
            render={
                (props) => !token ? (
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

export default PublicRoute;