'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('student', {
            sid: {
                type: Sequelize.STRING(25),
                primaryKey: true,
                allowNull: false,
                comment: "學號",
            },
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: "姓名",
            },
            point: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "點數",
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: "電話",
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "使用者ID",
            },
            class_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "班級ID",
            },
            is_live: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                comment: "是否為(住宿/非住宿)",
            },
            remark: {
                type: Sequelize.STRING(255),
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('student');
    }
};