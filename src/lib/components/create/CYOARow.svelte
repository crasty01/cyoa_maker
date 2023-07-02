<script lang="ts">
	import { type RowInfo, dataStore } from '$lib/stores/data';
	import { createAndSaveBasicCard, getFlagValue } from '$lib/functions/basicDataGeneration';
	import { modalStore } from '@skeletonlabs/skeleton';
	import CYOARowEdit from './CYOARowEdit.svelte';
	import CYOACard from './CYOACard.svelte';

	export let row: RowInfo;
	export let rowId: string;

	$: connectedflagValue = row.flagId ? getFlagValue($dataStore.flags.get(row.flagId)!) : true;

	const showRowEditModal = async () => {
		const response = await new Promise<RowInfo>((resolve) =>
			modalStore.trigger({
				type: 'component',
				component: {
					ref: CYOARowEdit,
					props: { row }
				},
				response: resolve
			})
		);

		console.log('response:', response);

		if (response) {
			$dataStore.rows.set(rowId, response);
			$dataStore.rows = $dataStore.rows; // trigger update
		}
	};

	const addCard = () => {
		const row = $dataStore.rows.get(rowId);
		if (!row) throw new Error('Row not found');

		const card = createAndSaveBasicCard(rowId);
		row.cards.push(card.id);

		$dataStore.rows = $dataStore.rows; // trigger update
	};

	const removeRow = async () => {
		const row = $dataStore.rows.get(rowId);
		if (!row) throw new Error('Row not found');

		const response = await new Promise<boolean>((resolve) =>
			modalStore.trigger({
				type: 'confirm',
				title: 'Please Confirm',
				body: `Are you sure you want to remove the row and all (${row.cards.length}) cards inside?`,
				response: resolve
			})
		);

		if (response !== true) return;

		for (const cardId of row.cards) {
			$dataStore.cards.delete(cardId);
		}
		$dataStore.rowsArray.splice($dataStore.rowsArray.indexOf(rowId), 1);
		$dataStore.rows.delete(rowId);
		$dataStore.rows = $dataStore.rows; // trigger update
	};
</script>

<div
	class="cyoa_row card variant-ghost-surface relative p-4 {connectedflagValue ? '' : 'opacity-40'}"
>
	<div class="flex gap-8 max-md:flex-col">
		{#if row.imageId}
			<img
				class="max-h-80 object-cover rounded-container-token"
				src={`/api/image/${row.imageId}`}
				loading="lazy"
				alt=""
			/>
		{/if}
		<article>
			<h2 class="h2 pb-2 font-extrabold">{row.name}</h2>
			<p class="max-w-xl">{row.description}</p>
		</article>
	</div>

	{#if row.cards.length > 0}
		<div class="mt-4 flex flex-wrap gap-2">
			{#each row.cards as cardId}
				{@const card = $dataStore.cards.get(cardId)}
				{#if card}
					<CYOACard {card} />
				{:else}
					<p>CardInfo [{cardId}] not found</p>
				{/if}
			{/each}
		</div>
	{/if}

	<div class="edit absolute right-4 top-4 pl-4">
		<button type="button" class="btn variant-filled-primary" on:click={showRowEditModal}>
			<span>edit</span>
		</button>
		<button type="button" class="btn variant-filled-primary" on:click={addCard}>
			<span>add card</span>
		</button>
		<button type="button" class="btn variant-filled-primary" on:click={removeRow}>
			<span>remove row</span>
		</button>
	</div>
</div>
