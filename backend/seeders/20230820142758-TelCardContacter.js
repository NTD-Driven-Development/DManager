'use strict';

const path = require('path')
const _ = require('lodash')
const moment = require('moment')
const fs = require('fs');
const tel_card_contacter_Bytes = fs.readFileSync(path.join(__dirname, '../data', 'tel_card_contacter.json'), 'utf-8');
const tel_card_contacters = JSON.parse(tel_card_contacter_Bytes);

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = moment().toDate();
        
        await queryInterface.bulkDelete('tel_card_contacter', null);
        console.log(`== 電話卡聯絡人載入中...`);
        await queryInterface.bulkInsert('tel_card_contacter', tel_card_contacters, {});
        console.log(`== 電話卡聯絡人載入完成 (${(moment().toDate() - now) / 1000}s)`);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('tel_card_contacter', null);
    }
};
