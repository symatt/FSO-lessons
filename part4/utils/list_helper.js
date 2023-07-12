const lodash = require('lodash');

const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	const reducer = (sum, item) => sum + item.likes;

	return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
	const likesArray = blogs.map((blog) => blog.likes);
	const maxLikes = Math.max(...likesArray);

	const favorite = blogs.filter((blog) => blog.likes === maxLikes);
	console.log(favorite);

	return {
		title: favorite[0].title,
		author: favorite[0].author,
		likes: favorite[0].likes,
	};
};

const mostBlogs = (blogs) => {
	const authorsCount = lodash.countBy(blogs, 'author');
	// console.log('LODASH COUNT BY: ', authorsCount);
	const maxCount = Math.max(...lodash.map(authorsCount));
	// console.log('LODASH MAX COUNT: ', maxCount);
	const author = lodash.findKey(authorsCount, (blog) => blog === maxCount);
	// console.log(author);
	return {
		author: author,
		blogs: maxCount,
	};
};

// const mostLikes = (blogs) => {
// 	const authorsCount = lodash;
// 	console.log('LODASH COUNT BY LIKES: ', authorsCount);
// 	return {
// 		author: 'test',
// 		likes: 1,
// 	};
// };

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	// mostLikes,
};
