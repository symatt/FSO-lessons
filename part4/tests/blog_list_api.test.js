const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});

	for (let blog of helper.initialBlogs) {
		let blogObject = new Blog(blog);
		await blogObject.save();
	}
});

test('blogs are returned as json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/);
}, 1000000);

test('all blogs are returned', async () => {
	const response = await api.get('/api/blogs');

	expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('a specific blog title is within the returned blogs', async () => {
	const response = await api.get('/api/blogs');

	const titles = response.body.map((r) => r.title);
	expect(titles).toContain('React patterns');
});

test('blogs have an id', async () => {
	const response = await api.get('/api/blogs');
	const ids = response.body.map((r) => r.id);
	expect(ids).toBeDefined();
});

test('a valid blog can be added', async () => {
	const newBlog = {
		title: 'newblog',
		author: 'newauthor',
		url: 'newblog.com',
		likes: 99999,
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

	const titles = blogsAtEnd.map((b) => b.title);
	expect(titles).toContain('React patterns');
});

test('a nwe blog with no likes shows 0 likes', async () => {
	const newBlog = {
		title: 'zero likes blog',
		author: 'newauthor',
		url: 'newblog.com',
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const blogsAtEnd = await helper.blogsInDb();
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
	const zeroLikesBlog = blogsAtEnd.filter((b) => b.title === 'zero likes blog');
	expect(zeroLikesBlog[0].likes).toEqual(0);
});

test('blog without title is not added', async () => {
	const newBlog = {
		author: 'newauthor',
		url: 'newblog.com',
		likes: 100,
	};

	await api.post('/api/blogs').send(newBlog).expect(400);

	const blogsAtEnd = await helper.blogsInDb();
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

test('blog without url is not added', async () => {
	const newBlog = {
		title: 'no url blog',
		author: 'newauthor',
		likes: 100,
	};

	await api.post('/api/blogs').send(newBlog).expect(400);

	const blogsAtEnd = await helper.blogsInDb();
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
});

afterAll(async () => {
	await mongoose.connection.close();
});
