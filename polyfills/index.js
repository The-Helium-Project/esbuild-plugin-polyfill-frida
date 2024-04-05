export { Buffer } from "buffer";
export * as process from "process";
export const window = {
  location: {
    href: 'http://localhost:80',
    origin: 'http://localhost:80',
    protocol: 'http:',
    host: 'localhost:80',
    hostname: 'localhost',
    port: '80',
    pathname: '/',
    search: '',
    hash: '',
  },
  navigator: {
    userAgent: 'Node.js',
  },
};
