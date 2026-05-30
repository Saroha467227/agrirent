import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import type { Equipment } from '@/data/equipment';

interface EquipmentCardProps {
  equipment: Equipment;
  compact?: boolean;
}

const availabilityConfig = {
  available: { label: 'Available Now', className: 'bg-sage' },
  booked: { label: 'Booked', className: 'bg-accent-gold' },
  coming_soon: { label: 'Coming Soon', className: 'bg-text-muted' },
};

export default function EquipmentCard({ equipment, compact = false }: EquipmentCardProps) {
  const availability = availabilityConfig[equipment.availability];

  if (compact) {
    return (
      <Link
        to={`/equipment/${equipment.id}`}
        className="block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 min-w-[280px]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={equipment.image}
            alt={equipment.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <span className={`absolute top-3 left-3 ${availability.className} text-white text-[0.6875rem] font-semibold rounded-pill px-2.5 py-1`}>
            {availability.label}
          </span>
        </div>
        <div className="p-4">
          <p className="text-[0.6875rem] font-medium text-text-muted uppercase tracking-wider">{equipment.category}</p>
          <h3 className="text-base font-semibold text-text-primary mt-0.5">{equipment.name}</h3>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-semibold text-text-primary">${equipment.pricePerDay}<span className="text-sm font-normal text-text-muted">/day</span></span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent-gold text-accent-gold" />
              <span className="text-sm text-text-secondary">{equipment.rating}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/equipment/${equipment.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span className={`absolute top-3 left-3 ${availability.className} text-white text-[0.6875rem] font-semibold rounded-pill px-2.5 py-1`}>
          {availability.label}
        </span>
        {equipment.horsepower && (
          <span className="absolute bottom-3 right-3 bg-charcoal text-white text-[0.6875rem] font-medium rounded px-2 py-0.5">
            {equipment.horsepower} HP
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="text-[0.6875rem] font-medium text-text-muted uppercase tracking-wider">{equipment.category}</p>
        <h3 className="text-lg font-semibold text-text-primary mt-0.5">{equipment.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <img
            src={equipment.owner.avatar}
            alt={equipment.owner.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-text-secondary">by {equipment.owner.name}</span>
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <MapPin className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs text-text-muted">{equipment.location}</span>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone/50">
          <span className="text-lg font-semibold text-text-primary">
            ${equipment.pricePerDay}<span className="text-sm font-normal text-text-muted">/day</span>
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent-gold text-accent-gold" />
            <span className="text-sm text-text-secondary">{equipment.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
