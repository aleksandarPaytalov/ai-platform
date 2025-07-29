# AI Platform - Cursor Rules System

## Overview

This directory contains the complete rules system for the AI Platform project, designed to provide granular, controlled development through Cursor AI. Each rule represents a specific development task with detailed instructions, context, and verification checklists.

## Quick Navigation

### Core Rule Files
- [`standards/global-behavior.mdc`](./standards/global-behavior.mdc) - AI behavior and communication patterns
- [`standards/technology-standards.mdc`](./standards/technology-standards.mdc) - Technology stack standards and patterns
- [`standards/quality-standards.mdc`](./standards/quality-standards.mdc) - Code quality and testing requirements
- [`project-checklist.mdc`](./project-checklist.mdc) - Master progress tracking checklist

### Documentation Files
- [`NAMING_CONVENTIONS.md`](./NAMING_CONVENTIONS.md) - File and folder naming standards
- [`RULES_ARCHITECTURE.md`](./RULES_ARCHITECTURE.md) - System design and architecture documentation
- [`README.md`](./README.md) - This master index file

## Step-by-Step Development Guide

The development process is organized into 15 sequential steps, each containing specific tasks:

### Phase 1: Foundation Setup
- **[01-cursor-rules-setup/](./steps/01-cursor-rules-setup/)** - Meta-development rules (Tasks 1.1-1.6)
- **[02-infrastructure/](./steps/02-infrastructure/)** - Project setup and infrastructure (Tasks 2.1-2.5)
- **[03-supabase-project-setup/](./steps/03-supabase-project-setup/)** - Database and Supabase configuration (Tasks 3.1-3.5)

### Phase 2: Core Application
- **[04-app-structure/](./steps/04-app-structure/)** - Next.js application structure (Tasks 4.1-4.5)
- **[05-tool-data-display/](./steps/05-tool-data-display/)** - Tool display components (Tasks 5.1-5.5)
- **[06-navigation-system/](./steps/06-navigation-system/)** - Navigation and tabs (Tasks 6.1-6.5)

### Phase 3: Advanced Features
- **[07-realtime-integration/](./steps/07-realtime-integration/)** - Supabase real-time features (Tasks 7.1-7.5)
- **[08-feature-updates-display/](./steps/08-feature-updates-display/)** - Feature update system (Tasks 8.1-8.5)
- **[09-ai-integration/](./steps/09-ai-integration/)** - Anthropic API integration (Tasks 9.1-9.5)

### Phase 4: Automation & Enhancement
- **[10-automated-update-system/](./steps/10-automated-update-system/)** - Automated processing (Tasks 10.1-10.5)
- **[11-search-filtering/](./steps/11-search-filtering/)** - Search and filtering capabilities (Tasks 11.1-11.5)
- **[12-mobile-optimization/](./steps/12-mobile-optimization/)** - Mobile responsiveness (Tasks 12.1-12.5)

### Phase 5: Production Readiness
- **[13-performance-seo/](./steps/13-performance-seo/)** - Optimization and SEO (Tasks 13.1-13.5)
- **[14-testing-quality-assurance/](./steps/14-testing-quality-assurance/)** - Testing and QA (Tasks 14.1-14.5)
- **[15-production-deployment/](./steps/15-production-deployment/)** - Deployment and monitoring (Tasks 15.1-15.5)

## How to Use This Rules System

### For Developers

1. **Start with Prerequisites**: Ensure all previous steps are completed before beginning a new step
2. **Read the Full Rule**: Review the entire rule file before implementation
3. **Follow Instructions Precisely**: Rules are designed to be followed exactly as written
4. **Use the Checklist**: Complete all checklist items before marking a task as done
5. **Document Progress**: Update the project checklist as you complete each rule

### For Project Management

1. **Track Progress**: Use the master project checklist to monitor overall development status
2. **Identify Dependencies**: Review rule dependencies before assigning tasks
3. **Quality Assurance**: Verify checklist completion for each rule before approval
4. **Planning**: Use the step organization to plan development phases and timelines

### Rule Invocation

Rules are Manual-type and must be explicitly invoked:
```
Load rule: task-##-descriptive-name
```

Example:
```
Load rule: task-01-create-project-rules-structure
```

## Directory Structure

```
.cursor/rules/
├── project-checklist.mdc         # Master progress tracker
├── NAMING_CONVENTIONS.md         # Naming standards guide
├── RULES_ARCHITECTURE.md         # System architecture docs
├── README.md                     # This index file
├── standards/                    # Core rule standards
│   ├── global-behavior.mdc       # AI behavior patterns
│   ├── technology-standards.mdc  # Tech stack and standards
│   └── quality-standards.mdc     # Quality and testing rules
└── steps/                        # Organized step directories
    ├── 01-cursor-rules-setup/     # Foundation rules
    ├── 02-infrastructure/         # Project setup
    ├── 03-supabase-project-setup/ # Database setup
    ├── 04-app-structure/          # App architecture
    ├── 05-tool-data-display/      # Display components
    ├── 06-navigation-system/      # Navigation features
    ├── 07-realtime-integration/   # Real-time features
    ├── 08-feature-updates-display/# Update system
    ├── 09-ai-integration/         # AI capabilities
    ├── 10-automated-update-system/# Automation
    ├── 11-search-filtering/       # Search features
    ├── 12-mobile-optimization/    # Mobile support
    ├── 13-performance-seo/        # Optimization
    ├── 14-testing-quality-assurance/ # QA and testing
    └── 15-production-deployment/  # Deployment
```

## Key Features

- **Granular Control**: Each task is precisely defined and scoped
- **Sequential Development**: Logical progression through development phases
- **Comprehensive Documentation**: Detailed instructions and context for each rule
- **Quality Assurance**: Built-in checklists ensure completeness
- **Scalable Architecture**: Organized structure supports project growth

## Support and Maintenance

- Rules are living documents that evolve with the project
- Regular reviews ensure accuracy and relevance
- Updates follow established naming conventions and architecture
- Community feedback improves rule quality and usability

## Getting Started

1. Begin with [01-cursor-rules-setup/](./steps/01-cursor-rules-setup/) for initial rule configuration
2. Follow the sequential numbering system (01 → 02 → 03...)
3. Complete all checklist items before proceeding to the next rule
4. Refer to the architecture and naming convention documents as needed
5. Update the master project checklist as you progress

For detailed information about the rules system design, see [RULES_ARCHITECTURE.md](./RULES_ARCHITECTURE.md).
For naming conventions and standards, see [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md). 