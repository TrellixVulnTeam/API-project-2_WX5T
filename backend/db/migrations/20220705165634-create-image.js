'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // imageableType: {
      //   type: Sequelize.STRING
      // },
      url: {
        type: Sequelize.STRING
      },
      spotID: {
        type: Sequelize.INTEGER,
        references: {model: 'Spots'}
      },
      reviewID: {
        type: Sequelize.INTEGER,
        references: {model: 'Reviews'},
        onDelete: "CASCADE"
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
    await queryInterface.dropTable('Images');
  }
};
