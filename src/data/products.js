// Sample products database for ChemZwap
export const productsData = [
    {
        id: '140732',
        productName: 'N,N-Dimethylformamide dimethyl acetal',
        synonyms: 'DMF-DMA, Dimethylformamide dimethyl acetal',
        casNumber: '4637-24-5',
        einecs: '225-094-1',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
        category: 'organic-chemistry'
    },
    {
        id: '1',
        productName: 'Acetone (Technical Grade)',
        synonyms: 'Propanone, 2-Propanone, Dimethyl ketone',
        casNumber: '67-64-1',
        einecs: '200-662-2',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&auto=format&fit=crop&q=80',
        category: 'organic-chemistry'
    },
    {
        id: '2',
        productName: 'Sodium Chloride (AR Grade)',
        synonyms: 'Table Salt, Common Salt, Halite',
        casNumber: '7647-14-5',
        einecs: '231-598-3',
        image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&auto=format&fit=crop&q=80',
        category: 'inorganic-chemistry'
    },
    {
        id: '3',
        productName: 'Ethanol (99.9% Pure)',
        synonyms: 'Ethyl Alcohol, Grain Alcohol, Absolute Ethanol',
        casNumber: '64-17-5',
        einecs: '200-578-6',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&auto=format&fit=crop&q=80',
        category: 'organic-chemistry'
    },
    {
        id: '4',
        productName: 'Hydrochloric Acid (35-37%)',
        synonyms: 'Muriatic Acid, Hydrogen Chloride Solution',
        casNumber: '7647-01-0',
        einecs: '231-595-7',
        image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&auto=format&fit=crop&q=80',
        category: 'inorganic-chemistry'
    },
    {
        id: '5',
        productName: 'Sulfuric Acid (98%)',
        synonyms: 'Oil of Vitriol, Battery Acid',
        casNumber: '7664-93-9',
        einecs: '231-639-5',
        image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&auto=format&fit=crop&q=80',
        category: 'inorganic-chemistry'
    },
    {
        id: '6',
        productName: 'Methanol (HPLC Grade)',
        synonyms: 'Methyl Alcohol, Wood Alcohol, Carbinol',
        casNumber: '67-56-1',
        einecs: '200-659-6',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&auto=format&fit=crop&q=80',
        category: 'analytical-chemistry'
    },
    {
        id: '7',
        productName: 'Sodium Hydroxide Pellets',
        synonyms: 'Caustic Soda, Lye, Sodium Hydrate',
        casNumber: '1310-73-2',
        einecs: '215-185-5',
        image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&auto=format&fit=crop&q=80',
        category: 'inorganic-chemistry'
    },
    {
        id: '8',
        productName: 'Acetonitrile (HPLC Grade)',
        synonyms: 'Methyl Cyanide, Cyanomethane',
        casNumber: '75-05-8',
        einecs: '200-835-2',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&auto=format&fit=crop&q=80',
        category: 'analytical-chemistry'
    },
    {
        id: '9',
        productName: 'Potassium Permanganate',
        synonyms: 'Permanganate of Potash, Condy\'s Crystals',
        casNumber: '7722-64-7',
        einecs: '231-760-3',
        image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&auto=format&fit=crop&q=80',
        category: 'inorganic-chemistry'
    },
    {
        id: '10',
        productName: 'Tris Buffer (Molecular Biology Grade)',
        synonyms: 'Tris(hydroxymethyl)aminomethane, THAM',
        casNumber: '77-86-1',
        einecs: '201-064-4',
        image: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=800&auto=format&fit=crop&q=80',
        category: 'biotechnology'
    }
];

// Helper function to get product by ID
export const getProductById = (id) => {
    return productsData.find(product => product.id === id);
};

// Helper function to get products by category
export const getProductsByCategory = (categoryId) => {
    return productsData.filter(product => product.category === categoryId);
};
