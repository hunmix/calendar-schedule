export type ResizeCallback = (
  entry: ResizeObserverEntry,
  observer: ResizeObserver
) => void;

export class ResizeEventStore {
  private observer: ResizeObserver;
  private eventMap: Map<Element, ResizeCallback[]> = new Map();
  constructor() {
    this.observer = new ResizeObserver(this.trigger);
  }

  private trigger = (
    entries: ResizeObserverEntry[],
    observer: ResizeObserver
  ) => {
    console.log("trigger");
    entries.forEach((entry) => {
      const { target } = entry;
      const callbacks = this.getCallbacks(target);
      callbacks.forEach((cb) => cb(entry, observer));
    });
  };

  private getCallbacks(el: Element) {
    return this.eventMap.get(el) ?? [];
  }

  observe(el: Element, cb: ResizeCallback) {
    if (this.eventMap.has(el)) {
      const events = this.eventMap.get(el);
      events!.push(cb);
    } else {
      this.eventMap.set(el, [cb]);
      this.observer.observe(el);
    }
  }

  unobserve(el: Element, cb?: ResizeCallback) {
    const callbacks = this.eventMap.get(el) ?? [];
    const index = callbacks.findIndex((v) => v === cb);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
    if (callbacks.length <= 0) {
      this.observer.unobserve(el);
    }
  }

  release() {
    this.eventMap.clear();
    this.observer.disconnect();
  }
}
