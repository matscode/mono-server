// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { schema } from '@ioc:Adonis/Core/Validator'
import Account from 'App/Models/Account'

export default class AccountsController {
  public async add({ request, response, auth }) {
    const accountData = await request.validate({
      schema: schema.create({
        account_name: schema.string(),
        account_number: schema.string(),
        bank_code: schema.string(),
      }),
    })

    accountData.userId = auth.user.id // set user

    const account = await Account.updateOrCreate(accountData, accountData)

    if (account.$isPersisted) return account.toJSON()

    response.abort('System error!!', 500)
  }

  public async list({ auth }) {
    return (await Account.query().where('user_id', auth.user.id)) || []
  }

  public async delete({ params, auth }) {
    const accountId = params?.id

    if (accountId) {
      (await Account.query().
        where('user_id', auth.user.id).
        where('id', accountId).first())?.delete()
    }
  }
}
