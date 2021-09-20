const {
	select
} = require('../modal/db.js');

const DEFAULT_DB = 'test';
const DEFAULT_COLLECTION = 'book';

const find = (dbase = DEFAULT_DB, collection = DEFAULT_COLLECTION, query) => {
	return new Promise((resolve, reject) => {
		select(dbase, collection).then(res => resolve(res)).catch(err => reject(err));
	});
}

module.exports = {
	find
};
