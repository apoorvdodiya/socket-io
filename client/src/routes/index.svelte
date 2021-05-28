<script>
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	let socket;
	let onMessage;
	onMount(() => {
		onMessage = () => {
			console.log(message);
			socket.emit('new message', message);
			message = '';
		};
		socket = io('http://localhost:4001');
		socket.emit('message', 'hakunamatata');
	});
	let message;
</script>

<input type="text" bind:value={message} />
<button on:click={onMessage}>Send</button>
