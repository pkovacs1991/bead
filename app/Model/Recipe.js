'use strict'

const Lucid = use('Lucid')

class Recipe extends Lucid {
  static scopeActive (builder) {
    builder.where('deleted', 0)
  }

  category () {
    return this.belongsTo('App/Model/Category')
  }

  created_by () {
    return this.belongsTo('App/Model/User', 'id', 'created_by_id')
  }
}

module.exports = Recipe
