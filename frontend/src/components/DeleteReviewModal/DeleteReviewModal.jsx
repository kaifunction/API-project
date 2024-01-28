import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { fetchDeleteReview } from "../../store/review"

function DeleteReviewModal({ reviewId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  // console.log("reviewIdfromdeleteModal===>", reviewId);
  const spotId = useSelector(state => state.spots?.spot?.id)
  // console.log(spotId)

  const handledelete = () => {
        // e.preventDefault();
    dispatch(fetchDeleteReview(reviewId)).then(() => {
      // 在成功删除后，使用 window.location.href 导航到 "/spots/current"
      window.location.href = `/spots/${spotId}`;
    });
    closeModal();
  };

  const handlekeep = () => {
    //     e.preventDefault();
    closeModal();
  };
  return (
    <div className="delete-modal-container">
      <div className="text-container">
        <h1 className="confrim">Confrim Delete</h1>
        <p className="text">
        Are you sure you want to delete this review?
        </p>
      </div>
      <div className="button-container">
        <button className="yes" onClick={handledelete}>
          Yes (Delete Review)
        </button>
        <button className="No" onClick={handlekeep}>
          No (Keep Review)
        </button>
      </div>
    </div>
  );
}

export default DeleteReviewModal;
