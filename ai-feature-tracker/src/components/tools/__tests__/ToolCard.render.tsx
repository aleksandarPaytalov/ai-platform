import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToolCard } from '@/components/tools';
import { createMockToolWithUpdate } from './ToolCard.mocks';

describe('ToolCard rendering', () => {
  it('renders tool name, description, and category', () => {
    const tool = createMockToolWithUpdate();
    render(<ToolCard tool={tool} />);
    expect(screen.getByText(tool.name as string)).toBeInTheDocument();
    expect(screen.getByText(/mock ai tool/i)).toBeInTheDocument();
    expect(screen.getByText(tool.category_name as string)).toBeInTheDocument();
  });
});


