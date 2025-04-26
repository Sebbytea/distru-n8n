![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-distru

This repository contains n8n community nodes to integrate with **Distru**, a full-stack inventory, warehouse, and order management platform. These nodes allow you to automate workflows interacting with the Distru API directly inside n8n.

To share your own nodes with the community, you must package them as an npm module, and [publish it on the npm registry](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry).

---

## Prerequisites

Make sure your development machine has the following installed:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/) version 18 or higher and [pnpm](https://pnpm.io/) package manager  
  *Install using nvm (Node Version Manager) on Linux, Mac, or WSL: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)*  
  *Windows users can refer to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows)*  
- Install n8n globally with:

  ```
  pnpm install -g n8n
  ```

- Recommended: follow the official n8n guide on [setting up a Node Development Environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/) for full details.

---

## Using this package

Here is how to quickly get started working with the Distru integration nodes:

1. Clone this repository:

   ```
   git clone https://github.com/Sebbytea/distru-n8n.git
   cd distru-n8n
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Open the project in your preferred editor.

4. Explore the source code in `/nodes` and `/credentials`. These contain the Distru nodes and API credential setup.

5. Update `package.json` for any personal project metadata if you fork or create your own package.

6. Use lint commands to keep code quality:

   ```
   pnpm lint
   pnpm lintfix
   ```

7. Build the package before running or publishing:

   ```
   pnpm build
   ```

8. Test your nodes locally inside n8n. Refer to [Run Your Node Locally](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/) for detailed instructions.

9. When ready, publish your node package to npm following the npm guidelines: [Publishing npm Packages](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry).

---

## Documentation

- Distru API documentation: [https://docs.distru.com/api](https://docs.distru.com/api)  
- n8n node creation guide: [https://docs.n8n.io/integrations/creating-nodes/](https://docs.n8n.io/integrations/creating-nodes/)  
- Node development environment setup: [https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/)  
- Testing custom nodes: [https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/](https://docs.n8n.io/integrations/creating-nodes/test/run-node-locally/)

---

## License

[MIT](LICENSE.md)

---

Let me know if you want help customizing for your particular repo setup or adding usage examples!
