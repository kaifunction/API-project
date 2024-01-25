import { csrfFetch } from "./csrf.js";

const GET_SPOTSBYID = "getspots/getSpotById";

export const getSpotById = (spot) => ({
     type: GET_SPOTSBYID,
     spot
});


export const fetchGetSpotsById = () => async (dispatch) => {
     const response = await csrfFetch("/api/spots/current", {
          method: "GET",
     });

     const data = await response.json();
     dispatch(getSpotById(data));
     return data;
}


const initialState = { spot: [] };

function getAllSpotByIdReducer(state = initialState, action) {
     switch (action.type) {
          case GET_SPOTSBYID: {
               return { ...state, spot: action.spot}
          }
          default:
               return state
     }
}

export default getAllSpotByIdReducer
