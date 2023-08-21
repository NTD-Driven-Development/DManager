'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('point_log', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            boarder_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "住宿生外鍵",
                references: {
                    model: "boarder",
                    key: "id",
                },
            },
            project_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "項目編號",
                references: {
                    model: "project",
                    key: "id",
                },
            },
            point_rule_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "點數規則ID",
                references: {
                    model: "point_rule",
                    key: "id",
                },
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('point_log');
    }
};