"use client";
import { useForm, FieldError } from 'react-hook-form';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { useLocalStorage } from 'usehooks-ts';

interface TransactionFormProps {
  updateBalance: React.Dispatch<React.SetStateAction<number>>;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ updateBalance }) => {
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [iban, setIban] = useState('');
  const [error, setError] = useState<string | null>('');
  const { register, handleSubmit, formState: { errors },reset } = useForm();
  const [isUserActive] = useLocalStorage("isUserActive", false);

  useEffect(() => {
    if (!isUserActive) {
      redirect("/");
    }
  }, [isUserActive]);

  const onSubmit = async (data: any) => {
    try {
      const { amount, userId } = data;
      let response;
      
      if (transactionType === 'transfer') {
        // Transfer request
        const body = {
          senderId: userId,
          receiverIban: iban,
          amount: Number(amount),

        };
        response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/transactions/transfer`, body);
        reset();
        
        setError(null)
      } else {
        const body = {
          userId: userId,
          category: transactionType.toUpperCase(),
          amount: Number(amount),
        };
        response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/transactions/opeartion`, body);
        setError(null)
        reset();
      }

      setError(null);
      updateBalance(response.data.newBalance);
    } catch (error) {
    //   setError('Transaction failed');
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg mx-auto py-8 px-6 bg-gradient-to-b from-teal-100 to-teal-50 shadow-md rounded-lg border border-teal-300">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* User ID Field */}
          <div className="space-y-2">
            <label htmlFor="userId" className="block text-sm font-medium text-teal-800">User ID</label>
            <input
              id="userId"
              type="text"
              {...register('userId', { required: 'User ID is required' })}
              className="w-full px-4 py-2 text-slate-900 border border-teal-300 rounded focus:outline-none focus:ring focus:ring-teal-500"
            />
            {errors.userId && <p className="text-xs text-rose-500">{(errors.userId as FieldError)?.message}</p>}
          </div>

          {/* Amount Field */}
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-teal-800">Amount</label>
            <input
              id="amount"
              type="number"
              {...register('amount', { required: 'Amount is required' })}
              className="w-full px-4 py-2 text-slate-900 border border-teal-300 rounded focus:outline-none focus:ring focus:ring-teal-500"
            />
            {errors.amount && <p className="text-xs text-rose-500">{(errors.amount as FieldError)?.message}</p>}
          </div>

          {/* IBAN Field (only for transfer) */}
          {transactionType === 'transfer' && (
            <div className="space-y-2">
              <label htmlFor="iban" className="block text-sm font-medium text-teal-800">Receiver IBAN</label>
              <input
                id="iban"
                type="text"
                {...register('iban', { required: 'IBAN is required' })}
                onChange={(e) => setIban(e.target.value)}
                className="w-full px-4 py-2 text-slate-900 border border-teal-300 rounded focus:outline-none focus:ring focus:ring-teal-500"
              />
              {errors.iban && <p className="text-xs text-rose-500">{(errors.iban as FieldError)?.message}</p>}
            </div>
          )}

          {/* Transaction Type */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-teal-800">Transaction Type</p>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="deposit"
                  checked={transactionType === 'deposit'}
                  onChange={() => setTransactionType('deposit')}
                  className="focus:ring-teal-500"
                />
                <span className="text-teal-800">Deposit</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="withdraw"
                  checked={transactionType === 'withdraw'}
                  onChange={() => setTransactionType('withdraw')}
                  className="focus:ring-teal-500"
                />
                <span className="text-teal-800">Withdraw</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="transfer"
                  checked={transactionType === 'transfer'}
                  onChange={() => setTransactionType('transfer')}
                  className="focus:ring-teal-500"
                />
                <span className="text-teal-800">Transfer</span>
              </label>
            </div>
          </div>
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-teal-600 text-white font-medium rounded hover:bg-teal-700 focus:outline-none focus:ring focus:ring-teal-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
