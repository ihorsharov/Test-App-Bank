import { IsString, IsNotEmpty, IsNumber, Min, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/, { message: 'Invalid IBAN format' })
  iban: string;

  @IsNumber()
  @Min(0)
  currentBalance: number;
}
