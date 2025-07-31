import { Controller, Post, Body, Get, Sse, MessageEvent } from '@nestjs/common';
import { AskService } from './ask.service';
import { Observable } from 'rxjs';

@Controller('ask')
export class AskController {
  constructor(private readonly askService: AskService) {}

  @Post()
  async ask(@Body() body: { question: string; domain: string }) {
    const { question, domain } = body;
    return this.askService.getLLMResponse(question, domain);
  }

  @Get('history')
  async history() {
    return this.askService.getHistory();
  }

  @Post('stream')
  @Sse()
  stream(@Body() body: { question: string; domain: string }): Observable<MessageEvent> {
    return this.askService.streamLLMResponse(body.question, body.domain);
  }
}
