import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HotelCardItem({ item }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (item?.hotelName) {
      setLoading(true);
      GetPlaceImg();
    }
  }, [item]);

  const GetPlaceImg = async () => {
    try {
      const data = { textQuery: item.hotelName };
      const resp = await GetPlaceDetails(data);
      
      // Safely get the 4th photo or fallback to 1st photo
      const photos = resp?.data?.places?.[0]?.photos;
      const selectedPhoto = photos?.[3] || photos?.[0];
      
      if (selectedPhoto?.name) {
        const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', selectedPhoto.name);
        setPhotoUrl(PhotoUrl);
      }
    } catch (error) {
      console.error("Error loading hotel image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link 
        to={`https://www.google.com/maps/search/?api=1&query=${item?.hotelName},${item?.hotelAddress}`} 
        target='_blank'
      >
        <div className='hover:scale-105 transition-all cursor-pointer'>
          {/* Image with loading state */}
          <div className='rounded-xl h-[180px] w-full overflow-hidden bg-gray-100'>
            {loading ? (
              <div className='h-full w-full animate-pulse bg-gray-300' />
            ) : (
              <img
                src={photoUrl || '/placeholder.jpg'}
                alt={item?.hotelName || 'Hotel image'}
                className='h-full w-full object-cover'
                onError={(e) => {
                  e.target.src = '/placeholder.jpg';
                }}
              />
            )}
          </div>
          
          {/* Hotel info */}
          <div className='my-3 py-2'>
            <h2 className='font-medium'>{item?.hotelName}</h2>
            <h2 className='text-xs text-gray-500'>📍{item?.hotelAddress}</h2>
            <h2 className='text-sm'>💰{item?.price}</h2>
            <h2 className='text-sm'>⭐{item?.rating}</h2>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default HotelCardItem;