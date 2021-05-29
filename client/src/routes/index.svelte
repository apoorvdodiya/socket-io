<script>
	import { io, Socket } from 'socket.io-client';
	import { onMount } from 'svelte';
import { writable } from 'svelte/store';
	let socket;
	let onMessageSend;
	let message;
	let messages = writable([]);
	let user = '';
	let userId = '';
	let session = null;
	onMount(() => {
		socket = io('http://localhost:4001', {
			autoConnect: false
		});
		onMessageSend = () => {
			let messageData = { message, user, userId };
			console.log('message ', messageData);
			$messages.push(messageData);
			$messages = $messages
			socket.emit('message', messageData);
			message = '';
		};
		updateSession(localStorage.getItem('session'));
		if (session != null && session !== 'null') {
			console.log('session is not null')
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
			socket.disconnect();
			console.log('error ', error);
			updateSession(null);
			user = '';
		});
		socket.on('session', ({ sessionId, userName }) => {
			updateSession(sessionId);
			user = userName;
			localStorage.setItem('session', session);
		});
		socket.on('new message', (newMessage) => {
			console.log('arriveed ', newMessage);
			$messages.push(newMessage);
			$messages = $messages
			console.log('updated ', $messages);
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
		<div>
			Messages: {$messages.length}
			{#each $messages as message}
				<div>{message.message || '-'}</div>
			{/each}
		</div>
	{/if}
</div>
