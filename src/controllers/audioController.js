const Audio = require('./../models/audioModel')

const getAudios = async (query) => {
  try {
    return await Audio.find(query)
  } catch (e) {
    console.log(e)
  }
}

const getAudio = async (query) => {
  try {
    return await Audio.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeAudio = async (data) => {
  try {
    return await Audio.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateAudio = async (query, data) => {
  try {
    return await Audio.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const deleteAudio = async (query) => {
  try {
    return await Audio.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countAudios = async (query) => {
  try {
    return await Audio.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {getAudios, getAudio, makeAudio, updateAudio, deleteAudio, countAudios}
