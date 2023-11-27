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
	class=" font-mono flex min-h-screen flex-col items-center justify-center bg-black text-xl text-gray-200"
>
	<form class="w-1/3" action="?/createTodo" method="POST">
		<input
			id="text"
			name="text"
			placeholder="Add Todo"
			bind:value={text}
			class="my-5 w-full rounded-2xl bg-black p-3 text-white outline-none transition focus:ring focus:ring-gray-200 focus:ring-offset-4 focus:ring-offset-black"
		/>
	</form>
	<!-- </form> -->
	<div class="flex w-1/3 flex-col space-y-3">
		{#each todos as todo, idx}
			<!-- on:click={() => (isFocus === false ? (isFocus = idx) : (isFocus = false))} -->

			<form
				class="flex w-full items-center justify-between rounded-2xl border-gray-600 p-4 transition {isFocus ===
					idx && 'ring ring-gray-200 ring-offset-4 ring-offset-black'}"
				action="?/updateTodo&id={todo.id}"
				method="POST"
			>
				<input
					bind:value={todo.completed}
					bind:checked={todo.completed}
					name="completed"
					type="checkbox"
					class="h-6 w-6 rounded border-gray-300 bg-gray-100 text-primary-600 transition focus:ring-2 focus:ring-primary-600"
				/>

				<!-- on:keypress={(e) => e.key === 'Enter' && edit(idx)} -->
				<input
					name="text"
					bind:value={todo.text}
					class="mx-7 grow bg-black p-4 outline-none transition {todo.completed
						? 'line-through'
						: ''}"
				/>

				<form class="mr-4 rounded-lg border-2 p-1" action="?/checkTodo&id={todo.id}" method="POST">
					<input type="hidden" />
					<button type="submit">{todo.completed ? 'Undone' : 'Done'}</button>
				</form>

				<form action="?/deleteTodo&id={todo.id}" method="POST">
					<button type="submit">x</button>
				</form>
			</form>
		{/each}
	</div>
</div>
