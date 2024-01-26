import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import getAllSpotReducer from './spot';
import getAllReviewReducer from './review';
import postNewSpotReducer from './newspot';
import postSpotImageReducer from './newspotimage';
import postReviewReducer from './newreview';
import getAllSpotByIdReducer from './getspots';
import updateSpotReducer from './updateSpot';
import deleteSpotReducer from './deletespot';

const rootReducer = combineReducers({
  session: sessionReducer,
  spots: getAllSpotReducer,
  review: getAllReviewReducer,
  newspot: postNewSpotReducer,
  newspotImage: postSpotImageReducer,
  newReview: postReviewReducer,
  getspots: getAllSpotByIdReducer,
  updataspot: updateSpotReducer,
  deletespot: deleteSpotReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;


//"development"
//"production"
