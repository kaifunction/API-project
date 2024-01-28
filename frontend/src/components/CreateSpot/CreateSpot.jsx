import { useState } from "react";
import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
import { fetchPostSpotImage } from "../../store/newspotimage";
import { fetchPostSpot } from "../../store/newspot";
import "./CreateSpot.css";
import { useNavigate } from "react-router-dom";

function CreateSpot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [errors, setErrors] = useState({});
  //   let newSpot = useSelector((state) => state.spots.newspot) ;
  //   const newSpotId = newSpot.id
  //   console.log("newSpot===>",newSpot)

  function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    const urlEndWith = [".png", ".jpg", ".jpeg"];
    const urlEndWith3 = url.slice(-4);
    const urlEndWith4 = url.slice(-5);

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
    if (price.length === 0) errors.price = "Price is required";
    if (url.length === 0) {
      errors.url = "Preview image is required";
    } else if (
      !urlEndWith.includes(urlEndWith3) &&
      !urlEndWith.includes(urlEndWith4)
    ) {
      errors.url = "Preview image must end in .png, .jpg, or .jpeg";
    }

    // Check the rest of the images
    [image1, image2, image3, image4].forEach((img, index) => {
      if (
        img.length > 0 &&
        !urlEndWith.includes(img.slice(-4)) &&
        !urlEndWith.includes(img.slice(-5))
      ) {
        errors[
          `image${index + 1}`
        ] = `Image URL must end in .png, .jpg, or .jpeg`;
      }
    });

    if (Object.values(errors).length) {
      setErrors(errors);
    } else {
      dispatch(
        fetchPostSpot({
          country,
          address,
          city,
          state,
          lat,
          lng,
          description,
          name,
          price,
        })
      )
        .then((response) => {
          const images = [
            { url, preview: true },
            { url: image1, preview: false },
            { url: image2, preview: false },
            { url: image3, preview: false },
            { url: image4, preview: false },
          ].filter((img) => img.url); // 过滤掉空的 URL

          // 使用 Promise.all 对所有图片进行处理
          Promise.all(
            images.map((img) =>
              dispatch(
                fetchPostSpotImage({
                  url: img.url,
                  preview: img.preview,
                  newSpotId: response.id,
                })
              )
            )
          )

            .then(() => navigate(`/spots/${response.id}`))

            .catch(async (res) => {
              const data = await res.json();
              if (data?.errors) {
                setErrors(data.errors);
              }
            });
        })

        .catch(async (res) => {
          const data = await res.json();
          // console.log("dataCreate====>", data);
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
  }

  return (
    <div className="page-container">
      <div className="title-container">
        <h1 className="h1">CREATE A NEW SPOT</h1>
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
                style={{ width: "580px", height: "30px", margin: "5px 0"}}
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
                style={{ width: "580px", height: "30px", margin: "5px 0" }}
              />
            </label>
            {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}

            <div className="city-state">
              {/* City */}
              <label className="city-label">
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
                <span  style={{position: "absolute"}}>, </span>
              </label>
              {errors.city && <p style={{ color: "red", position: "relative", top: "50px", left: "-400px"  }}>{errors.city}</p>}

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
                    width: "169px", height: "30px",
                    position: "relative",
                    left: "-14px",
                    top: "5px",
                  }}
                />
              </label>
              {errors.state && <p style={{ color: "red", position: "relative", top: "50px", left: "-190px" }}>{errors.state}</p>}
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
                <span style={{position: "absolute"}}>, </span>
                </label>
                {errors.lat && <p style={{ color: "red", position: "relative", top: "50px", left: "-387px" }}>{errors.lat}</p>}
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
                {errors.lng && <p style={{ color: "red", position: "relative", top: "50px", left: "-145px"  }}>{errors.lng}</p>}
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
              style={{ width: "580px", height: "150px"}}
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
              <span style={{ paddingRight: "5px" }}></span>
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

          <div className="spot-image">
            <h3 className="h3">Liven up your spot with photos</h3>
            <p>Submit a link to at least one photo to publish your spot.</p>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Preview Image URL"
              style={{ width: "580px", height: "30px",  margin: "5px 0" }}
            />
            {errors.url && <p style={{ color: "red" }}>{errors.url}</p>}
            <input
              type="text"
              value={image1}
              onChange={(e) => setImage1(e.target.value)}
              placeholder="Image URL"
              style={{ width: "580px", height: "30px",  margin: "5px 0", position: "relative",
              top: "5px"}}
            />
            {errors.image1 && <p style={{ color: "red" }}>{errors.image1}</p>}
            <input
              type="text"
              value={image2}
              onChange={(e) => setImage2(e.target.value)}
              placeholder="Image URL"
              style={{ width: "580px", height: "30px",  margin: "5px 0", position: "relative",
              top: "10px" }}
            />
            {errors.image2 && <p style={{ color: "red" }}>{errors.image2}</p>}
            <input
              type="text"
              value={image3}
              onChange={(e) => setImage3(e.target.value)}
              placeholder="Image URL"
              style={{ width: "580px", height: "30px",  margin: "5px 0", position: "relative",
              top: "15px" }}
            />
            {errors.image3 && <p style={{ color: "red" }}>{errors.image3}</p>}
            <input
              type="text"
              value={image4}
              onChange={(e) => setImage4(e.target.value)}
              placeholder="Image URL"
              style={{ width: "580px", height: "30px",  margin: "5px 0", position: "relative",
              top: "20px" }}
            />
          </div>
          {errors.image4 && <p style={{ color: "red" }}>{errors.image4}</p>}

          <div className="submit-button" style={{paddingBottom: "120px"}}>
            <button type="submit" style={{position: "relative",
              top: "30px", backgroundColor: "#00ffbf", borderRadius: "5px", padding:"3px 20px"}}>Create Spot</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSpot;
