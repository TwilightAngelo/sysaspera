var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DocSchema = new Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
  },
  title: { //название
    type: String,
    required: true,
    unique: false,
  },
  creator: { //автор/создатель
    type: String,
    required: false,
    unique: false,
  },
  subject: { //тема
    type: String,
    required: false,
    unique: false,
  },
  description: { //описание
    type: String,
    required: false,
    unique: false,
  },
  publisher: { //издатель
    type: String,
    required: false,
    unique: false,
  },
  contributor: { //внёсший вклад
    type: String,
    required: false,
    unique: false,
  },
  date: { //дата
    type: Date,
    required: true,
    unique: false,
  },
  type: { //тип
    type: String,
    required: false,
    unique: false,
  },
  format: { //формат документа
    type: String,
    required: true,
    unique: false,
  },
//  identifier: { //идентификатор
//    type: String,
//    required: false,
//    unique: false,
//  },
  source: { //источник
    type: String,
    required: false,
    unique: false,
  },
  language: { //язык
    type: String,
    required: false,
    unique: false,
  },
  relation: { //отношения
    type: String,
    required: false,
    unique: false,
  },
  coverage: { //покрытие
    type: String,
    required: false,
    unique: false,
  },
  rights: { //авторские права
    type: String,
    required: false,
    unique: false,
  },

;

module.exports = mongoose.model('Doc', DocSchema, 'docs');