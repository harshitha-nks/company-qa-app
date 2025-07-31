import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionHistory } from './question.entity';
import { MessageEvent } from '@nestjs/common';
import { Observable, Subscriber} from 'rxjs';


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

    await this.questionRepo.save({ question, domain, answer });

    return { answer };
  }

  async getHistory(): Promise<QuestionHistory[]> {
    return this.questionRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  streamLLMResponse(question: string, domain: string): Observable<MessageEvent> {
  return new Observable((subscriber: Subscriber<MessageEvent>) => {
    (async () => {
      try {
        const analysisResponse = await this.openai.chat.completions.create({
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant that analyzes user questions for business intent. Preserve exact spellings of company names.',
            },
            {
              role: 'user',
              content: `Analyze the intent and structure of this question about the domain ${domain}: "${question}"`,
            },
          ],
        });

        const analysis = analysisResponse.choices?.[0]?.message?.content ?? '';

        const prompt = `Based on the analysis "${analysis}", generate a refined, clear, and accurate answer to the original question: "${question}" for the domain ${domain}.`;

        const stream = await this.openai.chat.completions.create({
          model: 'llama3-70b-8192',
          stream: true,
          messages: [
            {
              role: 'system',
              content: 'You are an assistant giving detailed company insights.',
            },
            { role: 'user', content: prompt },
          ],
        });

        let fullAnswer = '';

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            fullAnswer += content;
            subscriber.next({ data: content });
          }
        }

        await this.questionRepo.save({ question, domain, answer: fullAnswer });

        subscriber.complete();
      } catch (error) {
        subscriber.error(error);
      }
    })();

    return () => {};
  });
}
}