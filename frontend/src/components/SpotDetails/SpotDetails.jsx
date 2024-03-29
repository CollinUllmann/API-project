import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectSpotById, thunkFetchSpotById } from "../../store/spot";
import { useEffect } from "react";
import { selectUserById, thunkFetchUsers } from "../../store/users";
import { selectSpotImagesBySpotId } from "../../store/spotImages";
import './SpotDetails.css'
import { FaStar } from "react-icons/fa6";
import Reviews from "../Reviews/Reviews";



function SpotDetails() {
  const dispatch = useDispatch();
  const {spotId} = useParams();

  const getSpotById = useSelector(selectSpotById)
  const getUserById = useSelector(selectUserById)
  const getImagesBySpotId = useSelector(selectSpotImagesBySpotId)


  const spot = getSpotById(spotId);
  const owner = getUserById(spot?.ownerId);
  const spotImages = getImagesBySpotId(spotId)
  const previewSpotImage = spotImages.find(spotImage => spotImage.preview);
  const gallerySpotImages = spotImages.filter(spotImage => !spotImage.preview);

  useEffect(() => {
    dispatch(thunkFetchSpotById(spotId))
    dispatch(thunkFetchUsers())
  }, [spotId, dispatch])


  const gallerySpotImageElements = gallerySpotImages.map(spotImage => {
    return (
      <div key={spotImage.id} className="SpotImageGalleryCell">
        <img  src={spotImage.url} className="SpotImageGalleryImage"/>
      </div>
    )
  })

  const rows = 2
  const imagePositionMapping = {};
  for (let i = 0; i < gallerySpotImageElements.length; i++) {
    const colPosition = Math.floor(i / rows) + 1
    const rowPosition = (i % rows) + 1
    imagePositionMapping[i] = [rowPosition, colPosition]
  }
  



  return (
    <div className="SpotDetailsContainer">
    <div className="SpotDetailsBody">
      <div className="TitleAndCityStateCountryDiv">
        <div className="Title">{spot?.name}</div>
        <div className="CityStateCountry">{spot?.city}, {spot?.state}, {spot?.country}</div>
      </div>
      <div className="SpotDetailsImageContainer">
        <div className="SpotDetailsPreviewCell">
          <img className='SpotDetailsPreviewImage' src={previewSpotImage?.url} />
        </div>
        <div className='SpotDetailsImageGallery'>
          {gallerySpotImages.map((spotImage, index) => {
            return (
              <div key={spotImage.id} className="SpotImageGalleryCell" style={{'gridArea': `${imagePositionMapping[index][0]} / ${imagePositionMapping[index][1]} / ${imagePositionMapping[index][0]} / ${imagePositionMapping[index][1]}`}}>
                <img  src={spotImage.url} className="SpotImageGalleryImage"/>
              </div>
            )
          })}
        </div>
      </div>
      <div className="SpotDetailsDescriptionAndReservationContainer">
        <div className="SpotDetailsHostDescription">
          <h2 className="SpotDetailsHostedByTitle">Hosted by {owner?.firstName} {owner?.lastName}</h2>
          <p className="SpotDetailsDescription">{spot?.description}</p>
        </div>
        <div className="SpotDetailsReservationContainer">
          <div className="SpotDetailsPriceRatingSpan">
            <div className="SpotDetailsPrice"><h2>${spot?.price}</h2><span>night</span></div>
              <div className="SpotDetailsReviewAvgAndCount">
                <h3 className='ReviewStarHeader'><FaStar/>{(isNaN(spot?.avgStarRating) || spot?.avgStarRating == null) ? 'New!' : Number(spot?.avgStarRating).toFixed(1)}</h3>
                {spot?.numReviews > 0 && (
                  <h3>{'· '}{spot?.numReviews} {spot?.numReviews == 1 ? 'review' : 'reviews'}</h3>
                )}
              </div>
          </div>
          <div className="ReserveButtonContainer">
            <div className='ReserveButton' onClick={()=>alert('Feature Coming Soon...')}>Reserve</div>
          </div>
        </div>
      </div>
      <div className="HrDiv">
        <hr className="ReviewsPageBreak"/>
      </div>
      {spot ? <Reviews spot={spot}/> : <></>}
    </div></div>
  );
}

export default SpotDetails;
