import { json } from '@sveltejs/kit';
import { cyoaImages } from '$lib/services/database';

export async function POST(event) {
	const body = await event.request.formData();

	const files = body.getAll('file') as Array<File>;

	const response = await Promise.all(
		files.map(async (file) => {
			const extension = file.type.split('/')?.[1];
			const fileName = `${crypto.randomUUID()}${extension ? `.${extension}` : ''}`;
			const arrayBuffer = await file.arrayBuffer();

			return await cyoaImages.put(fileName, {
				data: new Uint8Array(arrayBuffer),
				contentType: file.type
			});
		})
	);

	// it's common to return JSON, so SvelteKit has a helper
	return json(response);
}
