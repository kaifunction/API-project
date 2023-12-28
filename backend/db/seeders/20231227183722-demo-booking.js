'use strict';
const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

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
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        startDate: '2023-12-23',
        endDate: '2023-12-26'
      },
      {
        spotId: 2,
        userId: 1,
        startDate: '2024-01-02',
        endDate: '2024-01-07'
      },
      {
        spotId: 3,
        userId: 4,
        startDate: '2023-11-26',
        endDate: '2023-12-04'
      },
      {
        spotId: 4,
        userId: 3,
        startDate: '2024-12-20',
        endDate: '2024-12-29'
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {})
  }
};
