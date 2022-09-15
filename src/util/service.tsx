import axios from 'axios';

const get = (url: string, params?: object) => {
	return new Promise((resolve, reject) => {
		axios
			.get(url, {
				params
			})
			.then(res => {
				if (res.status === 200) {
					resolve(res.data);
				}
			})
			.catch(err => reject(err));
	});
};

const post = (url: string, params: object) => {
	return new Promise((resolve, reject) => {
		axios.post(url, {
			params
		}).then(({
			data
		}) => resolve(data)).catch(err => reject(err));
	});
};

export default {
	get,
	post
};
