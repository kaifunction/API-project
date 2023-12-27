'use strict';
const { Review } = require('../models');
// const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Review.bulkCreate([
      {
        review: 'This was an awesome spot!',
        stars: 5
      },
      {
        review: 'This was an nice spot!',
        stars: 4
      },
      {
        review: 'This was an OK spot!',
        stars: 3
      },
      {
        review: 'This was an bad spot!',
        stars: 1
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      stars: {
        [Op.in]: [1, 2, 3, 4, 5]
      }
    }, {})
  }
};