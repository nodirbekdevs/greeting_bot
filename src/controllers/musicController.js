const Music = require('./../models/musicModel')

const getMusics = async (query) => {
  try {
    return await Music.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getMusicPagination = async (query, offset, limit) => {
  try {
    return await Music.find(query).skip(offset).limit(limit)
  } catch (e) {
    console.log(e)
  }
}

const getMusic = async (query) => {
  try {
    return await Music.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeMusic = async (data) => {
  try {
    return await Music.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateMusic = async (query, data) => {
  try {
    return await Music.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const deleteMusic = async (query) => {
  try {
    return await Music.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countMusics = async (query) => {
  try {
    return await Music.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {getMusics, getMusicPagination, getMusic, makeMusic, updateMusic, deleteMusic, countMusics}
