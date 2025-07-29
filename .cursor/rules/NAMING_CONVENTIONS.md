# Naming Conventions

## File Naming Standards

### Rule Files
- Format: `task-##-descriptive-name.mdc`
- Example: `task-01-create-project-rules-structure.mdc`
- Use two-digit zero-padded numbers (01, 02, 03, etc.)
- Use kebab-case for descriptive names
- Always use `.mdc` extension for Cursor rule files

### Documentation Files
- Use SCREAMING_SNAKE_CASE for system documentation: `NAMING_CONVENTIONS.md`
- Use PascalCase for general documentation: `README.md`
- Use kebab-case for specific guides: `rules-architecture.md`

## Folder Naming Standards

### Numbered Step Directories
- Format: `##-kebab-case`
- Example: `01-cursor-rules-setup`
- Use two-digit zero-padded numbers for proper sorting
- Use kebab-case for descriptive names
- Keep names concise but descriptive

### General Directories
- Use kebab-case for multi-word directory names
- Use lowercase for single-word directories
- Examples: `rules`, `steps`, `documentation`

## Rule Naming Standards

### Rule Titles
- Use clear, descriptive, task-specific names
- Start with action verb when possible
- Include context and scope
- Example: "Create Master Project Rules Structure"

### Rule IDs
- Use kebab-case matching the filename
- Example: `task-01-create-project-rules-structure`

## Version Control Standards

### Commit Messages
- Format: `[RULE] task-##: Brief description`
- Example: `[RULE] task-01: Create project rules structure`

### Branch Naming
- Use `rule/task-##-brief-description` for rule development
- Example: `rule/task-01-project-structure`

### File Organization
- Keep related rule files in appropriate step directories
- Maintain consistent numbering across all files
- Use clear directory hierarchy for easy navigation

## Best Practices

1. **Consistency**: Always follow established patterns
2. **Clarity**: Names should be self-explanatory
3. **Sorting**: Use zero-padded numbers for proper alphabetical sorting
4. **Length**: Keep names concise but descriptive
5. **Hierarchy**: Reflect logical organization in naming structure 