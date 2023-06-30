<script lang="ts">
	import type { PointInfo } from '$lib/stores/data';
	import Icon from '@iconify/svelte';
	import { modalStore } from '@skeletonlabs/skeleton';

	export let point: PointInfo;

	// let formData: RowInfo = row;
	let formData: PointInfo = point && structuredClone(point);

	// Handle Form Submission
	const onFormSubmit = (): void => {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	};

	const onClose = (): void => {
		modalStore.close();
	};
</script>

{#if $modalStore[0]}
	<div class="modal-example-form card w-modal space-y-4 p-4 shadow-xl">
		<pre>{JSON.stringify(formData, null, 2)}</pre>
		<form class="modal-form space-y-4 border border-surface-500 p-4 rounded-container-token">
			<label class="label">
				<span>name</span>
				<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
			</label>

			<label class="label">
				<span>min value</span>
				<input
					class="input"
					type="number"
					bind:value={formData.min}
					placeholder="Enter min value..."
				/>
			</label>

			<label class="label">
				<span>max value</span>
				<input
					class="input"
					type="number"
					bind:value={formData.max}
					placeholder="Enter max value..."
				/>
			</label>

			<label class="label">
				<span>starting value</span>
				<input
					class="input"
					type="number"
					bind:value={formData.starting}
					placeholder="Enter starting value..."
				/>
			</label>

			<label class="label mb-4 flex select-none content-between gap-2">
				<span>visible</span>
				<input type="checkbox" class="input w-4" bind:checked={formData.visible} />
			</label>
		</form>

		<slot />

		<footer class="flex justify-end space-x-2">
			<button class="btn variant-ghost-primary" on:click={onClose}>
				<Icon icon="material-symbols:close-rounded" />
				<span>close</span>
			</button>
			<button class="btn variant-filled-primary" on:click={onFormSubmit}>
				<Icon icon="material-symbols:save-rounded" />
				<span>save</span>
			</button>
		</footer>
	</div>
{/if}
