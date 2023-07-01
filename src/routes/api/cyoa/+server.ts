import { json } from '@sveltejs/kit';
import { cyoaDatabase, cyoaDrive } from '$lib/services/database';

export async function POST(event) {
	const body = await event.request.json();

	const cyoa = body.data;
	const filename = crypto.randomUUID();

	console.log(filename, cyoa);

	await cyoaDrive.put(filename, {
		data: JSON.stringify(cyoa),
		contentType: 'application/json'
	});

	await cyoaDatabase.put({
		name: body.meta.name,
		hash: body.meta.hash,
		isShared: body.meta.isShared,
		file: filename
	});

	// it's common to return JSON, so SvelteKit has a helper
	return json({ success: true });
}
