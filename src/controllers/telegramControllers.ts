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
		parse_mode: 'Markdown',
	});
};

const handleBotStart = async (env: EnvBindings, message: TelegramMessage) => {
	try {
		const chatId = message.chat.id;
		if (!chatId) throw new Error('Chat ID missing!');
		const name = message.from?.first_name || 'there';
		await sendMessage(
			env,
			chatId,
			`
			Hey ${name}! Send me a magnet link.
			- Use /add for adding a torrent(magnet link).
			- Use /stats for a summary.
			`,
		);
	} catch (error) {
		console.error(error);
	}
};

export { callTelegramApi, sendMessage, handleBotStart, isMagnet };
