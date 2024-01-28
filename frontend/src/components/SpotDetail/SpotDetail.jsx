import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetail } from "../../store/spot";
import { fetchReview } from "../../store/review";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import PostReviewModal from "../PostReviewModal/PostReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import "./SpotDetail.css";
// import { useNavigate } from "react-router-dom";

function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spotDetail = useSelector((state) => state.spots.spot);
  // console.log("spotDetail====>",spotDetail)
  const currentUser = useSelector((state) => state.session.user);
  const spotReview = useSelector((state) => state.review.review);
  //  console.log(currentUser); //没有登录为null
  // console.log("spotReview====>",spotReview)

  useEffect(() => {
    dispatch(fetchSpotDetail(spotId));
  }, [dispatch, spotId, spotReview]);

  useEffect(() => {
    dispatch(fetchReview(spotId));
  }, [dispatch, spotId]);

  if (!spotReview) return null;

  const spotDetailImage = spotDetail.SpotImages;
  //   console.log("spotDetailImage====>", spotDetailImage);
  if (!spotDetail.SpotImages) return null;

  const spotReviewArr = spotReview.Reviews;
  if (!spotReviewArr) return null;

  spotReviewArr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const options = { year: "numeric", month: "long" };

  const firstImage = spotDetailImage.find((image) => {
    if (image.preview === true) return image.url;
  });

  //   console.log("firstImage====>", firstImage);
  const previewImage = firstImage.url;
  //   console.log("previewImage====>", previewImage);
  //   console.log("spotDetailImage====>", spotDetailImage);

  const smallImage = spotDetailImage
    .map((image) => (image.preview === false ? image.url : ""))
    .filter((url) => url !== "");
  //   console.log("smallImage====>", smallImage);

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  //Post your Reviwe Button的逻辑
  const isCurrentUserOwner =
    currentUser && spotDetail.Owner.id === currentUser.id;
  const hasCurrentUserPostedReview =
    currentUser &&
    spotReviewArr.some((review) => review.User.id === currentUser.id);

  const showPostReviewButton =
    currentUser && // 用户已登录
    !isCurrentUserOwner && // 用户不是地点的所有者
    !hasCurrentUserPostedReview; // 用户尚未为该地点发布评论

  // const showDeleteReviewButton =
  //   currentUser && !isCurrentUserOwner && hasCurrentUserPostedReview;

  return (
    <div className="spot-detail-container">
      {/* 图片和spot名字，地址 */}
      <div className="top-column">
        <h1 className="detail-title h1">{spotDetail.name}</h1>
        <h3 className="detail-city-state-country h3">
          {spotDetail.city}, {spotDetail.state}, {spotDetail.country}
        </h3>
        <div className="image-container">
          <div className="preview-image-container">
            <img
              src={previewImage}
              alt={spotDetail.name}
              className="previewImage"
              style={{ width: "600px", height: "420px" }}
            />
          </div>
          <div className="samllImage">
            {smallImage.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={spotDetail.name}
                style={{
                  width: "280px",
                  height: "203px",
                  paddingLeft: "10px",
                  paddingBottom: "10px",
                }}
              />
            ))}
          </div>
        </div>

        {/* hosted的主人名字，描述，callout box */}
        <div className="host-name-callout-box-container">
          <div className="hosted-name-description">
            <h3 className="hosted-name">
              Hosted by {spotDetail.Owner.firstName} {spotDetail.Owner.lastName}
            </h3>
            <p className="description">{spotDetail.description}</p>
          </div>

          <div className="callout-box">
            <div className="star-review-price-container">
              <span className="price-per-night" style={{ color: "#00ffbf" }}>
                ${spotDetail.price} night
              </span>

              <span
                className="number-review"
                style={{
                  position: "relative",
                  top: "-17px",
                  left: "335px",
                  color: "#00ffbf",
                }}
              >
                <br />
                <span>{spotDetail.numReviews === 0 ? "" : "•"}</span>
                {spotDetail.numReviews === 0
                  ? ""
                  : `${spotDetail.numReviews} ${
                      spotDetail.numReviews === 1 ? "Review" : "Reviews"
                    }`}
              </span>

              <span
                className="star-rating-number"
                style={{
                  color: "#00ffbf",
                  position: "relative",
                  left: "-80px",
                }}
              >
                <i
                  className="fa-solid fa-star"
                  style={{ width: "30px", color: "#ffe51c" }}
                ></i>
                {spotDetail.avgStarRating > 0
                  ? spotDetail.avgStarRating.toFixed(1)
                  : "New"}
              </span>
            </div>

            <button onClick={handleReserveClick} className="reserve-button">
              Reserve
            </button>
          </div>
        </div>
      </div>

      {/* 底下的reviews包括🌟 rating， review数量 */}
      <span
        style={{
          width: "100%",
          height: "2px",
          backgroundColor: "#00ffbf",
          margin: "40px 0",
        }}
      ></span>
      <div className="bottom-column">
        <div className="review-part">
          <span>
            <i
              className="fa-solid fa-star"
              style={{ width: "30px", color: "#ffe51c" }}
            ></i>
            {spotDetail.avgStarRating > 0
              ? spotDetail.avgStarRating.toFixed(1)
              : "New"}
          </span>

          <span style={{ position: "relative", left: "15px" }}>
            {spotDetail.numReviews === 0 ? "" : "•"}
          </span>
          <span style={{ position: "relative", left: "20px" }}>
            {spotDetail.numReviews === 0
              ? ""
              : `${spotDetail.numReviews} ${
                  spotDetail.numReviews === 1 ? "Review" : "Reviews"
                }`}
          </span>

          <div className="post-review-button">
            {showPostReviewButton && (
              //     <button className="post-review-button">Post Your Review</button>
              <button
                className="detail-post-review"
                style={{ position: "relative", top: "10px",padding:"8px 20px" }}
              >
                <OpenModalMenuItem
                  itemText="Post Your Review"
                  //     onItemClick={closeMenu}
                  modalComponent={<PostReviewModal />}
                />
              </button>
            )}
          </div>
        </div>

        <div className="review-container">
          {spotDetail.numReviews > 0 ? (
            <div
              style={{
                position: "relative",
                left: "-1015px",
                top: "80px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {spotReviewArr.map((review, index) => (
                <div key={index} className="text-container">
                  <span className="reviewer-firstname">
                    {review.User.firstName}{" "}
                    {new Date(review.createdAt).toLocaleDateString(
                      "en-US",
                      options
                    )}
                  </span>
                  <p>{review.review}</p>
                  <div className="delete-review-button">
                    {/* {console.log("reviewIdfromSPOTDETAIL===>", review.id)} */}
                    {review?.User.id === currentUser?.id && (
                      <button className="detail-delete-button" style={{padding:"8px 20px"}}>
                        <OpenModalMenuItem
                          itemText="Delete"
                          //     onItemClick={closeMenu}
                          modalComponent={
                            <DeleteReviewModal reviewId={review.id} />
                          }
                        />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="no-reviews"
              style={{ position: "relative", right: "990px", top: "56px" }}
            >
              {currentUser &&
                spotReviewArr.length === 0 &&
                spotDetail.Owner.id !== currentUser.id && (
                  <p>Be the first to post a review!</p>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpotDetail;
