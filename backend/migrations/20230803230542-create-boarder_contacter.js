'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('boarder_contacter', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            boarder_id: {
                type: Sequelize.UUID,
                allowNull: false,
                comment: "住宿生外鍵",
                references: {
                    model: "boarder",
                    key: "id",
                },
            },
            name: {
                type: Sequelize.STRING(10),
                allowNull: false,
                comment: "緊急聯絡人姓名",
            },
            tel: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: "聯絡人電話",
            },
            remark: {
                type: Sequelize.STRING(1024),
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
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: "更新時間",
            },
            updated_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: "更新者",
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: "刪除時間",
            },
            deleted_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: "刪除者",
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('boarder_contacter');
    }
};