'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('role_permission', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            role_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "角色編號",
            },
            permission_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "權限編號",
            },
            is_active: {
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('role_permission');
    }
};