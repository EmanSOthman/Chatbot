// App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Home from './pages/Home';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App({ signOut, user }) {
  return (
    <>
      <div className="d-flex justify-content-end p-2">
        <span className="me-3">Welcome, {user.username}</span>
        <button className="btn btn-outline-danger" onClick={signOut}>
          Sign Out
        </button>
      </div>
      <Home />
    </>
  );
}

export default withAuthenticator(App);
