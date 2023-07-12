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

const mostLikes = (blogs) => {
	// const authorsCount = blogs.map((blog) => {
	// 	return { author: blog.author, likes: blog.likes };
	// });
	// console.log('LODASH COUNT BY LIKES: ', authorsCount);

	const authorsCount = lodash(blogs)
		.groupBy('author')
		.map((objs, key) => ({
			author: key,
			likes: lodash.sumBy(objs, 'likes'),
		}))
		.value();
	// console.log('LODASH COUNT BY AUTHOR: ', authorsCount);
	// console.log('mapping', lodash.map(authorsCount, 'likes'));
	const maxLikes = Math.max(...lodash.map(authorsCount, 'likes'));
	// console.log('LODASH MAX COUNT: ', maxLikes);
	const author = lodash.find(authorsCount, (a) => a.likes === maxLikes);
	// console.log(author);

	return {
		author: author.author,
		likes: author.likes,
	};
};

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
};
