import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import 'sqlite3';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');
        // Remove file: prefix if it exists
        const database = dbUrl.startsWith('file:') ? dbUrl.substring(5) : dbUrl;
        const isProd = configService.get<string>('NODE_ENV') === 'production';

        return {
          type: 'sqlite',
          database,
          entities: [join(__dirname, '../../**', '*.entity.{ts,js}')],
          migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
          synchronize: false,
          logging: !isProd,
          migrationsRun: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
