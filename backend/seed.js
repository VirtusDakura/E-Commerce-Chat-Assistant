import 'dotenv/config';
import connectDB from './config/database.js';
import { Category, Product, User } from './models/index.js';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log('✅ Existing data cleared');

    // Create Categories
    console.log('📁 Creating categories...');
    const categories = await Category.insertMany([
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        icon: '📱',
        order: 1,
        isFeatured: true,
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
        icon: '👔',
        order: 2,
        isFeatured: true,
      },
      {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home improvement and garden supplies',
        icon: '🏡',
        order: 3,
        isFeatured: true,
      },
      {
        name: 'Books',
        slug: 'books',
        description: 'Books and educational materials',
        icon: '📚',
        order: 4,
        isFeatured: true,
      },
      {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Sports equipment and outdoor gear',
        icon: '⚽',
        order: 5,
        isFeatured: false,
      },
      {
        name: 'Toys & Games',
        slug: 'toys-games',
        description: 'Toys, games, and entertainment',
        icon: '🎮',
        order: 6,
        isFeatured: false,
      },
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Create Products
    console.log('📦 Creating products...');
    const products = [
      // Electronics
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium over-ear wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality. Perfect for music lovers and professionals.',
        shortDescription: 'Premium wireless headphones with ANC',
        price: 199.99,
        compareAtPrice: 249.99,
        category: categories[0]._id,
        brand: 'AudioTech',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
            alt: 'Black wireless headphones',
            isPrimary: true,
          },
        ],
        inventory: {
          stock: 50,
          sku: 'ELEC-HDPH-001',
          trackInventory: true,
          lowStockThreshold: 10,
        },
        specifications: new Map([
          ['Battery Life', '30 hours'],
          ['Connectivity', 'Bluetooth 5.0'],
          ['Weight', '250g'],
          ['Noise Cancellation', 'Active'],
        ]),
        features: [
          'Active Noise Cancellation',
          '30-hour battery life',
          'Foldable design',
          'Built-in microphone',
          'Fast charging',
        ],
        tags: ['headphones', 'wireless', 'audio', 'bluetooth', 'noise-cancellation'],
        ratings: { average: 4.5, count: 128 },
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, sleep tracking, and 50+ sport modes. Water-resistant up to 50m.',
        shortDescription: 'Advanced fitness smartwatch with GPS',
        price: 299.99,
        compareAtPrice: 399.99,
        category: categories[0]._id,
        brand: 'TechWear',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
            alt: 'Black smart watch',
            isPrimary: true,
          },
        ],
        inventory: {
          stock: 35,
          sku: 'ELEC-WATCH-002',
          trackInventory: true,
          lowStockThreshold: 10,
        },
        specifications: new Map([
          ['Display', '1.4" AMOLED'],
          ['Battery', '7 days'],
          ['Water Resistance', '50m'],
          ['GPS', 'Built-in'],
        ]),
        features: [
          'Heart rate monitoring',
          'GPS tracking',
          'Sleep analysis',
          '50+ sport modes',
          'Water-resistant',
        ],
        tags: ['smartwatch', 'fitness', 'wearable', 'gps', 'health'],
        ratings: { average: 4.7, count: 256 },
        isActive: true,
        isFeatured: true,
      },
      {
        name: '4K Ultra HD Webcam',
        description: 'Professional 4K webcam with auto-focus, built-in microphone, and adjustable tripod. Perfect for streaming, video calls, and content creation.',
        shortDescription: 'Professional 4K streaming webcam',
        price: 89.99,
        category: categories[0]._id,
        brand: 'StreamTech',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1588164863186-62cd29e01dbf',
            alt: 'Black webcam',
            isPrimary: true,
          },
        ],
        inventory: {
          stock: 80,
          sku: 'ELEC-CAM-003',
          trackInventory: true,
          lowStockThreshold: 15,
        },
        specifications: new Map([
          ['Resolution', '4K Ultra HD'],
          ['Frame Rate', '30fps'],
          ['Field of View', '90 degrees'],
          ['Connection', 'USB 3.0'],
        ]),
        features: [
          '4K resolution',
          'Auto-focus',
          'Built-in microphone',
          'Adjustable tripod included',
          'Plug and play',
        ],
        tags: ['webcam', '4k', 'streaming', 'video-call', 'content-creation'],
        ratings: { average: 4.3, count: 89 },
        isActive: true,
        isFeatured: false,
      },
      // Clothing
      {
        name: 'Classic Cotton T-Shirt',
        description: 'Premium 100% organic cotton t-shirt with a comfortable fit. Available in multiple colors. Perfect for everyday wear.',
        shortDescription: 'Comfortable organic cotton t-shirt',
        price: 24.99,
        compareAtPrice: 34.99,
        category: categories[1]._id,
        brand: 'ComfortWear',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
            alt: 'White cotton t-shirt',
            isPrimary: true,
          },
        ],
        inventory: {
          stock: 200,
          sku: 'CLTH-TSHIRT-001',
          trackInventory: true,
          lowStockThreshold: 30,
        },
        specifications: new Map([
          ['Material', '100% Organic Cotton'],
          ['Fit', 'Regular'],
          ['Care', 'Machine washable'],
        ]),
        features: [
          'Organic cotton',
          'Pre-shrunk',
          'Tagless',
          'Multiple colors',
          'Sustainable',
        ],
        tags: ['t-shirt', 'cotton', 'casual', 'organic', 'basics'],
        ratings: { average: 4.6, count: 342 },
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Denim Jacket',
        description: 'Classic denim jacket with a modern fit. Made from durable, high-quality denim. Features multiple pockets and adjustable cuffs.',
        shortDescription: 'Classic denim jacket with modern fit',
        price: 79.99,
        category: categories[1]._id,
        brand: 'UrbanStyle',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
            alt: 'Blue denim jacket',
            isPrimary: true,
          },
        ],
        inventory: {
          stock: 60,
          sku: 'CLTH-JACKET-002',
          trackInventory: true,
          lowStockThreshold: 10,
        },
        specifications: new Map([
          ['Material', 'Premium Denim'],
          ['Fit', 'Slim'],
          ['Closure', 'Button'],
        ]),
        features: [
          'Multiple pockets',
          'Adjustable cuffs',
          'Durable construction',
          'Classic design',
        ],
        tags: ['jacket', 'denim', 'outerwear', 'casual', 'fashion'],
        ratings: { average: 4.4, count: 167 },
        isActive: true,
        isFeatured: false,
      },
      // Home & Garden
      {
        name: 'Smart LED Light Bulbs (4-Pack)',
        description: 'WiFi-enabled smart LED bulbs with 16 million colors, voice control, and scheduling. Works with Alexa and Google Home. Energy efficient and long-lasting.',
        shortDescription: 'WiFi smart LED bulbs with voice control',
        price: 39.99,
        compareAtPrice: 59.99,
        category: categories[2]._id,
        brand: 'SmartHome',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1550985616-10810253b84d',
            alt: 'Smart LED light bulbs',
            isPrimary: true,
          },
        ],
        inventory: {
          stock: 150,
          sku: 'HOME-LIGHT-001',
          trackInventory: true,
          lowStockThreshold: 25,
        },
        specifications: new Map([
          ['Wattage', '9W (60W equivalent)'],
          ['Lifespan', '25,000 hours'],
          ['Colors', '16 million'],
          ['Connectivity', 'WiFi 2.4GHz'],
        ]),
        features: [
          'Voice control compatible',
          'Scheduling',
          'Energy efficient',
          'Remote control via app',
          'No hub required',
        ],
        tags: ['smart-home', 'led', 'lighting', 'wifi', 'voice-control'],
        ratings: { average: 4.5, count: 213 },
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Ceramic Plant Pot Set',
        description: 'Set of 3 modern ceramic plant pots with drainage holes and saucers. Perfect for indoor plants. Elegant minimalist design.',
        shortDescription: 'Modern ceramic plant pots (3-pack)',
        price: 34.99,
        category: categories[2]._id,
        brand: 'GreenThumb',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411',
            alt: 'White ceramic plant pots',
            isPrimary: true,
          },
        ],
        inventory: {
          stock: 90,
          sku: 'HOME-POT-002',
          trackInventory: true,
          lowStockThreshold: 15,
        },
        specifications: new Map([
          ['Material', 'Ceramic'],
          ['Sizes', 'Small, Medium, Large'],
          ['Drainage', 'Yes'],
        ]),
        features: [
          'Set of 3 pots',
          'Drainage holes',
          'Saucers included',
          'Minimalist design',
          'Durable ceramic',
        ],
        tags: ['plant-pot', 'ceramic', 'home-decor', 'indoor', 'gardening'],
        ratings: { average: 4.7, count: 145 },
        isActive: true,
        isFeatured: false,
      },
      // Books
      {
        name: 'The Art of Programming',
        description: 'Comprehensive guide to modern programming practices. Covers algorithms, data structures, design patterns, and best practices. Suitable for intermediate to advanced programmers.',
        shortDescription: 'Comprehensive modern programming guide',
        price: 49.99,
        category: categories[3]._id,
        brand: 'TechPress',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1532012197267-da84d127e765',
            alt: 'Programming book',
            isPrimary: true,
          },
        ],
        inventory: {
          stock: 75,
          sku: 'BOOK-PROG-001',
          trackInventory: true,
          lowStockThreshold: 10,
        },
        specifications: new Map([
          ['Pages', '650'],
          ['Format', 'Hardcover'],
          ['Language', 'English'],
          ['Publisher', 'TechPress'],
        ]),
        features: [
          'Comprehensive coverage',
          'Real-world examples',
          'Practice exercises',
          'Code samples',
        ],
        tags: ['book', 'programming', 'education', 'technology', 'coding'],
        ratings: { average: 4.8, count: 421 },
        isActive: true,
        isFeatured: true,
      },
      // Sports & Outdoors
      {
        name: 'Yoga Mat with Carrying Strap',
        description: 'Premium non-slip yoga mat made from eco-friendly TPE material. Extra thick for comfort, includes carrying strap and storage bag. Perfect for yoga, pilates, and floor exercises.',
        shortDescription: 'Premium eco-friendly yoga mat',
        price: 29.99,
        compareAtPrice: 44.99,
        category: categories[4]._id,
        brand: 'FitLife',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f',
            alt: 'Purple yoga mat',
            isPrimary: true,
          },
        ],
        inventory: {
          stock: 120,
          sku: 'SPORT-YOGA-001',
          trackInventory: true,
          lowStockThreshold: 20,
        },
        specifications: new Map([
          ['Material', 'TPE'],
          ['Thickness', '6mm'],
          ['Size', '183cm x 61cm'],
          ['Weight', '1.2kg'],
        ]),
        features: [
          'Non-slip surface',
          'Eco-friendly material',
          'Extra thick cushioning',
          'Carrying strap included',
          'Easy to clean',
        ],
        tags: ['yoga', 'fitness', 'exercise', 'mat', 'eco-friendly'],
        ratings: { average: 4.6, count: 289 },
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Resistance Bands Set',
        description: 'Complete set of 5 resistance bands with different resistance levels. Includes door anchor, handles, and ankle straps. Perfect for home workouts and travel.',
        shortDescription: 'Complete resistance band workout set',
        price: 24.99,
        category: categories[4]._id,
        brand: 'FitLife',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc',
            alt: 'Colorful resistance bands',
            isPrimary: true,
          },
        ],
        inventory: {
          stock: 95,
          sku: 'SPORT-BAND-002',
          trackInventory: true,
          lowStockThreshold: 15,
        },
        specifications: new Map([
          ['Resistance Levels', '5 (10-50 lbs)'],
          ['Material', 'Natural latex'],
          ['Includes', 'Door anchor, handles, ankle straps'],
        ]),
        features: [
          '5 resistance levels',
          'Portable',
          'Complete accessories',
          'Workout guide included',
          'Durable latex',
        ],
        tags: ['resistance-bands', 'fitness', 'home-workout', 'strength-training'],
        ratings: { average: 4.5, count: 198 },
        isActive: true,
        isFeatured: false,
      },
    ];

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create a test user
    console.log('👤 Creating test users...');
    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        phone: '+1234567890',
        isEmailVerified: true,
        addresses: [
          {
            label: 'home',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA',
            isDefault: true,
          },
        ],
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        isEmailVerified: true,
      },
    ]);

    console.log(`✅ Created ${users.length} users`);

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Products: ${createdProducts.length}`);
    console.log(`   Users: ${users.length}`);
    console.log('\n🔐 Test User Credentials:');
    console.log('   User: john@example.com / password123');
    console.log('   Admin: admin@example.com / admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
