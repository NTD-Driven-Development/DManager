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
        await queryInterface.bulkInsert('user', [
            {
                sid: "0",
                email : 'admin@dormiday.com',
                password: '$2b$10$kJJAb.B4QK3qcZ32XdHPmu5XUap.Svu50QzpuJ4PTWnfW9T8FNIbe',
                name: 'Admin',
                is_admin: true,
                is_actived: true,
                created_at: moment().toDate(),
            }
        ]);
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
