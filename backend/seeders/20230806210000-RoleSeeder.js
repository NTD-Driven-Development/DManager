'use strict';

const moment = require('moment');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        console.log(`== 角色載入中...`);
        const now = moment().toDate();
        const roles = [
            {
                id: 1,
                name: '編輯者',
                is_actived: true,
                created_at: now,
            },
            {
                id: 2,
                name: '檢視者',
                is_actived: true,
                created_at: now,
            },
        ]
        await queryInterface.bulkInsert('role', roles);
        console.log(`== 角色載入完成 (${(moment().toDate() - now) / 1000}s)`);
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
