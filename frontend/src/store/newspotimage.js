import { csrfFetch } from "./csrf.js";

const POST_IMAGE_SPOT = "spot/postImageSpot";

export const postImageSpot = (spot) => ({
  type: POST_IMAGE_SPOT,
  spot,
});

export const fetchPostSpotImage = (spotInfo) => async () => {
  const { url, preview, newSpotId } = spotInfo;
  const response = await csrfFetch(`/api/spots/${newSpotId}/images`, {
    method: "POST",
    body: JSON.stringify({
      url,
      preview,
    }),
  });
  //   const data = await response.json();
  console.log("responseImage===>", response);
  //   dispatch(postImageSpot(data))

  if (response.ok) {
    return response;
  } else {
    throw response;
  }
};

const initialState = { newspotImage: {} };

function postSpotImageReducer(state = initialState, action) {
  switch (action.type) {
    case POST_IMAGE_SPOT: {
      return { ...state, newspotImage: action.spotInfo };
    }
    default:
      return state;
  }
}

export default postSpotImageReducer;
