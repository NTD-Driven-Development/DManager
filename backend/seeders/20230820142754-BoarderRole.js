'use strict';

const path = require('path')
const _ = require('lodash')
const moment = require('moment')
const fs = require('fs');
const boarder_role_Bytes = fs.readFileSync(path.join(__dirname, '../data', 'boarder_role.json'), 'utf-8');
const boarder_role = JSON.parse(boarder_role_Bytes);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = moment().toDate();
        
        await queryInterface.bulkDelete('boarder_role', null);
        console.log(`== 住宿生身分別載入中...`);
        await queryInterface.bulkInsert('boarder_role', boarder_role, {});
        console.log(`== 住宿生身分別載入完成 (${(moment().toDate() - now) / 1000}s)`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('boarder_role', null);
    }
};
