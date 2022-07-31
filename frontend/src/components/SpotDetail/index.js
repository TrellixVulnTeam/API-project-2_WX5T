import React, { useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { findASpot } from "../../store/spots";
import { spotDelete } from "../../store/spots";
// import { deleteReview } from "../../store/review";
import "./spotDetail.css";
import SpotReviews from "./spotReviews";

const SpotsDetail = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let { spotId } = useParams();
  spotId = Number(spotId);
  // let { reviewId } = useParams();
  // reviewId = Number(reviewId);
  const spot = useSelector((state) => state.spots[spotId]);
  const sessionUser = useSelector((state) => state.session.user);
  // const review = useSelector((state) => Object.values(state.reviews));
  // const spotReview = review.filter(
  //   (review) => review.reviews === parseInt(sessionUser.id)
  // );

  useEffect(() => {
    if (!spot) {
      dispatch(findASpot(spotId));
    }
  }, [dispatch, spotId, spot]);

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(spotDelete(spotId));
    history.push("/");
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    history.push(`/spots/${spotId}/edit`);
  };

  const handleCreateReview = (e) => {
    e.preventDefault();
    history.push(`/spots/${spotId}/createReview`);
  };

  // const handleDeleteReview = (e) => {
  //   e.preventDefault();
  //   dispatch(deleteReview(reviewId));
  //   history.push(`/spots/${spotId}`);
  // };

  return (
    spot && (
      <>
        <div>
          <div className="detailName">{spot.name} </div>
          <img
            className="detailImg"
            src={spot.previewImage}
            alt={spot.name}
          ></img>
          <h3 className="detailLocation">
            {spot.city}, {spot.state}
          </h3>
          <p className="detailDescription">Description: {spot.description}</p>
          <p className="detailPrice">Price: ${spot.price} night</p>

          {sessionUser &&
            sessionUser.user &&
            sessionUser.user.id === spot.ownerId && (
              <div>
                <button onClick={handleEditClick}>Edit Spot</button>
                <button onClick={handleDelete}>Delete Spot</button>
              </div>
            )}
        </div>
        <div>
          <button onClick={handleCreateReview}>Create Review</button>

        </div>
        <div>
          <SpotReviews spotId={spotId}/>
        </div>
      </>
    )
  );
};

export default SpotsDetail;
