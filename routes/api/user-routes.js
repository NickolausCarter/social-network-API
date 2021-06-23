const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  createUser
} = require('../../controllers/user-controller');

router.route('/')
      .get(getAllUsers)
      .post(createUser)

router.route('/:id')
      .get(getUserById)

module.exports = router;