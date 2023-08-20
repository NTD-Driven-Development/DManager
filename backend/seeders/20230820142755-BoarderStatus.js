'use strict';

const path = require('path')
const _ = require('lodash')
const moment = require('moment')
const fs = require('fs');
const boarder_status_Bytes = fs.readFileSync(path.join(__dirname, '../data', 'boarder_status.json'), 'utf-8');
const boarder_status = JSON.parse(boarder_status_Bytes);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = moment().toDate();
        
        await queryInterface.bulkDelete('boarder_status', null);
        console.log(`== 住宿生狀態載入中...`);
        await queryInterface.bulkInsert('boarder_status', boarder_status, {});
        console.log(`== 住宿生狀態載入完成 (${(moment().toDate() - now) / 1000}s)`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('boarder_status', null);
    }
};
