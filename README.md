# secchiojs

Enhanced Web Storage API

## Install

you can install the package through [npm](https://npmjs.com/) runnig:

```bash
npm install secchiojs
```

## Usage

```js
import { getBucket } from 'secchiojs';

const [getToken, setToken, deleteToken] = getBucket('application-token', {
    version: 1,
    defaultValue: '',
    storage: localStorage,
    expire: 3600,
});

const token = getToken();

setToken('...');

deleteToken();
```

## API

### getBucket

#### Parameters

-   `name` **string** The name of the bucket. It will be used as key when saving into the storage.
-   `options` **BucketOptions** The bucket options.

#### Returns

The function returns an array containing get, set and remove methods.

```ts
export type Bucket = [() => any, (value: any) => void, () => void];
```

### BucketOptions

-   `storage?` **Storage** An instance of a storage implementing the Web Storage interface (eg. localStorage, sessionStorage).
-   `version?` **number** The version of the bucket.
-   `expire?` **number** A number that indicates the expiration of the data. Default is 0, which means no expiration.
-   `defaultValue?` **any** The default value returned if the data doesn't exist, or is expired or is from a different verision.
