const PostService = require('../services/post');
const FileService = require('../services/file');
const AWSService = require('../services/aws');

const fs = require('fs');
const express = require('express');
const path = require('path');

const { isLoggedIn, isModerator } = require('./middleware/authentication');
const router = express.Router();
const { handle } = require('../utils/error-handling/request-handler');

const singleUpload = AWSService.single('file');

/**
 * @route GET api/posts/user
 * @desc fetch all posts linked to a user.
 * @access Public
 */
router.route('/user').get(isLoggedIn, async (req, res, next) => { 	
	
	await handle(async () => {

		const token = req.headers['authorization'];
	
		const { posts } = await PostService.getUserPosts(token);

		res.status(200).send({ posts });

		res.end();

	}, next);

});

/**
 * @route GET api/posts/blogPost/:id
 * @desc fetch single blog post.
 * @access Public
 */
router.route('/blogPost/:id').get(async (req, res, next) => { 	

	await handle(async () => {

		const { id } = req.params;
		
		const { post } = await PostService.getBlogPost(id);

		res.status(200).send({ post });

		res.end();

	}, next);

});

/**
 * @route GET api/posts/slug/:slug
 * @desc fetch single blog post using slug.
 * @access Public
 */
router.route('/slug/:slug').get(async (req, res, next) => { 	

	await handle(async () => {

		const { slug } = req.params;
		
		const { post } = await PostService.getBlogPostBySlug(slug);

		res.status(200).send({ post });

		res.end();

	}, next);

});

/**
 * @route GET api/posts/create
 * @desc Create new blog post.
 * @access Private
 */
router.route('/create').post(isLoggedIn, async (req, res, next) => {

	await handle(async () => {

		const token = req.headers['authorization'];
	
		let uploadStat = await singleUpload(req, res, async function (err) {

			if (err) {
				console.log(err);
				
				return false;
			}
			
			const postDTO = { ...req.body, ...req.file };
			
			const { post } = await PostService.create(postDTO, token);
			
			console.log({ ...postDTO , postId: post._id });
			
			await FileService.saveFile({ ...postDTO , postId: post._id });
			
			console.log('File upload success');
			
			return true;

		});
		
		console.log(uploadStat);

		res.status(200).send();
		
		res.end();

	}, next);

});

/**
 * @route GET api/posts/image/:id
 * @desc fetch blog post image.
 * @access Public
 */
router.route('/image/:id').get(async (req, res, next) => {

	await handle(async () => {

		const { id } = req.params;

		const { post } = await PostService.getPost(id);

		const fileDir = '../images/blog/' + post.user + '/' + post.fileName;
		
		res.sendFile(path.join(__dirname, fileDir));

	}, next);

});

/**
 * @route GET api/posts/publishedBlogs
 * @desc fetch all published blog posts.
 * @access Public
 */
router.route('/publishedBlogs').get(async (req, res, next) => {

	await handle(async () => {
		
		const { posts } = await PostService.getPublishedBlogPosts();

		res.status(200).send({ posts });

		res.end();

	}, next);
	
});

/**
 * @route GET api/posts/post:id
 * @desc fetch single blog post.
 * @access Private
 */
router.route('/post/:id').get(isLoggedIn, async (req, res, next) => {
	
	await handle(async () => {

		const { id } = req.params;
		
		const { code, message, post } = await PostService.getPost(id);

		res.status(200).send({ code, message, post });

		res.end();

	}, next);
	
});

/**
 * @route PUT api/posts/update:id
 * @desc Update blog post.
 * @access Private
 */
// router.route('/update/:id').put(isLoggedIn, fileUpload.single('file'), async (req, res, next) => {
	
// 	await handle(async () => {

// 		const { id } = req.params;
		
// 		await PostService.update(id, req.body);
		
// 		res.end();

// 	}, next);

// });

/**
 * @route DELETE api/posts/delete:id
 * @desc Remove blog post.
 * @access Private
 */
router.route('/delete/:id').delete(isLoggedIn, async (req, res, next) => {

	await handle(async () => {

		const { id } = req.params;
	
		const { post } = await PostService.delete(id);
		
		await PostService.removeUserPostFile(post);
		
		res.end();

	}, next);

});

/**
 * @route POST api/posts/unique
 * @desc Check if the Slug is unique.
 * @access Private
 */
router.route('/unique').post(isLoggedIn, async (req, res, next) => {

	await handle(async () => {
		
		const { newSlug } = await PostService.unique(req.body);

		res.status(200).send({ newSlug });

		res.end();

	}, next);

});

/**
 * @route PUT api/posts/review
 * @desc update post review status.
 * @access Private
 */
router.route('/review').put(isLoggedIn, isModerator, async (req, res, next) => {
	
	await handle(async () => {

		await PostService.updateReview(req.body);
		
		res.end();

	}, next);

});

/**
 * @route GET api/posts/postsReview
 * @desc get all posts for moderator to review.
 * @access Private
 */
router.route('/postsReview').get(isLoggedIn, isModerator, async (req, res, next) => {
	
	await handle(async () => {

		const { posts } = await PostService.getPostsforReview();
		
		res.status(200).send({ posts });

		res.end();

	}, next);

});

/**
 * @route GET api/posts/reviewBlogPostSlug/:slug
 * @desc fetch single review blog post using slug.
 * @access private
 */
router.route('/reviewBlogPostSlug/:slug').get(isLoggedIn, isModerator, async (req, res, next) => { 	

	await handle(async () => {

		const { slug } = req.params;
		
		const { post } = await PostService.getReviewBlogPostBySlug(slug);
		
		res.status(200).send({ post });

		res.end();

	}, next);

});

module.exports = router;