'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addIndex('project_bunk', {
            fields: ['project_id', 'floor', 'room_type', 'room_no', 'bed'],
            unique: true,
            name: 'project_bunk_unique',
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.addIndex('project_bunk', {
            fields: ['project_id'],
            name: 'project_id,'
        });
        await queryInterface.removeIndex('project_bunk', 'project_bunk_unique');
    }
};