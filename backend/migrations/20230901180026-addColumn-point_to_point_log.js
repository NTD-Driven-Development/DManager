'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('point_log', 'point', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('point_log', 'point');
    }
};