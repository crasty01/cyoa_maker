import type { CardInfo, DataStore, FlagInfo, PointInfo, RowInfo } from '$lib/stores/data';

const defaultBasicCardOptionsShared = () => ({
	price: 0,
	max_stack: 1,
	show_price: true,
	pointId: undefined
	// flagId: 'DEFAULT'
});

export const defaultBasicCardOptions = (rowIndex: number, dataStore: DataStore): CardInfo => ({
	id: crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
	name: 'New Card',
	description: 'a blank card',
	selected: 0,
	rowIndex,
	...{
		...defaultBasicCardOptionsShared(),
		...dataStore.rows[rowIndex].cardDefault
	}
});

export const defaultBasicRowOptions = (dataStore: DataStore): RowInfo => ({
	id: crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
	name: `Row_${(dataStore.rows.length + 1).toFixed(0).padStart(2, '0')}`,
	description: 'a blank row',
	cards: [],
	flags: [],
	cardDefault: defaultBasicCardOptionsShared()
	// flagId: 'DEFAULT'
});

export const defaultBasicPointOptions = (dataStore: DataStore): PointInfo => ({
	id: crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
	name: `point_${(dataStore.points.size + 1).toFixed(0).padStart(2, '0')}`,
	starting: 0,
	min: -Number.MAX_SAFE_INTEGER,
	max: Number.MAX_SAFE_INTEGER,
	visible: true
});

export const defaultBasicFlagOptions = (dataStore: DataStore): FlagInfo => ({
	id: crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
	name: 'New Flag',
	conditions: [],
	type: 'AND'
});
