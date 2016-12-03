'use strict'

const Schema = use('Schema')

class UserLecturesTableSchema extends Schema {

  up () {
    this.create('user_lectures', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('lecture_id').unsigned().references('id').inTable('lectures')
      table.timestamps()
    })
  }

  down () {
    this.drop('user_lectures')
  }

}

module.exports = UserLecturesTableSchema
