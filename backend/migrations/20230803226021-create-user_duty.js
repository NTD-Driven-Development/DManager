'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_duty', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "使用者編號",
                references: {
                    model: "user",
                    key: "id",
                },
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: false,
                comment: "起始時間",
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: false,
                comment: "結束時間",
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
        await queryInterface.dropTable('user_duty');
    }
};