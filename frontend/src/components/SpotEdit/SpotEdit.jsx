// import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotDetail } from "../../store/spot";
import { fetchUpdateSpot } from "../../store/updateSpot";
import "./SpotEdit.css"

function SpotEdit() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spot = useSelector((state) => state.spots);
  //   console.log("spot====>", spot.spot.country);
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState("");

  useEffect(() => {
    dispatch(fetchSpotDetail(spotId));
  }, [dispatch, spotId]);

  useEffect(() => {
    if (spot) {
      setCountry(spot.spot.country);
      setAddress(spot.spot.address);
      setCity(spot.spot.city);
      setState(spot.spot.state);
      setLat(spot.spot.lat);
      setLng(spot.spot.lng);
      setDescription(spot.spot.description);
      setName(spot.spot.name);
      setPrice(spot.spot.price);
    }
  }, [spot]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const errors = {};
    if (country.length === 0) errors.country = "Country is required";
    if (address.length === 0) errors.address = "Address is required";
    if (city.length === 0) errors.city = "City is required";
    if (state.length === 0) errors.state = "State is required";
    if (lat.length === 0) errors.lat = "Latitude is required";
    if (lng.length === 0) errors.lng = "Longitude is required";
    if (description.length < 30)
      errors.description = "Description needs a minimum of 30 characters";
    if (name.length === 0) errors.name = "Name is required";
    if (price.length === 0) {
      errors.price = "Price is required";
    } else if (!/^[1-9]\d*$/.test(price)) {
      errors.price = "Price must be a positive integer";
    }

//     console.log("spotIdFromComponent=====>", spotId);
    //Can get the spotId from component.

    if (Object.values(errors).length > 0) {
      setErrors(errors);
    } else if (spotId) {
      dispatch(
        fetchUpdateSpot({
          country,
          address,
          city,
          state,
          lat,
          lng,
          description,
          name,
          price,
          spotId,
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
      navigate(`/spots/${spotId}`);
    }
  };

  return (
    <div className="page-container">
      <div className="title-container">
        <h1 className="h1">Create a new Spot</h1>
        <h3 className="h3">Where&apos;s your place located?</h3>
        <p className="p">
          Guests will only get your exact address once they booked a
          reservation.
        </p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="first-four-input">
            {/* Country */}
            <label className="country-label">
              Country
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="country"
                style={{ width: "580px", height: "30px",  margin: "5px 0" }}
              />
            </label>
            {errors.country && <p style={{ color: "red" }}>{errors.country}</p>}

            {/* Address */}
            <label className="address-label">
              Street Address
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                style={{ width: "580px", height: "30px",  margin: "5px 0" }}
              />
            </label>
            {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}

            <div className="city-state">
              {/* City */}
              <label>
                City
                <br />
                <span style={{ paddingRight: "15px" }}></span>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  style={{
                    width: "380px",
                    height: "30px",
                    position: "relative",
                    left: "-14px",
                    top: "5px",
                  }}
                />
                <span style={{position: "absolute"}}>, </span>
              </label>
              {errors.city && <p style={{ color: "red", position: "relative", top: "50px", left: "-400px" }}>{errors.city}</p>}

              {/* State */}
              <label className="state-label">
                State
                <br />
                <span style={{ paddingRight: "15px" }}></span>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  style={{
                    width: "169px",
                    height: "30px",
                    position: "relative",
                    left: "-14px",
                    top: "5px",
                  }}
                />
              </label>
              {errors.state && <p style={{ color: "red", position: "relative", top: "50px", left: "-190px"}}>{errors.state}</p>}
            </div>

            <div className="lat-lng">
              {/* Latitude */}
              <div className="lat-lng">
              <label className="latitude-label">
                Latitude
                <input
                  type="text"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="Latitude"
                  style={{
                    width: "380px",
                    height: "30px",
                    position: "relative",
                    left: "0px",
                    top: "5px",
                  }}
                />
                <span>, </span>
              </label>
              {errors.lat && <p style={{ color: "red", position: "relative", top: "50px", left: "-387px"}}>{errors.lat}</p>}
              {/* Longitude */}
              <label className="longitude-label">
                Longitude
                <input
                  type="text"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="Longitude"
                  style={{
                    width: "159px",
                    height: "30px",
                    position: "relative",
                    left: "21px",
                    top: "5px",
                  }}
                />
              </label>
              {errors.lng && <p style={{ color: "red", position: "relative", top: "50px", left: "-145px" }}>{errors.lng}</p>}
              </div>
            </div>
          </div>

          <div className="describe-container">
            <h3 className="h3">Describe your place to guests</h3>
            <p>
              Mention the best features of your space, any special amentities
              like fast wifi or parking, and what you love about the
              neighborhood.
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please write at least 30 characters"
              style={{ width: "580px", height: "100px"}}
            ></textarea>
            {errors.description && (
              <p style={{ color: "red" }}>{errors.description}</p>
            )}
          </div>

          <div className="spot-name">
            <h3 className="h3">Create a title for your spot</h3>
            <p>
              Catch guests&apos; attention with a spot title that highlights
              what makes your place special.
            </p>
            <label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name of your spot"
                style={{ width: "580px", height: "30px",  margin: "5px 0" }}
              />
            </label>
            {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
          </div>

          <div className="base-price">
            <h3 className="h3">Set a base price for your spot</h3>
            <p>
              Competitive pricing can help your listing stand out and rank
              higher in search results.
            </p>
            <label>
              $
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price per night (USD)"
                style={{ width: "575px", height: "30px",  margin: "5px 0" }}
              />
            </label>
            {errors.price && <p style={{ color: "red" }}>{errors.price}</p>}
          </div>

          <div className="submit-button" style={{paddingBottom: "100px"}}>
            <button type="submit" style={{position: "relative",
              top: "30px", backgroundColor: "#00ffbf", borderRadius: "5px", padding:"8px 20px", cursor: "pointer"}}>Update your Spot</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SpotEdit;
