'use client'; // This ensures that this component runs on the client side

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

interface WelcomeUserProps {
  userName: string;
}

const WelcomeUser: React.FC<WelcomeUserProps> = ({ userName }) => {
  const [isUserActive] = useLocalStorage('isUserActive', false);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-semibold text-gray-800">
        Welcome, {userName || 'User'}!
      </h1>
      <h2 className="text-xl font-semibold text-gray-800">
        {!isUserActive && (
          <Link className="text-blue-500 cursor-pointer" href="/auth">
            Log in or Create Account
          </Link>
        )}
      </h2>
    </div>
  );
};

export default WelcomeUser;
