'use strict'

const Schema = use('Schema')

class LecturesTableSchema extends Schema {

  up () {
    this.create('lectures', (table) => {
      table.increments()
      table.string('name', 50).notNullable()
      table.string('place', 50).notNullable()
      table.string('time', 50).notNullable()
      table.string('max', 50).notNullable()
      table.integer('faculty_id').unsigned().references('id').inTable('faculties')
      table.timestamps()
    })
  }

  down () {
    this.drop('lectures')
  }

}

module.exports = LecturesTableSchema
