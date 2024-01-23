import { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchGetSpots} from '../../store/spot'
import {NavLink} from 'react-router-dom';
import './SpotList.css';


function SpotList(){

     const dispatch = useDispatch();
     const spots = useSelector(state => state.spots);

     const spotsArray = spots.spot.Spots
     // console.log('spotsArray===>',spotsArray[0])

     useEffect(()=>{
          dispatch(fetchGetSpots())
     },[dispatch])

     if(!spots)return null

     return(
     <>
          <div className='spot-list-container tooltip'>
               {spotsArray?.map(eachSpot=>(
                    <div key={eachSpot.id} className='spot-tile'>
                         <NavLink key={eachSpot.id} to={`/spots/${eachSpot.id}`}>
                         <img src={eachSpot.previewImage} alt={eachSpot.name}/>

                         <p className="tooltiptext">{eachSpot.name}</p>
                         <div className='city-rating-line'>
                              <p>{eachSpot.city}, {eachSpot.state}</p>
                              <p><i className="fa-solid fa-star" style={{width: "20px"}}></i>{eachSpot.avgRating > 0 ? eachSpot.avgRating.toFixed(1) : 'New' }</p>
                         </div>
                         <p>${eachSpot.price} night</p>
                         </NavLink>
                    </div>
               ))}
          </div>
     </>
     )
}


export default SpotList;
