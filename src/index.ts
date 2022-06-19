export type BucketOptions<T = unknown> = {
    storage?: Storage;
    version?: number;
    expire?: number;
    defaultValue?: T;
};

export type BucketEntry<T = unknown> = {
    version: number;
    timestamp: number;
    data: T;
};

export type Bucket<T> = [() => T, (value: T) => void, () => void];

const isExpired = (entry: BucketEntry, expire: number = 0) =>
    !!expire && entry.timestamp + expire < Date.now();

const isSameVersion = (entry: BucketEntry, version: number) =>
    entry.version === version;

const setItem = <T>(
    key: string,
    data: T,
    { version, storage }: BucketOptions
) => {
    const entry: BucketEntry = {
        timestamp: Date.now(),
        data,
        version,
    };

    storage.setItem(key, JSON.stringify(entry));

    return entry;
};

const getItem = <T>(key: string, options: BucketOptions): BucketEntry<T> | null => {
    const { storage, version, expire } = options;

    const entry = JSON.parse(storage.getItem(key));
    if (!entry || isExpired(entry, expire) || !isSameVersion(entry, version)) {
        removeItem(key, options);
        return null;
    }

    return entry;
};

const removeItem = <T>(key: string, { storage }: BucketOptions<T>) => {
    storage.removeItem(key);
};

export function getBucket<T>(name: string, options?: BucketOptions<T>): Bucket<T> {
    options = {
        storage: localStorage,
        ...options,
    };

    return [
        () => {
            const entry = getItem<T>(name, options);

            return entry ? entry.data : options.defaultValue;
        },
        (value: T) => {
            setItem<T>(name, value, options);
        },
        () => {
            removeItem<T>(name, options);
        },
    ];
}
