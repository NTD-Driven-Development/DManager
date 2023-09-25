'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('bunk', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            floor: {
                type: Sequelize.STRING(10),
                allowNull: false,
                comment: "樓層",
            },
            room_type: {
                type: Sequelize.STRING(10),
                allowNull: false,
                comment: "房型",
            },
            room_no: {
                type: Sequelize.STRING(10),
                allowNull: false,
                comment: "房號",
            },
            bed: {
                type: Sequelize.STRING(10),
                allowNull: false,
                comment: "床號",
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
        await queryInterface.dropTable('bunk');
    }
};