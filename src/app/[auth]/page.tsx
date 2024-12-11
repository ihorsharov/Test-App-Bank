'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useLocalStorage } from 'usehooks-ts';
import { redirect } from 'next/navigation';

type CreateFormData = {
  name: string;
  iban: string;
  balance: number;
};

type LoginFormData = {
  iban: string;
};

const UserForm = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'login'>('create');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateFormData & LoginFormData>();
  const [isUserActive, setIsUserActive] = useLocalStorage('isUserActive', false);
  const [userId, setUserId] = useLocalStorage('userId', '');

  useEffect(() => {
    if (isUserActive) {
      redirect("/");
    }
  }, [isUserActive]);


  const handleCreateUser = async (data: CreateFormData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/users`, {
        fullName: data.name,
        iban: data.iban,
        currentBalance: Number(data.balance),
      });
      const { iban } = response?.data;
      if (iban) {
        setUserId(iban);
        reset();
      }
    } catch (error) {
      alert('Failed to create user');
    }
  };

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/users/login`, {
        iban: data.iban,
      });
      const { iban } = response?.data;

      if (iban) {
        setIsUserActive(true);
        setUserId(iban);
      } else {
        alert('Invalid IBAN or user not found');
      }
    } catch (error) {
      alert('Failed to log in user');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-lg mx-auto p-8 bg-white w-full shadow-xl rounded-xl border border-gray-300">
        {/* Tab Buttons */}
        <div className="flex justify-center mb-8 space-x-6">
          <button
            onClick={() => setActiveTab('create')}
            className={`w-full px-8 py-3 text-lg font-semibold rounded-lg ${
              activeTab === 'create' ? 'text-yellow-500 bg-yellow-100 shadow-lg' : 'bg-gray-300 text-gray-800'
            }`}
          >
            Create User
          </button>
          <button
            onClick={() => setActiveTab('login')}
            className={`w-full px-8 py-3 text-lg font-semibold rounded-lg ${
              activeTab === 'login' ? 'text-yellow-500 bg-yellow-100 shadow-lg' : 'bg-gray-300 text-gray-800'
            }`}
          >
            Log In
          </button>
        </div>

        {/* Forms */}
        <div className="space-y-8">
          {activeTab === 'create' && (
            <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-5">
              <h2 className="text-4xl font-bold text-center text-yellow-600">Create User</h2>
              <div className="flex flex-col">
                <label htmlFor="name" className="text-lg font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  {...register('name', { required: 'Name is required' })}
                  className="px-5 py-4 border-2 border-yellow-400 rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-500"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col">
                <label htmlFor="iban" className="text-lg font-medium text-gray-700">IBAN</label>
                <input
                  type="text"
                  id="iban"
                  placeholder="Enter your IBAN"
                  {...register('iban', { required: 'IBAN is required' })}
                  className="px-5 py-4 border-2 border-yellow-400 rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-500"
                />
                {errors.iban && <p className="text-red-500 text-sm">{errors.iban.message}</p>}
              </div>
              <div className="flex flex-col">
                <label htmlFor="balance" className="text-lg font-medium text-gray-700">Balance</label>
                <input
                  type="number"
                  id="balance"
                  placeholder="Enter your balance"
                  {...register('balance', { required: 'Balance is required' })}
                  className="px-5 py-4 border-2 border-yellow-400 rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-500"
                />
                {errors.balance && <p className="text-red-500 text-sm">{errors.balance.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-500"
              >
                Create User
              </button>
            </form>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
              <h2 className="text-4xl font-bold text-center text-yellow-600">Log In</h2>
              <div className="flex flex-col">
                <label htmlFor="iban" className="text-lg font-medium text-gray-700">IBAN</label>
                <input
                  type="text"
                  id="iban"
                  placeholder="Enter your IBAN"
                  {...register('iban', { required: 'IBAN is required' })}
                  className="px-5 py-4 border-2 border-yellow-400 rounded-md focus:outline-none focus:ring-4 focus:ring-yellow-500"
                />
                {errors.iban && <p className="text-red-500 text-sm">{errors.iban.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-yellow-400 text-white rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-500"
              >
                Log In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserForm;
