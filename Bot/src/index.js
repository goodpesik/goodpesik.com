const TeleBot = require('../');
const fs = require('fs');
const http = require("https");
const DataURI = require('datauri');
const jsonfile = require('jsonfile');
const dataFile = '../../data.json'
const bot = new TeleBot({
	token: '675420770:AAHOuQj7jMzVg_WLfCGNoilnanI07aQDbtw',
	usePlugins: ['namedButtons', 'commandButton', 'askUser']
});

const admin = 116128752;

let postList = [];
let removePost = false;

let post = {}

// Init Function
bot.start();

// Telebot functions

bot.on('/start', msg => {
	if (msg.from.id !== admin) {
		return;
	}

	post = {};
	
	replyMarkup = bot.inlineKeyboard([
		[bot.inlineButton('New Post', {callback: '/newpost'})],
		[bot.inlineButton('Remove Post', {callback: '/removepost'})],
		[bot.inlineButton('Edit Post', {callback: '/editpost'})]
	]);

	getPostsList().then(function(){
		return bot.sendMessage(msg.from.id, 'Please select...', {replyMarkup});
	});
});

bot.on('/newpost', msg => {
	return bot.sendMessage(msg.from.id, 'Send post Title', {ask: 'title'});
});

bot.on('ask.title', msg => {
	if(!msg.text.length) {
		return bot.sendMessage(msg.from.id, 'Send post Title', {ask: 'title'});
	} else {
		post.title = msg.text;
		return bot.sendMessage(msg.from.id, 'Send photo for post', {ask: 'photo'});
	}
});

bot.on('ask.photo', msg => {
	if(msg.photo) {
		bot.getFile(msg.photo[msg.photo.length-1].file_id).then(function(data) {
			parseImage(data.fileLink).then(function(data) {
				post.photo = data;
			});
		});
	}

	return bot.sendMessage(msg.from.id, 'Send post description', {ask: 'description'});
});


bot.on('ask.description', msg => {
	replyMarkup = bot.inlineKeyboard([
		[bot.inlineButton('Public post?', {callback: '/public'})]
	]);

	if(!msg.text.length) {
		return bot.sendMessage(msg.from.id, 'Send post description', {ask: 'description'});
	} else {
		post.description = msg.text;
		return bot.sendMessage(msg.from.id, 'Public post?', {replyMarkup});
	}
});

bot.on('/public', msg => {
	post.date = new Date(msg.message.date*1000);
	post.id = parseFloat(msg.id);
	replyMarkup = bot.inlineKeyboard([
		[bot.inlineButton('Post again?', {callback: '/start'})]
	]);

	publicPost().then(function(){
		bot.sendMessage(msg.from.id, 'Post successfully uploaded!!!', {replyMarkup});
	});
});

/// Remove Post

bot.on('/removepost', msg => {
	let posts = [];
	let replyMarkup;
	
	postList.forEach(function(item) {
		posts.push([bot.button('postSelect', item.title)]);
	});
	
	replyMarkup = bot.keyboard(posts, {resize: true})
	removePost = true;
	bot.sendMessage(msg.from.id, 'Please select post', {replyMarkup});
});

bot.on('text', msg => {
	if(removePost) {
		postList = postList.filter(post => post.title !== msg.text);
		
		let replyMarkup = bot.keyboard([
			[bot.button('start', '/start')]	
		], {resize: true})
		publicPost().then(function(){
			bot.sendMessage(msg.from.id, 'Post successfully removed!!!', {replyMarkup});
		});
		removePost = false;
	}
});

function getPostsList() {
	return new Promise(function(resolve, reject) {
		jsonfile.readFile(dataFile, function(err, obj) {
			if(err) {
				reject();
			} else {
				postList = obj;
				resolve();
			}
		});
	});
}

function publicPost() {
	if(post.id) {
		postList.push(post);
	}
	
	return new Promise(function(resolve, reject) {
		jsonfile.writeFile(dataFile, postList, function (err) {
			if (err) {
				reject();
			} else {
				resolve();
			}
		});
	});
}

function parseImage(fileLink) {
	const filePath = "photo.jpg";
	const file = fs.createWriteStream(filePath);

	function writeImage() {
		return new Promise(function(resolve, reject) {
			http.get(fileLink, response => {
				response.pipe(file);
				file.on("finish", () => { resolve(); });
			});
		});
	}

	function convertImage() {
		return new Promise(function(resolve,reject) {
			const datauri = new DataURI(filePath);
			resolve(datauri.content);
		});
	}

	return new Promise(function(resolve,reject) {
		return writeImage().then(function(){
			return convertImage().then(function(data){
				resolve(data);
			})
		})
	});
}

