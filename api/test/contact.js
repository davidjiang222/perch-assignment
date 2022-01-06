//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const db = require('../models')

chai.use(chaiHttp);
//Our parent block
describe("Contacts", () => {
    beforeEach(async () => {
        await db.customers.destroy({ where: {} });
    });
    /*
    * Test the /GET route
    */
    describe("/GET contacts", () => {
        it("it should GET all the contacts", async () => {
            const res = await chai.request(server).get("/contacts");
            res.should.have.status(200);
            res.body.data.should.be.a("array");
            res.body.success.should.be.eql(true);
            res.body.should.have.property('message').eql('Contact data successfully gotten');
        });
    });

    /*
    * Test the /GET/:id route
    */
    describe('/GET/:id contact', () => {
        it('it should GET a contact by the given id', async() => {
            const customer = await db.customers.create({
                firstName: "Detail First",
                lastName: "Detail Last",
                dob: "1/5/1994"
            })
            await db.contacts.create({
                address: "Detail Addr",
                city: "Detail City",
                state: "Detail State",
                phone: "1234567890", 
                customerId: customer.id 
            });
            const res = await chai.request(server).get('/contacts/' + customer.id);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.data.should.be.a('object');
            res.body.success.should.be.eql(true);
            res.body.data.should.have.property('firstName');
            res.body.data.should.have.property('lastName');
            res.body.data.should.have.property('id').eql(customer.id);
            res.body.should.have.property('message').eql('Contact detail successfully gotten');
        });
    });

    /*
    * Test the /POST route
    */
    describe('/POST contacts', () => {
        it('it should  POST a contact successfully', async () => {
            const customer = {
                firstName: "Test first",
                lastName: "Test last",
                dob: "2/22/1994",
                address: "Test addr",
                city: "Test city",
                state: "Test state",
                phone: "1234567890"
            }
            const res = await chai.request(server).post('/contacts').send(customer);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.data.should.be.a('object');
            res.body.should.have.property('message').eql('Contact created successfully');
            res.body.success.should.be.eql(true);
        });

        it('it should not POST a contact without firstName field', async () => {
            const customer = {
                lastName: "Test last",
                dob: "2/22/1994",
                address: "Test addr",
                city: "Test city",
                state: "Test state",
                phone: "1234567890"
            }
            const res = await chai.request(server).post('/contacts').send(customer);
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.success.should.be.eql(false);
        });
    });

    /*
    * Test the /PUT/:id route
    */
    describe('/PUT/:id contact', () => {
        it('it should UPDATE a contact given the id', async() => {
            const customer = await db.customers.create({
                firstName: "Update First",
                lastName: "Update Last",
                dob: "1/8/1994"
            })
            const contact = await db.contacts.create({
                address: "Update Addr",
                city: "Update City",
                state: "Update State",
                phone: "1234567890", 
                customerId: customer.id 
            });
            const res = await chai.request(server).put('/contacts/' + customer.id).send({ 
                customer: { 
                    firstName: "Changed First", 
                    dob: "1/20/1994" 
                },
                contact: {
                    id: contact.id,
                    city: "Changed City"
                }
            });
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.success.should.be.eql(true);
            res.body.should.have.property('message').eql('Contact updated successfully');
        });
    });

    /*
    * Test the /DELETE/:id route
    */
    describe('/DELETE/:id contact', () => {
        it('it should DELETE a contact given the id', async () => {
            const customer = await db.customers.create({
                firstName: "Delete First",
                lastName: "Delete Last",
                dob: "1/8/1994"
            })
            await db.contacts.create({
                address: "Delete Addr",
                city: "Delete City",
                state: "Delete State",
                phone: "1234567890", 
                customerId: customer.id 
            });
            const res = await chai.request(server).delete('/contacts/' + customer.id);
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Contact deleted successfully');
            res.body.success.should.be.eql(true);
        });
    });
});
