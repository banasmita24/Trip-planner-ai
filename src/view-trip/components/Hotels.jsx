import React from 'react'
import HotelCardItem from './HotelCardItem'

function Hotels({ trip }) {
  const hotelOptions = Array.isArray(trip?.tripData?.hotelOptions) ? trip.tripData.hotelOptions : [];

  return (
    <div>
      <h2 className='font-bold text-xl my-7'>Hotel Recommendation</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6'>
        {hotelOptions.map((item, index) => (
          <HotelCardItem 
            key={item.id ?? `${item.name}-${index}`} 
            item={item} 
          />
        ))}
      </div>
    </div>
  )
}

export default Hotels
