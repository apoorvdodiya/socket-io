<script>
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
	let socket;
	let onMessage;
	let message;
	let user = '';
	let session = null;
	$: session && updateSession(session);
	onMount(() => {
		session = localStorage.getItem('session');
		onMessage = () => {
			console.log(message);
			socket.emit('new message', message);
			message = '';
		};
		socket = io('http://localhost:4001', {
			autoConnect: false
		});
		if (session) {
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
			session = null;
			user = '';
		});
		socket.on('session', ({ sessionId, userName }) => {
			console.log('session ', sessionId, userName);
			session = sessionId;
			user = userName;
			localStorage.setItem('session', session);
		});
	};
	const updateSession = (userSession) => {
		console.log('session update called', userSession);
		session = userSession;
		localStorage.setItem('session', session);
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
		<button on:click={onMessage}>Send</button>
	{/if}
</div>
