<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar
	padding="px-4 py-2"
	gridColumns="grid-cols-3"
	slotDefault="place-self-center"
	slotTrail="place-content-end"
>
	<svelte:fragment slot="lead">
		<a href="/" class="btn btn-sm h1 text-xl font-extrabold hover:bg-white/5">
			<span>Interactive CYOA maker</span>
		</a>
	</svelte:fragment>
</AppBar>
