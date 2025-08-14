import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToolCard } from '@/components/tools';
import { createMockTool } from './ToolCard.mocks';

describe('ToolCard accessibility', () => {
  it('has accessible roles and labels', () => {
    const tool = createMockTool();
    render(<ToolCard tool={tool} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByLabelText(/AI Tool card/i)).toBeInTheDocument();
  });
});


