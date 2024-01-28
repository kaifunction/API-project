import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetSpots } from "../../store/spot";
import { NavLink } from "react-router-dom";
import "./SpotList.css";

function SpotList() {
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots);
  const currentUser = useSelector((state) => state.session.user);

  console.log("currentUser===>", currentUser);

  const spotsArray = spots.spot.Spots;
  // console.log('spotsArray===>',spotsArray[0])

  useEffect(() => {
    dispatch(fetchGetSpots());
  }, [dispatch]);

  if (!spots) return null;
  // if(!spots || currentUser)return null

  return (
    <>
      <div className="spot-list-container">
        {spotsArray?.map((eachSpot) => (
          <div key={eachSpot.id} className="spot-tile tooltip">
            <NavLink key={eachSpot.id} to={`/spots/${eachSpot.id}`} className="nav-link active" >
              <img
                src={eachSpot.previewImage}
                alt={eachSpot.name}
                style={{ width: "430px", height: "260px" }}
              />

              <div className="text-container">
                <p className="tooltiptext tooltip">{eachSpot.name}</p>
                <div className="city-rating-line">
                  <p>
                    {eachSpot.city}, {eachSpot.state}
                  </p>
                  <p>
                    <i
                      className="fa-solid fa-star"
                      style={{ width: "20px" , color: "#fdbf60"}}
                    ></i>
                    {eachSpot.avgRating > 0
                      ? eachSpot.avgRating.toFixed(1)
                      : "New"}
                  </p>
                </div>
                <p className="price-night">${eachSpot.price} night</p>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </>
  );
}

export default SpotList;
