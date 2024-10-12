import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { OAuthAccount } from './oauthAccount.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(OAuthAccount)
    private oauthAccountsRepository: Repository<OAuthAccount>,
  ) {}

  async findOne(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['oauthAccounts'],
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['oauthAccounts'],
    });
  }

  async findOrCreateUser(
    userData: Partial<User>,
    oauthData: Partial<OAuthAccount>,
  ): Promise<User> {
    let user = await this.findByEmail(userData.email);

    if (!user) {
      user = this.usersRepository.create(userData);
      user = await this.usersRepository.save(user);
    }

    let oauthAccount = await this.oauthAccountsRepository.findOne({
      where: { provider: oauthData.provider, providerId: oauthData.providerId }
    });

    if (!oauthAccount) {
      oauthAccount = this.oauthAccountsRepository.create({
        ...oauthData,
        userId: user.id,
      });
    } else {
      Object.assign(oauthAccount, oauthData);
    }

    await this.oauthAccountsRepository.save(oauthAccount);

    return this.findOne(user.id);
  }
}
