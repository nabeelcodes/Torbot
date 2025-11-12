import type { TelegramMessage, TelegramQueryBody, EnvBindings } from '../types';

const isMagnet = (text?: string) => {
	if (!text) return false;
	const magnetRegex = /magnet:\?xt=urn:btih:[a-zA-Z0-9]{10,}/i;
	return magnetRegex.test(text);
};

const callTelegramApi = async (env: EnvBindings, telegramMethod: string, body: TelegramQueryBody) => {
	const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${telegramMethod}`;
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	return res.json();
};

const sendMessage = async (env: EnvBindings, chatId: number, text: string) => {
	return callTelegramApi(env, 'sendMessage', {
		chat_id: chatId,
		text,
	});
};

const handleBotStart = async (env: EnvBindings, message: TelegramMessage) => {
	try {
		const chatId = message.chat.id;
		if (!chatId) throw new Error('Chat ID missing!');
		const name = message.from?.first_name || 'there';
		return await sendMessage(env, chatId, `Hey ${name}! Welcome to TorBot! Use /help to see available commands.`);
	} catch (error) {
		console.error(error);
	}
};

const handleBotHelp = async (env: EnvBindings, message: TelegramMessage) => {
	try {
		const chatId = message.chat.id;
		if (!chatId) throw new Error('Chat ID missing!');
		return await sendMessage(
			env,
			chatId,
			`Available commands:\n- /add <magnet_link> - Add new torrent.\n- /stats - Get a summary of available torrents.`,
		);
	} catch (error) {
		console.error(error);
	}
};

export { isMagnet, callTelegramApi, sendMessage, handleBotStart, handleBotHelp };
