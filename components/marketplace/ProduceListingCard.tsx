// File location: components/marketplace/ProduceListingCard.tsx
// Displays a single farmer/FPO produce listing.
import Image from "next/image";

export interface ProduceListingCardProps { cropName: string; variety?: string; quantityKg: number; pricePerKg: number; location: string; farmerOrFpoName: string; harvestDate?: string; imageUrl?: string; isDemo?: boolean; onViewDetails?: () => void; onSendOffer?: () => void; }

export default function ProduceListingCard({ cropName, variety, quantityKg, pricePerKg, location, farmerOrFpoName, harvestDate, imageUrl, isDemo = false, onViewDetails, onSendOffer }: ProduceListingCardProps) {
  return <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
    {isDemo && <span className="absolute left-2 top-2 z-10 rounded-full bg-gray-800/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">Demo Listing</span>}
    <div className="relative h-36 w-full bg-gray-100">{imageUrl ? <Image src={imageUrl} alt={cropName} fill className="object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>}</div>
    <div className="p-4"><div className="flex items-baseline justify-between"><h3 className="font-semibold text-gray-900">{cropName}{variety && <span className="text-gray-500"> · {variety}</span>}</h3><span className="text-sm font-medium text-green-700">₹{pricePerKg.toFixed(2)}/kg</span></div>
      <p className="mt-1 text-sm text-gray-500">{quantityKg.toLocaleString()} kg available · {location}</p>
      <p className="mt-1 text-xs text-gray-400">{farmerOrFpoName}{harvestDate && ` · Harvested ${new Date(harvestDate).toLocaleDateString()}`}</p>
      <div className="mt-3 flex gap-2"><button type="button" onClick={onViewDetails} className="flex-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700">View details</button>{onSendOffer && <button type="button" onClick={onSendOffer} className="flex-1 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white">Send offer</button>}</div>
    </div>
  </div>;
}
