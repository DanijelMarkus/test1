# Danci - Enterprise Portal

A modern Next.js web application featuring Entra ID SSO authentication (using MSAL PKCE) and a Copilot-backed API with an advanced orchestrator agent system.

## Features

### 🔐 Authentication
- **Entra ID SSO** using MSAL (Microsoft Authentication Library)
- **PKCE flow** for enhanced security
- Session-based authentication with automatic token refresh

### 🎯 Home UI
- **Welcome Section** with personalized greeting
- **Intelligent Search Bar** powered by orchestrator agents
- **Dashboard Cards**:
  - 📅 Schedule - View your calendar and upcoming meetings
  - 📰 News - Company announcements and updates
  - ✓ Actions - Your pending tasks and action items
  - ⚖️ Decisions - Items requiring your decision
  - ✓ Approvals - Pending approval requests

### 🤖 Orchestrator Agents

The application uses five specialized AI agents that work together:

1. **Intent Agent** - Analyzes user input to determine intent and extract entities
2. **Planner Agent** - Creates execution plans based on identified intents
3. **Executor Agent** - Executes plans by calling appropriate connectors
4. **Memory Agent** - Maintains conversation history and context
5. **Guardrails Agent** - Validates and sanitizes inputs/outputs for security

### 🔌 Connectors

Built-in connectors using the MCP (Model Context Protocol):

- **ServiceNow Now Assist (MCP)** - Incident management and IT service desk
- **Workday (MCP)** - HR, payroll, and employee management
- **Custom Connector** - General-purpose data fetching

### 🔧 Adapter System

Extensible adapter system allows adding new connectors easily:
- **BaseAdapter** - Foundation for creating custom adapters
- **GenericAdapter** - For standard REST API integration
- Easy integration with any external system

## Architecture

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
    ┌────▼────────────────────────────┐
    │  Orchestrator                   │
    │  ┌─────────────────────────┐   │
    │  │ A. Intent Agent         │   │
    │  │ B. Planner Agent        │   │
    │  │ C. Executor Agent       │   │
    │  │ D. Memory Agent         │   │
    │  │ E. Guardrails Agent     │   │
    │  └─────────────────────────┘   │
    └────────┬────────────────────────┘
             │
    ┌────────▼─────────────────┐
    │  Connector Registry      │
    │  ┌────────────────────┐  │
    │  │ ServiceNow (MCP)   │  │
    │  │ Workday (MCP)      │  │
    │  │ Custom Connector   │  │
    │  └────────────────────┘  │
    └──────────────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Azure AD / Entra ID application credentials
- (Optional) ServiceNow and Workday API credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd test1
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` with your credentials:
```env
# Azure AD / Entra ID Configuration
NEXT_PUBLIC_AZURE_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_AZURE_TENANT_ID=your_tenant_id_here
NEXT_PUBLIC_AZURE_REDIRECT_URI=http://localhost:3000

# Optional: Connector Configuration
SERVICENOW_INSTANCE_URL=your_servicenow_instance
SERVICENOW_API_KEY=your_servicenow_api_key
WORKDAY_TENANT_URL=your_workday_tenant
WORKDAY_API_KEY=your_workday_api_key

# Optional: OpenAI/Copilot Configuration
OPENAI_API_KEY=your_openai_api_key
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_API_KEY=your_azure_openai_key
```

### Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## API Endpoints

### POST /api/orchestrator
Process user queries through the orchestrator system.

**Request:**
```json
{
  "query": "Show my schedule",
  "userId": "user-123",
  "context": {}
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "intent": {
      "action": "schedule",
      "confidence": 0.85,
      "entities": {}
    },
    "results": [...]
  }
}
```

### POST /api/copilot
Get AI-powered assistance and suggestions.

**Request:**
```json
{
  "prompt": "Help me with my tasks",
  "context": {}
}
```

### GET /api/connectors
List all available connectors.

### POST /api/connectors
Execute a connector action.

**Request:**
```json
{
  "connector": "servicenow",
  "action": "query_incidents",
  "params": {}
}
```

## Adding New Connectors

1. Create a new connector class extending `BaseConnector`:

```typescript
import { BaseConnector } from '@/lib/connectors/baseConnector';

export class MyConnector extends BaseConnector {
  name = 'my-connector';
  type: 'custom' = 'custom';

  async execute(action: string, params: Record<string, any>): Promise<any> {
    // Implement your logic
  }
}
```

2. Register the connector in `lib/connectors/registry.ts`:

```typescript
this.register(new MyConnector());
```

3. (Optional) Create an adapter for MCP protocol support:

```typescript
import { BaseAdapter } from '@/lib/adapters/baseAdapter';

export class MyAdapter extends BaseAdapter {
  adapt(request: any): MCPRequest {
    // Convert to MCP format
  }

  parseResponse(response: MCPResponse): any {
    // Parse MCP response
  }
}
```

## Security

- **PKCE Flow**: Proof Key for Code Exchange for secure OAuth authentication
- **Guardrails Agent**: Validates all inputs and outputs
- **Session Storage**: Secure token storage
- **Input Sanitization**: Protection against injection attacks
- **Sensitive Data Detection**: Prevents exposure of credentials and PII

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── orchestrator/ # Orchestrator endpoint
│   │   ├── copilot/      # Copilot endpoint
│   │   └── connectors/   # Connector endpoints
│   ├── layout.tsx        # Root layout with auth
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # UI components
│   │   └── SearchBar.tsx
│   └── cards/            # Dashboard cards
│       ├── ScheduleCard.tsx
│       ├── NewsCard.tsx
│       ├── ActionsCard.tsx
│       ├── DecisionsCard.tsx
│       └── ApprovalsCard.tsx
├── lib/
│   ├── auth/             # Authentication
│   │   ├── msalConfig.ts
│   │   └── AuthProvider.tsx
│   ├── agents/           # Orchestrator agents
│   │   ├── intentAgent.ts
│   │   ├── plannerAgent.ts
│   │   ├── executorAgent.ts
│   │   ├── memoryAgent.ts
│   │   └── guardrailsAgent.ts
│   ├── connectors/       # MCP connectors
│   │   ├── servicenowConnector.ts
│   │   ├── workdayConnector.ts
│   │   ├── customConnector.ts
│   │   └── registry.ts
│   ├── adapters/         # Connector adapters
│   │   ├── baseAdapter.ts
│   │   └── genericAdapter.ts
│   └── orchestrator.ts   # Main orchestrator
├── public/               # Static assets
├── .env.local.example    # Environment variables template
└── package.json          # Dependencies
```

## Technologies

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **MSAL** - Microsoft Authentication Library
- **React 19** - UI library

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
