## How to build what you can not see ? 
## This is the problem and our solution.



• we are aware about the risk of uploading .env file in githbu repo

# Gaza Rebuild Hub

## Impact In Gaza

Gaza Rebuild Hub turns reconstruction progress into verifiable evidence. It connects projects to real updates so communities, donors, and engineers can see what is happening and trust what is reported.

Key impact:
- Builds transparency for critical infrastructure and housing projects.
- Enables verifiable progress updates that cannot be quietly altered.
- Improves coordination by giving all stakeholders a shared truth layer.

## What This Is

This project combines a web dashboard with an on-chain ledger of project updates:
- The web app shows projects, progress, and needs.
- The blockchain contract stores time-stamped updates (status + proof hash).
- The oracle script posts verified updates to the chain.

## How The Blockchain Helps

The blockchain layer is used as a tamper-evident log of project status updates:
- Each update is recorded with a timestamp, status, and IPFS hash.
- Only the trusted oracle wallet can post updates.
- Anyone can independently read and verify the update history.

## Run The Web App

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

## Post An On-Chain Update (Oracle)

1. Create `.env` in the project root:
   ```env
   PRIVATE_KEY=0x...
   ```
2. Set the contract address in `oracle-push.cjs`.
3. Run:
   ```bash
   node oracle-push.cjs
   ```

## Smart Contract

The smart contract lives in `blockchain/src/GazaRebuildLedger.sol` and exposes:
- `addUpdate(projectId, ipfsHash, status)` for oracle updates
- `getProjectUpdates(projectId)` for reads

## License

MIT
