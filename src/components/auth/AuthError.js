import React from 'react';
import { Link } from 'react-router-dom';

const AuthError = () => {
    return (
        <>
            <p>You are not authorized to access this page.</p>
            <Link to={'/home'}>Go back to login page</Link>
        </>
    )
}

export default AuthError;