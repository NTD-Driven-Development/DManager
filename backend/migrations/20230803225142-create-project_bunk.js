'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('project_bunk', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            boarder_id: {
                type: Sequelize.UUID,
                allowNull: true,
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
            remark: {
                type: Sequelize.STRING(1024),
                allowNull: true,
                comment: "備註",
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
        await queryInterface.dropTable('project_bunk');
    }
};