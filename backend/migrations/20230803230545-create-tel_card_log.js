'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('tel_card_log', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            sid: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: "住宿生學號",
            },
            project_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "項目ID",
            },
            tel_card_contacter_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "電話卡聯絡人ID",
            },
            remark: {
                type: Sequelize.STRING(500),
                allowNull: true,
                comment: "備註",
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                comment: "建立時間",
            },
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: "建立者",
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('tel_card_log');
    }
};