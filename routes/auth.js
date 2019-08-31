const express = require('express')
const sha512 = require('js-sha512')
const User = require('../models/user')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.route('/')
  .post(function (req, res) {
    let userData = req.body

    User.findOne({
      name: userData.name,
      password: sha512(userData.password)
    }).exec( (err, result) => {
      if (err) {
        throw err
      }

      if (!result) {
        res.status(403)
        res.send("Usuario o contraseña incorrecto")
      }

      if (result) {
        let userJSON = {
          id: result._id,
          name: result.name
        }

        let jwtToken = generateToken(userJSON, req.app.get("app_secret"))

        result.logged_at = Date.now()
        result.save()

        res.json({token: jwtToken})
      }
    })

  })

  function generateToken(payload, secret_passphrase) {
    return jwt.sign(payload, secret_passphrase, {
      expiresIn: "30 days"
  });
}

module.exports = router;