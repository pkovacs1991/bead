'use strict'

const Schema = use('Schema')

class UsersTableSchema extends Schema {

  up () {
     this.create('faculties', (table) => {
      table.increments()
      table.string('name', 50).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('faculties')
  }

}

module.exports = UsersTableSchema
