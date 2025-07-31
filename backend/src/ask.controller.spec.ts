// backend/src/ask.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AskController } from './ask.controller';
import { AskService } from './ask.service';

describe('AskController', () => {
  let controller: AskController;
  let mockService: Partial<AskService>;

  beforeEach(async () => {
    mockService = {
      getLLMResponse: jest.fn().mockResolvedValue({ answer: 'Controller test response' }),
      getHistory: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AskController],
      providers: [
        { provide: AskService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<AskController>(AskController);
  });

  it('should return answer from service', async () => {
    const response = await controller.ask({ question: 'Is apple.com B2B?', domain: 'apple.com' });
    expect(response.answer).toBe('Controller test response');
  });

  it('should return question history from service', async () => {
    const result = await controller.history();
    expect(Array.isArray(result)).toBe(true);
  });
});
