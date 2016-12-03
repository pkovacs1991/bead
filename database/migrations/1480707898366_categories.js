'use strict'

const Schema = use('Schema')

class FacultiesTableSchema extends Schema {

  up () {
    this.create('faculties', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('faculties')
  }

}

module.exports = FacultiesTableSchema
