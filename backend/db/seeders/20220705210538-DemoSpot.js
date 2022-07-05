'use strict';

const { DECIMAL } = require("sequelize/types");

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
    */  return queryInterface.bulkInsert('Users', [
      {
        ownerId: 1,
        address: '3805 Iris Circle',
        city: 'Burnsville',
        state:'Minnesota',
        country:'United States',
        latitude: 43.7654321,
        longitude: -130.1234567,
        name: 'Private Condo',
        description:'A beautiful condo in the heart of downtown',
        price:100,
        previewImage:'image url-1'
      },
      {
        ownerId: 2,
        address: '9595 E Grant Rd',
        city: 'Tucson',
        state:'Arizona',
        country:'United States',
        latitude: 23.8765432,
        longitude: -143.2345678,
        name: 'Mountain Villa',
        description:'A beautiful villa high in the mountains',
        price:90,
        previewImage:'image url-2'
      },
      {
        ownerId: 3,
        address: '1725 S Wallace St',
        city: 'Renton',
        state:'Washington',
        country:'United States',
        latitude: 33.9876543,
        longitude: -127.3456789,
        name: 'Forest Cabin',
        description:'A beautiful cabin deep in the forest',
        price:120,
        previewImage:'image url-3'
      },
      {
        ownerId: 4,
        address: '4422 Sampha Drake Lane',
        city: 'Toronto',
        state:'Alberta',
        country:'Canada',
        latitude: 67.123123,
        longitude: -112.321321,
        name: 'Spacious Bungalow',
        description:'Drake used to live here',
        price:250,
        previewImage:'image url-4'
      },
      {
        ownerId: 5,
        address: '1818 W Moclear',
        city: 'Harlem',
        state:'New York',
        country:'United States',
        latitude: 22.456456,
        longitude: -116.654654,
        name: 'Grand Skyrise',
        description:'Overlook Central Park',
        price:300,
        previewImage:'image url-5'
      },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Spots', {
      address: { [Op.in]: ['1725 S Wallace St', '9595 E Grant Rd','4422 Sampha Drake Lane', '3805 Iris Circle', '1818 W Moclear'] }
    }, {});
  }
};
