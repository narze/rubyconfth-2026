<script>
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" />
	<link rel="manifest" href="/manifest.json" />
	<meta name="theme-color" content="#dc2626" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
</svelte:head>
{@render children()}
