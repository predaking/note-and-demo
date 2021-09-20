import axios from 'axios';

const get = (url, params) => {
	return new Promise((resolve, reject) => {
		axios.get(url, {
			params
		}).then(({
			data
		}) => resolve(data)).catch(err => reject(err));
	});
};

export default {
	get,
};
