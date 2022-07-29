import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserReviews, deleteReview} from '../../store/review';
import { Link } from 'react-router-dom'

const Reviews = () => {
    const dispatch = useDispatch();
    const reviews = useSelector((state) => Object.values(state.reviews));


    useEffect(() => {
        dispatch(getUserReviews());
    }, [dispatch])

    const deleteReview = (e) => {
      e.preventDefualt()
      dispatch(deleteReview())
    }

    return (
      <div className='all-reviews-div'>
        <h1>Your Reviews</h1>
        {reviews.map((reviewState, i) => {
          return (
            <div key={reviewState.id}>
            <p className='stars'>{`${reviewState.User.firstName} ${reviewState.User.lastName}`}</p>
            <p className='user'>{`${reviewState.stars} stars`}</p>
            <p className='actual-review'>{`${reviewState.review}`}</p>
            </div>
          )
        })
        }
      </div>
    )


};

export default Reviews;
