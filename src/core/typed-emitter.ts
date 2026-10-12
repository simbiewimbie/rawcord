import type { GatewayEvents } from "../types/types.ts";
import log from "../utils/log.ts";

type Handler<T extends keyof GatewayEvents> = (data: GatewayEvents[T]) => void | Promise<void>;
type AnyHandler = Handler<keyof GatewayEvents>;

export class TypedEmitter {
  #handlers = new Map<string, Set<AnyHandler>>();

  // registering a handler for an event
  public on<T extends keyof GatewayEvents>(event: T, handler: Handler<T>) {
    let eventHandlers = this.#handlers.get(event);

    if (!eventHandlers) {
      eventHandlers = new Set<AnyHandler>();
      this.#handlers.set(event, eventHandlers);
    }

    eventHandlers.add(handler as AnyHandler);
  }

  public off(event: string, handler: AnyHandler): void {
    const eventHandlers = this.#handlers.get(event);
    if (!eventHandlers) return;
    eventHandlers.delete(handler);
  }

  public once<T extends keyof GatewayEvents>(event: T, handler: AnyHandler): void {
    const wrapper: AnyHandler = (data) => {
      this.off(event, wrapper);
      handler(data);
    };
    this.on(event, wrapper);
  }

  // announcing the occurrence of an event
  public emit<T extends keyof GatewayEvents>(event: T, data: GatewayEvents[T]): void {
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
