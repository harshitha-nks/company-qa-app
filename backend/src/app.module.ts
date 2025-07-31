import { Module } from '@nestjs/common';
import { AskController } from './ask.controller';
import { AskService } from './ask.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionHistory } from './question.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'questions.db',
      entities: [QuestionHistory],
      synchronize: true, 
    }),
    TypeOrmModule.forFeature([QuestionHistory]),
  ],
  controllers: [AskController],
  providers: [AskService],
})
export class AppModule {}
