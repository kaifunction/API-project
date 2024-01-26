import { csrfFetch } from "./csrf.js";

const DELETE_SPOT = "delete/deleteSpot";

export const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

export const fetchDeleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  const data = await response.json();
  console.log("fromDELETEdata====>", data)
  dispatch(deleteSpot(spotId));
  return data;
};

const initialState = { spot: [] };

function deleteSpotReducer(state = initialState, action) {
  switch (action.type) {
    case DELETE_SPOT: {
      const newState = { ...state };

      // 使用 action.spot.id 来获取要删除的 spotId
      const spotId = action.spotId;

      // 删除对应 spotId 的属性
      delete newState.spot[spotId];

      return newState;
    }
    default:
      return state;
  }
}

export default deleteSpotReducer;
