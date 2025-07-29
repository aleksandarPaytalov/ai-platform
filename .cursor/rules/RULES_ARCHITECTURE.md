# Rules System Architecture

## Overview

The AI Platform project uses a granular, controlled development approach through Cursor AI rules. Each rule is designed as a Manual-type rule to prevent scope creep and maintain precise control over the development process.

## Design Philosophy

### Granular Control
- Each task is broken down into specific, actionable rules
- Manual-type rules ensure explicit invocation and control
- Clear separation of concerns between different development phases

### Controlled Development
- Systematic progression through numbered steps
- Dependencies clearly defined between rules and tasks
- Comprehensive documentation for each development phase

### Scalable Organization
- Hierarchical folder structure for easy navigation
- Numbered sequence ensures logical progression
- Modular design allows for easy updates and maintenance

## Manual-Type Rules

### How They Work
- Manual-type rules require explicit invocation by developers
- Rules are not automatically applied during development
- Each rule contains specific instructions and acceptance criteria
- Rules include comprehensive checklists for verification

### Benefits
- Prevents unintended scope expansion
- Ensures deliberate, controlled development progress
- Allows for careful review at each step
- Maintains project quality and consistency

### Usage Pattern
1. Developer selects appropriate rule for current task
2. Rule provides detailed instructions and context
3. Developer follows rule guidelines precisely
4. Completion verified against rule checklist
5. Progress documented before moving to next rule

## System Architecture

### Directory Structure
```
.cursor/
└── rules/
    ├── project-checklist.mdc        # Master progress tracking
    ├── NAMING_CONVENTIONS.md        # Naming standards
    ├── RULES_ARCHITECTURE.md        # This document
    ├── README.md                    # Master index
    ├── standards/                   # Core rule standards
    │   ├── global-behavior.mdc      # AI behavior patterns
    │   ├── technology-standards.mdc # Tech stack standards
    │   └── quality-standards.mdc    # Code quality requirements
    └── steps/
        ├── 01-cursor-rules-setup/
        ├── 02-infrastructure/
        ├── 03-supabase-project-setup/
        ├── 04-app-structure/
        ├── 05-tool-data-display/
        ├── 06-navigation-system/
        ├── 07-realtime-integration/
        ├── 08-feature-updates-display/
        ├── 09-ai-integration/
        ├── 10-automated-update-system/
        ├── 11-search-filtering/
        ├── 12-mobile-optimization/
        ├── 13-performance-seo/
        ├── 14-testing-quality-assurance/
        └── 15-production-deployment/
```

### Rule File Structure
Each .mdc rule file contains:
- Frontmatter with metadata
- Context and background information
- Detailed instructions
- Expected outputs
- Comprehensive completion checklist

## Dependencies and Flow

### Sequential Dependencies
- Rules must be completed in numerical order
- Each step builds upon previous completed steps
- Dependencies clearly documented in each rule

### Cross-Step Dependencies
- Some rules may reference components from multiple steps
- Dependencies explicitly called out in rule documentation
- Integration points clearly defined

## Best Practices

### Rule Creation
1. Start with clear, specific objectives
2. Include comprehensive context and background
3. Provide detailed, actionable instructions
4. Create thorough completion checklists
5. Document all dependencies and prerequisites

### Rule Maintenance
1. Keep rules updated with project evolution
2. Version control all rule changes
3. Document breaking changes or updates
4. Maintain consistency across all rules

### Rule Usage
1. Read entire rule before starting implementation
2. Follow instructions precisely as written
3. Complete all checklist items before proceeding
4. Document any deviations or issues encountered

## Troubleshooting Guide

### Common Issues

#### Rule Not Found
- Verify correct file path and naming convention
- Check that rule file has proper .mdc extension
- Ensure rule exists in appropriate step directory

#### Rule Not Loading
- Verify frontmatter syntax is correct
- Check for proper YAML formatting in rule metadata
- Ensure file encoding is UTF-8

#### Dependency Issues
- Review prerequisite rules and ensure completion
- Check that all dependent components are in place
- Verify proper sequencing of rule execution

#### Checklist Failures
- Review all checklist items carefully
- Verify actual implementation matches requirements
- Check for missed steps or incomplete work

### Support and Maintenance
- Rules are living documents that evolve with the project
- Regular reviews ensure rules stay current and accurate
- Community feedback helps improve rule quality and clarity 