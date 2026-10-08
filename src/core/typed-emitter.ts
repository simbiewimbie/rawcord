import log from "../utils/log.ts";

type Handler = (data: unknown) => void | Promise<void>;

export class TypedEmitter {
  #handlers = new Map<string, Set<Handler>>();

  // registering a handler for an event
  public on(event: string, handler: Handler): void {
    let eventHandlers = this.#handlers.get(event);

    if (!eventHandlers) {
      eventHandlers = new Set<Handler>();
      this.#handlers.set(event, eventHandlers);
    }

    eventHandlers.add(handler);
  }

  public off(event: string, handler: Handler): void {
    const eventHandlers = this.#handlers.get(event);
    if (!eventHandlers) return;
    eventHandlers.delete(handler);
  }

  public once(event: string, handler: Handler): void {
    const wrapper: Handler = (data) => {
      this.off(event, wrapper);
      handler(data);
    };
    this.on(event, wrapper);
  }

  // announcing the occurrence of an event
  public emit(event: string, data: unknown): void {
    const eventHandlers = this.#handlers.get(event);

    if (!eventHandlers) return;

    for (let handler of eventHandlers) {
      try {
        const result = handler(data);
        if (result instanceof Promise) {
          result.catch((error) => log("error", `An error occured for a '${event}' event handler: ${error}`));
        }
      } catch (error) {
        log("error", `An error occured for a '${event}' event handler: ${error}`);
      }
    }
  }
}
