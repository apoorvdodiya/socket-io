<script lang="ts">
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
			$messages = $messages;
			socket.emit('message', messageData);
			message = '';
		};
		updateSession(localStorage.getItem('session'));
		if (session != null && session !== 'null') {
			console.log('session is not null');
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
		socket.on('session', ({ sessionId, userName, allMessages }) => {
			updateSession(sessionId);
			user = userName;
			$messages = allMessages;
			$messages = $messages;
			localStorage.setItem('session', session);
		});
		socket.on('new message', (newMessage) => {
			console.log('arriveed ', newMessage);
			$messages.push(newMessage);
			$messages = $messages;
			console.log('updated ', $messages);
		});
		socket.on('user disconnected', (message) => {
			console.log('disconnected ', message);
			$messages.push({ message });
			$messages = $messages;
		});
		socket.on('user connect', (message) => {
			console.log('disconnected ', message);
			$messages.push({ message });
			$messages = $messages;
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

<div class="container-main">
	{#if !session}
		UserName: <input type="text" bind:value={user} />
		<button class="add-button" on:click={onAddUser}>Add</button>
	{/if}
	{#if session}
		<h1 class="user-header">{user}</h1>
		<div class="input-box">
			<input class="message-input" type="text" bind:value={message} />
			<button class="send-button" on:click={onMessageSend}>Send</button>
		</div>
		<div class="message-container">
			Messages: {$messages.length}
			<div class="message-flex">
				{#each $messages as message}
					<span
						class="message"
						style={`align-self: ${message.user === user ? 'flex-end' : 'flex-start'};`}
					>
						{#if message.user !== user}
							<div class="message-from">
								~{message.user}
							</div>
						{/if}
						{message.message || '-'}
					</span>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.container-main {
		margin: 50px 250px;
		border: solid;
		border-radius: 20px;
		height: calc(100vh - 150px);
		padding: 20px;
		overflow: auto;
	}
	.user-header {
		margin-bottom: 5px;
		font-family: Arial, Helvetica, sans-serif;
		border-bottom: 2px solid;
	}

	.input-box {
		height: 30px;
		padding: 10px;
		margin-bottom: 10px;
	}

	.message-input {
		font-size: 20px;
		width: calc(100% - 90px);
	}

	.send-button {
		font-size: 20px;
		width: 70px;
	}

	.message-container {
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
		font-size: 20px;
	}

	.message-flex {
		display: flex;
		flex-direction: column;
	}
	.message {
		border: 1px solid;
		border-radius: 10px;
		max-width: 70%;
		padding: 10px;
		margin-top: 10px;
	}
	.message > .message-from {
		display: flex;
		margin-bottom: 5px;
		font-size: 12px;
	}
</style>
