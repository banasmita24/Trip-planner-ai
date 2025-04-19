import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPlaceImage = async () => {
      try {
        if (!trip?.userSelection?.location) {
          throw new Error('Location not specified');
        }

        setLoading(true);
        setError(null);

        // Check cache first
        const cacheKey = `place-img-${trip.userSelection.location}`;
        const cachedUrl = localStorage.getItem(cacheKey);
        
        if (cachedUrl) {
          if (isMounted) {
            setPhotoUrl(cachedUrl);
            setLoading(false);
          }
          return;
        }

        const data = {
          textQuery: trip.userSelection.location,
        };

        const resp = await GetPlaceDetails(data);
        
        if (!resp?.data?.places?.[0]?.photos) {
          throw new Error('No photos found for this location');
        }

        // Try to get the 4th photo first, fallback to 1st
        const photos = resp.data.places[0].photos;
        const selectedPhoto = photos[3] || photos[0];
        
        if (!selectedPhoto?.name) {
          throw new Error('Invalid photo reference');
        }

        const generatedUrl = PHOTO_REF_URL.replace('{NAME}', selectedPhoto.name);

        // Verify the image loads before setting state
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.src = generatedUrl;
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Image failed to load'));
        });

        if (isMounted) {
          setPhotoUrl(generatedUrl);
          setLoading(false);
          // Cache the successful URL
          localStorage.setItem(cacheKey, generatedUrl);
        }

      } catch (err) {
        if (isMounted) {
          console.error('Error loading place image:', err.message);
          setError(err.message);
          setPhotoUrl('/placeholder.jpg');
          setLoading(false);
        }
      }
    };

    if (trip) {
      fetchPlaceImage();
    }

    return () => {
      isMounted = false;
    };
  }, [trip]);

  return (
    <div className="space-y-6">
      {/* Image Section */}
      <div className="relative h-[330px] w-full rounded-xl overflow-hidden">
        {loading ? (
          <div className="h-full w-full bg-gray-200 animate-pulse rounded-xl" />
        ) : (
          <img
            src={photoUrl || '/placeholder.jpg'}
            alt={trip?.userSelection?.location || 'Travel destination'}
            className="h-full w-full object-cover transition-opacity duration-300"
            loading="eager"
            decoding="async"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.jpg';
              e.currentTarget.classList.add('opacity-90');
            }}
          />
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-2xl md:text-3xl">
          {trip?.userSelection?.location || 'Your Destination'}
        </h2>
        
        <div className="flex flex-wrap gap-3">
          <span className="bg-gray-200 font-medium text-gray-600 rounded-full py-1 px-4 text-sm md:text-base inline-flex items-center gap-2">
            <span>🗓️</span>
            <span>{trip?.userSelection?.totalDays || 'N/A'} Day</span>
          </span>
          <span className="bg-gray-200 font-medium text-gray-600 rounded-full py-1 px-4 text-sm md:text-base inline-flex items-center gap-2">
            <span>👩‍👧‍👦</span>
            <span>Travelers: {trip?.userSelection?.traveler || 'N/A'}</span>
          </span>
          <span className="bg-gray-200 font-medium text-gray-600 rounded-full py-1 px-4 text-sm md:text-base inline-flex items-center gap-2">
            <span>💵</span>
            <span>Budget: {trip?.userSelection?.budget || 'Not specified'}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;