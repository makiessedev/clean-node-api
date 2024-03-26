import { AddAccount, AddAccountModel } from '../../../domain/use-cases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypter: Encrypter) {

  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => { resolve(account) })
  }
}
