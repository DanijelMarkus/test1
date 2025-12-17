# Friday Architecture Documentation

## System Overview

Friday is an intent-driven employee assistant that combines a modern Next.js frontend with a sophisticated multi-agent orchestrator backend. It's designed to provide a unified, personalized experience for enterprise employees while maintaining strict governance and compliance standards.

## Core Components

### 1. Frontend Layer

#### Authentication (MSAL)
- **Technology**: @azure/msal-browser, @azure/msal-react
- **Flow**: PKCE Authorization Code Flow
- **Token Management**: 
  - `acquireTokenSilent` for seamless token refresh
  - Automatic fallback to `acquireTokenPopup` on failure
  - Session storage for security

#### Dashboard UI
Five main card components providing at-a-glance information:

1. **Today's Schedule** (`ScheduleCard.tsx`)
   - Displays upcoming meetings from Microsoft Graph Calendar
   - Shows time, location, and attendees
   - Real-time updates

2. **News** (`NewsCard.tsx`)
   - Corporate news and announcements
   - SharePoint integration ready
   - Source attribution and timestamps

3. **Actions** (`ActionsCard.tsx`)
   - Task management and to-dos
   - Priority indicators (high, medium, low)
   - Due date tracking and status

4. **Decisions** (`DecisionsCard.tsx`)
   - Pending decisions requiring user input
   - Multiple choice options
   - Approval workflow integration

5. **Approvals** (`ApprovalsCard.tsx`)
   - Expense reports, time-off requests
   - Quick approve/reject actions
   - Amount display for financial items

### 2. Backend API Layer

#### Orchestrator Endpoint (`/api/orchestrator`)
Main entry point for all agentic operations:
- **POST**: Process natural language requests
- **GET**: List available agents
- Handles OBO token relay
- Returns structured responses with compliance checks

#### Copilot Integration (`/api/copilot`)
Integration with Microsoft Copilot Studio:
- Query processing
- Graph API grounding
- Fabric integration ready

#### Connector Endpoints (`/api/connectors/*`)
Pluggable architecture for external systems:

1. **ServiceNow** (`/api/connectors/servicenow/tickets`)
   - MCP-based integration
   - Ticket creation and management
   - Search and retrieval

2. **Workday** (`/api/connectors/workday/*`)
   - Time-off requests (`/timeoff`)
   - Expense submission (`/expenses`)
   - OAuth2 authenticated

3. **Custom MCP** (`/api/connectors/custom-mcp`)
   - Generic MCP tool execution
   - Knowledge search
   - Custom API calls

### 3. Multi-Agent Orchestrator

#### Agent A: Intent Understanding (`intentAgent.ts`)
**Responsibility**: Natural language understanding and intent classification

**Capabilities**:
- Pattern-based intent matching
- Entity extraction (dates, amounts, people)
- Confidence scoring
- Supports 13+ intent types

**Supported Intents**:
- `schedule.view`, `schedule.create`
- `news.view`
- `action.view`, `action.complete`
- `decision.view`, `decision.make`
- `approval.view`, `approval.process`
- `servicenow.ticket`
- `workday.timeoff`, `workday.expense`
- `help`

#### Agent B: Planner/Router (`plannerAgent.ts`)
**Responsibility**: Route intents to appropriate agents and create execution plans

**Capabilities**:
- Agent registry management
- Capability-based agent selection
- Multi-step execution planning
- Dynamic routing

**Registered Agents**:
1. Microsoft Graph Calendar Agent
2. Microsoft Graph News Agent
3. ServiceNow Now Assist Agent
4. Workday Integration Agent
5. Custom MCP Tool Agent

#### Agent C: Executor (`executorAgent.ts`)
**Responsibility**: Execute planned actions with appropriate connectors

**Capabilities**:
- Action execution with OBO tokens
- Connector invocation
- Microsoft Graph API calls
- Error handling and retry logic

**Supported Actions**:
- Calendar operations (fetch, create)
- News aggregation
- Task management
- Approval processing
- External connector calls

#### Agent D: Memory & Context (`memoryAgent.ts`)
**Responsibility**: Maintain user context and session state

**Capabilities**:
- User profile management
- Activity history tracking (last 50 activities)
- Preference management
- Session continuity

**Stored Context**:
- User profile (name, email, job title, department)
- Recent activity log
- User preferences (theme, language, card order)
- Session ID for continuity

#### Agent E: Guardrails & Compliance (`guardrailsAgent.ts`)
**Responsibility**: Enforce policies and maintain audit trails

**Capabilities**:
- Data access policy checks
- Sensitive operation validation
- Rate limiting (100 requests per 5 minutes)
- GDPR compliance warnings
- Comprehensive audit logging

**Compliance Checks**:
1. **Data Access**: Verifies user permissions and role
2. **Sensitive Operations**: Flags financial and external system access
3. **Rate Limits**: Prevents abuse and DoS
4. **Audit Logging**: Complete trail of all operations

### 4. Connector Layer

