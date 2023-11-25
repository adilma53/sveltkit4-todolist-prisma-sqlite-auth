import { prisma } from '../lib/server/prisma';

export const load = async () => {
	return {
		dbTodos: await prisma.todo.findMany()
	};
};

export const actions = {
	createTodo: async (event) => {
		console.log('event -> ', event);
		console.log('params -> ', event.params);

		const { text } = Object.fromEntries(await event.request.formData());

		try {
			await prisma.todo.create({
				data: {
					text
				}
			});
		} catch (error) {
			console.error('error ->', error);
			return fail(500, { message: 'Could not create the todo.' });
		}

		return {
			status: 200
		};
	},
	updateTodo: async ({ request, url }) => {
		const id = await url.searchParams.get('id');
		if (!id) {
			return fail(400, { message: 'Invalid todo id' });
		}

		const { text } = Object.fromEntries(await request.formData());

		try {
			await prisma.todo.update({
				where: {
					id: Number(id)
				},
				data: {
					text
				}
			});
		} catch (error) {
			console.error('error ->', error);
			return fail(500, { message: 'Could not create the todo.' });
		}

		return {
			status: 200
		};
	},
	deleteTodo: async ({ url }) => {
		const id = await url.searchParams.get('id');
		if (!id) {
			return fail(400, { message: 'Invalid todo id' });
		}

		try {
			await prisma.todo.delete({
				where: {
					id: Number(id)
				}
			});
		} catch (error) {
			console.error('error ->', error);
			return fail(500, { message: 'Could not create the todo.' });
		}

		return {
			status: 200
		};
	},

	checkTodo: async ({ request, url }) => {
		const id = await url.searchParams.get('id');
		if (!id) {
			return fail(400, { message: 'Invalid todo id' });
		}

		try {
			const currentTodo = await prisma.todo.findUnique({
				where: {
					id: Number(id)
				}
			});

			if (!currentTodo) {
				return fail(404, { message: 'Todo not found' });
			}

			await prisma.todo.update({
				where: {
					id: Number(id)
				},
				data: {
					completed: !currentTodo.completed
				}
			});
		} catch (error) {
			console.error('error ->', error);
			return fail(500, { message: 'Could not update the todo.' });
		}

		return {
			status: 200
		};
	}
};
