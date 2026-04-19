'use client';

import { Link } from '@/types';
import LinkCard from './LinkCard';

interface LinkGridProps {
  links: Link[];
}

export default function LinkGrid({ links }: LinkGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {links.map((link) => (
        <LinkCard key={link._id} link={link} />
      ))}
    </div>
  );
}
