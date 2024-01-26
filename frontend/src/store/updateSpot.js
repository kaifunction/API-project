import { csrfFetch } from "./csrf.js";

const UPDATE_SPOT = "updatespot/updateSpot";

export const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot,
});

export const fetchUpdateSpot = (updatespot) => async (dispatch) => {
  const { country, address, city, state, lat, lng, description, name, price } = updatespot;
//   console.log("updatespot=====>",updatespot)
    //Can get the updateInfo from thunk.
//     console.log("spotId=====>",updatespot.spotId)
    //Can NOT get the spotId from thunk.
  const response = await csrfFetch(`/api/spots/${updatespot.spotId}`, {
    method: "PUT",
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
  if(response.ok){
     const data = await response.json();
     dispatch(updateSpot(data))
     return data;
  } else {
     throw response;
  }
};


const initialState = { updatespot: [] };

function updateSpotReducer( state = initialState, action) {
     switch (action.type) {
          case UPDATE_SPOT: {
               return {...state, updateSpot: action.spot}
          }
          default:
               return state
     }
}


export default updateSpotReducer;
