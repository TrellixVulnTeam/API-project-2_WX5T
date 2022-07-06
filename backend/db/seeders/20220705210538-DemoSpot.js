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
    */  return queryInterface.bulkInsert('Spots', [
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
        previewImage:'https://better.net/chicago/wp-content/uploads/sites/2/2021/04/Parkline-Chicago-.jpg'
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
        previewImage:'https://q-xx.bstatic.com/xdata/images/hotel/840x460/199606515.jpg?k=93dc44c90f73c8334ee6d1e05e953c9c839591aa253115d7cc52f4110f6c8e20&o=image url-2'
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
        previewImage:'https://discover.therookies.co/content/images/2019/04/HouseWIP.jpg'
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
        previewImage:'https://i.pinimg.com/originals/83/c1/bd/83c1bd6ec1882231f0e73387a12a6ec6.jpg'
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
        previewImage:'https://media.architecturaldigest.com/photos/570522a05fc159282a6446e5/master/pass/the-bryant-david-chipperfields-first-high-rise-new-york-city-02.jpg'
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
