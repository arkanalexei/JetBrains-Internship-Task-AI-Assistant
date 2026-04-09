import { EventSourcePolyfill } from "event-source-polyfill";

function createEventSource({
  message,
  convId,
  token,
  model_type,
}: {
  message: string;
  convId: string;
  token: string;
  model_type: string;
}) {
  const encodedMessage = encodeURIComponent(message);

  return new EventSourcePolyfill(
    import.meta.env.VITE_API_URL +
      "chat/" +
      model_type.toLowerCase() +
      `?message=${encodedMessage}&conv_id=${convId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      heartbeatTimeout: 180000,
    }
  );
}

export default createEventSource;
