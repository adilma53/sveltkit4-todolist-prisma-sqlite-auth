export async function DELETE({ params }) {
  // const id = await url.searchParams.get('id');
  // if (!id) {
  //   return fail(400, { message: 'Invalid todo id' });
  // }

  console.error('is delete route is run !!');

  try {
    await prisma.todo.delete({
      where: {
        id: Number(params.id)
      }
    });
  } catch (error) {
    console.error('error ->', error);
    return Response({ message: 'Could not create the todo.' }, { status: 200 });
  }

  return new Response(null, { status: 200 });
}
