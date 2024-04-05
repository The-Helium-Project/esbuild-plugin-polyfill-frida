const shims = require("./shims");
const path = require("path");

module.exports = function () {
    return {
        name: "frida-node-polyfill",
        setup({ onResolve, initialOptions }) {
            const polyfills = [path.join(__dirname, "polyfills", "index.js")];
            if (initialOptions.inject)
                initialOptions.inject.push(...polyfills);
            else
                initialOptions.inject = [...polyfills];

            onResolve({ filter: /.*/ }, (args) => {
                const shim = shims.get(args.path.slice(args.path.startsWith("node:") ? 5 : 0));
                if (!shim) return;
                return {
                    path: require.resolve(shim)
                }
            })
        }
    }
}