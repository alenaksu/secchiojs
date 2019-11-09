export type BucketOptions = {
    storage?: Storage;
    version?: number;
    expire?: number;
    defaultValue?: unknown;
};

export type BucketEntry = {
    version: number;
    timestamp: number;
    data: unknown;
};

export type Bucket<T> = [() => T, (value: T) => void, () => void];

const defer =
    (window as any).requestIdleCallback || window.requestAnimationFrame;

const isExpired = (entry: BucketEntry, expire: number = 0) =>
    !!expire && entry.timestamp + expire < Date.now();

const isSameVersion = (entry: BucketEntry, version: number) =>
    entry.version === version;

const setItem = (
    key: string,
    data: any,
    { version, storage }: BucketOptions
) => {
    const entry: BucketEntry = {
        timestamp: Date.now(),
        data,
        version,
    };

    defer(() => storage.setItem(key, JSON.stringify(entry)));

    return entry;
};

const getItem = (key: string, options: BucketOptions, cached: BucketEntry) => {
    const { storage, version, expire } = options;

    const entry = !cached ? JSON.parse(storage.getItem(key)) : cached;
    if (!entry || isExpired(entry, expire) || !isSameVersion(entry, version)) {
        removeItem(key, options);
        return null;
    }

    return entry;
};

const removeItem = (key: string, { storage }: BucketOptions) => {
    defer(() => storage.removeItem(key));
};

export function getBucket<T>(name: string, options?: BucketOptions): Bucket<T> {
    options = {
        storage: localStorage,
        ...options,
    };
    let cached = null;

    return [
        () => {
            cached = getItem(name, options, cached);

            return cached ? cached.data : options.defaultValue;
        },
        (value: any) => {
            cached = setItem(name, value, options);
        },
        () => {
            removeItem(name, options);
            cached = null;
        },
    ];
}
