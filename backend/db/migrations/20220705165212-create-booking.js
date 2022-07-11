'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.DATEONLY,
        allowNull : false
      },
      endDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      spotID: {
        type: Sequelize.INTEGER,
        references: {model: 'Spots', key : "id"}
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {model: 'Users', key : "id"}
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
    await queryInterface.dropTable('Bookings');
  }
};
