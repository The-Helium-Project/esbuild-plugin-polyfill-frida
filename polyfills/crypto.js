// Importing Buffer module from 'buffer'
import { Buffer } from 'buffer';
// Exporting functions and class
export default {
    createHash,
    randomBytes,
    randomFillSync,
    getRandomValues,
};
// Function to create a hash object
/**
 * Creates a hash object with the specified checksum type.
 * @param type The type of checksum algorithm to use.
 * @param options The hash options (optional).
 * @returns A new Hash object.
 */
export function createHash(type, options) {
    return new Hash(new Checksum(type), options);
}
// Class representing a hash object
export class Hash {
    /**
      * Constructs a new Hash object with the provided checksum.
      * @param checksum The checksum object to associate with this Hash instance.
      * @param options Optional options for the hash object.
      */
    constructor(checksum, options) {
        this.checksum = checksum;
        this.options = options;
    }
    // Method to update the hash with input data
    /**
     * Updates the hash with input data.
     * @param data The input data to update the hash with.
     * @param inputEncoding The encoding of the input data (optional).
     * @returns The Hash object for method chaining.
     */
    update(data, inputEncoding) {
        if (data instanceof DataView) {
            // If data is a DataView, convert it to Uint8Array and update the checksum
            const uint8Array = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
            this.checksum.update(uint8Array.buffer);
        }
        else if (inputEncoding !== undefined) {
            // If inputEncoding is specified, convert data to a Buffer and update the checksum
            if (typeof data !== 'string') {
                throw new Error('Input data must be a string when inputEncoding is specified');
            }
            const buffer = Buffer.from(data, inputEncoding);
            this.checksum.update(Array.from(buffer));
        }
        else if (data instanceof Buffer || data instanceof Uint8Array) {
            // If data is a Buffer or Uint8Array, convert it to an array and update the checksum
            this.checksum.update(Array.from(data));
        }
        else {
            // Otherwise, update the checksum directly
            this.checksum.update(data);
        }
        return this;
    }
    // Method to compute the hash digest in the specified encoding
    /**
     * Computes the hash digest in the specified encoding.
     * @param encoding The encoding of the hash digest (optional).
     * @returns The hash digest as a Buffer or string.
     */
    digest(encoding = 'binary') {
        if (encoding === 'hex') {
            // Return the checksum as a hexadecimal string
            return this.checksum.getString();
        }
        const rawDigest = Buffer.from(this.checksum.getDigest());
        if (encoding === 'binary') {
            // Return the raw digest as a Buffer
            return rawDigest;
        }
        // Otherwise, return the digest as a string in the specified encoding
        return rawDigest.toString(encoding);
    }
    // Method to create a copy of the hash object
    /**
     * Creates a copy of the hash object.
     * @returns A new Hash object identical to this one.
     */
    copy() {
        return new Hash(this.checksum, this.options);
    }
}
// Function to generate random bytes
/**
 * Generates random bytes with the specified size.
 * @param size The size of the random bytes to generate.
 * @param callback A callback function to handle the result (optional).
 * @returns If no callback is provided, returns a Buffer with random bytes.
 */
export function randomBytes(size, callback) {
    if (callback && typeof callback === 'function') {
        // If a callback function is provided, asynchronously generate random bytes
        const bytes = Buffer.allocUnsafe(size);
        getRandomValues(bytes); // Using getRandomValues to fill the buffer with random values
        callback(null, bytes);
    }
    else {
        // If no callback is provided, synchronously generate random bytes
        const bytes = Buffer.allocUnsafe(size);
        getRandomValues(bytes); // Using getRandomValues to fill the buffer with random values
        return bytes;
    }
}
// Function to fill a buffer with random values synchronously
/**
 * Fills the specified buffer with random values synchronously.
 * @param buffer The buffer to fill with random values.
 * @param offset The starting offset within the buffer (optional, defaults to 0).
 * @param size The number of bytes to fill (optional, defaults to the buffer length).
 * @returns The filled buffer.
 * @throws RangeError If the offset or size is invalid.
 */
export function randomFillSync(buffer, offset = 0, size) {
    if (!size)
        size = buffer.byteLength - offset;
    if (offset < 0 || size < 0 || offset + size > buffer.byteLength)
        throw new RangeError("Invalid offset or size");
    const uint8Array = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    // Fill the buffer with random bytes using getRandomValues function
    getRandomValues(uint8Array.subarray(offset, offset + size));
    // If buffer is a Buffer or Uint8Array, directly return it
    if (buffer instanceof DataView) {
        // If buffer is a DataView, return the updated DataView
        return new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
    }
    return buffer;
}
// Function to generate random values using the browser's crypto API or Node.js crypto module
/**
 * Generates random values using the browser's crypto API or Node.js crypto module.
 * @param buffer The buffer to fill with random values.
 * @returns The filled buffer with random values.
 */
export function getRandomValues(buffer) {
    // Check if the environment is a browser and if the crypto API is available
    //@ts-ignore
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        // If 'crypto.getRandomValues' is available in the browser, use it to fill the buffer with random values
        //@ts-ignore
        return window.crypto.getRandomValues(buffer);
        //@ts-ignore
    }
    else if (typeof global !== 'undefined' && global.crypto && global.crypto.getRandomValues) {
        // If 'crypto.getRandomValues' is available in Node.js, use it to fill the buffer with random values
        //@ts-ignore
        return global.crypto.getRandomValues(buffer);
    }
    else {
        // If neither browser crypto API nor Node.js crypto module is available, fill the buffer with pseudo-random values
        // This fallback mechanism is less secure than using a cryptographic source of randomness
        for (let i = 0; i < buffer.length; i++) {
            buffer[i] = Math.floor(Math.random() * 256);
        }
        return buffer;
    }
}
