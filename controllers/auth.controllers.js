const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  register: async (req, res, next) => {
    try {
      let { email, password, password_confirmation } = req.body;

      if (password != password_confirmation) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request!',
          err: 'please ensure that the password and password confirmation match!',
          data: null,
        });
      }

      const emailExist = await prisma.user.findUnique({ where: { email } });
      if (emailExist) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'email has already been used!',
          data: null,
        });
      }

      const encriptedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: encriptedPassword,
        },
      });

      const userProfile = await prisma.userProfile.create({
        data: {
          // first_name,
          // last_name,
          // birth_date: new Date(birth_date),
          userId: user.id,
        },
      });

      return res.status(201).json({
        status: false,
        message: 'Created!',
        err: null,
        data: { user: { id: user.id, email: user.email } },
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      let { email, password } = req.body;

      const existUser = await prisma.user.findUnique({ where: { email } });

      if (!existUser) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request!',
          err: 'Email does not exist',
          data: null,
        });
      }

      const isPasswordCorrect = await bcrypt.compare(password, existUser.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request',
          err: 'invalid email or password!',
          data: null,
        });
      }

      let token = jwt.sign({ id: existUser.id }, JWT_SECRET_KEY);

      return res.status(200).json({
        status: true,
        message: 'OK',
        err: null,
        data: { user: { id: existUser.id, email: existUser.email }, token },
      });
    } catch (err) {
      next(err);
    }
  },

  authenticate: async (req, res, next) => {
    res.status(200).json({
      status: true,
      message: 'OK',
      err: null,
      data: {
        first_name: req.userProfile.first_name,
        last_name: req.userProfile.first_name,
        email: req.user.email,
        birth_date: req.userProfile.birth_date,
        profile_picture: req.userProfile.profile_picture,
      },
    });
  },
};
