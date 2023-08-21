'use strict';

const path = require('path')
const _ = require('lodash')
const moment = require('moment')
const fs = require('fs');
const class_Bytes = fs.readFileSync(path.join(__dirname, '../data', 'class.json'), 'utf-8');
const classes = JSON.parse(class_Bytes);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = moment().toDate();
        
        await queryInterface.bulkDelete('class', null);
        console.log(`== 班級載入中...`);
        await queryInterface.bulkInsert('class', classes, {});
        console.log(`== 班級載入完成 (${(moment().toDate() - now) / 1000}s)`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('class', null);
    }
};
