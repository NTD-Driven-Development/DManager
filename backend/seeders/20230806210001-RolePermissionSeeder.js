'use strict';

const path = require('path')
const _ = require('lodash')
const moment = require('moment')
const fs = require('fs');
const role_permission_Bytes = fs.readFileSync(path.join(__dirname, '../data', 'role_permission.json'), 'utf-8');
const role_permissions = JSON.parse(role_permission_Bytes);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = moment().toDate();
        
        await queryInterface.bulkDelete('role_permission', null);
        console.log(`== 角色權限載入中...`);
        
        await queryInterface.bulkInsert('role_permission', role_permissions, {});
        console.log(`== 角色權限載入完成 (${(moment().toDate() - now) / 1000}s)`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('role_permission', null);
    }
};
