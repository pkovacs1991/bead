'use strict'

const Schema = use('Schema')

class UsersTableSchema extends Schema {

  up () {
    this.drop('users')
  }

  down () {
    this.drop('users')
  }

}

module.exports = UsersTableSchema
