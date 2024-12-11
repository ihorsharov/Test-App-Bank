import { useForm, FieldError } from 'react-hook-form';
import axios from 'axios';
import React, { useState } from 'react';

interface TransactionFormProps {
  updateBalance: React.Dispatch<React.SetStateAction<number>>;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ updateBalance }) => {
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [iban, setIban] = useState('');
  const [error, setError] = useState<string | null>('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const { amount, userId, iban } = data;
      const body = {
        userId: userId,
        amount: Number(amount),
        receiverIban: iban,
      };

      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/transactions/${transactionType}`, body);
      setError(null);
      updateBalance(response.data.newBalance);
    } catch (error) {
      setError('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-[450px] mx-auto p-6 bg-white shadow-xl rounded-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-center mb-6">Transaction Form</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">User ID:</label>
          <input
            type="text"
            {...register('userId', { required: 'User ID is required' })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.userId && <span className="text-red-500 text-sm">{(errors.userId as FieldError)?.message}</span>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Amount:</label>
          <input
            type="number"
            {...register('amount', { required: 'Amount is required' })}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.amount && <span className="text-red-500 text-sm">{(errors.amount as FieldError)?.message}</span>}
        </div>

        {transactionType === 'transfer' && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">IBAN:</label>
            <input
              type="text"
              {...register('iban', { required: 'IBAN is required' })}
              onChange={(e) => setIban(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.iban && <span className="text-red-500 text-sm">{(errors.iban as FieldError)?.message}</span>}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Transaction Type:</label>
          <div className="flex gap-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="deposit"
                checked={transactionType === 'deposit'}
                onChange={() => setTransactionType('deposit')}
                className="text-blue-500"
              />
              <span>Deposit</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="withdraw"
                checked={transactionType === 'withdraw'}
                onChange={() => setTransactionType('withdraw')}
                className="text-blue-500"
              />
              <span>Withdraw</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="transfer"
                checked={transactionType === 'transfer'}
                onChange={() => setTransactionType('transfer')}
                className="text-blue-500"
              />
              <span>Transfer</span>
            </label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
