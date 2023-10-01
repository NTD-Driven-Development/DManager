'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // when sys_log, sys_error_log insert, trigger will update operation_name
        await queryInterface.sequelize.query(`
            CREATE TRIGGER trig_update_log_operation_name
            BEFORE INSERT ON sys_log
            FOR EACH ROW
            BEGIN
                IF NEW.operation_name IS NULL THEN
                    SET NEW.operation_name = (select description from permission where path = NEW.url and method = NEW.http_method);
                END IF;
            END;
        `);
        await queryInterface.sequelize.query(`
            CREATE TRIGGER trig_update_error_log_operation_name
            BEFORE INSERT ON sys_error_log
            FOR EACH ROW
            BEGIN
                IF NEW.operation_name IS NULL THEN
                    SET NEW.operation_name = (select description from permission where path = NEW.url and method = NEW.http_method);
                END IF;
            END;
        `);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DROP TRIGGER IF EXISTS trig_update_log_operation_name;
        `);
        await queryInterface.sequelize.query(`
            DROP TRIGGER IF EXISTS trig_update_error_log_operation_name;
        `);
    }
};