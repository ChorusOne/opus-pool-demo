# OPUS Pool SDK Example

## Prerequisites 📋

### Project Stack

-   The project runs on **Node.js (version 18)** and **npm (version 8)**, please make sure these are installed
-   It is built with **TypeScript** and **React**, and bundled using **Vite**.
-   For data management, **React Query** is utilized.
-   It leverages **Wagmi**, **viem**, and **WalletConnect** for web3 wallet connections.

### 📣 Environment Setup

To run OPUS Pool SDK Example it is required to configure **WalletConnect**. To set this up:

-   **Copy** the `.env.dist` file to `.env` to create your local environment settings.
-   **Create** a new project on [WalletConnect Cloud](https://cloud.walletconnect.com) to obtain your unique project ID.
-   **Use** this `projectId` in your `.env` file, linking your development environment to the blockchain.

## Setup 🛠️

To get the frontend up and running, follow these steps:

1. Install the dependencies:

    ```bash
    npm install
    ```

2. Start the development server:

    ```bash
    npm run dev
    ```

3. Once the development server is started, open your browser and navigate to `http://localhost:5173/opus-pool-demo/`.

## Additional Resources 📚

-   To see the OPUS Pool SDK Example in action, check out the live demo [here][demo].
-   For a detailed guide on how to use the OPUS Pool SDK, based on this example, refer to our [Guide][guide].
-   Comprehensive API documentation can be found at [API Docs][api].
-   To explore more about the SDK, visit the official [Opus Pool SDK repository][sdk-repo].

[demo]: https://chorusone.github.io/opus-pool-demo/
[guide]: https://chorus-one.gitbook.io/opus-pool-sdk-1.0/opus-pool-guide/0-introduction
[api]: https://chorus-one.gitbook.io/opus-pool-sdk-1.0/api-docs/opuspool
[sdk-repo]: https://github.com/ChorusOne/opus-pool-sdk
