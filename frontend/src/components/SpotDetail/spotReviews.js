import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadReviews } from '../../store/review';
// import CreateReview from './createReview';

const SpotReviews = ({spotId}) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => Object.values(state.reviews));

  useEffect(() => {
      dispatch(loadReviews(spotId));
  }, [dispatch, spotId])

    return (
      <div className='all-reviews-div'>
        <h1>Reviews</h1>
        {reviews.map((reviewState, i) => {

          return (
            <div className='reviews-container' key={i}>
               <div className='full-user-review'>
              {/* <p className='userName'>{`${reviewState.firstName} ${reviewState.user.lastName}`}</p> */}
            <p className='stars'>{`${reviewState.stars} stars`}</p>
            <p className='review'>{`${reviewState.review}`}</p>
            </div>
            </div>
          )
        })
        }

      </div>


    )


};

export default SpotReviews;
