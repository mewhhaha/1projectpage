export const ws = () => {
  let self: WebSocket;
  let sessions: WebSocket[] = [];
  return {
    disconnect: (websocket: WebSocket) => {
      sessions = sessions.filter((w) => w !== websocket);
      websocket.close();
    },

    connect: ({
      onConnect,
      onMessage,
    }: {
      onConnect?: (websocket: WebSocket) => Promise<void> | void;
      onMessage?: (websocket: WebSocket, message: MessageEvent) => void;
    }) => {
      const pair = new WebSocketPair();
      const websocket = pair[1];

      websocket.accept();

      sessions.push(websocket);

      onConnect?.(pair[1]);
      self = pair[1];

      websocket.addEventListener("message", (msg) => onMessage?.(pair[1], msg));

      return new Response(null, { status: 101, webSocket: pair[0] });
    },

    broadcast: (
      message: string,
      options: { skipSelf: boolean } = { skipSelf: false }
    ) => {
      sessions = sessions.filter((session) => {
        if (options.skipSelf && session === self) {
          return true;
        }

        try {
          session.send(message);
          return true;
        } catch (_err) {
          return false;
        }
      });
    },
  };
};

export type DurableObjectNamespaceIs<ClassDO extends CallableDurableObject> =
  DurableObjectNamespace & { __type?: ClassDO & never };

export type External<A extends Record<string, any>> = Extract<
  {
    [Key in keyof A]: A[Key] extends (
      ...args: any[]
    ) => Promise<Response> | Response
      ? Key
      : never;
  }[Exclude<keyof A, keyof CallableDurableObject>],
  string
>;

export type Client<ClassDO extends Record<string, any>> = {
  request: Request;
  stub: DurableObjectStub;
} & { __type?: ClassDO & never };

export const client = <ClassDO extends CallableDurableObject>(
  request: Request,
  ns: DurableObjectNamespaceIs<ClassDO>,
  name: string | DurableObjectId
): Client<ClassDO> => {
  const stub =
    typeof name === "string" ? ns.get(ns.idFromName(name)) : ns.get(name);
  return {
    request,
    stub,
  };
};

export const call = <
  ClassDO extends Record<string, any>,
  Method extends External<ClassDO>
>(
  { stub, request }: Client<ClassDO>,
  method: Method,
  ...args: Parameters<ClassDO[Method]>
) => {
  const encodedArgs = encodeURIComponent(JSON.stringify(args));
  return stub.fetch(
    new Request(`https://do/${method}/${encodedArgs}`, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      formData: request.formData,
      redirect: request.redirect,
      bodyUsed: request.bodyUsed,
      cf: request.cf,
    })
  );
};

export class CallableDurableObject implements DurableObject {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const [method, encodedArgs] = url.pathname.split("/").slice(1);
    const args = JSON.parse(decodeURIComponent(encodedArgs));

    // @ts-ignore Here we go!
    return await this[method](...args);
  }
}
