import { MinLength } from 'class-validator';

export class AuthDto {
  @MinLength(4, { message: 'Usuário inválido' })
  username: string;

  @MinLength(8, {
    message: 'Senha inválida',
  })
  password: string;
}
