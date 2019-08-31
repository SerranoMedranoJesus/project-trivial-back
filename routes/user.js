const express = require('express')
const sha512 = require('js-sha512')
let User = require('../models/user')
const router = express.Router()

router.route('/')
  .get( (req, res) => {
    User.find().exec( (err, results) => {
      if(err) {
        throw err
      }

      res.json(results)
    } )
  } )

  .post( async(req, res, next) => {
    let userData = req.body
    let userObject = await new User ({
      name: userData.name,
      email: userData.email,
      password: sha512(userData.password),
      createdAt: userData.createdAt
    })

    userObject.save( (err) => {
      if (err) {
        if(err === 500) {
          res.status(400)
        }
        if(err !== 500){
          next(err)
        }
      }

      res.status(201)
      res.send(userObject.toJSON())
    } )
  } )

router.route('/:username')
  .get( (req, res) => {
    let UserName = req.params.username

    if(!res) {
      res.status(404)
      res.send('Usuario no encontrado')
    }
    if(res) {
      User.findOne({name: UserName}).exec( (err, results) => {
        if(err) {
          throw err
        }

        let user = {
          name: results.name,
          email: results.email
        }

        res.json(user)
      } )
    }
  } )

  .put( (req, res) => {
    let UserName = req.params.name
    let userData = req.body

    User.findOne({name: UserName}).exec( (err, result) => {
      if(err) {
        throw err
      }

      if(!result) {
        res.status(404)
        res.send('Usuario no encontrado')
      }

      if(result) {
        result.name = userData.name
        result.email = userData.email
        result.password = sha512(userData.password)
        result.createdAt = userData.createdAt

        result.save( (err) => {
          if(err) {
            throw err
          }

          res.json(result.toJSON())
        } )
      }
    } )
  } )

router.route('/:username/stats')
  .patch( (req, res) => {
    let UserName = req.params.username
    let userData = req.body
    
    User.findOne({name: UserName}).exec( (err, result) => {
      if(err) {
        throw err
      }

      if(!result) {
        res.status(404)
        res.send('Usuario no encontrado')
      }

      if(result) {
        result.correct += userData.correct
        result.failed += userData.failed
        result.games += userData.games

        result.save( (err) => {
          if(err) {
            throw err
          }

          res.json(result.toJSON())
        } )
      }
    } )
  } )

        
  .get( (req, res) => {
    let UserName = req.params.username

    if(!res) {
      res.status(404)
      res.send('Usuario no encontrado')
    }
    if(res) {
      User.findOne({name: UserName}).exec( (err, results) => {
        if(err) {
          throw err
        }

        let user = {
          name: results.name,
          games: results.games,
          correct: results.correct,
          failed: results.failed,
          total: results.correct + results.failed
        }

        res.json(user)
      } )
    }
  } )

module.exports = router