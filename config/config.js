require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  staging: {
    username: 'nneoczyuzbblhf',
    password:
      'd6206dae8b36cdd0bd9cefb615133b829531266ac795018ff4830de602bd6561',
    database: 'dbuacvoisghlgq',
    host: 'ec2-3-230-38-145.compute-1.amazonaws.com',
    dialect: 'postgres',
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  },
  production: {
    username: 'nneoczyuzbblhf',
    password:
      'd6206dae8b36cdd0bd9cefb615133b829531266ac795018ff4830de602bd6561',
    database: 'dbuacvoisghlgq',
    host: 'ec2-3-230-38-145.compute-1.amazonaws.com',
    dialect: 'postgres',
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
  },
};
