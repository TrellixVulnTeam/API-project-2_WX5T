"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
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
      "Reviews",
      [
        {
          review:
            "I am not sure how living in the middle of downtown is private",
          stars: 3,
          spotID: 1,
          userID: 1,
        },
        {
          review: "Breathtaking views and sunsets",
          stars: 4,
          spotID: 2,
          userID: 2,
        },
        {
          review: "I saw a bear and a panther playing with a little boy",
          stars: 3,
          spotID: 3,
          userID: 3,
        },
        {
          review: "I really love the recording studio downstairs",
          stars: 5,
          spotID: 4,
          userID: 4,
        },
        {
          review: "I hate how loud it is at night but the view is amazing",
          stars: 2,
          spotID: 5,
          userID: 5,
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
      "Review",
      {
        spotID: {
          [Op.in]: [1, 2, 3, 4, 5],
        },
      },
      {}
    );
  },
};
