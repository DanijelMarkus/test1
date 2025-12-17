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
# Friday — Intent-Driven Employee Assistant

A Next.js web application that provides a personalized, intent-driven employee experience with **Microsoft Entra ID SSO** and a **multi-agent orchestrator** backend. Built for enterprise scale with governance, compliance, and observability.

## 🎯 Overview

Friday is an agentic orchestrator that combines:
- **Personalized UI** - Single entry point for employees with cards for Schedule, News, Actions, Decisions, and Approvals
- **Microsoft Entra ID SSO** - Secure authentication using MSAL PKCE Authorization Code flow
- **Multi-Agent Orchestrator** - Five specialized agents working together to process user intents
- **MCP-Based Connectors** - Pluggable integrations with ServiceNow, Workday, and custom tools
- **Enterprise Governance** - Compliance checks, audit logging, and policy enforcement

## 🏗️ Architecture

### Frontend (Next.js + MSAL)
- **Authentication**: MSAL.js with PKCE flow for Entra ID SSO
- **Token Management**: `acquireTokenSilent` for seamless OBO token acquisition
- **Dashboard Cards**: 
  - Today's Schedule (Microsoft Graph Calendar)
  - News (SharePoint/Corporate updates)
  - Actions (Tasks and to-dos)
  - Decisions (Pending decisions requiring input)
  - Approvals (Expense reports, time-off requests, etc.)

### Backend (Next.js API Routes)
- **`/api/orchestrator`** - Main orchestration endpoint
- **`/api/copilot`** - Copilot Studio integration
- **`/api/connectors/*`** - Pluggable connector endpoints
  - `/api/connectors/servicenow/tickets` - ServiceNow Now Assist (MCP)
  - `/api/connectors/workday/timeoff` - Workday time-off requests
  - `/api/connectors/workday/expenses` - Workday expense submission
  - `/api/connectors/custom-mcp` - Custom MCP tool adapter

### Multi-Agent System

#### Agent A: Intent Understanding
- NLU-based intent classification
- Entity extraction from user utterances
- Pattern matching with confidence scoring

#### Agent B: Planner/Router
- Maps intents to appropriate agents/tools
- Creates execution plans
- Manages agent registry and discovery

#### Agent C: Executor
- Executes planned actions
- Invokes appropriate connectors with OBO tokens
- Handles Microsoft Graph API calls

#### Agent D: Memory & Context
- Maintains user profile and session state
- Tracks recent activity history
- Personalizes experiences based on preferences

#### Agent E: Guardrails & Compliance
- Enforces data access policies
- Validates sensitive operations
- Audit logging and rate limiting
- GDPR and enterprise compliance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Microsoft Entra ID tenant with app registration

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
git clone https://github.com/DanijelMarkus/test1.git
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
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Microsoft Entra ID
NEXT_PUBLIC_ENTRA_CLIENT_ID=your-client-id
NEXT_PUBLIC_ENTRA_TENANT_ID=your-tenant-id
NEXT_PUBLIC_ENTRA_REDIRECT_URI=http://localhost:3000

# Backend API
ENTRA_CLIENT_SECRET=your-client-secret

# Optional: External Connectors
SERVICENOW_INSTANCE_URL=https://your-instance.service-now.com
WORKDAY_API_ENDPOINT=https://your-tenant.workday.com
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Microsoft Entra ID Setup

### App Registration

1. Go to [Azure Portal](https://portal.azure.com) > Microsoft Entra ID > App registrations
2. Create a new registration:
   - **Name**: Friday Employee Assistant
   - **Supported account types**: Single tenant
   - **Redirect URI**: Web - `http://localhost:3000`

3. Note the **Application (client) ID** and **Directory (tenant) ID**

4. Under **Certificates & secrets**, create a new client secret

5. Under **API permissions**, add:
   - Microsoft Graph:
     - `User.Read` (Delegated)
     - `Calendars.Read` (Delegated)
     - `Sites.Read.All` (Delegated)

6. Under **Authentication**:
   - Enable **Access tokens** and **ID tokens**
   - Set **Supported account types** appropriately

## 🔧 API Usage

### Orchestrator Endpoint

Send natural language requests to the orchestrator:

```bash
curl -X POST http://localhost:3000/api/orchestrator \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "utterance": "Show me my meetings today",
    "context": {
      "userId": "user@example.com"
    }
  }'
```

Response:
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
      "type": "schedule.view",
      "confidence": 0.95,
      "entities": { "date": "today" }
    },
    "plan": {
      "selectedAgent": {
        "id": "graph-calendar",
        "name": "Microsoft Graph Calendar Agent"
      },
      "steps": [...]
    },
    "result": [...],
    "compliance": {
      "passed": true,
      "violations": [],
      "warnings": []
    },
    "executionTime": 234
  }
}
```

### ServiceNow Connector

Create a ServiceNow ticket:

```bash
curl -X POST http://localhost:3000/api/connectors/servicenow/tickets \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shortDescription": "Network connectivity issue",
    "description": "Unable to access internal network resources",
    "priority": "2"
  }'
