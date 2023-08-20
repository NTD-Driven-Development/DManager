'use strict';

const path = require('path')
const _ = require('lodash')
const moment = require('moment')
const fs = require('fs');
const bunk_Bytes = fs.readFileSync(path.join(__dirname, '../data', 'bunk.json'), 'utf-8');
const bunks = JSON.parse(bunk_Bytes);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = moment().toDate();
        
        await queryInterface.bulkDelete('bunk', null);
        console.log(`== 床位載入中...`);
        await queryInterface.bulkInsert('bunk', bunks, {});
        console.log(`== 床位載入完成 (${(moment().toDate() - now) / 1000}s)`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('bunk', null);
    }
};
