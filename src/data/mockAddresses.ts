// Local mock data standing in for a geocoding/places API (prototype only).

export type Address = {
  id: string;
  street: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  lat: number;
  lng: number;
};

export const MIN_SEARCH_LENGTH = 3;

export function formatAddress(a: Address) {
  return `${a.street}, ${a.district}, ${a.city}, ${a.province} ${a.postalCode}`;
}

const ADDRESSES: Address[] = [
  { id: "1", street: "Jalan Karet Pasar Baru Timur III No.10", district: "Karet Tengsin", city: "Jakarta Pusat", province: "Daerah Khusus Ibukota Jakarta", postalCode: "10250", lat: -6.2088, lng: 106.8176 },
  { id: "2", street: "Jalan Jenderal Sudirman Kav. 52-53", district: "Senayan", city: "Jakarta Selatan", province: "Daerah Khusus Ibukota Jakarta", postalCode: "12190", lat: -6.2255, lng: 106.8087 },
  { id: "3", street: "Jalan M.H. Thamrin No.1", district: "Gondangdia", city: "Jakarta Pusat", province: "Daerah Khusus Ibukota Jakarta", postalCode: "10310", lat: -6.1951, lng: 106.8227 },
  { id: "4", street: "Jalan Kemang Raya No.8", district: "Bangka", city: "Jakarta Selatan", province: "Daerah Khusus Ibukota Jakarta", postalCode: "12730", lat: -6.2615, lng: 106.8138 },
  { id: "5", street: "Jalan Pantai Kuta No.22", district: "Kuta", city: "Badung", province: "Bali", postalCode: "80361", lat: -8.7183, lng: 115.1686 },
  { id: "6", street: "Jalan Raya Seminyak No.17", district: "Seminyak", city: "Badung", province: "Bali", postalCode: "80361", lat: -8.6913, lng: 115.1683 },
  { id: "7", street: "Jalan Monkey Forest No.5", district: "Ubud", city: "Gianyar", province: "Bali", postalCode: "80571", lat: -8.5069, lng: 115.2625 },
  { id: "8", street: "Jalan Ir. H. Juanda No.101", district: "Dago", city: "Bandung", province: "Jawa Barat", postalCode: "40135", lat: -6.8915, lng: 107.6107 },
  { id: "9", street: "Jalan Braga No.45", district: "Braga", city: "Bandung", province: "Jawa Barat", postalCode: "40111", lat: -6.9175, lng: 107.6094 },
  { id: "10", street: "Jalan Malioboro No.60", district: "Sosromenduran", city: "Yogyakarta", province: "Daerah Istimewa Yogyakarta", postalCode: "55271", lat: -7.7926, lng: 110.3658 },
  { id: "11", street: "Jalan Tunjungan No.88", district: "Genteng", city: "Surabaya", province: "Jawa Timur", postalCode: "60275", lat: -7.2615, lng: 112.7384 },
  { id: "12", street: "Jalan Diponegoro No.12", district: "Citarum", city: "Semarang", province: "Jawa Tengah", postalCode: "50241", lat: -6.9932, lng: 110.4203 },
  { id: "13", street: "Jalan Gajah Mada No.30", district: "Petojo Utara", city: "Jakarta Pusat", province: "Daerah Khusus Ibukota Jakarta", postalCode: "10130", lat: -6.1659, lng: 106.8179 },
  { id: "14", street: "Jalan Imam Bonjol No.3", district: "Menteng", city: "Jakarta Pusat", province: "Daerah Khusus Ibukota Jakarta", postalCode: "10310", lat: -6.1983, lng: 106.8310 },
];

const SEARCH_DELAY_MS = 300;

/** Every whitespace-separated keyword must appear somewhere in the address. */
export function searchAddresses(query: string): Promise<Address[]> {
  const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results = ADDRESSES.filter((a) => {
    const haystack = formatAddress(a).toLowerCase();
    return keywords.every((k) => haystack.includes(k));
  });
  return new Promise((resolve) => setTimeout(() => resolve(results), SEARCH_DELAY_MS));
}

/** Stand-in for reverse geocoding: the mock address closest to a coordinate. */
export function nearestAddress(lat: number, lng: number): Address {
  const distance = (a: Address) => (a.lat - lat) ** 2 + ((a.lng - lng) * Math.cos((lat * Math.PI) / 180)) ** 2;
  return ADDRESSES.reduce((best, a) => (distance(a) < distance(best) ? a : best));
}
