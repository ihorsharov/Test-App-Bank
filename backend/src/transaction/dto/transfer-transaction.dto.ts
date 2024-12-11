import { IsString, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class TransferTransactionDto {
  @IsUUID()
  senderId: string;

  @IsString()
  receiverIban: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
