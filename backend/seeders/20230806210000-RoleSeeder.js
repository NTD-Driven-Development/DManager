'use strict';

const moment = require('moment');
/** @type {import('sequelize-cli').Migration} */
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
        const now = moment().toDate();
        const roles = [
            {
                id: 1,
                name: '編輯者',
                created_at: now,
            },
            {
                id: 2,
                name: '檢視者',
                created_at: now,
            },
        ]
        await queryInterface.bulkInsert('role', roles);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
