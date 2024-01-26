import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import * as sessionActions from './store/session';
import { ModalProvider, Modal } from './context/Modal';
import {getSpots, getDetail } from './store/spot';
import { getReview } from './store/review';
import { postSpot } from './store/newspot';
import { postImageSpot } from './store/newspotimage';
import { postReview } from './store/newreview';
import { getSpotById } from './store/getspots';
import { updateSpot } from './store/updateSpot';
import { deleteSpot } from './store/deletespot';

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
  window.sessionActions = sessionActions;
  window.getSpots = getSpots;
  window.getDetail = getDetail;
  window.getReview = getReview;
  window.postSpot = postSpot;
  window.postImageSpot = postImageSpot;
  window.postReview = postReview;
  window.getSpotById = getSpotById;
  window.updateSpot = updateSpot;
  window.deleteSpot = deleteSpot;
}

// const Carrot = () => (
//   <div style={{ color: "orange", fontSize: "100px" }}>
//     <i className="fas fa-carrot"></i>
//   </div>
// );

// Wrap the application with the Modal provider and render the Modal component
// after the App component so that all the Modal content will be layered as
// HTML elements on top of the all the other HTML elements:
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
        {/* <Carrot /> */}
        <Modal />
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
