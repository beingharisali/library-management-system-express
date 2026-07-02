const express = require('express')
const router = express.Router()
const { getBooks } = require('../controllers/books')

router.get('/', getBooks)

module.exports = router