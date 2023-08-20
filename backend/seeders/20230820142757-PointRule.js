'use strict';

const path = require('path')
const _ = require('lodash')
const moment = require('moment')
const fs = require('fs');
const point_rule_Bytes = fs.readFileSync(path.join(__dirname, '../data', 'point_rule.json'), 'utf-8');
const point_rules = JSON.parse(point_rule_Bytes);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = moment().toDate();
        
        await queryInterface.bulkDelete('point_rule', null);
        console.log(`== 加扣點規則載入中...`);
        await queryInterface.bulkInsert('point_rule', point_rules, {});
        console.log(`== 加扣點規則載入完成 (${(moment().toDate() - now) / 1000}s)`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('point_rule', null);
    }
};
