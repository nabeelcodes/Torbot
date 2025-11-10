import type { TorboxCreateResponse, TorboxTorrentlistResponse } from '../types';
import { TorboxCreateSchema, TorboxMylistSchema } from '../validators';

const TORBOX_BASE_URL = process.env.TORBOX_API_BASE_URL || 'https://api.torbox.app/v1';

const TORBOX_KEY = (() => {
	try {
		const key = process.env.TORBOX_API_KEY;
		if (!key) throw new Error('env var missing: TORBOX_API_KEY');
		return key;
	} catch (error) {
		console.error(error);
	}
})();

const createTorrent = async (magnet: string): Promise<TorboxCreateResponse> => {
	try {
		const form = new FormData();
		form.append('magnet', magnet);
		const responseFromTorbox = await fetch(`${TORBOX_BASE_URL}/api/torrents/createtorrent`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${TORBOX_KEY}` },
			body: form as unknown as BodyInit,
		});
		const jsonData = await responseFromTorbox.json();
		const parsedData = TorboxCreateSchema.parse(jsonData);
		if (!parsedData.success && parsedData.error) throw new Error(parsedData.error);
		return parsedData;
	} catch (error) {
		console.error(error);
		return {
			success: false,
			error: 'Failed! Torrent not added.',
		};
	}
};

const fetchTorrentlist = async (): Promise<TorboxTorrentlistResponse> => {
	const res = await fetch(`${TORBOX_BASE_URL}/api/torrents/mylist`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${TORBOX_KEY}` },
	});
	const json = await res.json();
	const parsed = TorboxMylistSchema.parse(json);
	return parsed;
};

export { createTorrent, fetchTorrentlist };
