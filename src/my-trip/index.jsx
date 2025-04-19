import { db } from '@/service/firebaseConfig';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Fixed useNavigation to useNavigate
import { collection, query, where, getDocs } from "firebase/firestore";
import UserTripCard from './components/UserTripCard';

function MyTrips() {
  const navigate = useNavigate(); // Fixed to useNavigate hook
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/'); // Navigate back if no user
      return;
    }

    setUserTrips([]); // Clear trips before fetching new ones
    const q = query(collection(db, 'AiTrips'), where('userEmail', '==', user?.email));
    const querySnapshot = await getDocs(q);

    const trips = []; // Array to hold all trips
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      trips.push(doc.data()); // Collect trip data
    });

    setUserTrips(trips); // Update state once after fetching all data
  };

  return (
    <div className='px-5 mt-12 sm:px-10 md:px-32 lg:px-56 xl:px-72'>
      <h2 className='font-bold text-3xl mb-10'>My Trips</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-5 my-3'>
        {userTrips?.length > 0 ? userTrips.map((trip, index) => (
          <UserTripCard trip={trip} key={index} />
        )) : [1, 2, 3, 4, 5, 6].map((item, index) => (
          <div key={index} className='h-[200px] w-full bg-slate-200 animate-pulse rounded-xl'></div>
        ))}
      </div>
    </div>
  );
}

export default MyTrips;
