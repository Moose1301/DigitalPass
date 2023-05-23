// https://github.com/MinecraftJS/uuid

import { randomUUID as cryptoUUID, randomBytes } from "crypto";

/**
 * UUID Class
 * @see https://en.wikipedia.org/wiki/Universally_unique_identifier
 */
export default class UUID {
  /** Buffer containing the bytes for this UUID */
  private bytes: Buffer;
  /**
   * Object containing results of the `.toString` method.
   * The `.toString` executes regex to check for string
   * validity and can be slow when used multiple times.
   * These cached values avoids multiple executions of
   * the regex.
   */
  private stringCache: { dashes?: string; noDashes?: string };

  /**
   * Constructs a new UUID using the specified data.
   * @param mostSigBits The most significant bits of the UUID
   * @param leastSigBits The least significant bits of the UUID
   */
  public constructor(mostSigBits: Buffer, leastSigBits: Buffer) {
    this.bytes = Buffer.alloc(16);
    mostSigBits.copy(this.bytes);
    leastSigBits.copy(this.bytes, 8);

    this.stringCache = {};
  }

  /** The most significant 64 bits of this UUID's 128 bit value */
  public getMostSignificantBits(): Buffer {
    return this.bytes.subarray(0, 8);
  }

  /** The least significant 64 bits of this UUID's 128 bit value */
  public getLeastSignificantBits(): Buffer {
    return this.bytes.subarray(8, 16);
  }

  /** Converts this `UUID` instance to a JSON valid format */
  public toJSON(dashes = true): string {
    return this.toString(dashes);
  }

  /** Converts this `UUID` instance to a serializable string */
  public toString(dashes = true): string {
    const key = dashes ? 'dashes' : 'noDashes';

    const cached = this.stringCache[key];
    if (cached) return cached;

    const string = this.bytes.toString('hex');
    const result = dashes ? UUID.addDashesToStringUUID(string) : string;
    this.stringCache[key] = result;

    return result;
  }

  /** The version for this `UUID` */
  public get version(): number {
    return parseInt(this.toString(false).slice(12, 13), 16);
  }

  /** The variant for this `UUID` */
  public get variant(): number {
    return parseInt(this.toString(false).slice(16, 17), 16);
  }

  /**
   * This method is executed when the `UUID`
   * instance is used in a "primitive context".
   *
   * @example
   * ```javascript
   * const uuid = new UUID(...);
   *
   * // Without this method
   * console.log('UUID: ' + uuid); // -> 'UUID: [object Object]'
   *
   * // With this method
   * console.log('UUID: ' + uuid); // -> 'UUID: 7ed9e77e-34b8-400e-b684-9093c550b4f9'
   * ```
   * @returns A string containing the UUID
   */
  public [Symbol.toPrimitive](): string {
    return this.toString();
  }

  /**
   * This method is executed when `inspect` from
   * the `node:util` module is run on this instance.
   *
   * This method returns a fancy string for developers
   * so they can debug with ease.
   * @returns A fancy string
   */
  public [Symbol.for('nodejs.util.inspect.custom')](): string {
    return `UUID <${this.toString()}>`;
  }

  public static parseUUID(uuid: string): UUID {
    uuid = uuid.replace(/-/g, '');

    const mostSigBits = Buffer.from(uuid.slice(0, 16), 'hex');
    const leastSigBits = Buffer.from(uuid.slice(16, 32), 'hex');

    return new UUID(mostSigBits, leastSigBits);
  }
  public static randomUUID(): UUID {
    const uuid: string = cryptoUUID().replace(/-/g, '');
    return new UUID(
      Buffer.from(uuid.slice(0, 16), 'hex'),
      Buffer.from(uuid.slice(16, 32), 'hex')
    );
  }

  private static addDashesToStringUUID(uuid: string) {
    return (
      uuid.slice(0, 8) +
      '-' +
      uuid.slice(8, 12) +
      '-' +
      uuid.slice(12, 16) +
      '-' +
      uuid.slice(16, 20) +
      '-' +
      uuid.slice(20, 32)
    );
  }
  public equals(uuid: UUID): boolean {
    return this.toString() === uuid.toString();
  }
}