<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">
		<a href="/" class="btn btn-sm text-xl hover:bg-white/5 h1 font-extrabold"
			>Interactive CYOA maker</a
		>
	</svelte:fragment>
</AppBar>
