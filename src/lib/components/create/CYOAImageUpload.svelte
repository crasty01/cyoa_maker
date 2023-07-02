<script lang="ts">
	import { dataStore } from '$lib/stores/data';
	import Icon from '@iconify/svelte';
	import { modalStore } from '@skeletonlabs/skeleton';
	import { FileDropzone } from '@skeletonlabs/skeleton';

	// let formData: RowInfo = row;

	let files: FileList;
	// Handle Form Submission
	const onFormSubmit = (): void => {
		if ($modalStore[0].response) $modalStore[0].response(files);
		modalStore.close();
	};

	const onClose = (): void => {
		modalStore.close();
	};

	const numberFormatter = new Intl.NumberFormat('en-US', {
		style: 'unit',
		unit: 'megabyte'
	});
</script>

{#if $modalStore[0]}
	<div class="modal-example-form card w-modal max-h-[80vh] space-y-4 overflow-auto p-4 shadow-xl">
		<!-- <pre>{JSON.stringify(formData, null, 2)}</pre> -->
		<h2 class="h2 font-extrabold">upload iamges</h2>
		<!-- <form class="modal-form space-y-4 border border-surface-500 p-4 rounded-container-token"> -->
		{#if files}
			<div class="flex flex-col gap-2">
				{#each [...files] as file}
					<div class="flex justify-between gap-4">
						<span class="block max-w-[12rem] flex-grow truncate">{file.name}</span>
						<span>{numberFormatter.format(file.size / 1_000_000)}</span>
						<!-- <button class="btn variant-ghost-error"><span>delete</span></button> -->
					</div>
				{/each}
			</div>
		{/if}
		<FileDropzone multiple accept="image/*" name="files" bind:files />
		<!-- </form> -->

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
