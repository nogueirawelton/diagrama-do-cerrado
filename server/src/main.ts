import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { types } from 'pg';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  types.setTypeParser(1700, (val) => parseFloat(val));
  types.setTypeParser(20, (val) => parseInt(val, 10));

  app.enableCors({
    origin: ['http://localhost:3000'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,

      exceptionFactory: (errors) => {
        const getFirstErrorMessage = (error: any): string => {
          if (error.constraints) {
            return Object.values(error.constraints)[0] as string;
          }
          if (error.children && error.children.length > 0) {
            return getFirstErrorMessage(error.children[0]);
          }
          return 'Validation Error';
        };

        const message = getFirstErrorMessage(errors[0]);

        throw new HttpException(
          {
            message: message,
            error: 'Validation Error',
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Diagrama do Cerrado')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3030);
}

bootstrap();
