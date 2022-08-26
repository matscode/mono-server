// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UsersController {
  public async login({ auth, request }) {
    const email = request.input('email')
    const password = request.input('password')

    return { ...(await auth.attempt(email, password)) }
  }

  public async register({ request, response }) {
    const userData = await request.validate({
      schema: schema.create({
        first_name: schema.string(),
        last_name: schema.string(),
        email: schema.string([rules.email()]),
        password: schema.string([rules.minLength(8)]),
      }),
    })

    const userExists = await User.findBy('email', userData.email)

    if (userExists) {
      return response.status(422).send({
        errors: [{ rule: 'unique', field: 'email', message: 'Email is taken' }],
      })
    }

    const user = await User.create(userData)

    if (user.$isPersisted) return user.toJSON()

    response.abort('System error!!', 500)
  }

  public async delete({ auth }) {
    (await User.find(auth.user.id))?.delete()
  }

  public async logout({}) {
    return {}
  }
}