```

### Workday Connector

Request time off:

```bash
curl -X POST http://localhost:3000/api/connectors/workday/timeoff \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2024-12-20",
    "endDate": "2024-12-31",
    "type": "vacation",
    "reason": "Holiday vacation"
  }'
```

## 🏢 Enterprise Features

### OAuth 2.0 On-Behalf-Of (OBO) Flow
- Frontend acquires user token via MSAL
- Backend exchanges token for downstream service tokens
- Maintains user identity across all operations

### Agent Registry / Agent365 Mock
- Centralized agent discovery and registration
- Capability-based agent selection
- Supports Agent ID / Microsoft Entra integration

### Compliance & Governance
- Pre-execution compliance checks
- Audit logging for all operations
- Rate limiting and policy enforcement
- GDPR-compliant data handling

### MCP (Model Context Protocol)
- Standardized tool integration
- Reusable across different agents
- Pluggable connector architecture

## 📊 Monitoring & Observability

All operations are logged with:
- User ID
- Intent type
- Selected agent
- Execution time
- Success/failure status
- Compliance check results

Access audit logs:
```bash
curl http://localhost:3000/api/orchestrator/audit?userId=user@example.com
```

## 🔒 Security

- **Authentication**: Microsoft Entra ID SSO with MSAL
- **Authorization**: Role-based access control (ready for implementation)
- **Token Management**: Secure token storage in sessionStorage
- **Compliance**: Built-in guardrails and policy enforcement
- **Audit Logging**: Complete audit trail for all operations

## 🛠️ Development

### Project Structure
```
.
├── app/
│   ├── api/                    # API routes
│   │   ├── orchestrator/       # Orchestrator endpoint
│   │   ├── copilot/            # Copilot Studio integration
│   │   └── connectors/         # External system connectors
│   ├── components/             # React components
│   │   ├── auth/               # Authentication components
│   │   ├── cards/              # Dashboard card components
│   │   └── layout/             # Layout components
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── lib/
│   ├── agents/                 # Multi-agent system
│   │   ├── intentAgent.ts      # Intent understanding
│   │   ├── plannerAgent.ts     # Planning & routing
│   │   ├── executorAgent.ts    # Execution
│   │   ├── memoryAgent.ts      # Context & memory
│   │   ├── guardrailsAgent.ts  # Compliance
│   │   └── orchestrator.ts     # Main orchestrator
│   ├── auth/                   # MSAL authentication
│   ├── connectors/             # External connectors
│   └── types/                  # TypeScript types
├── .env.example                # Environment variables template
└── package.json                # Dependencies
```

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

## 📝 Supported Intents

The system currently supports:

- **Schedule Management**: View/create meetings
- **News**: Corporate updates and announcements
- **Actions**: Task management
- **Decisions**: Approval workflows
- **ServiceNow**: Ticket creation and management
- **Workday**: Time-off requests and expense submission

## 🤝 Contributing

This is an enterprise internal tool. For contributions, please follow your organization's development guidelines.

## 📄 License

Internal use only - proprietary software.

## 🔗 References

- [Agentic Employee Experience Documentation](https://bayergroup-my.sharepoint.com/...)
- [Composable Agentic Ecosystem](https://bayergroup.sharepoint.com/...)
- [Microsoft Stack Architecture](https://bayergroup-my.sharepoint.com/...)
- [Agent ID / Entra Integration](https://teams.microsoft.com/...)

## 📞 Support

For support, please contact your IT department or the Friday development team.

---

Built with ❤️ using Next.js, TypeScript, and Microsoft Entra ID
