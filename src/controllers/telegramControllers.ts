import type { TelegramMessage, TelegramQueryBody } from '../types';

const TELEGRAM_BOT_TOKEN = (() => {
	try {
		const token = process.env.TELEGRAM_BOT_TOKEN;
		if (!token) throw new Error('env var missing: TELEGRAM_BOT_TOKEN');
		return token;
	} catch (error) {
		console.error(error);
	}
})();

const isMagnet = (text?: string) => {
	if (!text) return false;
	const magnetRegex = /magnet:\?xt=urn:btih:[a-zA-Z0-9]{10,}/i;
	return magnetRegex.test(text);
};

const callTelegramApi = async (telegramMethod: string, body: TelegramQueryBody) => {
	const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${telegramMethod}`;
	const res = await fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	return res.json();
};

const sendMessage = async (chatId: number, text: string) => {
	return callTelegramApi('sendMessage', {
		chat_id: chatId,
		text,
		parse_mode: 'Markdown',
	});
};

const handleBotStart = async (message: TelegramMessage) => {
	try {
		const chatId = message.chat.id;
		if (!chatId) throw new Error('Chat ID missing!');
		const name = message.from?.first_name || 'there';
		await sendMessage(chatId, `Hey ${name}! Send me a magnet link. Use /stats for a summary.`);
	} catch (error) {
		console.error(error);
	}
};

export { callTelegramApi, sendMessage, handleBotStart, isMagnet };
