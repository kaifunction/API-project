'use strict';
const { Spot } = require('../models');
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
    await Spot.bulkCreate([
      {
        ownerId: 2,
        address: '234 Redwood Lane',
        city: 'Enchanted Haven',
        state: 'California',
        country: 'United States of America',
        lat: 37.8216,
        lng: -122.4737,
        name: 'Mystical Treehouse Retreat',
        description: 'Elevated escape in ancient redwoods',
        price: 150
      },
      {
        ownerId: 1,
        address: '789 Jade Street',
        city: 'Zen Gardens',
        state: 'Beijing',
        country: 'China',
        lat: 39.9042,
        lng: 116.4074,
        name: 'Tranquil Bamboo Oasis',
        description: 'Harmony in the heart of the city',
        price: 798
      },
      {
        ownerId: 4,
        address: '456 Lighthouse Rd',
        city: 'Coastal Serenity',
        state: 'QLD',
        country: 'Australia',
        lat: -27.4698,
        lng: 153.0251,
        name: 'Oceanfront Zen House',
        description: 'Breathtaking views and calming vibes',
        price: 180
      },
      {
        ownerId: 3,
        address: '101 Mountain View Drive',
        city: 'Alpine Retreat',
        state: 'CO',
        country: 'United States of America',
        lat: 39.6133,
        lng: -106.1207,
        name: 'Ski Chalet Haven',
        description: 'Cosy lodge with panoramic mountain views',
        price: 190
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Hounter House', 'Sea View House', 'Snow House', 'Hot spring cabin'] }
    }, {});
  }
};
