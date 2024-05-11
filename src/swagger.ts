import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ConfigService } from './config/config.service';

export function initSwagger(
  app: INestApplication,
  config: ConfigService,
): void {
  const options = new DocumentBuilder()
    .setTitle('Best Movie of All Time')
    .setDescription('Best Movie of All Time API documentation')
    .setExternalDoc('Postman Collection', config.apiUrl + '-json')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
