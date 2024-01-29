import { useEffect, useState } from "react";
import { useModal } from "../../context/Modal";
import { useSelector, useDispatch } from "react-redux";
import { fetchPostReview } from "../../store/newreview";
import { fetchReview } from "../../store/review"
import "./PostReviewModal.css";

// import { useParams } from "react-router-dom";

function PostReviewModal() {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [activeRating, setActiveRating] = useState(stars);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const disabled = false;
  // const {spotId} = useParams();
  const spotId = useSelector((state) => state.spots.spot.id);

  // console.log("spotId=====>",spotId)

  useEffect(() => {
    setActiveRating(stars);
  }, [stars]);

  const handleEnter = (num) => {
    if (!disabled) {
      setActiveRating(num + 1);
    }
  };

  const handleLeave = () => {
    if (!disabled) {
      setActiveRating(stars);
    }
  };
  const handleClick = (number) => {
    // 点击 paw icon 时调用传递进来的 onChange 函数，并传递 paw icon 的序号
    onChange(number);
  };

  const onChange = (number) => {
    setStars(parseInt(number));
  };
  //   console.log("stars====>", stars)

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    dispatch(
      fetchPostReview({
        review,
        stars,
        spotId,
      })
    )
      .then(()=> {
          dispatch(fetchReview(spotId));
          closeModal()
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data?.message) {
          setErrors({message: "User already has a review for this spot"});
        }
        console.log(data.message)
      });
  };

  return (
    <div className="post-review-modal-container">
      <h1 className="review-modal-title">How was your stay?</h1>
      {errors.message && <p style={{color: "red"}}>{errors.message}</p>}
      <div>
        <form onSubmit={handleSubmit} className="form">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Leave your review here..."
            //   style={{width: "100ox"}}
            className="textarea"
          ></textarea>
          <div className="rating-input">
            {[0, 1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={num < activeRating ? "filled" : "empty"}
                onClick={() => handleClick(num + 1)}
                onMouseEnter={() => handleEnter(num)}
                onMouseLeave={handleLeave}
              >
                <i className="fa fa-star"></i>
              </div>
            ))}
            <label style={{marginLeft: "10px"}}>Stars</label>
          </div>

          <div className="review-post-button">
            <button disabled={review.length < 10 || stars === 0} className="submit-review-button" style={{cursor: "pointer"}}>
              Submit Your Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostReviewModal;
