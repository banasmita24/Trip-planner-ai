import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';

function Header() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const login = useGoogleLogin({
    onSuccess: (token) => GetUserProfile(token),
    onError: (error) => console.log(error),
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokenInfo.access_token}`,
          Accept: 'application/json',
        },
      });
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setOpenDialog(false);
    } catch (err) {
      console.error("Failed to fetch user info", err);
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    setUser(null);
    window.location.reload();
  };

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-4'>
      <a href="/">
        <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />
      </a>

      <div>
        {user ? (
          <div className='flex items-center gap-4'>
            <a href="/create-trip">
              <Button className="!bg-white !text-black !shadow !border !border-gray-300 rounded-full">Create Trip</Button>
            </a>
            <a href="/my-trips">
              <Button className="!bg-white !text-black !shadow !border !border-gray-300 rounded-full">My Trips</Button>
            </a>
            <Popover>
              <PopoverTrigger asChild>
                <div className="bg-white p-[3px] rounded-full shadow border border-gray-300 cursor-pointer">
                  <img
                    src={user.picture}
                    alt="User"
                    className="rounded-full w-[38px] h-[38px] object-cover"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="bg-white text-black border border-gray-300">
                <h2 className="cursor-pointer" onClick={handleLogout}>
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button
            className="!bg-white !text-black !shadow !border !border-gray-300 rounded-full"
            onClick={() => setOpenDialog(true)}
          >
            Sign In
          </Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="flex flex-col items-center gap-4">
              <img src="/logo.svg" alt="Logo" className="h-12" />
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
  );
}

export default Header;
