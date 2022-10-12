const mongoose = require('mongoose');
const fs = require('fs')
const { performance } = require('perf_hooks');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
let mongo_data;

const schema = new Schema({
    author: ObjectId,
    firstname:      String,
    lastName:       String,
    birthdate:      String,
    addresse:       String,
    plz:            String,
    city:           String,
    email:          String,
    password:       String,
});

const EXECUTION_FULL = 10000;
const EXECUTION_PART = 1000;


const main = async () => {
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/test');

        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "connection error: "));
        db.once("open", async function () {
            console.log("Connected successfully");

            let array = JSON.parse(fs.readFileSync('perf.json').toString());

            let data = fs.readFileSync('../data/data.json').toString();
            data = JSON.parse(data);

            let User = db.model('User',schema);

            await User.deleteMany({});

            var startTime = performance.now()
            for (let i = 0; i < data.length;i++) {
                let user = data[i];
                const newUser = new User(user);
                await newUser.save();
            }
            var endTime = performance.now()
            let insert_time = {
                time: (endTime - startTime),
                time_per_command: Math.round((endTime - startTime) / data.length),
                executions: data.length,
            }

            mongo_data = await User.find();

            startTime = performance.now();
            for (let i = 0; i < EXECUTION_PART; i++) {
                let data = await User.findById(getRandomID(0,9999));
            }
            endTime = performance.now()
            let read_time = {
                time: (endTime - startTime),
                time_per_command: Math.round((endTime - startTime) / EXECUTION_PART),
                executions: EXECUTION_PART,
            }
            startTime = performance.now()
            for (let i = 0; i < EXECUTION_PART; i++) {
                let test = await User.find().sort([['firstname', 'asc'],['lastName', 'asc']]);
            }
            endTime = performance.now()
            let order_time = {
                time: (endTime - startTime),
                time_per_command: Math.round((endTime - startTime) / EXECUTION_PART),
                executions: EXECUTION_PART,
            }
            startTime = performance.now()
            for (let i = 0; i < EXECUTION_FULL; i++) {
                const res = await User.updateOne({ id: getRandomID(0,999) }, { firstname: 'TEST' });
            }
            endTime = performance.now()
            let update_time = {
                time: (endTime - startTime),
                time_per_command: Math.round((endTime - startTime) / EXECUTION_FULL),
                executions: EXECUTION_FULL,
            }
            startTime = performance.now()
            for (let i = 0; i < mongo_data.length; i++) {
                User.deleteOne({id: mongo_data[i].id})
            }
            endTime = performance.now()
            let delete_time = {
                time: (endTime - startTime),
                time_per_command: Math.round((endTime - startTime) / mongo_data.length),
                executions: EXECUTION_FULL,
            }

            array.push({
                insert_time,
                read_time,
                order_time,
                update_time,
                delete_time,
            })
            console.log(array.length);
            fs.writeFileSync('perf.json',JSON.stringify(array));
            mongoose.disconnect();
        });

    }catch (e) {
        console.log(e);
    }
}

main();

function getRandomID(min, max) {
    let i = Math.floor(Math.random() * (max - min) + min);
    if(i < mongo_data.length)
        return mongo_data[i].id;
}