'use strict';
const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        firstName: 'Olivia',
        lastName: 'Anderson',
        email: 'olivia.anderson@gmail.com',
        username: 'oanderson123',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: 'Ethan',
        lastName: 'Williams',
        email: 'ethan.williams@gmail.com',
        username: 'ewilliam34',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: 'Sophia',
        lastName: 'Miller',
        email: 'sophia.miller@gmail.com',
        username: 'smiller789',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: 'Liam',
        lastName: 'Carter',
        email: 'liam.carter@gmail.com',
        username: 'FakeUser4',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: 'DemoF',
        lastName: 'DemoL',
        email: 'demofdemol@gmail.com',
        username: 'demo1234',
        hashedPassword: bcrypt.hashSync('passworddemo')
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['FakeUser1', 'FakeUser2', 'FakeUser3', 'FakeUser4'] }
    }, {});
  }
};
