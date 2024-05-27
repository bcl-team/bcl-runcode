import EventEmitter2 from 'eventemitter2';

export type TClientRequestHandler = (arg: unknown) => unknown;

class Client {
  private readonly _resourceName: string;
  private readonly _eventEmitter: EventEmitter2;

  constructor(resourceName: string, eventEmitter: EventEmitter2) {
    this._resourceName = resourceName;
    this._eventEmitter = eventEmitter;
    this._onMessage = this._onMessage.bind(this);
    window.addEventListener('message', this._onMessage);
  }

  public emit(eventName: string, payload?: unknown): void {
    fetch(`https://${this._resourceName}/${eventName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(payload),
    }).catch(console.error);
  }
  public invoke<T>(eventName: string, payload?: unknown): Promise<T> {
    return fetch(`https://${this._resourceName}/${eventName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(payload),
    }).then<T>((r) => r.json());
  }

  public on(eventName: string, handler: TClientRequestHandler): void {
    this._eventEmitter.on(eventName, handler);
  }

  public off(eventName: string, handler: TClientRequestHandler): void {
    this._eventEmitter.off(eventName, handler);
  }

  private async _onMessage({ data }: MessageEvent): Promise<void> {
    const { eventName, payload } = data;

    if (!eventName) {
      return;
    }

    await this._eventEmitter.emitAsync(eventName, payload);
  }
}

export const client = new Client(window.PARENT_RESOURCE_NAME, new EventEmitter2());
