<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<div class="card variant-ghost-primary p-8">
	<h1 class="h1 text-4xl font-extrabold">Interactive CYOA maker</h1>
	<p class="text-lg font-normal">Craft your own interactive story without limitations!</p>
	<div class="links list-none pt-4 flex flex-col gap-2 w-fit">
		<a href="/create" type="button" class="btn variant-filled-primary justify-start">
			<Icon icon="material-symbols:edit-rounded" />
			<span>Start creating</span>
		</a>
		<a href="/view" type="button" class="btn variant-ghost-primary justify-start">
			<Icon icon="material-symbols:search-rounded" />
			<span>view</span>
		</a>
	</div>
</div>
