import { csrfFetch } from './csrf.js';

const GET_ALLSPOTS = 'spot/getSpots';
const GET_SPOTDETAIL = 'spot/getDetail';
const GET_REVIEW = 'spot/getReview';


//regular action creator
export const getSpots = (spot) => ({
     type: GET_ALLSPOTS,
     spot
});

export const getDetail = (spot) => ({
     type: GET_SPOTDETAIL,
     spot
});

export const getReview = (review) => ({
     type: GET_REVIEW,
     review
})

//thunk action creator
export const fetchGetSpots = () => async dispatch => {
     const response = await csrfFetch('/api/spots',{
          method: "GET"
     })
     const data = await response.json();
     dispatch(getSpots(data));
     return data
};


export const fetchSpotDetail = (spotId) => async dispatch => {
     const response = await csrfFetch(`/api/spots/${spotId}`, {
          method: "GET"
     })
     const data = await response.json();
     dispatch(getDetail(data))
     return data
};

export const fetchReview = (spotId) => async dispatch => {
     const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
          method: "GET"
     })
     const data = await response.json();
     dispatch(getReview(data))
     return data
}


const initialState = { spot: [] };

function getAllSpotReducer (state = initialState, action){
     switch (action.type){
          case GET_ALLSPOTS: {
               return {...state, spot: action.spot }
          }
          case GET_SPOTDETAIL: {
               return {...state, spot: action.spot  }
          }
          case GET_REVIEW: {
               return {...state, review: action.review}
          }
          default:
               return state;
     }
}


export default getAllSpotReducer;
