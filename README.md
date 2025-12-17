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
git clone https://github.com/DanijelMarkus/test1.git
cd test1
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
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
