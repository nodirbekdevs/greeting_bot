const Poem = require('./../models/poemModel')

const getPoems = async (query) => {
  try {
    return await Poem.find(query).sort({createdAt: -1})
  } catch (e) {
    console.log(e)
  }
}

const getPoemPagination = async (query, offset, limit) => {
  try {
    return await Poem.find(query).skip(offset).limit(limit)
  } catch (e) {
    console.log(e)
  }
}

const getPoem = async (query) => {
  try {
    return await Poem.findOne(query)
  } catch (e) {
    console.log(e)
  }
}

const makePoem = async (data) => {
  try {
    return await Poem.create(data)
  } catch (e) {
    console.log(e)
  }
}

const updatePoem = async (query, data) => {
  try {
    return await Poem.findOneAndUpdate(query, data, {new: true})
  } catch (e) {
    console.log(e)
  }
}

const deletePoem = async (query) => {
  try {
    return await Poem.findOneAndDelete(query)
  } catch (e) {
    console.log(e)
  }
}

const countPoems = async (query) => {
  try {
    return await Poem.countDocuments(query)
  } catch (e) {
    console.log(e)
  }
}

module.exports = {getPoems, getPoemPagination, getPoem, makePoem, updatePoem, deletePoem, countPoems}
