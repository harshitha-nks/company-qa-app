import { Controller, Post, Body } from '@nestjs/common';
import { AskService } from './ask.service';

@Controller('ask')
export class AskController {
  constructor(private readonly askService: AskService) {}

  @Post()
  async ask(@Body() body: { question: string; domain: string }) {
    const { question, domain } = body;
    return this.askService.getLLMResponse(question, domain);
  }
}
