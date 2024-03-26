import { AddAccountModel } from '../../domain/use-cases/add-account'
import { AccountModel } from '../../domain/models/account'

export interface AddAccountRepository {
  add: (account: AddAccountModel) => Promise<AccountModel>
}
