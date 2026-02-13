export default async function emitEventHandler(
  event: string,
  data: unknown,
  socketId?: string,
) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SOCKET_SERVER}/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ socketId, event, data }),
    });
  } catch (error) {
    console.log(`Error in Emit Event Handler ${error}`);
  }
}
