require("dotenv").config();

/*
	DATABASE_URL is received from Heroku and it has format as shown below:
	postgres://DATABASE_USER:DATABASE_PASSWORD@DATABASE_HOST/DATABASE_NAME
	In order to extract this data we need to match it against regex patterns.
*/
const DB_USER = process.env.DATABASE_URL.match(/\/\/\w+:/)[0].slice(2, -1);
const DB_PASSWORD = process.env.DATABASE_URL.match(/:\w+@/)[0].slice(1, -1);
// After match with the URL, we also need to get rid of the port part
const DB_HOST = process.env.DATABASE_URL.match(/@[\w+._-]+:\d{1,4}\//)[0]
	.slice(1, -1)
	.split(":")[0];
const DB_NAME = process.env.DATABASE_URL.match(/\b\/\w+\b/)[0].slice(1);

module.exports = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		dialect: "postgres",
	},
	staging: {
		username: DB_USER,
		password: DB_PASSWORD,
		database: DB_NAME,
		host: DB_HOST,
		dialect: "postgres",
		dialectOptions: {
			ssl: { rejectUnauthorized: false },
		},
	},
	production: {
		username: DB_USER,
		password: DB_PASSWORD,
		database: DB_NAME,
		host: DB_HOST,
		dialect: "postgres",
		dialectOptions: {
			ssl: { rejectUnauthorized: false },
		},
	},
};
