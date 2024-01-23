import { csrfFetch } from './csrf.js';

const GET_ALLSPOTS = 'spot/getSpots';


//regular action creator
export const getSpots = (spot) => ({
     type: GET_ALLSPOTS,
     spot
})

//thunk action creator
export const fetchGetSpots = () => async dispatch => {
     const response = await csrfFetch('/api/spots',{
          method: "GET"
     })
     const data = await response.json();
     dispatch(getSpots(data));
     return data
}


const initialState = { spot: [] };

function getAllSpotReducer (state = initialState, action){
     switch (action.type){
          case GET_ALLSPOTS: {
               return {...state, spot: action.spot }
          }
          default:
               return state;
     }
}


export default getAllSpotReducer;
