type Subscriber = () => void | Promise<unknown>;

export class EventSubsciption {
  private subscribers: Subscriber[] = [];

  // resolves when every subscriber's work is done, so the caller can tell
  // when e.g. a retry attempt it started has ended
  fire = async (): Promise<void> => {
    await Promise.all(this.subscribers.map((subscriber) => subscriber()));
  };

  subscribe = (fn: Subscriber) => {
    this.subscribers.push(fn);
    return () => {
      this.subscribers.splice(this.subscribers.indexOf(fn), 1);
    };
  };
}
