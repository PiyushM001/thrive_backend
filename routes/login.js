const express = require("express");
const router = express.Router();
const students = require("../schema/user");
const bcrypt = require('bcrypt');
const info = require("../schema/info");

require('dotenv').config();

const jwtsecret = "piyush"
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");


router.post(
  "/",
  [body("email","write a valid email").isEmail(), body("password","password should be longer than 6").isLength({ min: 6 })],
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
const resultarray = result.array();
      return res.status(404).json(resultarray[0].msg);
    }
    const { email, password } = req.body;
    try {
      const student = await students.findOne({ email });
      if (!student) {
        res.status(404).json("No user found");
        return;
       
      }
      const information = await info.findOne({user:student._id})

      const checkpassword = await bcrypt.compare(password, student.password)
      if (!checkpassword) {
        res.status(404).json("Invalid credentials");
        return;
      }

      const data = {
        user: {
          id: student.id,
        },
      };
     
    

      const logintoken = jwt.sign(data, jwtsecret);
      res.json({token:logintoken,realname:information.RealName});

 } catch (error) {
  res.status(404).send("something went wrong");
  return;
    }
  

});
module.exports = router;




