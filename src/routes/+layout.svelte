<script>
	import '../fontfaces.postcss';
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';

	import { AppShell } from '@skeletonlabs/skeleton';
	import AppHeader from '$lib/layout/AppHeader.svelte';
	import { Modal } from '@skeletonlabs/skeleton';

	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<Modal />

<AppShell>
	<svelte:fragment slot="header"><AppHeader /></svelte:fragment>
	<slot />
</AppShell>
