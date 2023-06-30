<script lang="ts">
	import { dataStore, type PointInfo } from '$lib/stores/data';
	import { getPointValue } from '$lib/functions/basicDataGeneration';
	import Icon from '@iconify/svelte';
	import { modalStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import CYOAPointEdit from './CYOAPointEdit.svelte';

	export let point: PointInfo;

	$: popupId = `popup-${point.id}`;
	$: popupFeatured = {
		event: 'click',
		target: popupId,
		placement: 'right'
	} as PopupSettings;
	$: value = getPointValue(point);

	const showPointEditModal = async () => {
		const response = await new Promise<PointInfo>((resolve) =>
			modalStore.trigger({
				type: 'component',
				component: {
					ref: CYOAPointEdit,
					props: { point }
				},
				response: resolve
			})
		);

		console.log('response:', response);

		if (response) {
			$dataStore.points = $dataStore.points.set(point.id, response);
		}
	};

	const removePoint = () => {
		$dataStore.points.delete(point.id);
		$dataStore.points = $dataStore.points; // trigger update
	};
</script>

<div
	class="card flex items-center gap-2 border-2 border-surface-900 {!point.visible &&
		'border-dashed'} px-4 py-2"
>
	<span>{point.name}:</span>
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
					on:click={showPointEditModal}
				>
					<span>edit</span>
				</button>
				<button type="button" class="btn variant-filled-primary w-full" on:click={removePoint}>
					<span>remove</span>
				</button>
			</div>
			<div class="arrow bg-surface-100-800-token" />
		</div>
	{/if}
</div>
