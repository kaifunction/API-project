import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetSpotsById } from "../../store/getspots";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal";
// import SpotEdit from "../SpotEdit/SpotEdit"
import "./SpotByUser.css";

function SpotByUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [render, setRender] = useState(false);
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
    navigate(`/spots/${spotId}/edit`);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    //需要解决，
  };

  return (
    <div className="manage-page-container">
      <div className="manage-header">
        <h1 className="manage-title h1">Manage Your Spots</h1>
        <button onClick={handleCreateSpot}
        className="create-spot-button-manage" style={{padding:"8px 20px"}}>Create a New Spot</button>
      </div>

      <div className="manage-images-container">
        {currentUserSpot?.map((spot) => (
          <div key={spot.id} className="each-image-container">
            <NavLink key={spot.id} to={`/spots/${spot.id}`} style={{textDecoration: "none"}}>
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
                      style={{ width: "25px", color: "#ffe51c" }}
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

                <button onClick={(e) => handleUpdate(e, spot.id)} className="update-button" style={{cursor: "pointer", padding:"8px 20px"}}>
                  Update
                </button>

              {/* <div className="delete-button"> */}
                <button onClick={handleDelete}
                className="delete-button" style={{cursor: "pointer", padding:"8px 20px"}}>
                  <OpenModalMenuItem
                    itemText="Delete"
                    //     onItemClick={closeMenu}
                    modalComponent={<DeleteSpotModal spotId={spot.id} />}
                  />
                </button>
              {/* </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpotByUser;
