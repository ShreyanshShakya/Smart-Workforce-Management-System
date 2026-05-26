import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatCard from './StatCard';
import { describe, it, expect } from 'vitest';

describe('StatCard Component', () => {
    it('renders the title and value correctly', () => {
        render(<StatCard title="Total Tasks" value={42} icon="📋" color="indigo" />);
        
        expect(screen.getByText('Total Tasks')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
        expect(screen.getByText('📋')).toBeInTheDocument();
    });

    it('applies the correct color classes', () => {
        const { container } = render(<StatCard title="Test" value={1} icon="X" color="rose" />);
        
        // Check if the container has rose-specific classes
        const iconDiv = container.querySelector('.text-rose-400');
        expect(iconDiv).toBeInTheDocument();
    });
});
