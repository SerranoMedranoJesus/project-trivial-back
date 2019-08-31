const express = require('express')
let Quiz = require('../models/quiz')
const router = express.Router()

router.route('/')
  .get( (req, res) => {
    Quiz.find().exec( (err, results) => {
      if(err) {
        throw err
      }

      res.json(results)
    } )
  } )

  .post( async(req, res, next) => {
    let quizData = req.body
    let quizObject = await new Quiz ({
      question: quizData.question,
      answer: quizData.answer
    })

    quizObject.save( (err) => {
      if (err) {
        next(err)
      }

      res.status(201)
      res.send(quizObject.toJSON())
    } )
  } )

module.exports = router