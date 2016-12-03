'use strict'

const Schema = use('Schema')

class RecipesTableSchema extends Schema {

  up () {
    this.drop('recipes')
  }

  down () {
    this.drop('recipes')
  }

}

module.exports = RecipesTableSchema
