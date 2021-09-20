const mongodb = require('mongodb');

const {
	MongoClient
} = mongodb;

const DEFAULT_DB = "test";
const URL = "mongodb://127.0.0.1:27017/";

/**
 * @description 查询
 * @method select
 * @param {string} [dbase = DEFAULT_DB] 数据库
 * @param {string} collection 集合
 * @param {object} query 查询条件
 */
const select = (dbase = DEFAULT_DB, collection, query = {}) => {
	return new Promise((resolve, reject) => {
		MongoClient
			.connect(URL + dbase)
			.then(db => {
				db.db(dbase)
					.collection(collection)
					.find(query).toArray()
					.then(data => {
						console.log(data);
						resolve(data);
						db.close();
					})
					.catch(err => reject(err));
			})
			.catch(err => reject(err));
	});
};

module.exports = {
	select,
}

// MongoClient.connect(URL + DEFAULT_DB, (err, db) => {
// 	if (err) {
// 		throw new Error(err);
// 	}
//
// 	console.log("---- db has been established! ----");
//
// 	// 选择数据库
// 	const dbase = db.db(DEFAULT_DB);

	// 创建集合
	// dbase.createCollection(newCollection, (err, res) => {
	// 	if (err) {
	// 		throw new Error(err);
	// 	}
	//
	// 	console.log(`---- collection ${newCollection} has been established! ----`);
	// });

	// dbase.collection(newCollection).insertOne(bookInfo, (err, res) => {
	// 	if (err) {
	// 		throw new Error(err);
	// 	}
	//
	// 	console.log("---- record has been inserted! ----");
	// 	db.close(); // 操作完一定要关闭
	// });

	// dbase.collection(newCollection).updateOne({
	// 	name: '圆月弯刀'
	// }, {
	// 	$set: {
	// 		cover: "https://www.gulongwang.com/skin/zuilive/images/yuan.jpg"
	// 	}
	// }, (err, res) => {
	// 	if (err) {
	// 		throw new Error(err);
	// 	}
	//
	// 	console.log("---- record has been updated! ----");
	// 	db.close();
	// });
// });

// {name: '多情剑客无情剑',author: '古龙',hero: '李寻欢',cover: 'https://www.gulongwang.com/skin/zuilive/images/duo.jpg',desc: '小李飞刀，例不虚发，出身书香世家的他被称为“小李探花”...'}
