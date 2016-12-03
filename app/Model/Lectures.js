'use strict'

const Lucid = use('Lucid')

class Recipe extends Lucid {
  static scopeActive (builder) {
    builder.where('deleted', 0)
  }

  faculty () {
    return this.belongsTo('App/Model/Faculties')
  }

  created_by () {
    return this.belongsTo('App/Model/User', 'id', 'created_by_id')
  }
}

module.exports = Recipe
