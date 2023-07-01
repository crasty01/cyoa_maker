import { derived, writable, type Readable, get } from 'svelte/store';

export type PointInfo = {
	id: string;
	name: string;
	starting: number;
	min: number;
	max: number;
	visible: boolean;
};

export type CardInfo = {
	id: string;
	name: string;
	description: string;
	price: number;
	show_price: boolean;
	pointId?: string;
	selected: number;
	max_stack: number;
	rowId: string;
	flagId?: string;
};

export type RowInfo = {
	id: string;
	name: string;
	description: string;
	cards: Array<string>; // just for ordering
	flags: Array<string>;
	cardDefault: Pick<CardInfo, 'max_stack' | 'pointId' | 'price' | 'show_price' | 'flagId'>;
	flagId?: string;
};

export const evaluationTypes = [
	'equal',
	'greater',
	'greater_or_equal',
	'less',
	'less_or_equal'
] as const;
export type EvaluationType = (typeof evaluationTypes)[number];

export type PointCondition = {
	condition_type: 'point_condition';
	pointId: string;
	type: EvaluationType;
	value: number;
};

export type CardCondition = {
	condition_type: 'card_condition';
	cardId: string;
	type: EvaluationType;
	value: number;
};

export type StaticCondition = {
	condition_type: 'static_condition';
	value: boolean;
};

export type Condition = PointCondition | CardCondition | StaticCondition;

export type FlagInfo = {
	id: string;
	name: string;
	conditions: Array<Condition>;
	type: 'AND' | 'OR' | 'NOT';
};

export type DataStore = {
	isBeingEdited: boolean;
	points: Map<string, PointInfo>;
	flags: Map<string, FlagInfo>;
	cards: Map<string, CardInfo>;
	rows: Map<string, RowInfo>;
	rowsArray: Array<string>; // just for ordering

	// TODO: Add styles/calsses
};

const createDefaultDataStore = (): DataStore => ({
	isBeingEdited: true,
	points: new Map<string, PointInfo>(),
	flags: new Map<string, FlagInfo>(),
	cards: new Map<string, CardInfo>(),
	rows: new Map<string, RowInfo>(),
	rowsArray: []
});

export const dataStore = writable<DataStore>(createDefaultDataStore());

export const clearDataStore = () => {
	dataStore.set(createDefaultDataStore());
};