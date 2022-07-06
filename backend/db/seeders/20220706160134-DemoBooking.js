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
     return queryInterface.bulkInsert('Bookings', [
      {
        startDate: '2022-10-13',
        endDate: '2022-10-01',
        spotID: 1,
        userID: 1
      },
      {
        startDate: '2022-11-03',
        endDate: '2022-11-16',
        spotID: 2,
        userID: 2
      },
      {
        startDate: '2022-01-01',
        endDate: '2022-01-15',
        spotID: 3,
        userID: 3
      },
      {
        startDate: '2022-09-11',
        endDate: '2022-09-20',
        spotID: 4,
        userID: 4
      },
      {
        startDate: '2022-02-01',
        endDate: '2022-02-14',
        spotID: 5,
        userID: 5
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
     down: async (queryInterface, Sequelize) => {
      const Op = Sequelize.Op;
      return queryInterface.bulkDelete('Bookings', {
        spotID: { [Op.in]: [1, 2, 3, 4, 5] }
      }, {});
    }
  }
};
