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

Route.get('/', 'LectureController.main').as('main')
Route.get('/my_lecture', 'LectureController.myLectures').as('my_lecture_list')
Route.get('/lecture', 'LectureController.index').as('lecture_list')
Route.get('/lecture/create', 'LectureController.create').as('lecture_create').middleware('auth')
Route.post('/lecture/create', 'LectureController.doCreate').as('do_lecture_create').middleware('auth')
Route.get('/lecture/:id', 'LectureController.show').as('lecture_page')
Route.get('/lecture/:id/edit', 'LectureController.edit').as('lecture_edit')
Route.post('/lecture/:id/edit', 'LectureController.doEdit').as('do_lecture_edit')
Route.get('/lecture/:id/delete', 'LectureController.doDelete').as('lecture_delete')
Route.get('/lecture/assign/:id', 'LectureController.assignLecture').as('assign_lecture')
Route.get('/lecture/drop/:id', 'LectureController.dropLecture').as('drop_lecture')
Route.get('/lecture/drop/:id/:user_id', 'LectureController.dropLecture').as('drop_user_lecture')
