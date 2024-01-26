import { csrfFetch } from "./csrf.js";

const GET_REVIEW = "review/getReview";
const DELETE_REVIEW = "review/deleteReview";

//regular action creator

export const getReview = (review) => ({
  type: GET_REVIEW,
  review,
});

export const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
})

//thunk action creator
export const fetchReview = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "GET",
  });
  const data = await response.json();
  dispatch(getReview(data));
  return data;
};

export const fetchDeleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  console.log("datafromSTORE====>", data)
  dispatch(deleteReview(reviewId));
  return data;
}


const initialState = { review: {} };

function getAllReviewReducer(state = initialState, action) {
     switch (action.type) {
          case GET_REVIEW: {
               return {...state, review: action.review}
          }
          case DELETE_REVIEW: {
            const newState = { ...state };
            const reviewId = action.reviewId;
            delete newState.review[reviewId]
            return newState
          }
          default:
               return state;
     }
}

export default getAllReviewReducer;
