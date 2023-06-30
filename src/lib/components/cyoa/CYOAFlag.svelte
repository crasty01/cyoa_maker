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

	const removeFlag = () => {
		$dataStore.flags.delete(flag.id);
		$dataStore.flags = $dataStore.flags; // trigger update
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
