import React, { useEffect, useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { Input } from '../components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from '../constants/options';
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';
import { chatSession } from '../service/AiModel';
import { FcGoogle } from "react-icons/fc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig"
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom"

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFromData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFromData({
      ...formData,
      [name]: value
    })
  }
  useEffect(() => {
    console.log(formData)
  }, [formData])

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  })

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem('user')

    if (!user) {
      setOpenDialog(true)
      return;
    }

    if (!formData?.location || !formData?.budget || !formData?.traveler) {
      toast("Please fill all details!");
      return;
    }

    if (formData?.totalDays > 5) {
      toast("Trip can’t exceed 4 days!");
      return;
    }

    toast("Form generated.");
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT
      .replace('{location}', formData?.location)
      .replace('{totalDays}', formData?.totalDays)
      .replace('{traveler}', formData?.traveler)
      .replace('{budget}', formData?.budget)



    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log("--", result?.response?.text());
    setLoading(false);
    SaveAiTrip(result?.response?.text());
  }

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AiTrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user?.email,
      id: docId
    });
    setLoading(false);
    navigate('/view-trip/' + docId);
  }


  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      OnGenerateTrip();
    })
  }

  return (
    <div className="px-5 mt-10 sm:px-10 md:px-32 lg:px-56 xl:px-72">

      <div>
        <h2 className="font-bold text-3xl ">Tell us your travel preferences 🌍✈️🌴</h2>
        <p className="mt-3 text-gray-600 text-xl">Just provide some basic information,and our trip planner will generate a customized itinerary based on your preferences.</p>
      </div>

      <div className="mt-20 flex flex-col gap-9">
        <div>
          <h2 className="text-xl my-3 font-medium">What is destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => { handleInputChange('location', v.label) }
            }}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">How many days are you planning tour trip?</h2>
          <Input placeholder={'Ex.3'} type="number"
            onChange={(v) => handleInputChange('totalDays', v.target.value)}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <p>The budget is exclusively allocated for activities and dining purposes. </p>
          <div className="grid grid-cols-3 gap-5 mt-5 mb-5">
            {SelectBudgetOptions.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('budget', item.title)}
                className={`cursor-pointer p-4 border rounded-lg hover:shadow-lg
          ${formData?.budget == item.title && 'shadow-lg border-cyan-500'}
          `}>
                <h2 className="text-3xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">Who do you plan on traveling with on your next adventure?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5 mb-5">
            {SelectTravelList.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`cursor-pointer p-4 border rounded-lg hover:shadow-lg
          ${formData?.traveler == item.people && 'shadow-lg border-cyan-500'}
          `}>
                <h2 className="text-3xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div className='my-10 justify-end flex'>
          <Button onClick={OnGenerateTrip} disabled={loading} >
            {loading ?
              <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
              : 'Generate Trip'}
          </Button>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogDescription className="flex flex-col items-center gap-4">
                <img src="/logo.svg" alt="Logo" />
                <h2 className="font-bold text-lg mt-2">Sign In with Google</h2>
                <p className="text-center text-sm text-gray-500">Sign in to the app using secure Google authentication</p>
                <Button onClick={login} className="!bg-white !text-black !shadow !border !border-gray-300 rounded-full flex items-center gap-2">
                  <FcGoogle className="h-6 w-6" />
                  Sign In with Google
                </Button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}
export default CreateTrip