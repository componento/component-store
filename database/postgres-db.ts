import { createConnection } from 'typeorm';

export const postgresDB = async () => {
    return await createConnection({
        type     : 'postgres',
        host     : 'localhost',
        port     :  5432,
        username : 'zawar',
        password : 'zawar123',
        database : 'component_test',
        ssl: true,
        logging: ['query', 'error'],
        synchronize: true,
    }).then((connection) => {
        console.log('Database connection established');

    });
};