// @vitest-environment jsdom
import React from 'react';
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { WelcomeModal } from '../src/components/common/WelcomeModal';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

it('shows the first-visit welcome with dark text and readable typography', () => {
  render(<WelcomeModal onExplore={vi.fn()} />);

  const dialog = screen.getByRole('dialog', { name: 'Welcome to Bioinformatics Hub' });
  expect(dialog.className).toContain('bg-white');
  expect(dialog.className).toContain('font-sans');
  expect(dialog.className).toContain('overflow-y-auto');
  expect(screen.getByRole('heading', { name: 'Welcome to Bioinformatics Hub' }).className).toContain('text-slate-950');
  expect(document.getElementById('welcome-description')?.className).toContain('text-base');
  expect(document.getElementById('welcome-description')?.className).toContain('text-slate-800');
  for (const heading of screen.getAllByRole('heading', { level: 4 })) {
    expect(heading.className).toContain('text-base');
    expect(heading.className).toContain('text-slate-950');
  }
});

it('opens the hub and remembers that the welcome was dismissed', () => {
  const onExplore = vi.fn();
  render(<WelcomeModal onExplore={onExplore} />);

  fireEvent.click(screen.getByRole('button', { name: 'Explore Hub' }));

  expect(onExplore).toHaveBeenCalledOnce();
  expect(localStorage.getItem('arif_bio_welcome_seen')).toBe('true');
  expect(screen.queryByRole('dialog')).toBeNull();
});

it('allows skipping or closing the welcome without navigating', () => {
  for (const buttonName of ['Skip for now', 'Close modal']) {
    localStorage.clear();
    const onExplore = vi.fn();
    const view = render(<WelcomeModal onExplore={onExplore} />);

    fireEvent.click(screen.getByRole('button', { name: buttonName }));

    expect(onExplore).not.toHaveBeenCalled();
    expect(localStorage.getItem('arif_bio_welcome_seen')).toBe('true');
    expect(screen.queryByRole('dialog')).toBeNull();
    view.unmount();
  }
});

it('keeps the welcome hidden for returning visitors', () => {
  localStorage.setItem('arif_bio_welcome_seen', 'true');
  render(<WelcomeModal onExplore={vi.fn()} />);

  expect(screen.queryByRole('dialog')).toBeNull();
});
