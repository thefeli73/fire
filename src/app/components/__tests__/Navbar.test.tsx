import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { Navbar } from '../Navbar';

describe('Navbar', () => {
  it('uses an opaque mobile menu button', () => {
    render((<Navbar />) as unknown as ReactNode);

    const mobileMenuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(mobileMenuButton).toHaveClass('md:hidden');
    expect(mobileMenuButton).toHaveClass('border');
    expect(mobileMenuButton).toHaveClass('bg-background');
    expect(mobileMenuButton).toHaveClass('hover:bg-accent');
    expect(mobileMenuButton).not.toHaveClass('bg-gradient-to-br');
    expect(mobileMenuButton).not.toHaveClass('hover:bg-primary/10');
  });
});
