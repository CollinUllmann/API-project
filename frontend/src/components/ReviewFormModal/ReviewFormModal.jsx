import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { thunkFetchCreateReview, thunkFetchReviewsBySpotId } from '../../store/reviews';
import { FaStar } from "react-icons/fa6";
import './ReviewFormModal.css'
import { thunkFetchSpotById } from '../../store/spot';

// import * as sessionActions from '../../store/session';
// import './SignupForm.css';

function ReviewFormModal({spot}) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  const [review, setReview] = useState('')
  const [errors, setErrors] = useState({});
  const [activeRating, setActiveRating] = useState(0)
  const [rating, setRating] = useState(0)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const { closeModal } = useModal();


  const handleSubmit = (e) => {
    e.preventDefault();
    setHasSubmitted(true)
    setErrors({});
    const newReview = {
      spotId: spot.id,
      userId: sessionUser.id,
      review,
      stars: rating
    }

    console.log('review going into thunk', newReview)

    return dispatch(thunkFetchCreateReview(spot.id, newReview))
      .then(errors => {
        if (errors) {
          setErrors(errors);
        } else {
          dispatch(thunkFetchReviewsBySpotId(spot.id))
          dispatch(thunkFetchSpotById(spot.id))
          closeModal()
        }
      });
  };

  const numList = [1, 2, 3, 4, 5]


  return (
    <>
      <h1>How was your stay?</h1>
      {hasSubmitted ? Object.values(errors).map((error, index) => <div key={index} className="error">{error}</div>) : <></>}
      <form className='ReviewForm' onSubmit={handleSubmit}>
        <textarea
        className="ReviewFormTextArea"
        placeholder='Leave your review here...'
        value={review}
        rows={5}
        onChange={(e) => setReview(e.target.value)}
        name='review'
        />
        <div className="rating-input">
        {numList.map(num => {
          return (
            <div
            key={num} 
            className={activeRating > num - 1 ? 'filled' : 'empty'}
            onMouseEnter={() => setActiveRating(num)}
            onMouseLeave={() => setActiveRating(rating)}
            onClick={() => setRating(num)}
            >
            <FaStar/>  
          
        </div>
          )
        })}
        <h4>Stars</h4>
    </div>
        <button disabled={rating < 1 && review.length < 10}>Submit Your Review</button>
      </form>
    </>
  );
}

export default ReviewFormModal;
