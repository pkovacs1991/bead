'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.get('/login', 'UserController.login').as('login')
Route.post('/login', 'UserController.doLogin').as('do_login')
Route.get('/register', 'UserController.register').as('register')
Route.post('/register', 'UserController.doRegister').as('do_register')
Route.get('/profile', 'UserController.profile').as('profile').middleware('auth')
Route.get('/logout', 'UserController.doLogout').as('do_logout').middleware('auth')
Route.post('/profile/edit', 'UserController.doProfileEdit').as('do_profile_edit').middleware('auth')
Route.post('/profile/edit_password', 'UserController.doPasswordEdit').as('do_password_edit').middleware('auth')

Route.get('/', 'RecipeController.main').as('main')
Route.get('/recipe', 'RecipeController.index').as('recipe_list')
Route.get('/recipe/create', 'RecipeController.create').as('recipe_create').middleware('auth')
Route.post('/recipe/create', 'RecipeController.doCreate').as('do_recipe_create').middleware('auth')
Route.get('/recipe/:id', 'RecipeController.show').as('recipe_page')
Route.get('/recipe/:id/edit', 'RecipeController.edit').as('recipe_edit')
Route.post('/recipe/:id/edit', 'RecipeController.doEdit').as('do_recipe_edit')
Route.get('/recipe/:id/delete', 'RecipeController.doDelete').as('recipe_delete')
