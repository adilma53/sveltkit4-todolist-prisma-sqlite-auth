import { redirect } from '@sveltejs/kit';
import { prisma } from './lib/server/prisma';

async function authenticateUser(event) {
	const { cookies } = event;

	const session = cookies.get('session');

	const user = await prisma.user.findUnique({
		where: { session }
	});

	console.log('session -->', session);
	console.log('user.session -->', user.session);
	console.log('user.id -->', user.id);

	if (user && session && user.session === session) {
		return user;
	}

	return null;
}

export async function handle({ event, resolve }) {
	event.locals.user = await authenticateUser(event);

	console.log('event.locals.user.id  -->', event.locals.user.id);
	console.log('event.url.pathname -->', event.url.pathname);

	if (event.url.pathname.startsWith('/profile')) {
		if (event.locals.user === null) {
			throw redirect(303, '/');
		}

		if (event.url.pathname.startsWith('/profile/admin')) {
			if (!event.locals.user.role !== 'ADMIN') {
				throw redirect(300, '/');
			}
		}
	}

	const response = await resolve(event);
	return response;
}
