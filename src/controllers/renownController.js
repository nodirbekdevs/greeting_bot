const Renown = require('./../models/renownModel')

const getRenowns = async (query) => {
  try {
    return await Renown.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getRenownPagination = async (query, offset, limit) => {
  try {
    return await Renown.find(query).skip(offset).limit(limit)
  } catch (e) {
    console.log(e)
  }
}

const getRenown = async (query) => {
  try {
    return await Renown.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makeRenown = async (data) => {
  try {
    return await Renown.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updateRenown = async (query, data) => {
  try {
    return await Renown.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const deleteRenown = async (query) => {
  try {
    return await Renown.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countRenowns = async (query) => {
  try {
    return await Renown.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {getRenowns, getRenownPagination, getRenown, makeRenown, updateRenown, deleteRenown, countRenowns}
