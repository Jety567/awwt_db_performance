/*
{
    firstname:
    surname:
    birthdate:
    addresse:
    plz:
    city:
    email:
    password:
}
 */

const { faker } = require('@faker-js/faker');
const fs = require('fs');

fs.appendFileSync('data.json','[');


for (let i = 0; i < 10000; i++) {
    fs.appendFileSync('data.json', JSON.stringify({
        firstname: faker.name.firstName(),
        lastName: faker.name.lastName(),
        birthdate: faker.date.birthdate(),
        addresse: faker.address.streetAddress(),
        plz: faker.address.zipCode("####"),
        city: faker.address.cityName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
    }) + ',');
}
fs.appendFileSync('data.json',']');