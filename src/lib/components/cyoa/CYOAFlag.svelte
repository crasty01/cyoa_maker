<script lang="ts">
	import { dataStore, type FlagInfo } from '$lib/stores/data';
	import Icon from '@iconify/svelte';
	import { modalStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import CYOAFlagEdit from './CYOAFlagEdit.svelte';
	import { getFlagValue } from '$lib/functions/basicDataGeneration';

	export let flag: FlagInfo;

	$: popupId = `popup-${flag.id}`;
	$: popupFeatured = {
		event: 'click',
		target: popupId,
		placement: 'right'
	} as PopupSettings;
	$: value = getFlagValue(flag);

	const showFlagEditModal = async () => {
		const response = await new Promise<FlagInfo>((resolve) =>
			modalStore.trigger({
				type: 'component',
				component: {
					ref: CYOAFlagEdit,
					props: { flag }
				},
				response: resolve
			})
		);

		console.log('response:', response);

		if (response) {
			$dataStore.flags = $dataStore.flags.set(flag.id, response);
		}
	};

	const removeFlag = async () => {
		const connectedRows = [...$dataStore.rows.values()].filter((row) => row.flagId === flag.id);
		const connectedCards = [...$dataStore.cards.values()].filter((card) => card.flagId === flag.id);

		const response = await new Promise<boolean>((resolve) =>
			modalStore.trigger({
				type: 'confirm',
				title: 'Please Confirm',
				body: `Are you sure you want to remove the flag, you will also remove the connection from ${connectedRows.length} rows and ${connectedCards} cards?`,
				response: resolve
			})
		);

		if (response !== true) return;


		$dataStore.flags.delete(flag.id);

		for (const row of connectedRows) {
			row.flagId = undefined;
		}

		for (const card of connectedCards) {
			card.flagId = undefined;
		}

		$dataStore.flags = $dataStore.flags; // trigger update, hopefully for the whole store
	};
</script>

<div class="card flex items-center gap-2 border-2 border-surface-900 px-4 py-2">
	<span>{flag.name}</span>
	<span>{value}</span>

	{#if $dataStore.isBeingEdited}
		<button
			type="button"
			class=" btn-icon btn-icon-sm variant-filled-primary ml-auto"
			use:popup={popupFeatured}
		>
			<Icon icon="material-symbols:more-vert" />
		</button>

		<div data-popup={popupId} class="card isolate z-10 w-64 px-4 py-2 shadow-xl">
			<div class="flex gap-2">
				<button
					type="button"
					class="btn variant-filled-primary w-full"
					on:click={showFlagEditModal}
				>
					<span>edit</span>
				</button>
				<button type="button" class="btn variant-filled-primary w-full" on:click={removeFlag}>
					<span>remove</span>
				</button>
			</div>
			<div class="arrow bg-surface-100-800-token" />
		</div>
	{/if}
</div>
