const db = require("../models");
const Joi = require('joi')

const getAll = async (req, res) => {
    try {
        const customers = await db.customers.findAll( { include: [db.contacts] })
        res.send({ success: true, message: 'Contact data successfully gotten', data: customers });
    } catch (err) {
        res.status(500).send({ success: false, message: err.message || "Something went wrong while fetching data." });
    }
}

const get = async (req, res) => {
    try {
        const customer = await db.customers.findByPk(req.params.id, { include: [db.contacts] });
        res.send({ success: true, message: 'Contact detail successfully gotten', data: customer });
    } catch (err) {
        res.status(500).send({ success: false, message: err.message || "Something went wrong while fetching data." });
    }
}

const create = async (req, res) => {
    const schema = Joi.object({
        firstName: Joi.string().max(100).required(),
        lastName: Joi.string().max(100).required(),
        dob: Joi.string().max(10).allow('').optional(),
        address: Joi.string().allow('').optional(),
        city: Joi.string().allow('').optional(),
        state: Joi.string().allow('').optional(),
        phone: Joi.string().max(15)
    })
    const customerData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob,
    };

    const contactData = {
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        phone: req.body.phone,
    }

    try {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).send({ success: false, message: error.details[0].message })
        }
        const customer = await db.customers.create(customerData);
        const contact = await db.contacts.create({ ...contactData, customerId: customer.id });
        res.send({ success: true, message: 'Contact created successfully', data: contact });
    } catch (err) {
        res.status(500).send({ success: false, message: err.message || "Something went wrong while creating data." });
    }
}

const update = async (req, res) => {
    const customerData = {
        firstName: req.body.customer.firstName,
        lastName: req.body.customer.lastName,
        dob: req.body.customer.dob,
    }

    const contactData = {
        address: req.body.contact.address,
        city: req.body.contact.city,
        state: req.body.contact.state,
        phone: req.body.contact.phone
    }

    try {
        await db.customers.update(customerData, { where: { id: req.params.id }});
        await db.contacts.update(contactData, { where: { id: req.body.contact.id }});
        res.send({ success: true, message: 'Contact updated successfully' });
    } catch (err) {
        res.status(500).send({ success: false, message: err.message || "Something went wrong while updating data." });
    }
}

const remove = async (req, res) => {
    try {
        await db.customers.destroy({ where: { id: req.params.id }})
        res.send({ success: true, message: 'Contact deleted successfully' });
    } catch (err) {
        res.status(500).send({ success: false, message: err.message || "Something went wrong while deleting data." });
    }
}

module.exports = {
    getAll,
    get,
    create,
    update,
    remove
}