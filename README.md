## Requirements

- **Node.js**: v20.12.0
- **pnpm**: Dependency manager (handled by Corepack)

## Setup

### Using Node Version Manager (nvm)

If you are using `nvm` to manage Node versions, run the following command to switch to the correct version:

````bash
nvm use

Enable Corepack
To ensure you can use pnpm without manually installing it, enable Corepack by running:

```bash
corepack enable


Install Dependencies

```bash
pnpm install
````

Running the Application

```bash
pnpm dev
```

Running Tests

To run end-to-end tests with Cypress, ensure the app is running, then execute:

```bash
pnpm test:e2e
```

To run the unit tests, use:

```bash
pnpm test
```
