import React, { useEffect, useState } from 'react'
import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import TripPlace from '../components/TripPlace';
import Footer from '../components/Footer';

function ViewTrip() {

    const {tripId} = useParams();
    const [trip,setTrip] = useState();

    const GetTripData=async()=>{
        const docRef = doc(db, "AiTrips", tripId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setTrip(docSnap.data());
          } 
        else {
            console.log("No such document!");
            toast('No trip found!')
          }
    }

    useEffect(()=>{
        tripId&&GetTripData();
    },[tripId])

  return (
    <div className='p-12 md:px-25 lg:px-44 xl:px:56'>
        <InfoSection trip={trip}/>
        <Hotels trip={trip}/>
        <TripPlace trip={trip}/>
        <Footer trip={trip}/>
    </div>
  )
}

export default ViewTrip
