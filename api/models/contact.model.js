module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("contact", {
        address: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        }
    });
    return Contact;
};