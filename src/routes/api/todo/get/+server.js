import { prisma } from '../../../../lib/server/prisma';

export async function GET() {
  // const id = await url.searchParams.get('id');
  // if (!id) {
  //   return fail(400, { message: 'Invalid todo id' });
  // }

  console.error('GETTING ALL TODOS ROUTE');

  try {
    const todos = await prisma.todo.findMany();

    return new Response(JSON.stringify(todos), { status: 200 });
  } catch (error) {
    console.error('error ->', error);
    return Response({ message: 'Could not GET ALL TODOS.' }, { status: 500 });
  }
}
