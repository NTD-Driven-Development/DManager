'use strict';

const path = require('path')
const _ = require('lodash')
const moment = require('moment')
const fs = require('fs');
const permission_Bytes = fs.readFileSync(path.join(__dirname, '../data', 'permission.json'), 'utf-8');
const permissions = JSON.parse(permission_Bytes);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = moment().toDate();
        
        await queryInterface.bulkDelete('permission', null);
        console.log(`== 權限載入中...`);
        
        await queryInterface.bulkInsert('permission', permissions, {});
        console.log(`== 權限載入完成 (${(moment().toDate() - now) / 1000}s)`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('permission', null);
    }
};
