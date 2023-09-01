import { createHash } from 'node:crypto';

const algorithm = 'sha256';
const digest = 'hex';

export function hashDataAsync(
  unhashedData: string,
  salt: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const hashedData = createHash(algorithm)
        .update(unhashedData + salt)
        .digest(digest);

      resolve(hashedData);
    } catch (error) {
      // todo: logger ({ location: 'SRC:UTILS::HASH_DATA_ASYNC' })
      reject(null);
    }
  });
}

export function hashData(unhashedData: string, salt: string): string {
  return createHash(algorithm)
    .update(unhashedData + salt)
    .digest(digest);
}