#### ServiceNow Connector (`servicenow.ts`)
**Protocol**: MCP (Model Context Protocol)

**Operations**:
- `createTicket`: Create incidents
- `getTicket`: Retrieve ticket details
- `updateTicket`: Modify existing tickets
- `searchTickets`: Query tickets

#### Workday Connector (`workday.ts`)
**Protocol**: OAuth2

**Operations**:
- `requestTimeOff`: Submit time-off requests
- `submitExpense`: Submit expense reports
- `getTimeOffBalance`: Check available leave
- `getExpenseReports`: List submitted expenses

#### Custom MCP Connector (`customMcp.ts`)
**Protocol**: MCP

**Tools**:
- `knowledge-search`: Internal knowledge base search
- `api-call`: Generic API invocation
- `data-transform`: Format conversion

## Data Flow

### Request Processing Flow

```
User → Frontend (MSAL) → acquireToken
  ↓
Frontend → POST /api/orchestrator (with Bearer token)
  ↓
Backend → Orchestrator.process()
  ↓
1. Memory Agent → Get/Update User Context
2. Intent Agent → Understand Intent
3. Planner Agent → Create Execution Plan
4. Guardrails Agent → Compliance Check
5. Executor Agent → Execute Plan
  ↓
Response → Frontend → UI Update
```

### Token Flow (OBO)

```
User Browser
  ↓ (MSAL PKCE)
Microsoft Entra ID → Access Token (User Context)
  ↓
Backend API
  ↓ (OBO Exchange)
Microsoft Entra ID → Downstream Tokens
  ↓
External Services (Graph, ServiceNow, Workday)
```

## Security Architecture

### Authentication
- **Microsoft Entra ID SSO** via MSAL
- **PKCE flow** for public clients
- **Token expiration**: Automatic refresh
- **Storage**: SessionStorage (no persistence)

### Authorization
- **OBO (On-Behalf-Of)** token flow
- User context maintained throughout request chain
- Scope-based access control ready

### Compliance
- Pre-execution compliance checks
- Audit logging for all operations
- Rate limiting per user
- GDPR compliance warnings
- Policy enforcement framework

## Scalability Considerations

### Current Implementation
- In-memory storage for context and audit logs
- Singleton orchestrator instance
- Synchronous execution

### Production Recommendations

1. **State Management**
   - Redis for session storage
   - Distributed cache for user context
   - Message queue for async operations

2. **Agent Scaling**
   - Containerize individual agents
   - Kubernetes orchestration
   - Load balancing across agent instances

3. **Observability**
   - Application Insights integration
   - Structured logging
   - Distributed tracing
   - Performance metrics

4. **Data Persistence**
   - Azure Cosmos DB for audit logs
   - SQL Database for user preferences
   - Blob Storage for attachments

## Extension Points

### Adding New Intents
1. Update `intentAgent.ts` with new patterns
2. Add capability to appropriate agent in `plannerAgent.ts`
3. Implement action in `executorAgent.ts`

### Adding New Connectors
1. Create connector class in `lib/connectors/`
2. Implement connector interface
3. Add API route in `app/api/connectors/`
4. Register in agent registry

### Adding New Agents
1. Create agent class implementing standard interface
2. Register in orchestrator
3. Update planner with routing logic
4. Add API endpoint if needed

## Configuration

### Environment Variables

#### Required
- `NEXT_PUBLIC_ENTRA_CLIENT_ID`: Application ID
- `NEXT_PUBLIC_ENTRA_TENANT_ID`: Tenant ID
- `NEXT_PUBLIC_ENTRA_REDIRECT_URI`: Redirect URL
- `ENTRA_CLIENT_SECRET`: Backend secret

#### Optional (Connectors)
- `SERVICENOW_INSTANCE_URL`: ServiceNow instance
- `SERVICENOW_CLIENT_ID`: ServiceNow OAuth client
- `WORKDAY_API_ENDPOINT`: Workday API URL
- `WORKDAY_CLIENT_ID`: Workday OAuth client
- `CUSTOM_MCP_ENDPOINT`: Custom MCP server URL

## Development Workflow

### Local Development
```bash
npm install
cp .env.example .env
# Configure environment variables
npm run dev
```

### Testing Orchestrator
```bash
curl -X POST http://localhost:3000/api/orchestrator \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"utterance": "Show my calendar", "context": {"userId": "user@example.com"}}'
```

### Building for Production
```bash
npm run build
npm start
```

## Future Enhancements

### Phase 2 (Planned)
- Real Microsoft Graph API integration
- Actual ServiceNow MCP implementation
- Workday OAuth2 implementation
- Azure OpenAI for advanced NLU
- Semantic Kernel integration

### Phase 3 (Proposed)
- Voice interface support
- Mobile applications
- Teams bot integration
- Advanced analytics dashboard
- Multi-language support

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [MSAL.js Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/overview)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Azure Entra ID](https://learn.microsoft.com/en-us/entra/identity/)

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainer**: Friday Development Team
