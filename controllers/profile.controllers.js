const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const imagekit = require('../libs/imagekit');
const path = require('path');

module.exports = {
  updateProfile: async (req, res, next) => {
    try {
      let { first_name, last_name, birth_date } = req.body;
      // console.log('sdfs');
      // return res.send(req.file);

      let strFile = req.file.buffer.toString('base64');

      const { url } = await imagekit.upload({
        fileName: Date.now() + path.extname(req.file.originalname),
        file: strFile,
      });

      const userProfile = await prisma.userProfile.upsert({
        where: { userId: req.user.id },
        create: {
          userId: req.user.id,
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
