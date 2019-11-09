# secchiojs

Enhanced Web Storage API

## Install

you can install the package through [npm](https://npmjs.com/) runnig:

```bash
npm install secchiojs
```

## Usage

### Typescript

```ts
import { getBucket } from 'secchiojs';

type UserPrefs = {
    name: string;
    email: string;
    mode: number;
};

const [getPrefs, updatePrefs, deletePrefs] = getBucket<UserPrefs>(
    'user-prefs',
    {
        version: 1,
        defaultValue: {},
        storage: localStorage,
        expire: 3600,
    }
);

const userPrefs = getPrefs();

updatePrefs({
    ...userPrefs,
    mode: 2,
});

deletePrefs();
```

### Javascript

```js
import { getBucket } from 'secchiojs';

const [getPrefs, updatePrefs, deletePrefs] = getBucket('user-prefs', {
    version: 1,
    defaultValue: {},
    storage: localStorage,
    expire: 3600,
});

const userPrefs = getPrefs();

updatePrefs({
    ...userPrefs,
    mode: 2,
});

deletePrefs();
```

## API

**NOTE**: All the operations are performed using a cache, deferring the actual operations to the storage.

### getBucket

#### Parameters

-   `name` **string** The name of the bucket. It will be used as key when saving into the storage.
-   `options` **BucketOptions** The bucket options.

#### Returns

The function returns an array containing get, set and remove methods.

```ts
export type Bucket<T> = [
    // get
    () => T,

    // set
    (value: T) => void,

    // remove
    () => void
];
```

### BucketOptions

-   `storage?` **Storage** An instance of a storage implementing the Web Storage interface (eg. localStorage, sessionStorage).
-   `version?` **number** The version of the bucket.
-   `expire?` **number** A number that indicates the expiration of the data. Default is 0, which means no expiration.
-   `defaultValue?` **any** The default value returned if the data doesn't exist, or is expired or is from a different verision.
