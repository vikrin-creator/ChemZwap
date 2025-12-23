// Category hierarchy data for ChemZwap
// Structure: Category > Subcategory > Child Category

export const categoryData = [
    {
        id: 'analytical-chemistry',
        name: 'Analytical Chemistry',
        description: 'Comprehensive solutions for analytical testing and quality control',
        image: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop&q=80',
        subcategories: [
            {
                id: 'chromatography',
                name: 'Analytical Chromatography',
                childCategories: [
                    'HPLC Columns & Accessories',
                    'GC Columns & Supplies',
                    'TLC Plates & Supplies',
                    'Ion Chromatography',
                    'Column Care & Cleaning'
                ]
            },
            {
                id: 'reagents',
                name: 'Analytical Reagents',
                childCategories: [
                    'pH Indicators & Buffers',
                    'Titration Solutions',
                    'Chemical Standards',
                    'Reference Materials',
                    'Volumetric Solutions'
                ]
            },
            {
                id: 'sample-prep',
                name: 'Analytical Sample Preparation',
                childCategories: [
                    'Filtration Products',
                    'Extraction Supplies',
                    'SPE Cartridges',
                    'Sample Vials & Caps',
                    'Dilution & Dissolution'
                ]
            },
            {
                id: 'photometry',
                name: 'Photometry & Rapid Testing',
                childCategories: [
                    'Spectrophotometers',
                    'Colorimeters',
                    'Test Strips & Kits',
                    'Water Testing',
                    'Rapid Analysis Tools'
                ]
            },
            {
                id: 'reference-materials',
                name: 'Reference Materials',
                childCategories: [
                    'Certified Standards',
                    'Calibration Kits',
                    'QC Materials',
                    'Proficiency Testing',
                    'Traceability Standards'
                ]
            }
        ]
    },
    {
        id: 'organic-chemistry',
        name: 'Organic Chemistry',
        description: 'High-purity organic compounds and synthetic reagents',
        image: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&auto=format&fit=crop&q=80',
        subcategories: [
            {
                id: 'building-blocks',
                name: 'Building Blocks',
                childCategories: [
                    'Aldehydes & Ketones',
                    'Alcohols & Phenols',
                    'Amines & Anilines',
                    'Carboxylic Acids',
                    'Heterocyclic Compounds'
                ]
            },
            {
                id: 'solvents',
                name: 'Organic Solvents',
                childCategories: [
                    'Alkanes & Alkenes',
                    'Chlorinated Solvents',
                    'Ethers & Esters',
                    'Aromatic Solvents',
                    'Green Solvents'
                ]
            },
            {
                id: 'reagents-synthesis',
                name: 'Synthetic Reagents',
                childCategories: [
                    'Coupling Reagents',
                    'Protecting Groups',
                    'Oxidizing Agents',
                    'Reducing Agents',
                    'Catalysts'
                ]
            },
            {
                id: 'natural-products',
                name: 'Natural Products',
                childCategories: [
                    'Plant Extracts',
                    'Essential Oils',
                    'Alkaloids',
                    'Terpenes',
                    'Flavonoids'
                ]
            },
            {
                id: 'polymers',
                name: 'Polymers & Monomers',
                childCategories: [
                    'Polyethylene Glycols',
                    'Acrylates',
                    'Vinyl Compounds',
                    'Epoxy Resins',
                    'Specialty Polymers'
                ]
            }
        ]
    },
    {
        id: 'inorganic-chemistry',
        name: 'Inorganic Chemistry',
        description: 'Inorganic salts, metals, and specialty materials',
        image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&auto=format&fit=crop&q=80',
        subcategories: [
            {
                id: 'salts',
                name: 'Inorganic Salts',
                childCategories: [
                    'Chlorides & Fluorides',
                    'Sulfates & Sulfites',
                    'Nitrates & Nitrites',
                    'Phosphates',
                    'Carbonates & Bicarbonates'
                ]
            },
            {
                id: 'acids-bases',
                name: 'Acids & Bases',
                childCategories: [
                    'Mineral Acids',
                    'Strong Bases',
                    'Weak Acids',
                    'Buffer Solutions',
                    'pH Adjusters'
                ]
            },
            {
                id: 'metals',
                name: 'Metals & Metal Compounds',
                childCategories: [
                    'Precious Metals',
                    'Transition Metals',
                    'Metal Oxides',
                    'Metal Catalysts',
                    'Organometallics'
                ]
            },
            {
                id: 'nanomaterials',
                name: 'Nanomaterials',
                childCategories: [
                    'Metal Nanoparticles',
                    'Carbon Nanotubes',
                    'Quantum Dots',
                    'Graphene & 2D Materials',
                    'Magnetic Nanoparticles'
                ]
            },
            {
                id: 'ceramics',
                name: 'Ceramics & Materials',
                childCategories: [
                    'Silicon Compounds',
                    'Titanium Compounds',
                    'Zeolites',
                    'Specialty Ceramics',
                    'Refractory Materials'
                ]
            }
        ]
    },
    {
        id: 'lab-essentials',
        name: 'Lab Essentials',
        description: 'Essential laboratory supplies and consumables',
        image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&auto=format&fit=crop&q=80',
        subcategories: [
            {
                id: 'glassware',
                name: 'Glassware',
                childCategories: [
                    'Beakers & Flasks',
                    'Test Tubes & Vials',
                    'Pipettes & Burettes',
                    'Graduated Cylinders',
                    'Specialty Glassware'
                ]
            },
            {
                id: 'plasticware',
                name: 'Plasticware',
                childCategories: [
                    'Bottles & Containers',
                    'Pipette Tips',
                    'Centrifuge Tubes',
                    'Petri Dishes',
                    'Microplates'
                ]
            },
            {
                id: 'filtration',
                name: 'Filtration Products',
                childCategories: [
                    'Filter Papers',
                    'Membrane Filters',
                    'Syringe Filters',
                    'Filter Funnels',
                    'Vacuum Filtration'
                ]
            },
            {
                id: 'safety-equipment',
                name: 'Safety Equipment',
                childCategories: [
                    'Gloves & Protective Wear',
                    'Goggles & Face Shields',
                    'Lab Coats',
                    'Spill Kits',
                    'First Aid Supplies'
                ]
            },
            {
                id: 'lab-instruments',
                name: 'Lab Instruments',
                childCategories: [
                    'Balances & Scales',
                    'pH Meters',
                    'Stirrers & Shakers',
                    'Heating Equipment',
                    'Refrigeration'
                ]
            }
        ]
    },
    {
        id: 'biotechnology',
        name: 'Biotechnology',
        description: 'Life science research and biotech applications',
        image: 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=600&auto=format&fit=crop&q=80',
        subcategories: [
            {
                id: 'cell-culture',
                name: 'Cell Culture',
                childCategories: [
                    'Culture Media',
                    'Serum & Supplements',
                    'Cell Culture Reagents',
                    'Culture Vessels',
                    'Cell Lines'
                ]
            },
            {
                id: 'molecular-biology',
                name: 'Molecular Biology',
                childCategories: [
                    'DNA/RNA Extraction',
                    'PCR Reagents',
                    'Cloning Vectors',
                    'Enzymes',
                    'Molecular Markers'
                ]
            },
            {
                id: 'protein-research',
                name: 'Protein Research',
                childCategories: [
                    'Protein Standards',
                    'Antibodies',
                    'Protein Purification',
                    'Electrophoresis',
                    'Western Blotting'
                ]
            },
            {
                id: 'biochemicals',
                name: 'Biochemicals',
                childCategories: [
                    'Amino Acids & Peptides',
                    'Nucleotides',
                    'Carbohydrates',
                    'Lipids',
                    'Cofactors & Vitamins'
                ]
            },
            {
                id: 'microbiology',
                name: 'Microbiology',
                childCategories: [
                    'Culture Media',
                    'Antibiotics',
                    'Stains & Dyes',
                    'Petri Dishes',
                    'Microbiological Testing'
                ]
            }
        ]
    }
];
