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

export const TorboxMylistDataSchema = z.array(
	z.object({
		id: z.number().int().positive(),
		name: z.string(),
		size: z.number().int().positive(),
		created_at: z.string(),
		download_finished: z.boolean(),
		cached: z.boolean(),
	}),
);

export const TorboxMylistSchema = z.object({
	success: z.boolean(),
	error: z.string().nullable(),
	detail: z.string(),
	data: TorboxMylistDataSchema,
});

export const TorBoxDownloadSchema = z.object({
	success: z.boolean(),
	error: z.string().nullable(),
	detail: z.string().optional(),
	data: z.string().optional(),
});
