import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/user/login', 'UsersController.login')
  Route.post('/user/register', 'UsersController.register')

  // protected endpoints
  Route.group(() => {
    Route.post('/account/link', 'AccountsController.add')
    Route.get('/account/list', 'AccountsController.list')
    Route.delete('/account/:id', 'AccountsController.delete')
    Route.delete('/user', 'UsersController.delete')
    Route.get('/user/logout', 'UsersController.logout')
  }).middleware('auth:api')
}).prefix('/api/v1')
