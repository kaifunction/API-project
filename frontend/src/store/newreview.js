import { csrfFetch } from "./csrf.js";

const POST_REVIEW = "spot/postReview";

export const postReview = (review) => ({
  type: POST_REVIEW,
  review,
});

export const fetchPostReview = (spotReview) => async (dispatch) => {
  const { review, stars, spotId } = spotReview;
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify({
      review,
      stars,
    }),
  });

  // console.log("responseReview===>", response);
  if (response.ok) {
    dispatch(postReview(response));
    return response;
  } else {
    throw response;
  }
};

const initialState = { newReview: [] };

function postReviewReducer(state = initialState, action) {
  switch (action.type) {
    case POST_REVIEW: {
      return { ...state, newReview: action.spotReview };
    }
    default:
      return state;
  }
}


export default postReviewReducer;
