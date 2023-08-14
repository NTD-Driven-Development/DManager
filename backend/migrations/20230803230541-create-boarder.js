'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('boarder', {
            sid: {
                type: Sequelize.STRING(20),
                primaryKey: true,
                allowNull: false,
                comment: "學號",
            },
            project_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "期別ID",
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
            boarder_role_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "住宿身份ID",
            },
            boarder_status_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "住宿狀態ID",
            },
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: "姓名",
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: false,
                comment: "電話",
            },
            class_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: "班級ID",
            },
            birthday: {
                type: Sequelize.DATE,
                allowNull: false,
                comment: "生日",
            },
            avatar: {
                type: Sequelize.STRING(255),
                allowNull: true,
                comment: "頭像",
            },
            remark: {
                type: Sequelize.STRING(255),
                allowNull: true,
                comment: "備註",
            },
            access_card: {
                type: Sequelize.STRING(50),
                allowNull: true,
                comment: "門禁卡號",
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
        await queryInterface.dropTable('boarder');
    }
};