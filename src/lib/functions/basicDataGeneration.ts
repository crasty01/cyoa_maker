import {
	dataStore,
	type CardInfo,
	type PointInfo,
	type RowInfo,
	type FlagInfo,
	type Condition,
	type CardCondition,
	type StaticCondition,
	type PointCondition,
	type EvaluationType,
	type DataStore
} from '$lib/stores/data';
import { get } from 'svelte/store';
import {
	defaultBasicCardOptions,
	defaultBasicFlagOptions,
	defaultBasicPointOptions,
	defaultBasicRowOptions
} from './defaultDatagenerationOptions';

export const createAndSaveBasicRow = (options?: Partial<RowInfo>): RowInfo => {
	const _dataStore = get(dataStore);

	const row: RowInfo = {
		...defaultBasicRowOptions(_dataStore),
		...options
	};

	if (_dataStore.rows.find((r) => r.id === row.id))
		throw new Error(`row id ${row.id} already exists`);

	dataStore.update((store) => {
		store.rows.push(row);
		return store;
	});

	return row;
};

export const createAndSaveBasicCard = (
	rowIndex: number,
	options?: Partial<Omit<CardInfo, 'rowIndex'>>
): CardInfo => {
	const _dataStore = get(dataStore);

	const card: CardInfo = {
		...defaultBasicCardOptions(rowIndex, _dataStore),
		...options
	};

	if (_dataStore.cards.has(card.id)) throw new Error(`card id ${card.id} already exists`);

	dataStore.update((store) => {
		store.cards.set(card.id, card);
		return store;
	});

	return card;
};

export const createAndSaveBasicPoint = (options?: Partial<PointInfo>): PointInfo => {
	const _dataStore = get(dataStore);

	const point: Omit<PointInfo, 'value'> = {
		...defaultBasicPointOptions(_dataStore),
		...options
	};

	if (_dataStore.points.has(point.id)) throw new Error(`point id ${point.id} already exists`);

	dataStore.update((store) => {
		store.points.set(point.id, point);
		return store;
	});

	return point;
};

/**
 * Creates a basic flag with the given parameters.
 * If no parameters are given, the flag will be created with default values.
 * The flag will be added to the data store.
 * @param param0 the parameters to create the flag with
 * @param param0.name the name of the flag
 * @param param0.conditions the conditions of the flag
 * @param param0.type the type of the flag
 * @param param0.id the id of the flag (will be generated if not given)
 * @returns the created flag
 */
export const createAndSaveBasicFlag = (options?: Partial<FlagInfo>): FlagInfo => {
	const _dataStore = get(dataStore);

	const flag: FlagInfo = {
		...defaultBasicFlagOptions(_dataStore),
		...options
	};

	if (_dataStore.flags.has(flag.id)) throw new Error(`flag id ${flag.id} already exists`);

	dataStore.update((store) => {
		store.flags.set(flag.id, flag);
		return store;
	});

	return flag;
};

export const createBasicStaticCondition = ({ value = false } = {}): StaticCondition => {
	const condition: StaticCondition = {
		condition_type: 'static_condition',
		value
	};

	return condition;
};

export const createBasicCardCondition = (
	cardId: string,
	{ type = 'equal' as EvaluationType, value = 0 } = {}
): CardCondition => {
	const condition: CardCondition = {
		condition_type: 'card_condition',
		cardId,
		type,
		value
	};

	return condition;
};

export const createBasicPointCondition = (
	pointId: string,
	{ type = 'equal' as EvaluationType, value = 0 } = {}
): PointCondition => {
	const condition: PointCondition = {
		condition_type: 'point_condition',
		pointId,
		type,
		value
	};

	return condition;
};

export const getPointValue = (point: PointInfo): number => {
	let v = point.starting;
	const cards = get(dataStore).cards;
	for (const [_, card] of cards) {
		if (card.pointId !== point.id) continue;
		v += card.selected * card.price;
	}
	console.log('getPointValue', point.id, v);
	return v;
};

const evaluateCondition = (
	evaluatingValue: number,
	type: EvaluationType,
	evaluatorValue: number
): boolean => {
	switch (type) {
		case 'equal':
			return evaluatingValue === evaluatorValue;
		case 'greater':
			return evaluatingValue > evaluatorValue;
		case 'greater_or_equal':
			return evaluatingValue >= evaluatorValue;
		case 'less':
			return evaluatingValue < evaluatorValue;
		case 'less_or_equal':
			return evaluatingValue <= evaluatorValue;
		default:
			console.error('unknown evaluation type', type);
			return false;
	}
};

export const getConditionValue = (condition: Condition): boolean => {
	const _dataStore = get(dataStore);

	switch (condition.condition_type) {
		case 'card_condition':
			const card = _dataStore.cards.get(condition.cardId);
			if (!card) {
				console.warn('card not found', condition.cardId);
				return false;
			}
			return evaluateCondition(card.selected, condition.type, condition.value);
		case 'point_condition':
			const point = _dataStore.points.get(condition.pointId);
			if (!point) {
				console.warn('point not found', condition.pointId);
				return false;
			}
			return evaluateCondition(getPointValue(point), condition.type, condition.value);
		case 'static_condition':
			return condition.value;
		default:
			console.error('unknown condition type', condition);
			return false;
	}
};

export const getFlagValue = (flag: FlagInfo): boolean => {
	const values = flag.conditions.map(getConditionValue);

	switch (flag.type) {
		case 'AND':
			return values.every((v) => v);
		case 'OR':
			return values.some((v) => v);
		case 'NOT':
			return !values[0];
		default:
			console.error('unknown flag type', flag);
			return false;
	}
};
