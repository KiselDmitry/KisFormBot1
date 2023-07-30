const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');

const token = '6408194386:AAGtySHB10Adu1aQTQocPOug0w1HF-8MsAE';

const bot = new TelegramApi(token, { polling: true });

const chats = {};



const startGame = async (chatId) => {
	await bot.sendMessage(chatId, `Я сейчас загадаю число от 0 до 9 , а ты должен его отгадать`);
	const randomNumber = Math.floor(Math.random() * 10);
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
	bot.setMyCommands([
		{ command: '/start', description: 'начальное приветсвие' },
		{ command: '/info', description: 'Получить информацию о пользователе' },
		{ command: '/game', description: 'Игра угадай цифру' }
	])

	bot.on('message', async msg => {
		const text = msg.text;
		const chatId = msg.chat.id;

		if (text === '/start') {
			await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/67e/60c/67e60c3e-98b9-3cf5-8338-1c71364df6d2/11.webp');
			return bot.sendMessage(chatId, `Добро пожаловать в телеграмм бот kisForm`);
		}
		if (text === '/info') {
			return bot.sendMessage(chatId, `Тебя зовут ${msg.chat.first_name} ${msg.chat.last_name}`);
		}
		if (text === '/game') {
			return startGame(chatId);
		}
		return bot.sendMessage(chatId, `Я тебя не понимаю попробуй еще раз!`);
	});

	bot.on('callback_query', async msg => {
		const data = msg.data;
		const chatId = msg.message.chat.id;
		if (data === '/again') {
			return startGame(chatId);
		}
		if (data === chats[chatId]) {
			return await bot.sendMessage(chatId, `Ух ты , да ты везунчик! Ты угадал цыфрау${data}`, againOptions);
		} else {
			return await bot.sendMessage(chatId, `Ты не везунчик! Ты неугадал! Я загадал ${chats[chatId]} !!!`, againOptions);
		}
		// bot.sendMessage(chatId, `Ты выбрал цифру ${data}`)
		// console.log(msg);
	})
};

start();