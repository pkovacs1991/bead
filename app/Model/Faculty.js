'use strict'

const Lucid = use('Lucid')

class Faculty extends Lucid {
 lectures () {
    return this.hasMany('App/Model/Lecture')
  }
}

module.exports = Faculty
