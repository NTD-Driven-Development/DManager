'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            sid: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: "學號",
            },
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: "姓名",
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: "帳號",
            },
            password: {
                type: Sequelize.STRING(512),
                allowNull: false,
                comment: "密碼",
            },
            is_admin: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                comment: "是否為管理員",
            },
            is_actived: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                comment: "是否啟用",
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
        await queryInterface.dropTable('user');
    }
};