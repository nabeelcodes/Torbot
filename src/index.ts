import { Hono } from 'hono';
import { isMagnet, handleBotStart, sendMessage } from './controllers/telegramControllers';
import { createTorrent, fetchTorrentlist } from './controllers/torboxControllers';
import type { TelegramUpdate } from './types';

const app = new Hono();

app.get('/health', (context) => context.text('ok'));

app.post('/webhook', async (context) => {
	try {
		const update = (await context.req.json()) as TelegramUpdate;
		const msg = update.message;

		if (!msg) return context.json({ ok: true });

		const text = msg.text?.trim();
		const chatId = msg.chat.id;

		if (!text) {
			await sendMessage(chatId, 'I only process commands and magnet links.');
			return context.json({ ok: true });
		}

		if (text === '/start') {
			await handleBotStart(msg);
			return context.json({ ok: true });
		}

		if (text === '/stats') {
			try {
				const r = await fetchTorrentlist();
				if (!r.success) {
					await sendMessage(chatId, `Failed to fetch stats: ${r.detail || 'unknown'}`);
					return context.json({ ok: true });
				}
				const torrents = (r.data && (r.data.torrents || r.data)) || [];
				const count = Array.isArray(torrents) ? torrents.length : 0;
				const used = Array.isArray(torrents) ? torrents.reduce((acc: number, t: any) => acc + (t.total_bytes || t.size_bytes || 0), 0) : 0;
				const usedMB = (used / 1024 / 1024).toFixed(2);
				await sendMessage(chatId, `Torrents: ${count}\nUsed: ${usedMB} MB`);
			} catch (err: any) {
				await sendMessage(chatId, `Error fetching stats: ${err.message}`);
			}
			return context.json({ ok: true });
		}

		if (text.startsWith('/add ')) {
			const magnet = text.replace('/add', '').trim();

			if (!isMagnet(magnet)) {
				await sendMessage(chatId, 'Please provide a valid magnet link, e.g. /add magnet:?xt=urn:btih:...');
				return context.json({ ok: true });
			}

			await sendMessage(chatId, 'Adding torrent to TorBox... 🔁');

			try {
				const response = await createTorrent(magnet);
				if (response.success) {
					const id = (response.data && response.data.torrent_id) || undefined;
					await sendMessage(chatId, `Added ✅${id ? ` — ID: ${id}` : ''}`);
				} else {
					await sendMessage(chatId, `TorBox rejected it: ${response.detail || 'unknown'}`);
				}
			} catch (err: any) {
				await sendMessage(chatId, `Error adding torrent: ${err.message}`);
			}

			return context.json({ ok: true });
		}

		// fallback
		await sendMessage(chatId, 'Unrecognized command!');
		return context.json({ ok: true });
	} catch (err: any) {
		console.error(err);
		return context.json({ ok: false, error: err.message }, 500);
	}
});

export default app;
