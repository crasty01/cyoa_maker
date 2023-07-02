import type { CardInfo, FlagInfo, PointInfo, RowInfo, DataStore } from '$lib/stores/data';

const simplifyDataStore = (
	data: DataStore
): {
	cards: Array<CardInfo>;
	flags: Array<FlagInfo>;
	points: Array<PointInfo>;
	rows: Array<RowInfo>;
	rowsArray: Array<string>;
} => ({
	cards: [...data.cards.values()],
	flags: [...data.flags.values()],
	points: [...data.points.values()],
	rows: [...data.rows.values()],
	rowsArray: data.rowsArray
});

export const stringify = (data: DataStore): string =>
	JSON.stringify({
		...simplifyDataStore(data)
	});

export const parse = (text: string): DataStore => {
	const parsed = JSON.parse(text);
	return {
		cards: new Map(parsed.cards.map((card: CardInfo) => [card.id, card])),
		flags: new Map(parsed.flags.map((flag: FlagInfo) => [flag.id, flag])),
		points: new Map(parsed.points.map((point: PointInfo) => [point.id, point])),
		rows: new Map(parsed.rows.map((row: RowInfo) => [row.id, row])),
		images: parsed.images,
		rowsArray: parsed.rowsArray
	};
};

const hash = async (password: string, salt: string): Promise<string> => {
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		{ name: 'PBKDF2' },
		false,
		['deriveBits', 'deriveKey']
	);
	const bits = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			salt: encoder.encode(salt),
			iterations: 100000,
			hash: 'SHA-256'
		},
		key,
		256
	);
	return btoa(String.fromCharCode(...new Uint8Array(bits)));
};

export const sendDataToBackend = async (
	data: DataStore,
	name: string,
	password: string,
	isShared: boolean
) => {
	await fetch('/api/cyoa', {
		method: 'POST',
		body: JSON.stringify({
			data: simplifyDataStore(data),
			meta: {
				name,
				isShared,
				hash: await hash(password, name)
			}
		})
	});
};

export const getDataFromBackend = async (name: string, password: string): Promise<DataStore> => {
	const params = new URLSearchParams();
	const _hash = await hash(password, name);
	params.append('hash', _hash);

	console.log(name, _hash);

	const response = await fetch(`/api/cyoa/${name}?${params.toString()}`);
	if (response.ok) {
		return parse(await response.text());
	} else {
		throw new Error('Invalid name or key');
	}
};

export const getNamesFromBackend = async (
	last?: string
): Promise<{
	items: Array<{
		name: string;
		isShared: boolean;
		key: string;
	}>;
	last?: string;
	count: number;
}> => {
	const params = new URLSearchParams();
	if (last) {
		params.append('last', last);
	}

	const response = await fetch(`/api/cyoa/list?${params.toString()}`);
	if (response.ok) {
		const data = await response.json();
		console.log(data);
		return data;
	} else {
		throw new Error('Could not get names');
	}
};

export const uploadImagesToBackend = async (fileList: FileList): Promise<Array<string>> => {
	let idList: Array<string> = [];

	await Promise.all(
		Array.from(fileList).map(async (file) => {
			const formData = new FormData();
			formData.append('file', file);
			const res = await fetch(`/api/cyoa/upload`, {
				method: 'POST',
				body: formData
			});

			if (res.ok) {
				idList.push((await res.json())?.[0]);
			}
		})
	);

	return idList;
};

export const getImageDataFromBackend = async (imageId: string): Promise<string> => {
	const response = await fetch(`/api/image/${imageId}`);
	if (response.ok) {
		const blob = await response.blob();
		return URL.createObjectURL(blob);
	} else {
		throw new Error('Invalid image');
	}
};
