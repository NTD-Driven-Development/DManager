'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('boarder', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
            },
            sid: {
                type: Sequelize.STRING(20),
                allowNull: true,
                comment: "學號",
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
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: "姓名",
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: true,
                comment: "電話",
            },
            class_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: "班級ID",
                references: {
                    model: "class",
                    key: "id",
                },
            },
            birthday: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: "生日",
            },
            avatar: {
                type: Sequelize.STRING(255),
                allowNull: true,
                comment: "頭像",
            },
            remark: {
                type: Sequelize.STRING(1024),
                allowNull: true,
                comment: "備註",
            },
            access_card: {
                type: Sequelize.STRING(50),
                allowNull: true,
                comment: "門禁卡號",
            },
            boarder_status_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "住宿狀態編號",
                references: {
                    model: "boarder_status",
                    key: "id",
                },
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
        await queryInterface.dropTable('boarder');
    }
};