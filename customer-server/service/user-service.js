// funAddAdminModules

const common = require("../global/common");
const mongoose = require("mongoose");
const { user } = require("../models/user-model");
let jwt = require("jsonwebtoken");
const config = require("../config/config");
const arrayEmpty = [];

module.exports = {
  //Add admin modules
  funUserSignup: async function (obj, db) {
    try {
      let userDetail = {
        fkUserId: new mongoose.Types.ObjectId(),
        strEmail: obj?.strEmail,
        strName: obj?.strName,
        strPassword: obj?.strPassword,
        strPhone: obj?.strPhone,
        strCountry: obj?.strCountry,
      };

      let hashpassword = common.setPassword(obj.strPassword);
      if (!hashpassword) {
        return {
          success: false,
          message: "Password encryption failed.",
          data: arrayEmpty,
        };
      }
      userDetail.strPassword = hashpassword;
      let insertuser = await user.create(userDetail);

      if (insertuser) {
        return {
          success: true,
          message: "Success.",
          data: arrayEmpty,
        };
      } else {
        return {
          success: false,
          message: "Failed to update.",
          data: arrayEmpty,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "System:" + error,
        data: arrayEmpty,
      };
    }
  },

  funUserLogin: async function (obj, db) {
    try {
      let strEmail = obj.strEmail;
      let strPassword = obj.strPassword;

      let userDetails = await user.aggregate([
        {
          $match: {
            strEmail: strEmail,
          },
        },
        {
          $project: {
            fkUserId: 1,
            strEmail: 1,
            strName: 1,
            strPassword: 1,
            strPhone: 1,
            strCountry:1,
            _id: 0,
          },
        },
      ]);

      if (!userDetails.length > 0)
        return {
          success: false,
          message: "does not matching any documents",
          data: arrayEmpty,
        };
      let objLoginPassword = common.validPassword(strPassword);

      if (userDetails[0].strPassword != objLoginPassword)
        return {
          success: false,
          message: "Does not match the password.",
          data: [],
        };
      let objPasData = {
        strEmail: obj.strEmail,
        intUserId: userDetails[0].fkUserId,
      };

      const token = jwt.sign({ user: objPasData }, config.JWT_SECRET, {
        expiresIn: "200m",
      }); // 10 minutes expiration

      if (token) {
        userDetails[0].token = token;

        return {
          success: true,
          message: "Login success",
          data: userDetails[0],
        };
      } else {
        return {
          success: false,
          message: "Token implment failed",
          data: arrayEmpty,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "System:" + error,
        data: arrayEmpty,
      };
    }
  },
};
