import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';

describe('AppController', () => {
  let controller: AppController;
  const prisma = {
    user: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    office: { findMany: jest.fn() },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: PrismaService, useValue: prisma }],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getUsers devuelve los usuarios sin la contraseña', async () => {
    prisma.user.findMany.mockResolvedValue([{ id: '1', name: 'Ana' }]);
    await expect(controller.getUsers()).resolves.toEqual([{ id: '1', name: 'Ana' }]);
    const args = prisma.user.findMany.mock.calls[0][0];
    expect(args.select.password).toBeUndefined();
  });

  it('setActive rechaza un body sin booleano', async () => {
    await expect(controller.setActive('1', {})).rejects.toBeInstanceOf(HttpException);
  });

  it('login exige email y contraseña', async () => {
    await expect(controller.login({ email: '' })).rejects.toBeInstanceOf(HttpException);
  });
});
