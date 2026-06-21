import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders the brand logo', () => {
    render(<App />);
    expect(screen.getByText('Spec')).toBeInTheDocument();
  });

  it('shows step 1 heading on initial render', () => {
    render(<App />);
    expect(screen.getByText('Set up your SAP project')).toBeInTheDocument();
  });

  it('renders the stepper with 4 steps', () => {
    render(<App />);
    expect(screen.getAllByText('Project setup').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Requirements')).toBeInTheDocument();
    expect(screen.getByText('Review scope')).toBeInTheDocument();
    expect(screen.getByText('Functional spec')).toBeInTheDocument();
  });

  it('renders the readiness panel', () => {
    render(<App />);
    expect(screen.getByText('Document readiness')).toBeInTheDocument();
  });

  it('shows the Continue button', () => {
    render(<App />);
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });
});
