import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetail, fetchReview } from "../../store/spot";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import PostReviewModal from "../PostReviewModal/PostReviewModal";
import "./SpotDetail.css";
// import { useNavigate } from "react-router-dom";

function SpotDetail() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spotDetail = useSelector((state) => state.spots.spot);
  //   console.log("spotDetail====>",spotDetail)
  const currentUser = useSelector((state) => state.session.user);
  const spotReview = useSelector((state) => state.spots.review);
  //  console.log(currentUser); //没有登录为null

  useEffect(() => {
    dispatch(fetchSpotDetail(spotId));
  }, [dispatch, spotId]);

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

  return (
    <div className="spot-detail-container">
      {/* 图片和spot名字，地址 */}
      <div className="top-column">
        <h1>{spotDetail.name}</h1>
        <h3>
          {spotDetail.city}, {spotDetail.state}, {spotDetail.country}
        </h3>
        <div className="image-container">
          <div className="preview-image-container">
            <img
              src={previewImage}
              alt={spotDetail.name}
              className="previewImage"
            />
          </div>
          <div className="samllImage">
            {smallImage.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={spotDetail.name}
                style={{ width: "280px" }}
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
              <span className="star-rating-number">
                <i className="fa-solid fa-star" style={{ width: "30px" }}></i>
                {spotDetail.avgStarRating > 0
                  ? spotDetail.avgStarRating.toFixed(1)
                  : "New"}
              </span>
              <span>{spotDetail.numReviews === 0 ? "" : "•"}</span>
              <span className="number-review">
                <br />
                {spotDetail.numReviews === 0
                  ? ""
                  : `${spotDetail.numReviews} ${
                      spotDetail.numReviews === 1 ? "Review" : "Reviews"
                    }`}
              </span>

              <span className="price-per-night">${spotDetail.price} night</span>
            </div>

            <button onClick={handleReserveClick} className="reserve-button">
              Reserve
            </button>
          </div>
        </div>
      </div>

      {/* 底下的reviews包括🌟 rating， review数量 */}
      <div className="bottom-column">
        <div className="review-part">
          <span>
            <i className="fa-solid fa-star" style={{ width: "30px" }}></i>
            {spotDetail.avgStarRating > 0
              ? spotDetail.avgStarRating.toFixed(1)
              : "New"}
          </span>
          <span>{spotDetail.numReviews === 0 ? "" : "•"}</span>
          <span>
            {spotDetail.numReviews === 0
              ? ""
              : `${spotDetail.numReviews} ${
                  spotDetail.numReviews === 1 ? "Review" : "Reviews"
                }`}
          </span>
          <div className="post-review-button">
            {showPostReviewButton && (
              //     <button className="post-review-button">Post Your Review</button>
              <button>
                <OpenModalMenuItem
                  itemText="Post Your Review"
                  //     onItemClick={closeMenu}
                  modalComponent={<PostReviewModal />}
                />
              </button>
            )}
          </div>
        </div>

        {spotDetail.numReviews > 0 ? (
          <div className="review-container">
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
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            {currentUser &&
              spotReviewArr.length === 0 &&
              spotDetail.Owner.id !== currentUser.id && (
                <p>Be the first to post a review!</p>
              )}
          </div>
        )}

        {/* console.log("spotDetail ID ====>", spotDetail.Owner.id)
  console.log("USERID ====>", spotReviewArr[0].User.id) */}
        {/* <div>
        {spotDetail.numReviews > 0 ? (
          <div className="reviews-list">

            {spotDetail.reviews.map((review, index) => (
          <div key={index} className="review-item">
            <p>
              {review.reviewer.firstName}, {getFormattedDate(review.postedDate)}
            </p>
            <p>{review.comment}</p>
          </div>
        ))}
          </div>
        ) : (
          <div className="no-reviews">

            {currentUser && !isOwner && <p>Be the first to post a review!</p>}
          </div>
        )}
      </div> */}
      </div>
    </div>
  );
}

export default SpotDetail;
