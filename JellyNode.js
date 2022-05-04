/**
 * JellyNode
 * Node.JS emulator/sandbox for browser
 * Emulated node version: Node.js v16.13.0
 */

 const JellyNode = {};
 JellyNode.API = {};
 
 /** Sandboxes a piece of JavaScript code in a Node.JS environment. */
 JellyNode.sandbox = ((code) => {
     let globalThis_keys = Object.keys(globalThis || {}).map(key => key === 'import' ? '' : `const ${key} = undefined;`);
     let window_keys = Object.keys(window || {}).map(key => key === 'import' ? '' : `const ${key} = undefined;`);
     let node_keys = Object.keys(JellyNode.API || {}).map(key => `const ${key} = (${JellyNode.API[key].toString()}); globalThis[${key}] = ${key};`);
     let _keys = [...new Set([...globalThis_keys, ...window_keys, ...node_keys])].join('\n');
     let sandbox = `"lovin' it in the sandbox.";\nconst globalThis = {};\n${_keys}\n${code}`;
 
     return eval(sandbox);
 });
 
 /** Fetches a file using synchronous HTTP GET. */
 JellyNode.get = ((url) => {
     var xmlHttp = new XMLHttpRequest();
     xmlHttp.open("GET", url, false);
     xmlHttp.send(null);
     return xmlHttp.responseText;
 });
 
 /** Adds a module to the current sandbox. */
 JellyNode.API.require = ((name) => {
     if (JellyNode.modules[name]) {
         return JellyNode.modules[name];
     } else {
         let unpkg_module = JellyNode.get('https://unpkg.com/' + name);
         if(unpkg_module) {
             return JellyNode.sandbox(unpkg_module);
         } else {
             throw new Error('Unable to find module "' + name + '"');
         }
     }
 });
 
 /** Emits all APIs to globalThis. */
 JellyNode.import = (() => {
     globalThis.node = JellyNode;
     for (let key of Object.keys(JellyNode)) {
         globalThis[key] = JellyNode[key];
     }
 });
 
 /** Emit all APIs to gloablThis, This shouldn't be used in production. */
 JellyNode.import();