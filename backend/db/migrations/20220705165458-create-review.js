'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      review: {
        type: Sequelize.TEXT
      },
      stars: {
        type: Sequelize.DECIMAL
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',

        },

      },
      spotID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Spots',

        },

      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reviews');
  }
};
