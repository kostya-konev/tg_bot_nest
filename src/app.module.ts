import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import {TelegrafModule} from "nestjs-telegraf";
import * as LocalSession from 'telegraf-session-local';
import { TG_TOKEN } from "./configs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import * as path from 'path'
import {TaskEntity} from "./entities/task.entity";

const sessions = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [sessions.middleware()],
      token: TG_TOKEN
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      database: 'todo_app_tg_bot',
      username: 'postgres',
      password: 'postgres',
      entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
      migrations: [path.join(__dirname, '**', '*.migrations.{ts,js}')],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TaskEntity])
  ],
  controllers: [],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
