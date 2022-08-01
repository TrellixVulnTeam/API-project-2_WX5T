import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Redirect, useParams } from "react-router-dom";
import * as reviewActions from "../../store/review";

const CreateReview = () => {
  const dispatch = useDispatch();
  let { spotID } = useParams();
  spotID = Number(spotID);

  const [reviewMessage, setReviewMessage] = useState("");
  const [stars, setStars] = useState("");
  const [errors, setErrors] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (submitSuccess) {
    return <Redirect to={`/spots/${spotID}`} />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    let review = {
      review: reviewMessage,
      stars: stars,
    };
    return dispatch(reviewActions.createReviews(spotID, review))
      .then(async (res) => {
        setSubmitSuccess(true);
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  return (
    <form className="spotsReview" onSubmit={handleSubmit}>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <label>
        Review:
        <input
          type="text"
          placeholder="Review Message"
          value={reviewMessage}
          onChange={(e) => setReviewMessage(e.target.value)}
          required
        />
      </label>
      <label>
        Stars:
        <input
          type="text"
          placeholder="Rating"
          value={stars}
          onChange={(e) => setStars(e.target.value)}
          required
        />
      </label>
      <button type="submit">Create Review</button>
    </form>
  );
};

export default CreateReview;
