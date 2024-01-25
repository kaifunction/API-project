import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetSpotsById } from "../../store/getspots";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
// import SpotEdit from "../SpotEdit/SpotEdit"
import "./SpotByUser.css";

function SpotByUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
//   const currentUserId = useSelector((state) => state.session.user.id);
  // console.log("currentUser=====>", currentUserId)
  const currentUserSpot = useSelector((state) => state.getspots.spot.Spots);

  console.log("currentUserSpot=====>", currentUserSpot);

  useEffect(() => {
    dispatch(fetchGetSpotsById());
  }, [dispatch]);

  if (!currentUserSpot) return null;

  const handleCreateSpot = (e) => {
    e.preventDefault();
    navigate("/spots/new");
    // console.log("gooooooooo")
  };

  const handleUpdate = (e, spotId) => {
     e.preventDefault();
     navigate(`/spots/${spotId}/edit`)
  }

  return (
    <div className="manage-page-container">
      <div className="manage-header">
        <h1 className="manage-title">Manage Your Spots</h1>
        <button onClick={handleCreateSpot}>Create a New Spot</button>
      </div>

      <div className="manage-images-container">
        {currentUserSpot?.map((spot) => (
          <div key={spot.id} className="each-image-container">
            <NavLink key={spot.id} to={`/spots/${spot.id}`}>
              <div className="image">
                <img
                  src={spot.previewImage}
                  alt={spot.className}
                  style={{ width: "300px", height: "200px" }}
                />
              </div>

              <div className="image-text">
                <div className="text-line-one">
                  <span className="city-state">
                    {spot.city}, {spot.state}
                  </span>
                  <span className="star-review">
                    <i
                      className="fa-solid fa-star"
                      style={{ width: "20px" }}
                    ></i>
                    {spot.avgRating > 0 ? spot.avgRating.toFixed(1) : "New"}
                  </span>
                </div>

                <br />

                <div className="text-line-two">
                  <span>${spot.price} night</span>
                </div>
              </div>
            </NavLink>
            <div className="buttons">
              <div className="update-button">
                <button onClick={(e) => handleUpdate(e, spot.id)}>Update</button>
                {/* <SpotEdit spotId={spot.id}/> */}
              </div>
              <div className="delete-button">
                <button>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpotByUser;
