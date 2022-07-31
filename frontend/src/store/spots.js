import { csrfFetch } from "./csrf";

const GET_ALL_SPOTS = "spots/get-all-spots";
const ADD_SPOT = "spots/add";
const DELETE_SPOT = "spots/delete";
const EDIT_SPOT = "spots/edit";
const GET_USER_SPOTS = "spots/get-user-spots";


const getAll = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots,
  };
};


const addSpot = (spot) => {
  return {
    type: ADD_SPOT,
    spot
  }
}

const editSpot = (editedSpot) => {
  return {
    type: EDIT_SPOT,
    editedSpot,
  };
};

const deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId,
  };
};

const getUserSpots = (currentUserSpots) => {
  return {
    type: GET_USER_SPOTS,
    currentUserSpots,
  };
};


//Get all spots
export const getAllSpots = async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  if (response.ok) {
    const spots = await response.json();
    dispatch(getAll(spots));
    const all = {};
    spots.spot.forEach(spot=>(all[spot.id]= spot))
    // spots.forEach((spot) => (all[spot.id] = spot));
    return { ...all };
  }
  return {};
};


//Get a spot detail
export const findASpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spot = await response.json();
    dispatch(addSpot(spot));
    return spot;
  }
  return response;
};


//Create a spot
export const createSpot = spot => async dispatch => {
  const response = await csrfFetch('/api/spots/spots', {
    method: "POST",
    body: JSON.stringify(spot)
  })
  if (response.ok) {
    const newSpot = await response.json();
    dispatch(addSpot(newSpot));
    return newSpot;
  }

  return response
}



// Edit property
export const spotEdit = (spot,spotID) => async (dispatch) => {
  const {
    id,
    ownerId,
    address,
    city,
    state,
    country,
    latitude,
    longitude,
    name,
    description,
    price,
    previewImage,
  } = spot;
  const response = await csrfFetch(`/api/spots/${spotID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      ownerId,
      address,
      city,
      state,
      country,
      latitude,
      longitude,
      name,
      description,
      price,
      previewImage,
    }),
  });

  if (response.ok) {
    const editedSpot = await response.json();
    dispatch(editSpot(editedSpot));
    return editedSpot;
  }
};


// delete a spot
export const spotDelete = (spotID) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotID}`, {
    method: "DELETE",
    body: JSON.stringify({
      spotID,

    }),
  });
console.log("THIS IS DELETED", response)
  if (response.ok) {
    const deletedSpot = await response.json();
    dispatch(deleteSpot(spotID));
    return deletedSpot;
  }
};

//Delete a Spot// working partially
// export const spotDelete = (spotID) => async dispatch => {
//   const response = await csrfFetch(`/api/spots/${spotID}`, {
//     method: "DELETE",
//     body: JSON.stringify({spotID})
//   });

//   if (response.ok) {
//      await response.json();
//     dispatch(deleteSpot(spotID));
//   }
// };

// export const spotDelete = (spotID) => async (dispatch) => {
//   const response = await csrfFetch(`/api/spots/${spotID}`, {
//     method: "DELETE",
//     body: JSON.stringify({
//       spotID,
//     }),
//   });

//   const res = await response.json();
//   dispatch(deleteSpot(spotID));
//   return res;
// };

//Get the current user's spots

export const getCurrentUserSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/users/current/spots");
  if (response.ok) {
    const allSpots = await response.json();
    dispatch(getUserSpots(allSpots));
    return allSpots;
  }
  return response;
};



const initialState = {};
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {

    case GET_ALL_SPOTS: {
      const allSpots = {};
      action.spots.spot.forEach((spot) => (allSpots[spot.id] = spot));
      return { ...allSpots, ...state };
    }

    case ADD_SPOT: {
      let newState = { ...state };
      newState[action.spot.id] = action.spot;
      return newState;
    }

    case EDIT_SPOT: {
      const newState = { ...state };
      newState[action.editedSpot.id] = action.editedSpot;
      return newState;
    }

    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState[action.spotId]
      return newState;
    }

    case GET_USER_SPOTS: {
      const newState = {};
      action.currentUserSpots.forEach(spot => newState[spot.id] = spot);
      let allSpots = {...newState};
      return allSpots;
    }

    default:
      return state;
  }
};

export default spotsReducer;
