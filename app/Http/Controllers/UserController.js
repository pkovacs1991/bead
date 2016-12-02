'use strict'

const Hash = use('Hash')
const User = use('App/Model/User')
const Validator = use('Validator')

class UserController {
  /**
   *
   */
  * doLogin (request, response) {
    const username = request.input('username')
    const password = request.input('password')

    try {
      const login = yield request.auth.attempt(username, password)

      if (login) {
        response.route('login')
        return
      }

      throw new Error('Invalid credentails')
    }
	catch (err) {
      yield request.withAll().andWith({ error: err }).flash()
      response.route('login')
    }
  }

  /**
   *
   */
  * doRegister (request, response) {
    const userData = request.all()

    const validation = yield Validator.validateAll(userData, {
      username: 'required|alpha_numeric|unique:users',
      email: 'required|email|unique:users',
      nickname: 'required|max:30',
      password: 'required|min:4',
      password_again: 'required|same:password'
    })

    if (validation.fails()) {
      yield request
        .withOut('password', 'password_again')
        .andWith({ errors: validation.messages() })
        .flash()

      response.route('register')
	  return;
	  
    }
	
    const user = new User()
    user.username = userData.username
    user.email = userData.email
    user.nickname = userData.nickname
    user.password = yield Hash.make(userData.password)

    yield user.save()

    yield request.auth.login(user)
    
    response.route('register')
  }

  /**
   *
   */
  * doLogout (request, response) {
    yield request.auth.logout()
    response.route('main')
  }

  /**
   *
   */
  * login (request, response) {
    if (request.currentUser) {
      response.route('main')
      return
    }

    yield response.sendView('login')
  }

  /**
   *
   */
  * register (request, response) {
    if (request.currentUser) {
      response.route('main')
      return
    }

    yield response.sendView('register')
  }

  /**
   *
   */
  * profile (request, response) {
    yield response.sendView('profile')
  }

  /**
   *
   */
  * doPasswordEdit (request, response) {
    const userData = request.all()

    const validation = yield Validator.validateAll(userData, {
      old_password: 'required',
      new_password: 'required|min:4',
      new_password_again: 'required|same:new_password'
    })

    if (validation.fails()) {
      yield request
        .with({ errors: validation.messages() })
        .flash()
		
     response.route('profile')
	 return;
    }
	
    const user = request.currentUser
    const isSame = yield Hash.verify(userData.old_password, user.password)

    if (!isSame) {
      yield request
        .with({ errors: [{ message: 'Bad actual password.' }] })
        .flash()
		
      response.route('profile')
	  return
    }

    user.password = yield Hash.make(userData.new_password)

    yield user.update()

    yield request
      .with({ success: 'Password changed successfully.' })
      .flash()
	
    response.route('profile')
  }

  /**
   *
   */
  * doProfileEdit (request, response) {
    const userData = request.all()
    const user = request.currentUser
    const rules = { nickname: 'required|max:30' }

    if (userData.username !== user.username) {
      rules.username = 'required|alpha_numeric|unique:users'
    }

    if (userData.email !== user.email) {
      rules.email = 'required|email|unique:users'
    }

    const validation = yield Validator.validateAll(userData, rules)

    if (validation.fails()) {
      yield request
        .with({ errors: validation.messages() })
        .flash()

      response.route('profile')
	  return;
    }
	
    user.username = userData.username
    user.email = userData.email
    user.nickname = userData.nickname

    yield user.update()

    yield request
      .with({ success: 'Profile changed successfully.' })
      .flash()
	
    response.route('profile')
  }
}

module.exports = UserController
