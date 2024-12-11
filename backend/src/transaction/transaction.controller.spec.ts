import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransferTransactionDto } from './dto/transfer-transaction.dto';
import { BadRequestException } from '@nestjs/common';

const mockTransactionService = {
  operation: jest.fn(),
  transfer: jest.fn(),
  getStats: jest.fn(),
};

describe('TransactionController', () => {
  let transactionController: TransactionController;
  let transactionService: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: mockTransactionService,
        },
      ],
    }).compile();

    transactionController = module.get<TransactionController>(
      TransactionController,
    );
    transactionService = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(transactionController).toBeDefined();
  });

  describe('operation', () => {
    it('should successfully perform a deposit operation', async () => {
      const createTransactionDto: CreateTransactionDto = {
        userId: '1',
        category: 'DEPOSIT',
        amount: 100,
      };

      mockTransactionService.operation.mockResolvedValue({
        userId: '1',
        category: 'DEPOSIT',
        amount: 100,
        resultingBalance: 200,
      });

      const result =
        await transactionController.operation(createTransactionDto);
      expect(result).toEqual({
        userId: '1',
        category: 'DEPOSIT',
        amount: 100,
        resultingBalance: 200,
      });
      expect(mockTransactionService.operation).toHaveBeenCalledWith(
        createTransactionDto,
      );
    });

    it('should successfully perform a withdraw operation', async () => {
      const createTransactionDto: CreateTransactionDto = {
        userId: '1',
        category: 'WITHDRAW',
        amount: 50,
      };

      mockTransactionService.operation.mockResolvedValue({
        userId: '1',
        category: 'WITHDRAW',
        amount: 50,
        resultingBalance: 150,
      });

      const result =
        await transactionController.operation(createTransactionDto);
      expect(result).toEqual({
        userId: '1',
        category: 'WITHDRAW',
        amount: 50,
        resultingBalance: 150,
      });
    });
  });

  describe('transfer', () => {
    it('should successfully perform a transfer operation', async () => {
      const transferDto: TransferTransactionDto = {
        senderId: '1',
        receiverIban: 'IBAN2',
        amount: 100,
      };

      mockTransactionService.transfer.mockResolvedValue({
        senderId: '1',
        receiverIban: 'IBAN2',
        amount: 100,
      });

      const result = await transactionController.transfer(transferDto);
      expect(result).toEqual({
        senderId: '1',
        receiverIban: 'IBAN2',
        amount: 100,
      });
      expect(mockTransactionService.transfer).toHaveBeenCalledWith(transferDto);
    });

    it('should throw error if sender does not have enough balance', async () => {
      const transferDto: TransferTransactionDto = {
        senderId: '1',
        receiverIban: 'IBAN2',
        amount: 100,
      };

      mockTransactionService.transfer.mockRejectedValue(
        new BadRequestException('Operation deprecated. Not enough money'),
      );

      try {
        await transactionController.transfer(transferDto);
      } catch (e) {
        expect(e.response.message).toBe(
          'Operation deprecated. Not enough money',
        );
      }
    });
  });

  describe('getStats', () => {
    it('should return transaction statistics for a user', async () => {
      const userId = '1';
      const transactions = [
        {
          id: '1',
          userId: '1',
          category: 'DEPOSIT',
          amount: 100,
          resultingBalance: 200,
        },
        {
          id: '2',
          userId: '1',
          category: 'WITHDRAW',
          amount: -50,
          resultingBalance: 150,
        },
      ];

      mockTransactionService.getStats.mockResolvedValue(transactions);

      const result = await transactionController.statement(userId);
      expect(result).toEqual(transactions);
      expect(mockTransactionService.getStats).toHaveBeenCalledWith(userId);
    });

    it('should throw error if user does not exist', async () => {
      const userId = 'non-existent-id';
      mockTransactionService.getStats.mockRejectedValue(
        new BadRequestException('User not found'),
      );

      try {
        await transactionController.statement(userId);
      } catch (e) {
        expect(e.response.message).toBe('User not found');
      }
    });
  });
});
