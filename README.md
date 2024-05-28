LUA DOES NOT WORK FOR NOW


## JS
shared helper functions/props
```ts
declare const playerId: number;
declare const playerPed: number;
declare const currentVehicle: number;
declare const lastVehicle: number;
declare const sleep: (ms: number) => Promise<void>;
declare const waitUntil: (predicate: () => boolean, max?: number) => Promise<boolean>;
```

client specific helper functions/props
```ts
declare const serverId: number;
declare const requestModel: (model: string | number) => Promise<void>;
declare const requestAnimDict: (dict: string) => Promise<void>;
```