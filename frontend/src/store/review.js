import { csrfFetch } from "./csrf.js";

const GET_REVIEW = "review/getReview";

//regular action creator

export const getReview = (review) => ({
  type: GET_REVIEW,
  review,
});

//thunk action creator
export const fetchReview = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "GET",
  });
  const data = await response.json();
  dispatch(getReview(data));
  return data;
};


const initialState = { review: {} };

function getAllReviewReducer(state = initialState, action) {
     switch (action.type) {
          case GET_REVIEW: {
               return {...state, review: action.review}
          }
          default:
               return state;
     }
}

export default getAllReviewReducer;
