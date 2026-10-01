<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import Features from '$lib/components/Features.svelte';
	import VersionHistory from '$lib/components/VersionHistory.svelte';
	import Workflow from '$lib/components/Workflow.svelte';
	import Architecture from '$lib/components/Architecture.svelte';
	import Security from '$lib/components/Security.svelte';
	import GetStarted from '$lib/components/GetStarted.svelte';
	import Roadmap from '$lib/components/Roadmap.svelte';
	import Updates from '$lib/components/Updates.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>eDMS · Enterprise Document Management on your LAN</title>
	<meta name="author" content="QUINAS" />
	<meta
		name="description"
		content="eDMS is a self-hosted document management system for office networks: versioning, approval workflow, append-only audit log, and role- and department-based access."
	/>
</svelte:head>

<Nav />
<main>
	<Hero />
	<Features />
	<VersionHistory />
	<Workflow />
	<Architecture />
	<Security />
	<GetStarted />
	<Roadmap />
	<Updates />
</main>
<Footer />
