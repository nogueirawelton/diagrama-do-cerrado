import { IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @MinLength(3, { message: 'O nome precisa ter no mínimo 3 caracteres' })
  name: string;

  @IsEmail(
    {},
    {
      message: 'E-mail inválido',
    },
  )
  email: string;

  @MinLength(4, { message: 'Seu usuário precisa ter no mínimo 4 caracteres' })
  username: string;

  @MinLength(8, {
    message: 'Sua senha precisa ter no mínimo 8 caracteres',
  })
  password: string;
}
