'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('permission', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING(100),
                allowNull: false,
                comment: "描述",
            },
            method: {
                type: Sequelize.STRING(10),
                allowNull: false,
                comment: "HTTP Method",
            },
            path: {
                type: Sequelize.STRING(255),
                allowNull: false,
                comment: "Route Path",
            },
            is_actived: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                comment: "是否啟用",
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('permission');
    }
};