<script lang="ts">
	import { type RowInfo, dataStore } from '$lib/stores/data';
	import { createBasicCard } from '$lib/functions/basicDataGeneration';
	import { modalStore } from '@skeletonlabs/skeleton';
	import CYOARowEdit from './CYOARowEdit.svelte';
	import CYOACard from './CYOACard.svelte';

	export let row: RowInfo;
	export let rowIndex: number;

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
			$dataStore.rows[rowIndex] = response;
		}
	};

	const addCard = () => {
		const card = createBasicCard(rowIndex);
		$dataStore.rows[rowIndex].cards.push(card.id);
	};

	const removeRow = async () => {
		const response = await new Promise<boolean>((resolve) =>
			modalStore.trigger({
				type: 'confirm',
				title: 'Please Confirm',
				body: `Are you sure you want to remove the row and all (${$dataStore.rows[rowIndex].cards.length}) cards inside?`,
				response: resolve
			})
		);

		console.log('response:', response);

		if (response === true) {
			for (const cardId of row.cards) {
				$dataStore.cards.delete(cardId);
			}
			$dataStore.rows.splice(rowIndex, 1);
			$dataStore.rows = $dataStore.rows; // trigger update
		}
	};
</script>

<div class="cyoa_row card variant-ghost-surface relative p-4">
	<h2 class="h2 font-extrabold">{row.name}</h2>
	<p>{row.description}</p>

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

	{#if $dataStore.isBeingEdited}
		<div class="edit absolute right-4 top-4">
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
	{/if}
</div>
