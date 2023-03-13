const Felicitation = require('./../models/felicitationModel')

const getFelicitations = async (query) => {
  try {
    return await Felicitation.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getFelicitationPagination = async (query, offset, limit) => {
  try {
    return await Felicitation.find(query).skip(offset).limit(limit)
  } catch (e) {
    console.log(e)
  }
}

const getFelicitation = async (query) => {
  try {
    return await Felicitation.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeFelicitation = async (data) => {
  try {
    return await Felicitation.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateFelicitation = async (query, data) => {
  try {
    return await Felicitation.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const deleteFelicitation = async (query) => {
  try {
    return await Felicitation.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countFelicitations = async (query) => {
  try {
    return await Felicitation.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  getFelicitations,
  getFelicitationPagination,
  getFelicitation,
  makeFelicitation,
  updateFelicitation,
  deleteFelicitation,
  countFelicitations
}
