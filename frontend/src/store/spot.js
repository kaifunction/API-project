import { csrfFetch } from "./csrf.js";

const GET_ALLSPOTS = "spot/getSpots";
const GET_SPOTDETAIL = "spot/getDetail";
// const DELETE_SPOT = "delete/deleteSpot";
//move1
// const GET_REVIEW = "spot/getReview";
//move2
// const POST_SPOT = "spot/postSpot";
//move3
// const POST_IMAGE_SPOT = "spot/postImageSpot";
//move4
// const POST_REVIEW = "spot/postReview";

//regular action creator
export const getSpots = (spot) => ({
  type: GET_ALLSPOTS,
  spot,
});

export const getDetail = (spot) => ({
  type: GET_SPOTDETAIL,
  spot,
});


// export const deleteSpot = (spotId) => ({
//   type: DELETE_SPOT,
//   spotId
// });

//move1
// export const getReview = (review) => ({
//   type: GET_REVIEW,
//   review,
// });

//move2
// export const postSpot = (spot) => ({
//   type: POST_SPOT,
//   spot,
// });

//move3
// export const postImageSpot = (spot) => ({
//   type: POST_IMAGE_SPOT,
//   spot,
// });

//move4
// export const postReview = (review) => ({
//   type: POST_REVIEW,
//   review,
// });

//thunk action creator
export const fetchGetSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "GET",
  });
  const data = await response.json();
  dispatch(getSpots(data));
  return data;
};

export const fetchSpotDetail = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "GET",
  });
  const data = await response.json();
  dispatch(getDetail(data));
  return data;
};

// export const fetchDeleteSpot = (spotId) => async(dispatch) => {
//   const response = await csrfFetch(`/api/spots/${spotId}`, {
//        methed: "DELETE",
//   });
//   // const data = await response.json()
//   dispatch(deleteSpot(response))
//   return response;
// };


//move1
// export const fetchReview = (spotId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
//     method: "GET",
//   });
//   const data = await response.json();
//   dispatch(getReview(data));
//   return data;
// };


//move2
// export const fetchPostSpot = (spotInfo) => async (dispatch) => {
//   const { country, address, city, state, lat, lng, description, name, price } =
//     spotInfo;
//   const response = await csrfFetch("/api/spots", {
//     method: "POST",
//     body: JSON.stringify({
//       country,
//       address,
//       city,
//       state,
//       lat,
//       lng,
//       description,
//       name,
//       price,
//     }),
//   });
//   if (response.ok) {
//     const data = await response.json();
//     // console.log("dataSpot===>",data)
//     dispatch(postSpot(data));
//     return data;
//   } else {
//     throw response;
//   }
// };

//move3
// export const fetchPostSpotImage = (spotInfo) => async () => {
//   const { url, preview, newSpotId } = spotInfo;
//   const response = await csrfFetch(`/api/spots/${newSpotId}/images`, {
//     method: "POST",
//     body: JSON.stringify({
//       url,
//       preview,
//     }),
//   });
//   // const data = await response.json();
//   console.log("responseImage===>", response)
//   // dispatch(postImageSpot(data))
//   return response;
// };

//move4
// export const fetchPostReview = (spotReview) => async (dispatch) => {
//   const { review, stars, spotId } = spotReview;
//   const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
//     method: "POST",
//     body: JSON.stringify({
//       review,
//       stars,
//     }),
//   });

//   // console.log("responseReview===>", response);
//   dispatch(postReview(response))
//   return response;
// };

const initialState = { spot: [] };

function getAllSpotReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALLSPOTS: {
      return { ...state, spot: action.spot };
    }
    case GET_SPOTDETAIL: {
      return { ...state, spot: action.spot };
    }
//     case DELETE_SPOT: {
//       const newState = {...state}
//       delete newState[action.spotId]
//       return newState
//       // return
//  }
    // case GET_REVIEW: {
    //   return { ...state, review: action.review };
    // }
    // case POST_SPOT: {
    //   return { ...state, newspot: action.spot };
    // }
    // case POST_IMAGE_SPOT: {
    //   return { ...state, newspotImage: action.spotInfo };
    // }
    // case POST_REVIEW: {
    //  return { ...state, newReview: action.spotReview}
    // }
    default:
      return state;
  }
}

export default getAllSpotReducer;
