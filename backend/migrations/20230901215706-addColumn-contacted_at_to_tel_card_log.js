'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('tel_card_log', 'contacted_at', {
            type: Sequelize.DATE,
            allowNull: false,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('tel_card_log', 'contacted_at');
    }
};