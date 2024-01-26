import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { fetchDeleteReview } from "../../store/review"

function DeleteReviewModal({ reviewId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  console.log("reviewIdfromdeleteModal===>", reviewId);
  const handledelete = (e) => {
        e.preventDefault();
    dispatch(fetchDeleteReview(reviewId));
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
