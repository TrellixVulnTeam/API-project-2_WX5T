'use strict';

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
     return queryInterface.bulkInsert(
      "Image",
      [
        {
          imageableType:
            'JPEG',
          url: 'https://better.net/chicago/wp-content/uploads/sites/2/2021/04/Parkline-Chicago-.jpg',
          spotID: 1,
          reviewID: 1,
        },
        {
          imageableType:
          'IMAGE',
        url: 'https://q-xx.bstatic.com/xdata/images/hotel/840x460/199606515.jpg?k=93dc44c90f73c8334ee6d1e05e953c9c839591aa253115d7cc52f4110f6c8e20&o=',
        spotID: 2,
        reviewID: 2
        },
        {
          imageableType:
          'JPEG',
        url: 'https://discover.therookies.co/content/images/2019/04/HouseWIP.jpg',
        spotID: 3,
        reviewID: 3
        },
        {
          imageableType:
          'JPEG',
        url: 'https://i.pinimg.com/originals/83/c1/bd/83c1bd6ec1882231f0e73387a12a6ec6.jpg',
        spotID: 4,
        reviewID: 4
        },
        {
          imageableType:
            'JPEG',
          url: 'https://media.architecturaldigest.com/photos/570522a05fc159282a6446e5/master/pass/the-bryant-david-chipperfields-first-high-rise-new-york-city-02.jpg',
          spotID: 5,
          reviewID: 5
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      "Image",
      {
        spotId: {
          [Op.in]: [1, 2, 3, 4, 5],
        },
      },
      {}
    );
  },
};
