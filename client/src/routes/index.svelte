<script>
	import { io } from 'socket.io-client';
	import { onMount } from 'svelte';
	onMount(() => {
		const socket = io('http://localhost:4000');
		console.log(socket);
	});
</script>

<h1>Hello</h1>
