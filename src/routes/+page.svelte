<script>
	import { PrismaClient } from '@prisma/client';
	export let data;
	$: ({ dbTodos } = data);
	$: console.log('totos ->', dbTodos), data;

	let text = '';
	let todos;
	$: todos = dbTodos;

	let isFocus = false;

	function remove(idx) {
		todos = todos.filter((item, index) => index !== idx);
	}

	function add() {
		const obj = {};
		obj['text'] = text;
		obj['done'] = false;
		todos = [...todos, obj];

		text = '';
	}

	// function check(idx) {
	// 	let temp = todos;
	// 	temp[idx] = { ...temp[idx], done: !temp[idx]['done'] };
	// 	todos = temp;
	// }

	function edit(idx) {
		let temp = todos;
		temp[idx] = { ...temp[idx], text: temp[idx]['text'] };
		todos = temp;
	}

	$: {
		if (typeof localStorage !== 'undefined') {
			const storagTodos = localStorage.getItem('todos');
			storagTodos && (todos = JSON.parse(storagTodos));
		}
	}

	$: {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('todos', JSON.stringify(todos));
		}
	}
</script>

<div
	class=" bg-black text-xl font-mono text-gray-200 flex flex-col justify-center items-center min-h-screen"
>
	<form class="w-1/3" action="?/createTodo" method="POST">
		<input
			id="text"
			name="text"
			placeholder="Add Todo"
			bind:value={text}
			class="transition outline-none focus:ring focus:ring-gray-200 focus:ring-offset-4 focus:ring-offset-black bg-black text-white p-3 rounded-2xl my-5 w-full"
		/>
	</form>
	<!-- </form> -->
	<div class="space-y-3 flex flex-col w-1/3">
		{#each todos as todo, idx}
			<!-- on:click={() => (isFocus === false ? (isFocus = idx) : (isFocus = false))} -->

			<form
				class="transition flex p-4 rounded-2xl border-gray-600 w-full justify-between items-center {isFocus ===
					idx && 'ring ring-gray-200 ring-offset-4 ring-offset-black'}"
				action="?/updateTodo&id={todo.id}"
				method="POST"
			>
				<input
					bind:value={todo.completed}
					bind:checked={todo.completed}
					name="completed"
					type="checkbox"
					class="transition w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-600 focus:ring-2"
				/>

				<!-- on:keypress={(e) => e.key === 'Enter' && edit(idx)} -->
				<input
					name="text"
					bind:value={todo.text}
					class="mx-7 grow transition outline-none bg-black p-4 {todo.completed
						? 'line-through'
						: ''}"
				/>

				<form class="p-1 rounded-lg border-2 mr-4" action="?/checkTodo&id={todo.id}" method="POST">
					<input type="hidden" name="completed" />
					<button type="submit">{todo.completed ? 'Undone' : 'Done'}</button>
				</form>

				<form action="?/deleteTodo&id={todo.id}" method="POST">
					<button type="submit">x</button>
				</form>
			</form>
		{/each}
	</div>
</div>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css" />
</svelte:head>
