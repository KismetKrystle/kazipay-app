# 💸 KaziPay - Empowering Global Freelance Payments with XRPL

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?logo=react)](https://reactjs.org/)
[![Powered by XRPL](https://img.shields.io/badge/Powered%20by-XRPL-000000?logo=ripple)](https://xrpl.org/)

**KaziPay** is a decentralized payment platform that revolutionizes freelance transactions through milestone-based escrow contracts and intelligent trust scoring - all built on the XRP Ledger. Designed for the Global South, KaziPay bridges the gap between international clients and emerging-market talent with secure, low-fee payments.

## 🌟 Key Features

- 🔐 **Secure Wallet Integration** - Connect XRP wallets with robust authentication
- 📋 **Milestone-Based Escrow** - Smart contract-powered project funding with automatic release
- 🧠 **Intelligent Trust Scoring** - Credit evaluation based on XRPL transaction history
- 👥 **Dual Role Dashboards** - Separate interfaces for clients and freelancers
- ⚡ **Real-time Transactions** - Fast, low-fee payments via XRP Ledger
- 🏆 **NFT Rewards** - Users receive NFTs when reaching 750+ credit score
- 🔄 **Auto-Release Logic** - Automated milestone completion for inactive reviews

## 🛠️ Technology Stack

| Technology | Purpose | Implementation |
|------------|---------|----------------|
| **React** | Frontend UI framework | Component-based architecture with hooks |
| **JavaScript/TypeScript** | Core programming language | Strongly typed development experience |
| **Vite** | Build tool & dev server | Fast HMR and optimized production builds |
| **Tailwind CSS** | Utility-first CSS framework | Responsive, modern UI design |
| **Node.js + Express** | Backend API server | RESTful endpoints and middleware |
| **Supabase** | Backend-as-a-Service | Authentication, database, real-time features |
| **xrpl.js** | XRP Ledger integration | Wallet, Escrow, DID, Multi-token/NFT operations |
| **JWT** | Authentication tokens | Secure user session management |

## 🏗️ Project Structure

```
KaziPay-App/
├── 📁 frontend/                 # React application
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   ├── 📁 pages/           # Route components
│   │   ├── 📁 hooks/           # Custom React hooks
│   │   ├── 📁 services/        # API integration
│   │   └── 📁 utils/           # Helper functions
│   ├── 📄 package.json
│   └── 📄 vite.config.js
├── 📁 backend/                  # Express API server
│   ├── 📁 routes/              # API endpoints
│   ├── 📁 services/            # Business logic
│   ├── 📁 middleware/          # Auth & validation
│   └── 📄 server.js
├── 📁 contracts/               # XRPL smart contracts
│   ├── 📄 escrow_service.js    # Complete escrow lifecycle management
│   └── 📄 nft_rewards.js       # NFT minting for high-score users
└── 📄 README.md
```

## 🔐 Smart Contract Credit Scoring System

KaziPay features an innovative trust scoring mechanism that evaluates XRP wallet reliability based on transaction history and account activity. This creates transparency and builds confidence between clients and freelancers.

### 📊 Scoring Algorithm (Maximum: 850 points)

| **Factor** | **Description** | **Max Points** | **Formula** |
|------------|-----------------|----------------|-------------|
| **Base Score** | Starting score for all users | 300 | Fixed baseline |
| **Success Rate** | Transaction completion ratio | 100 | `(successfulTxs / totalTxs) × 100` |
| **Payment Activity** | Volume of payment transactions | 100 | `min(paymentTxs × 10, 100)` |
| **Account Age** | Wallet maturity indicator | 100 | `min(daysOld × 2, 100)` |
| **Transaction Volume** | Total XRP moved | 100 | `min(totalVolume / 1,000,000, 100)` |
| **Average Transaction** | Mean transaction size | 100 | `min(avgTxSize / 10,000, 100)` |
| **Verification Bonus** | DID-verified accounts | 50 | Binary bonus |
| **NFT Reward** | Unlocked at 750+ score | - | Exclusive NFT mint |

### 🔍 Data Sources & Implementation

- **Transaction Analysis**: Last 100 XRP Ledger transactions
- **Account Metrics**: Wallet creation date and activity patterns  
- **Success Tracking**: Completed vs failed transaction ratio
- **Identity Verification**: Decentralized Identity (DID) integration
- **Failsafe Protection**: Defaults to 300 points if calculation fails

The credit score is displayed via the `CreditScoreDisplay` component in the navigation bar when a wallet is connected and verified.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- XRP Ledger Testnet wallet ([Get testnet XRP](https://xrpl.org/xrp-testnet-faucet.html))
- Supabase account ([Sign up free](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KaziPay-XRP-Team/KaziPay-App.git
   cd KaziPay-App
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

### Development Server

**Start the frontend** (runs on `http://localhost:5173`)
```bash
cd frontend
npm run dev
```

**Start the backend** (runs on `http://localhost:5000`)
```bash
cd backend
npm run dev
```

## 📱 Core Components

### Frontend Architecture
- **Wallet Connection**: XRPL wallet integration with xumm/crossmark support
- **Dashboard Components**: Role-based UI for clients and freelancers
- **Milestone Management**: Create, fund, and track project milestones
- **Credit Score Display**: Real-time trust score visualization

### Backend Services
- **Authentication API**: JWT-based user management
- **Project Management**: CRUD operations for projects and milestones
- **XRPL Integration**: Escrow contract creation and execution
- **Credit Scoring Engine**: Real-time wallet analysis and scoring

### Smart Contract Logic

The `escrow_service.js` smart contract manages the complete project lifecycle:

1. **Creates Project** - Establishes escrow and holds project payment in XRP until specific conditions are met
2. **Finishes Transaction** - Releases the escrowed XRP to the recipient once conditions are satisfied  
3. **Cancels Transaction** - Cancels the escrow if conditions aren't met within a specified timeframe

Additional contract features:
- **NFT Rewards**: Automatically mints exclusive NFTs for users achieving 750+ credit scores
- **Multi-token Support**: Handles various XRP Ledger tokens beyond native XRP

## 🌍 Use Cases

- **Freelance Marketplaces**: Secure milestone-based payments
- **Remote Work Platforms**: International contractor payments  
- **Service Marketplaces**: Trust-based transaction facilitation
- **Cross-border Payments**: Low-fee global money transfers

## 👥 Team

Built with ❤️ by the KaziPay development team:

- **Frontend Development** - React, UI/UX, Component Design : 
- **Backend Development** - API, Database, Authentication :
- **Smart Contract Development** - XRPL Integration, Escrow Logic :
- **Strategy & Documentation** - Product Strategy, Technical Writing :
- **Product Manager & Architecture** - Logic, Systems and Setup : 

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: Coming Soon 🚀
- **Documentation**: [Wiki](../../wiki)
- **Issues**: [GitHub Issues](../../issues)
- **Discussions**: [GitHub Discussions](../../discussions)

## 🏆 Acknowledgments

- [Ripple](https://ripple.com) for XRP Ledger technology and developer resources
- [Supabase](https://supabase.com) for backend infrastructure
- [React](https://reactjs.org) and [Vite](https://vitejs.dev) for frontend tooling
- The global freelance community for inspiration and feedback

---

⭐ **Star this repo** if you find KaziPay useful for your projects!

💬 **Questions?** Open an [issue](../../issues) or start a [discussion](../../discussions)

🐛 **Found a bug?** Please report it [here](../../issues/new?template=bug_report.md)
