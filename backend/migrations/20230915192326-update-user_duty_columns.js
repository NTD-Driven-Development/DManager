'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('user_duty', 'updated_at', {
            type: Sequelize.DATE,
            allowNull: true,
        });
        await queryInterface.addColumn('user_duty', 'updated_by', {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.renameColumn('user_duty', 'start_date', 'start_time');
        await queryInterface.renameColumn('user_duty', 'end_date', 'end_time');
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('user_duty', 'updated_at');
        await queryInterface.removeColumn('user_duty', 'updated_by');
        await queryInterface.renameColumn('user_duty', 'start_time', 'start_date');
        await queryInterface.renameColumn('user_duty', 'end_time', 'end_date');
    }
};