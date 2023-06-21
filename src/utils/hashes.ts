import { createHash } from 'node:crypto';

export function hashDataAsync(
  unhashedData: string,
  salt: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const hashedData = createHash('sha256')
        .update(unhashedData + salt)
        .digest('hex');

      resolve(hashedData);
    } catch (error) {
      // todo: logger ({ location: 'SRC:UTILS::HASH_DATA_ASYNC' })
      reject(null);
    }
  });
}
