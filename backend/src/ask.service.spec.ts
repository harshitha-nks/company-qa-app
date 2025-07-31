import { Test, TestingModule } from '@nestjs/testing';
import { AskService } from './ask.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuestionHistory } from './question.entity';
import OpenAI  from 'openai';

jest.mock('openai', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: 'Mocked response' } }],
          }),
        },
      },
    })),
  };
});


describe('AskService', () => {
  let service: AskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AskService,
        {
          provide: getRepositoryToken(QuestionHistory),
          useValue: {
            save: jest.fn(),
            find: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    service = module.get<AskService>(AskService);
  });

  it('should return a mocked response from LLM', async () => {
    const res = await service.getLLMResponse('Is redcar.io B2B?', 'redcar.io');
    expect(res.answer).toBe('Mocked response');
  });

  it('should return empty history list', async () => {
    const history = await service.getHistory();
    expect(Array.isArray(history)).toBe(true);
  });
});
