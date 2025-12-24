<?php
/**
 * Seed Products Script
 * Run this to add initial products to the database
 * Usage: php seed-products.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/database.php';

echo "=== ChemZwap Products Seeder ===\n\n";

// Sample chemical products data
$products = [
    [
        'product_name' => 'N,N-Dimethylformamide dimethyl acetal',
        'synonyms' => 'DMF-DMA, Dimethylformamide dimethyl acetal',
        'cas_number' => '4637-24-5',
        'einecs' => '225-094-1',
        'category' => 'organic-chemistry'
    ],
    [
        'product_name' => 'Acetone (Technical Grade)',
        'synonyms' => 'Propanone, 2-Propanone, Dimethyl ketone',
        'cas_number' => '67-64-1',
        'einecs' => '200-662-2',
        'category' => 'organic-chemistry'
    ],
    [
        'product_name' => 'Sodium Chloride (AR Grade)',
        'synonyms' => 'Table Salt, Common Salt, Halite',
        'cas_number' => '7647-14-5',
        'einecs' => '231-598-3',
        'category' => 'inorganic-chemistry'
    ],
    [
        'product_name' => 'Ethanol (99.9% Pure)',
        'synonyms' => 'Ethyl Alcohol, Grain Alcohol, Absolute Ethanol',
        'cas_number' => '64-17-5',
        'einecs' => '200-578-6',
        'category' => 'organic-chemistry'
    ],
    [
        'product_name' => 'Hydrochloric Acid (35-37%)',
        'synonyms' => 'Muriatic Acid, Hydrogen Chloride Solution',
        'cas_number' => '7647-01-0',
        'einecs' => '231-595-7',
        'category' => 'inorganic-chemistry'
    ],
    [
        'product_name' => 'Sulfuric Acid (98%)',
        'synonyms' => 'Oil of Vitriol, Battery Acid',
        'cas_number' => '7664-93-9',
        'einecs' => '231-639-5',
        'category' => 'inorganic-chemistry'
    ],
    [
        'product_name' => 'Methanol (HPLC Grade)',
        'synonyms' => 'Methyl Alcohol, Wood Alcohol, Carbinol',
        'cas_number' => '67-56-1',
        'einecs' => '200-659-6',
        'category' => 'analytical-chemistry'
    ],
    [
        'product_name' => 'Sodium Hydroxide Pellets',
        'synonyms' => 'Caustic Soda, Lye, Sodium Hydrate',
        'cas_number' => '1310-73-2',
        'einecs' => '215-185-5',
        'category' => 'inorganic-chemistry'
    ],
    [
        'product_name' => 'Acetonitrile (HPLC Grade)',
        'synonyms' => 'Methyl Cyanide, Cyanomethane',
        'cas_number' => '75-05-8',
        'einecs' => '200-835-2',
        'category' => 'analytical-chemistry'
    ],
    [
        'product_name' => 'Potassium Permanganate',
        'synonyms' => 'Permanganate of Potash, Condy\'s Crystals',
        'cas_number' => '7722-64-7',
        'einecs' => '231-760-3',
        'category' => 'inorganic-chemistry'
    ],
    [
        'product_name' => 'Tris Buffer (Molecular Biology Grade)',
        'synonyms' => 'Tris(hydroxymethyl)aminomethane, THAM',
        'cas_number' => '77-86-1',
        'einecs' => '201-064-4',
        'category' => 'biotechnology'
    ],
    [
        'product_name' => 'Isopropyl Alcohol (IPA)',
        'synonyms' => '2-Propanol, Isopropanol, Rubbing Alcohol',
        'cas_number' => '67-63-0',
        'einecs' => '200-661-7',
        'category' => 'organic-chemistry'
    ],
    [
        'product_name' => 'Ammonia Solution (25%)',
        'synonyms' => 'Ammonium Hydroxide, Aqua Ammonia',
        'cas_number' => '1336-21-6',
        'einecs' => '215-647-6',
        'category' => 'inorganic-chemistry'
    ],
    [
        'product_name' => 'Chloroform (AR Grade)',
        'synonyms' => 'Trichloromethane, Methyl Trichloride',
        'cas_number' => '67-66-3',
        'einecs' => '200-663-8',
        'category' => 'organic-chemistry'
    ],
    [
        'product_name' => 'Formaldehyde Solution (37%)',
        'synonyms' => 'Formalin, Methanal',
        'cas_number' => '50-00-0',
        'einecs' => '200-001-8',
        'category' => 'organic-chemistry'
    ]
];

try {
    $db = Database::getInstance();
    
    echo "Connecting to database...\n";
    echo "Host: " . DB_HOST . "\n";
    echo "Database: " . DB_NAME . "\n\n";
    
    // First, check if products table exists
    try {
        $db->query("SELECT 1 FROM products LIMIT 1");
        echo "Products table exists ✓\n\n";
    } catch (Exception $e) {
        echo "Creating products table...\n";
        $db->query("
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_name VARCHAR(255) NOT NULL,
                synonyms TEXT,
                cas_number VARCHAR(50),
                einecs VARCHAR(50),
                category VARCHAR(100),
                image VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ");
        echo "Products table created ✓\n\n";
    }
    
    // Check current count
    $currentCount = $db->fetchOne("SELECT COUNT(*) as count FROM products");
    echo "Current products in database: " . $currentCount['count'] . "\n\n";
    
    if ($currentCount['count'] > 0) {
        echo "Products already exist. Do you want to add more? (y/n): ";
        $handle = fopen("php://stdin", "r");
        $line = fgets($handle);
        if (trim($line) !== 'y' && trim($line) !== 'Y') {
            echo "Skipping product insertion.\n";
            exit(0);
        }
    }
    
    echo "Inserting products...\n\n";
    
    $inserted = 0;
    foreach ($products as $product) {
        try {
            $db->query(
                "INSERT INTO products (product_name, synonyms, cas_number, einecs, category) VALUES (?, ?, ?, ?, ?)",
                [
                    $product['product_name'],
                    $product['synonyms'],
                    $product['cas_number'],
                    $product['einecs'],
                    $product['category']
                ]
            );
            echo "  ✓ Added: " . $product['product_name'] . "\n";
            $inserted++;
        } catch (Exception $e) {
            echo "  ✗ Failed: " . $product['product_name'] . " - " . $e->getMessage() . "\n";
        }
    }
    
    echo "\n=== Summary ===\n";
    echo "Successfully inserted: $inserted products\n";
    
    // Final count
    $finalCount = $db->fetchOne("SELECT COUNT(*) as count FROM products");
    echo "Total products in database: " . $finalCount['count'] . "\n";
    
    echo "\n✅ Seeding complete!\n";
    
} catch (Exception $e) {
    echo "\n❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}
