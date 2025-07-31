import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionHistory } from './question.entity';

@Injectable()
export class AskService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(QuestionHistory)
    private readonly questionRepo: Repository<QuestionHistory>,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  async getLLMResponse(question: string, domain: string) {
    const fullPrompt = `Given the domain ${domain}, answer the question: "${question}".`;

    const response = await this.openai.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [
        { role: 'system', content: 'You are an expert on B2B companies.' },
        { role: 'user', content: fullPrompt },
      ],
    });

    const answer = response.choices?.[0]?.message?.content ?? 'No answer generated';

    // ✅ Save to DB
    await this.questionRepo.save({ question, domain, answer });

    return { answer };
  }

  // ✅ Retrieve full question history
  async getHistory(): Promise<QuestionHistory[]> {
    return this.questionRepo.find({
      order: { createdAt: 'DESC' },
    });
  }
}
