import { z } from 'zod';

export const TorboxDataSchema = z.object({
	hash: z.string(),
	torrent_id: z.number().int().positive(),
	auth_id: z.uuid(),
});

export const TorboxCreateSchema = z.object({
	success: z.boolean(),
	error: z.string().nullable(),
	detail: z.string().optional(),
	data: TorboxDataSchema.optional(),
	message: z.string().optional(),
	download_url: z.string().optional(),
});

export const TorboxMylistSchema = z.object({
	success: z.boolean(),
	error: z.string().nullable(),
	detail: z.string(),
	data: z.array(
		z.object({
			id: z.number().int(),
			auth_id: z.string(),
			server: z.number().int(),
			hash: z.string(),
			name: z.string(),
			magnet: z.string().nullable(),
			size: z.number(),
			active: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			download_state: z.string(),
			seeds: z.number(),
			peers: z.number(),
			ratio: z.number(),
			progress: z.number(),
			download_speed: z.number(),
			upload_speed: z.number(),
			eta: z.number(),
			torrent_file: z.boolean(),
			expires_at: z.string().nullable(),
			download_present: z.boolean(),
			files: z.array(
				z.object({
					id: z.number().int(),
					md5: z.string().nullable(),
					hash: z.string(),
					name: z.string(),
					size: z.number(),
					zipped: z.boolean(),
					s3_path: z.string(),
					infected: z.boolean(),
					mimetype: z.string(),
					short_name: z.string(),
					absolute_path: z.string(),
					opensubtitles_hash: z.string().nullable(),
				}),
			),
			download_path: z.string(),
			availability: z.number(),
			download_finished: z.boolean(),
			tracker: z.string().nullable(),
			total_uploaded: z.number(),
			total_downloaded: z.number(),
			cached: z.boolean(),
			owner: z.string(),
			seed_torrent: z.boolean(),
			allow_zipped: z.boolean(),
			long_term_seeding: z.boolean(),
			tracker_message: z.string().nullable(),
			cached_at: z.string().nullable(),
			private: z.boolean(),
		}),
	),
});

export const TorBoxDownloadSchema = z.object({
	success: z.boolean(),
	error: z.string().nullable(),
	detail: z.string().optional(),
	data: z.string().optional(),
});
