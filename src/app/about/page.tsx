'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from 'usehooks-ts';

const About = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isUserActive] = useLocalStorage('isUserActive', false);
  const [userId] = useLocalStorage('userId', '');

  useEffect(() => {
    if (!isUserActive) {
      router.push('/user');
    }
  }, [isUserActive, router]);

  useEffect(() => {
    if (userId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_URL}/users/iban/${userId}`)
        .then((response) => {
          const { id, user, transactions ,fullName} = response.data;
          setUserDetails({ id, fullName });
          setTransactions(transactions || []);
          
        })
        .catch((error) => console.error('Error fetching user details and transactions:', error));
    }
  }, [userId]);
console.log(userDetails)
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
    <div className="w-full max-w-md h-[40vh] mx-auto p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-3xl font-semibold text-center mb-6">Account Statement</h1>

      {userDetails&&Object?.keys(userDetails).length > 0 && (
        <div className="mb-6 text-center">
           <h2 className="text-xl font-medium">User: {userDetails.fullName}</h2>
            <p>ID: {userDetails.id}</p>
            <p>IBAN: {userDetails.iban}</p>
            <p>Balance: {userDetails.currentBalance} EUR</p>
        </div>
      )}

      <ul className="space-y-4">
        {transactions.length > 0 ? (
          transactions
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((transaction) => (
              <li
                key={transaction.id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                <span className={`${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
                </span>
                <span>{transaction.balance}</span>
              </li>
            ))
        ) : (
          <li className="text-center">No transactions found</li>
        )}
      </ul>
    </div>
    </div>

  );
};

export default About;
