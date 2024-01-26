import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { fetchDeleteSpot } from "../../store/deletespot";
import "./DeleteSpotModal.css"
// import { useEffect, useState } from "react";


function DeleteSpotModal({spotId}) {
     const dispatch = useDispatch();
     const { closeModal } = useModal();
     // const spot = useSelector(state => state.spots.spot)
     // console.log("spot===>",spot)
     // const currentUserSpot = useSelector((state) => state.getspots.spot.Spots);
     // console.log("MODALcurrentUserSpot=====>",currentUserSpot)

     const handledelete = (e) => {
              e.preventDefault();
          dispatch(fetchDeleteSpot(spotId))
          closeModal()
     };

     const handlekeep = () => {
          //     e.preventDefault();
          closeModal()
     };

  return (
    <div className="delete-modal-container">
      <div className="text-container">
        <h1 className="confrim">Confrim Delete</h1>
        <p className="text">
          Are you sure you want to remove this spot from the listings?
        </p>
      </div>
      <div className="button-container">
        <button className="yes" onClick={handledelete}>
          Yes (DELETE Spot)
        </button>
        <button className="No" onClick={handlekeep}>
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}

export default DeleteSpotModal;
