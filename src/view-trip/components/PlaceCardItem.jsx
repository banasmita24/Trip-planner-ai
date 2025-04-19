import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';

function PlaceCardItem({ place }) {
    const [photoUrl, setPhotoUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (place) GetPlaceImg();
    }, [place]);

    const GetPlaceImg = async () => {
        try {
            const data = { textQuery: place.placeName };
            const resp = await GetPlaceDetails(data);

            const photos = resp?.data?.places?.[0]?.photos;
            const selectedPhoto = photos?.[3] || photos?.[0];

            if (selectedPhoto?.name) {
                const PhotoUrl = PHOTO_REF_URL.replace('{NAME}', selectedPhoto.name);
                setPhotoUrl(PhotoUrl);
            } else {
                setPhotoUrl('/placeholder.jpg');
            }
        } catch (err) {
            console.error("Failed to load photo:", err);
            setPhotoUrl('/placeholder.jpg');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Link
                to={`https://www.google.com/maps/search/?api=1&query=${place?.placeName},${place?.geoCoordinates}`}
                target='_blank'
            >
                <div className='my-4 bg-gray-50 p-2 gap-2 border rounded-lg flex flex-cols-2 hover:scale-105 transition-all hover:shadow-md cursor-pointer '>
                    <div className='py-2 mx-3'>
                        {loading ? (
                            <div className='w-[140px] h-[140px] bg-gray-300 animate-pulse rounded-xl' />
                        ) : (
                            <img
                                src={photoUrl}
                                className='w-[140px] h-[140px] rounded-xl object-cover transition-all duration-300'
                                onError={(e) => (e.currentTarget.src = '/placeholder.jpg')}
                            />
                        )}
                    </div>
                    <div className='flex flex-col justify-between'>
                        <div>
                            <h2 className='font-medium text-sm text-orange-600'>{place.time}</h2>
                            <h2 className='font-bold text-blue-700'>{place.placeName}</h2>
                            <p className='text-sm text-gray-500'>{place.placeDetails}</p>
                            <h2 className='text-blue-700 text-sm'>{place.ticketPricing}</h2>
                            <h2 className='text-sm text-yellow-500'>⭐{place.rating}</h2>
                        </div>
                    </div>
                    <div className='mt-36'>
                        <Button><FaLocationDot /></Button>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default PlaceCardItem;