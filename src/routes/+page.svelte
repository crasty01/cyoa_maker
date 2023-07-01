<script lang="ts">
	import Icon from '@iconify/svelte';
	import CYOAList from '$lib/components/CYOAList.svelte';
	import { modalStore } from '@skeletonlabs/skeleton';

	const load = async () => {
		const item = await new Promise<string>((resolve) =>
			modalStore.trigger({
				type: 'component',
				component: {
					ref: CYOAList,
					props: {}
				},
				response: resolve
			})
		);

		console.log('item:', item);
	};
</script>

<div class="grid h-full w-full place-content-around">
	<div class="card variant-ghost-primary p-8">
		<h1 class="h1 text-4xl font-extrabold">Interactive CYOA maker</h1>
		<p class="text-lg font-normal">Craft your own interactive story without limitations!</p>
		<div class="links flex w-fit list-none flex-col gap-2 pt-4">
			<a href="/create" type="button" class="btn variant-filled-primary justify-start">
				<Icon icon="material-symbols:edit-rounded" />
				<span>Start creating</span>
			</a>
			<!-- href="/view" -->
			<!-- <button type="button" class="btn variant-ghost-primary chip-disabled justify-start">
				<Icon icon="material-symbols:search-rounded" />
				<span>view</span>
			</button> -->
			<button on:click={() => load()} type="button" class="btn variant-ghost-primary justify-start">
				<Icon icon="material-symbols:search-rounded" />
				<span>load cyoa</span>
			</button>
		</div>
	</div>
</div>
