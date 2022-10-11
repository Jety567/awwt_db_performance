const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const { performance } = require('perf_hooks');

const prisma = new PrismaClient()
let data = fs.readFileSync('../data/data.json').toString();
data = JSON.parse(data);

const test = async () => {
    let array = JSON.parse(fs.readFileSync('perf.json').toString());
    var startTime = performance.now()
    for (let i = 0; i < data.length;i++) {
        let user = data[i];
        const newUser = await prisma.post.create({
            data: user,
        })
    }
    var endTime = performance.now()
    let insert_time = Math.round((endTime - startTime) / data.length);
    startTime = performance.now()
    for (let i = 0; i < 100; i++) {
        const ret = await prisma.post.findMany({
            where: {
                id: getRandomArbitrary(2,999),
            }
        })
    }
    endTime = performance.now()
    let read_time = Math.round((endTime - startTime) / 100);
    startTime = performance.now()
    for (let i = 0; i < 100; i++) {
        const user = await prisma.post.findMany({
            orderBy: [
                {
                    firstname: 'desc',
                },
                {
                    lastName: 'desc',
                },
            ],
        })
    }
    endTime = performance.now()
    let order_time = Math.round((endTime - startTime) / 100);
    startTime = performance.now()
    for (let i = 0; i < 1000; i++) {
        const updateUser = await prisma.post.update({
            where: {
                id: getRandomArbitrary(10,900),
            },
            data: {
                firstname: 'TEST',
            },
        })
    }
    endTime = performance.now()
    let update_time = Math.round((endTime - startTime) / 1000);
    startTime = performance.now()
    for (let i = 1; i <= 1000; i++) {
        const deleteUser = await prisma.post.delete({
            where: {
                id: i,
            },
        })
    }
    endTime = performance.now()
    let delete_time = Math.round((endTime - startTime) / 1000);

    array.push({
        insert_time,
        read_time,
        order_time,
        update_time,
        delete_time,
    })
    console.log(array.length);
    fs.writeFileSync('perf.json',JSON.stringify(array));
    prisma.$queryRaw('TRUNCATE Post;');
}

test();

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}



