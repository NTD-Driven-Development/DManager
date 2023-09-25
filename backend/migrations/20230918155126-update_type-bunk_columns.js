'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('bunk', 'floor', {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: "樓層",
        });
        await queryInterface.changeColumn('bunk', 'room_no', {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: "房號",
        });
        await queryInterface.changeColumn('bunk', 'bed', {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: "床號",
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn('bunk', 'floor', {
            type: Sequelize.STRING(10),
            allowNull: false,
            comment: "樓層",
        });
        await queryInterface.changeColumn('bunk', 'room_no', {
            type: Sequelize.STRING(10),
            allowNull: false,
            comment: "房號",
        });
        await queryInterface.changeColumn('bunk', 'bed', {
            type: Sequelize.STRING(10),
            allowNull: false,
            comment: "床號",
        });
    }
};