# Healthcare App UI

A sample healthcare application frontend built with Next.js, featuring appointment management and other healthcare-related functionalities. This application uses gRPC-web for efficient communication with backend services.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Protocol Buffers compiler (protoc)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd healthcare-app-ui
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Generate Protocol Buffer files:

```bash
npm run generate-proto
# or
yarn generate-proto
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
healthcare-app-ui/
├── proto/                 # Proto definition files
├── src/
│   ├── app/               # Next.js application routes
│   ├── components/        # React components
│   ├── generated/         # Auto-generated Proto/gRPC code
│   └── services/          # Service layer for API communication
├── scripts/               # Utility scripts (e.g., proto generation)
└── public/                # Static assets
```

## Technology Stack

- **Framework**: Next.js
- **UI Components**: React
- **API Communication**: gRPC-web
- **Data Definition**: Protocol Buffers
- **Styling**: CSS Modules/Tailwind CSS (as applicable)

## Proto/gRPC Setup

This project uses Protocol Buffers and gRPC-web for communication with backend services. The proto files define the service contracts and are used to generate TypeScript definitions.

To update the proto definitions:

1. Modify the .proto files in the `/proto` directory
2. Run the generation script:

```bash
npm run generate-proto
```

The script will:
- Generate JavaScript files with CommonJS imports
- Generate TypeScript definitions for gRPC web clients
- Place all generated files in the `/src/generated` directory

## Development

### Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build the application
- `npm run start` - Start production server
- `npm run generate-proto` - Generate files from proto definitions
- `npm run lint` - Run linting
- `npm run test` - Run tests (if configured)

## Deployment

The application can be deployed to any platform that supports Next.js applications, such as Vercel, Netlify, or a custom server.

```bash
npm run build
npm run start
```


