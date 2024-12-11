import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/, { message: 'Invalid IBAN format' })
  iban: string;
}
