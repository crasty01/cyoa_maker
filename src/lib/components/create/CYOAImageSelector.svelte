<script lang="ts">
	import { dataStore } from '$lib/stores/data';
	import Icon from '@iconify/svelte';

	export let selectedImageId: string | undefined;

	$: imageList = $dataStore.images ?? [];

	const selectImageId = (imageId: string) => {
		if (selectedImageId === imageId) selectedImageId = undefined;
		else selectedImageId = imageId;
	};
</script>

<div class="flex w-full flex-wrap gap-2">
	{#each imageList as imageId}
		<label
			for={imageId}
			class="relative aspect-square flex-grow basis-40 flex-wrap overflow-hidden rounded-container-token"
		>
			<img class="h-full w-full object-cover" src={`/api/image/${imageId}`} alt="" loading="lazy" />
			<div class="floating-buttons absolute right-2 top-2 flex gap-2">
				<a
					href={`/api/image/${imageId}`}
					target="_blank"
					class="btn btn-icon variant-filled-primary h-8 w-8 rounded-container-token"
				>
					<Icon icon="material-symbols:expand-all-rounded" />
				</a>
				<input
					class="input h-8 w-8"
					type="checkbox"
					id={imageId}
					checked={selectedImageId === imageId}
					on:click={() => selectImageId(imageId)}
				/>
			</div>
		</label>
	{/each}
</div>
