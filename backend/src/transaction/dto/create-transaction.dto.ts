import {
  IsString,
  IsNumber,
  IsPositive,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { TransactionCategory } from '@prisma/client';

export class CreateTransactionDto {
  @IsUUID()
  userId: string;

  @IsEnum(TransactionCategory)
  category: TransactionCategory;

  @IsNumber()
  @IsPositive()
  amount: number;
}
