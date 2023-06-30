<script lang="ts">
	import type { RowInfo } from '$lib/stores/data';
	import Icon from '@iconify/svelte';
	import { modalStore } from '@skeletonlabs/skeleton';

	export let row: RowInfo;

	// let formData: RowInfo = row;
	let formData: RowInfo = row && structuredClone(row);

	// Handle Form Submission
	const onFormSubmit = (): void => {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	};

	const onClose = (): void => {
		// console.log('onClose', formData, row);
		// formData = structuredClone(row);

		modalStore.close();
	};
</script>

{#if $modalStore[0]}
	<div class="modal-example-form card w-modal space-y-4 p-4 shadow-xl">
		<form class="modal-form space-y-4 border border-surface-500 p-4 rounded-container-token">
			<label class="label">
				<span>name</span>
				<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
			</label>
			<label class="label">
				<span>description</span>
				<textarea
					class="input"
					rows="3"
					bind:value={formData.description}
					placeholder="Enter description..."
				/>
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
