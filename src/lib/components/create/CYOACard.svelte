<script lang="ts">
	// import { type CardInfo, dataStore } from '$lib/stores/data';
	import { modalStore, popup } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import { dataStore, type CardInfo } from '$lib/stores/data';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import CYOACardEdit from './CYOACardEdit.svelte';
	import { getFlagValue, getPointValue } from '$lib/functions/basicDataGeneration';

	export let card: CardInfo;

	$: popupId = `popup-${card.id}`;
	$: popupFeatured = {
		event: 'click',
		target: popupId,
		placement: 'left'
	} as PopupSettings;
	$: connectedflagValue = card.flagId ? getFlagValue($dataStore.flags.get(card.flagId)!) : true;
	$: parentRowFlagId = $dataStore.rows.get(card.rowId)!.flagId;
	$: connectedflagValueRow = parentRowFlagId
		? getFlagValue($dataStore.flags.get(parentRowFlagId)!)
		: true;

	const selectCard = (toAdd?: -1 | 1) => {
		// if (!card?.pointId) return;

		let oldSelected = card.selected;
		if (toAdd) {
			card.selected = Math.min(card.max_stack, Math.max(0, card.selected + toAdd));
		} else {
			card.selected = card.selected === 0 ? 1 : 0;
		}

		// if new point value is lower than min and higher than max, revert to old value
		if (card.pointId) {
			const point = $dataStore.points.get(card.pointId)!;
			const value = getPointValue(point);
			console.log('value:', value);
			if (value < point.min || value > point.max) {
				card.selected = oldSelected;
			}
		}

		$dataStore = $dataStore; // trigger update
	};

	const showCardEditModal = async () => {
		const response = await new Promise<CardInfo>((resolve) =>
			modalStore.trigger({
				type: 'component',
				component: {
					ref: CYOACardEdit,
					props: { card }
				},
				response: resolve
			})
		);

		console.log('response:', response);

		if (response) {
			$dataStore.cards.set(card.id, response);
			$dataStore.cards = $dataStore.cards; // trigger update
		}
	};

	const removeCard = () => {
		const row = $dataStore.rows.get(card.rowId);
		if (!row) throw new Error('Row not found');

		row.cards = row.cards.filter((id) => id !== card.id);

		$dataStore.cards.delete(card.id);
		$dataStore.rows = $dataStore.rows; // trigger update
	};
</script>

<div
	class="card relative flex flex-col flex-grow p-4 {card.selected > 0
		? 'variant-ghost-primary'
		: 'variant-ghost-surface'} {connectedflagValue || !connectedflagValueRow ? '' : 'opacity-40'}"
>
	<div class="flex items-baseline gap-4">
		<h3 class="h3 pb-2 font-bold">{card.name}</h3>
		<div class={card.show_price ? '' : 'line-through'}>price: {card.price}</div>
	</div>
	<p class="max-w-xl">{card.description}</p>

	<div class="card__footer mt-4 flex-grow flex flex-col justify-end">
		{#if card.max_stack > 1}
			<div class="flex justify-center items-center gap-4">
				<button type="button" class="btn variant-filled-primary" on:click={() => selectCard(+1)}>
					<Icon icon="material-symbols:add-rounded" />
					<span>add</span>
				</button>
				<span class="card px-4 py-2">{card.selected} / {card.max_stack}</span>
				<button type="button" class="btn variant-filled-primary" on:click={() => selectCard(-1)}>
					<Icon icon="material-symbols:remove-rounded" />
					<span>remove</span>
				</button>
			</div>
		{:else}
			<button type="button" class="btn variant-filled-primary w-full" on:click={() => selectCard()}>
				<span>select</span>
			</button>
		{/if}
	</div>

	<button
		type="button"
		class="btn-icon variant-filled-primary absolute right-2 top-2"
		use:popup={popupFeatured}
	>
		<Icon icon="material-symbols:more-vert" />
	</button>

	<div data-popup={popupId} class="card isolate z-10 w-64 px-4 py-2 shadow-xl">
		<div class="flex gap-2">
			<button type="button" class="btn variant-filled-primary w-full" on:click={showCardEditModal}>
				<span>edit</span>
			</button>
			<button type="button" class="btn variant-filled-primary w-full" on:click={removeCard}>
				<span>remove</span>
			</button>
		</div>
		<div class="arrow bg-surface-100-800-token" />
	</div>
</div>
