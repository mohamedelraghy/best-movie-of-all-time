import { Test, TestingModule } from '@nestjs/testing';
import { BaseService } from './base.service';

describe('BaseService', () => {
  let service: BaseService<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseService],
    }).compile();

    service = module.get<BaseService<any>>(BaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
