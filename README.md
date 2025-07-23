# BookParty TypeScript Project

A basic TypeScript project initialized with pnpm.

## Getting Started

### Prerequisites
- Node.js
- pnpm

### Installation
```bash
pnpm install
```

### Available Scripts

- `pnpm run dev` - Run the TypeScript file directly using ts-node
- `pnpm run build` - Compile TypeScript to JavaScript in the `dist` folder
- `pnpm run start` - Run the compiled JavaScript from the `dist` folder
- `pnpm run clean` - Remove the `dist` folder

### Project Structure
```
bookparty/
├── src/
│   └── index.ts          # Main TypeScript file
├── dist/                 # Compiled JavaScript (created after build)
├── package.json
├── tsconfig.json         # TypeScript configuration
└── README.md
```

## Usage

### Development
Run the TypeScript file directly:
```bash
pnpm run dev
```

### Production
Build and run the compiled version:
```bash
pnpm run build
pnpm run start
``` 