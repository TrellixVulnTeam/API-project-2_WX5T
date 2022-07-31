import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = "/reviews/load";
const POST_REVIEWS = "/reviews/post";
const DELETE_REVIEW = "/review/delete";
const LOAD_USER_REVIEWS = "/reviews/user"

const deleteReviewAction = (review) => {
  return {
    type: DELETE_REVIEW,
    review,
  };
};

const createReviewAction = (review) => {
  return {
    type: POST_REVIEWS,
    review,
  };
};

const loadUserReviews = (reviews) => {
  return {
    type: LOAD_USER_REVIEWS,
    reviews
  }
}


const loadReviewAction = (reviews) => {
  return {
    type: LOAD_REVIEWS,
    reviews,
  };
};

//CREATE REVIEW
export const createReviews = (spotID, review) => async (dispatch) => {
  // spotID = Number(spotID)
  const response = await csrfFetch(`/api/spots/${spotID}/reviews`, {
    method: "POST",
    body: JSON.stringify(review,spotID),
  });

  if (response.ok) {
    const newReview = await response.json();
    dispatch(createReviewAction(newReview));
    return newReview;
  }

  return response;
};

//get all reviews of a spot
export const loadReviews = (spotID) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotID}/reviews`);

  if (response.ok) {
    const allReviews = await response.json();
    dispatch(loadReviewAction(allReviews));
    return allReviews;
  }

  return response;
};

//get the current user's reviews
export const getUserReviews = () => async (dispatch) => {
  const response = await csrfFetch(`/api/users/current/reviews`);
  if (response.ok) {
    const userReviews = await response.json();
    console.log(userReviews);
    dispatch(loadUserReviews(userReviews));
    return userReviews;
  }
  return response;
};

//delete review
export const deleteReview = (reviewID,) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewID}`, {
    method: "DELETE",
    body: JSON.stringify({
      reviewID,
    }),
  });

  const res = await response.json();
  dispatch(deleteReviewAction(reviewID));
  return res;
};

const initialState = {};
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_REVIEW: {
      const newState = { ...state };
      delete newState[action.res];
      return newState;
    };
    case POST_REVIEWS: {
      const newState = { ...state };
      newState[action.review.id] = action.review;
      return newState;
    };
    case LOAD_REVIEWS: {
      const allReviews = {};
      action.reviews.forEach((review) => (allReviews[review.id] = review));
      let reviews = {...allReviews};
      return reviews;
    };
    case LOAD_USER_REVIEWS: {
      const newState = {};
      action.reviews.forEach(reviews => newState[reviews.id] = reviews);
      let allReviews = {...newState};
      return allReviews;
    }
    default:
      return state;
  }
};

export default reviewsReducer;
