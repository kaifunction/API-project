import { csrfFetch } from "./csrf.js";

const POST_SPOT = "spot/postSpot";

export const postSpot = (spot) => ({
  type: POST_SPOT,
  spot,
});

export const fetchPostSpot = (spotInfo) => async (dispatch) => {
  const { country, address, city, state, lat, lng, description, name, price } =
    spotInfo;
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify({
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
    }),
  });
  if (response.ok) {
    const data = await response.json();
    // console.log("dataSpot===>",data)
    dispatch(postSpot(data));
    return data;
  } else {
    throw response;
  }
};


const initialState = { newspot: [] };

function postNewSpotReducer( state = initialState, action) {
     switch (action.type) {
          case POST_SPOT: {
               return {...state, newspot: action.spot}
          }
          default:
               return state;
     }
}

export default postNewSpotReducer;
