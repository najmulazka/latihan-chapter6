const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const imagekit = require('../libs/imagekit');
const path = require('path');

module.exports = {
  updateProfile: async (req, res, next) => {
    try {
      let { first_name, last_name, birth_date } = req.body;

      let strFile = req.file.buffer.toString('base64');

      const { url } = await imagekit.upload({
        fileName: Date.now() + path.extname(req.file.originalname),
        file: strFile,
      });

      const userProfile = await prisma.user.update({
        where: { id: req.user.id },
        data: {
          userProfile: {
            upsert: {
              create: {
                first_name,
                last_name,
                birth_date: new Date(birth_date),
                profile_picture: url,
              },
              update: {
                first_name,
                last_name,
                birth_date: new Date(birth_date),
                profile_picture: url,
              },
            },
          },
        },
      });

      if (!userProfile) {
        return res.status(400).json({
          status: false,
          message: 'Bad Request!',
          err: 'user id does not exist',
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: 'OK!',
        err: null,
        data: { userProfile: req.userProfile },
      });
    } catch (err) {
      next(err);
    }
  },
};
