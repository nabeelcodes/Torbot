import { Hono } from 'hono';
import { isMagnet, handleBotStart, sendMessage } from './controllers/telegramControllers';
import { createTorrent, fetchTorrentlist } from './controllers/torboxControllers';
import type { EnvBindings, TelegramUpdate } from './types';

const app = new Hono<{ Bindings: EnvBindings }>();

app.get('/health', (context) => context.text('ok'));

app.post('/webhook', async (context) => {
	const env = context.env;

	try {
		const update = (await context.req.json()) as TelegramUpdate;
		const msg = update.message;

		if (!msg) return context.json({ ok: true });

		const text = msg.text?.trim();
		const chatId = msg.chat.id;

		if (!text) {
			await sendMessage(env, chatId, 'I only process commands and magnet links.');
			return context.json({ ok: true });
		}

		if (text === '/start') {
			await handleBotStart(env, msg);
			return context.json({ ok: true });
		}

		if (text === '/stats') {
			try {
				const response = await fetchTorrentlist(env);

				if (!response.success) {
					await sendMessage(env, chatId, `Failed to fetch stats: ${response.detail || 'unknown'}`);
					return context.json({ ok: true });
				}

				const torrents = (response.data && response.data) || [];
				const count = torrents.length;

				await sendMessage(env, chatId, `Total Torrents: ${count}`);
			} catch (err: any) {
				await sendMessage(env, chatId, `Error fetching stats: ${err.message}`);
			}
			return context.json({ ok: true });
		}

		if (text.startsWith('/add ')) {
			const magnet = text.replace('/add', '').trim();

			if (!isMagnet(magnet)) {
				await sendMessage(env, chatId, 'Please provide a valid magnet link, e.g. /add magnet:?xt=urn:btih:...');
				return context.json({ ok: true });
			}

			await sendMessage(env, chatId, 'Adding torrent to TorBox... 🔁');

			try {
				const response = await createTorrent(env, magnet);
				if (response.success) {
					const id = (response.data && response.data.torrent_id) || undefined;
					await sendMessage(env, chatId, `Added ✅${id ? ` — ID: ${id}` : ''}`);
				} else {
					await sendMessage(env, chatId, `TorBox rejected it: ${response.detail || 'unknown'}`);
				}
			} catch (err: any) {
				await sendMessage(env, chatId, `Error adding torrent: ${err.message}`);
			}

			return context.json({ ok: true });
		}

		// fallback
		await sendMessage(env, chatId, 'Unrecognized command!');
		return context.json({ ok: true });
	} catch (err: any) {
		console.error(err);
		return context.json({ ok: false, error: err.message }, 500);
	}
});

export default app;
