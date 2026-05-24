'use client';

import { Link } from '@/types';
import LinkCard from './LinkCard';

interface LinkGridProps {
  links: Link[];
}

export default function LinkGrid({ links }: LinkGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-8 auto-rows-fr items-stretch">
      {links.map((link) => (
        <LinkCard key={link._id} link={link} />
      ))}
    </div>
  );
}
