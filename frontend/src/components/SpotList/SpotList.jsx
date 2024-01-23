import { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchGetSpots} from '../../store/spot'
import './SpotList.css';


function SpotList(){

     const dispatch = useDispatch();
     const spots = useSelector(state => state.spots);
     // if(!spots)return null

     const spotsArray = spots.spot.Spots
     // console.log('spotsArray===>',spotsArray[0])

     useEffect(()=>{
          dispatch(fetchGetSpots())
     },[dispatch])


     return(
     <>
          <div className='spot-list-container tooltip'>
               {spotsArray?.map(eachSpot=>(
                    <div key={eachSpot.id} className='spot-tile'>
                         <img src={eachSpot.previewImage} alt={eachSpot.name}/>
                         <p className="tooltiptext">{eachSpot.name}</p>
                         <p>{eachSpot.city}, {eachSpot.state}</p>
                         <p>{eachSpot.avgRating > 0 ? eachSpot.avgRating.toFixed(1) : 'New' }</p>
                         <p>${eachSpot.price} night</p>
                    </div>
               ))}
          </div>
     </>
     )
}


export default SpotList;
