import { DirectoryRecord, Field, SystemConfig, User } from './types';

export const systemConfig: SystemConfig = {
    settingId: "Global",
    logo: "https://placehold.co/200x50/D4AF37/000000?text=LUXE",
    heroImage: "https://toolset.com/wp-content/uploads/2020/05/toolset-homepage-hero-section-example.png",
    heroText: "Exclusive Listings",
    primaryColor: "#D4AF37",
    colorSecondary: "#0F0F13",
    colorBackground: "#050505",
    defaultLayout: "Grid",
    anonymousAccess: true,
    borderRadius: "0.5rem"
};

export const mockUsers: User[] = [
    {
        id: 'admin-1',
        email: 'admin@luxedir.com',
        password: 'Admin@Luxe2026',
        role: 'Admin',
        name: 'Super Admin',
        isActive: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    },
    {
        id: 'owner-1',
        email: 'owner@luxedir.com',
        password: 'Owner@Luxe2026',
        role: 'Owner',
        name: 'John Luxury',
        isActive: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Owner'
    },
    {
        id: 'user-1',
        email: 'guest@luxedir.com',
        password: 'User@Luxe2026',
        role: 'User',
        name: 'Guest User',
        isActive: true,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
    }
];

export const formSchema: Field[] = [
    {
        id: "State_01",
        name: "State",
        type: "choice-checkbox",
        navigable: true,
        filterable: true,
        options: ["Gujarat", "Maharashtra", "Rajasthan"],
        group: "Location Details"
    },
    {
        id: "Rating_01",
        name: "Rating",
        type: "number",
        sortable: true,
        group: "Performance"
    },
    {
        id: "Amenities_01",
        name: "Amenities",
        type: "choice-checkbox",
        options: ["Wifi", "Parking", "Pool", "Gym", "Valet"],
        filterable: true,
        group: "Features"
    }
];

const states = ["Gujarat", "Maharashtra", "Rajasthan"];

const generateRecords = (): DirectoryRecord[] => {
    const records: DirectoryRecord[] = [];
    const amenitiesList = ["Valet", "Wifi", "Pool", "Gym", "Parking"];

    for (let i = 1; i <= 100; i++) {
        let category: 'Premium' | 'Executive' | 'Boutique' = 'Boutique';
        if (i <= 40) category = 'Premium';
        else if (i <= 80) category = 'Executive';

        const state = states[i % states.length];

        // Deterministic Amenities based on index
        const amenities = amenitiesList.filter((_, index) => (i + index) % 3 === 0);

        records.push({
            id: `record-${i}`, // Deterministic ID
            ownerId: i % 2 === 0 ? 'owner-1' : 'admin-1', // Deterministic Owner allocation
            category,
            name: `${category} Listing ${i}`,
            address: `${100 + i} Luxury Blvd, ${state}`,
            image: `https://placehold.co/600x400/1a1a1a/D4AF37?text=${category}+${i}`,
            data: {
                "State_01": [state],
                "Rating_01": parseFloat((4.0 + (i % 10) / 10).toFixed(1)), // Deterministic Rating 4.0-4.9
                "Amenities_01": amenities
            }
        });
    }
    return records;
};

export const mockRecords = generateRecords();
