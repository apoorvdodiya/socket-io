<script>
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	let socket;
	let onMessageSend;
	let message;
	let messages = [];
	let user = '';
	let session = null;
	onMount(() => {
		socket = io('http://localhost:4001', {
			autoConnect: false
		});
		onMessageSend = () => {
			console.log(message);
			socket.emit('new message', message);
			message = '';
		};
		updateSession(localStorage.getItem('session'));
		if (session !== null) {
			socket.auth = { sessionId: session };
			connectSocket();
		}
	});
	const onAddUser = () => {
		
		socket.auth = { userId: Math.random(), userName: user };
		connectSocket();
	};
	const connectSocket = () => {
		socket.connect();
		socket.on('error', (error) => {
			console.log('error ', error);
			updateSession(null);
			user = '';
		});
		socket.on('session', ({ sessionId, userName }) => {
			updateSession(sessionId);
			user = userName;
			localStorage.setItem('session', session);
		});
	};
	const updateSession = (userSession) => {
		session = userSession;
		if (session === null) {
			localStorage.clear();
		} else {
			localStorage.setItem('session', session);
		}
	};
</script>

<div>
	{#if !session}
		UserName: <input type="text" bind:value={user} />
		<button on:click={onAddUser}>Add</button>
	{/if}
	{#if session}
		<h1>Hi, {user}</h1>
		Message:<input type="text" bind:value={message} />
		<button on:click={onMessageSend}>Send</button>
	{/if}
	{#if session}
		<div>
			{#each messages as message}
				<div>{message}</div>
			{/each}
		</div>
	{/if}
</div>
