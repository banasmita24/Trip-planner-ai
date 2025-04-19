import React from 'react'
import PlaceCardItem from './PlaceCardItem';

function TripPlace({ trip }) {
  // Ensure itinerary is an array and is not empty before mapping
  const itinerary = Array.isArray(trip?.tripData?.itinerary) ? trip.tripData.itinerary : [];

  return (
    <div className='my-4'>
      <h2 className='font-bold text-xl'>Places to Visit</h2>
      <div>
        {itinerary.length > 0 ? (
          itinerary.map((item, i) => (
            <div key={i}>
              <h2 className='font-medium text-l'>Day {item?.day}</h2>
              <div className='grid md:grid-cols-2 gap-4'>
                {item.plan?.map((place, index) => (
                  <PlaceCardItem key={place.id ?? `${place.name}-${index}`} place={place} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No itinerary data available.</p>
        )}
      </div>
    </div>
  );
}

export default TripPlace;
