// Comprehensive product catalog for ShopSmart E-Commerce
// Using chat product images from assets
import { productImages } from '../utils/chatAssets';

const placeholderImg = "https://via.placeholder.com/400x400/e5e7eb/374151?text=Product";

export const products = [
    {
        id: "p1",
        title: "TechPro X15",
        price: 4500,
        currency: "GHS",
        category: "Electronics",
        rating: 4.8,
        reviewCount: 127,
        image: productImages.laptop1,
        images: [productImages.laptop1],
        description: "15.6-inch, 16GB RAM, 512GB SSD. Premium laptop with powerful performance for work and personal use. Experience crystal-clear display quality with exceptional battery life.",
        specifications: {
            "Screen": "15.6-inch",
            "RAM": "16GB RAM",
            "Storage": "512GB SSD",
            "Connectivity": "Wi-Fi 6, Bluetooth 5.0"
        },
        inStock: true,
        featured: true
    },
    {
        id: "p2",
        title: "UltraBook Pro",
        price: 5200,
        currency: "GHS",
        category: "Electronics",
        rating: 4.9,
        reviewCount: 89,
        image: productImages.laptop2,
        images: [productImages.laptop2],
        description: "14-inch, 8GB RAM, 256GB SSD. Sleek and portable ultrabook perfect for professionals on the go. Lightweight design with all-day battery life.",
        specifications: {
            "Screen": "14-inch",
            "RAM": "8GB RAM",
            "Storage": "256GB SSD",
            "Weight": "1.2kg"
        },
        inStock: true,
        featured: true
    },
    {
        id: "p3",
        title: "PowerStation 9000",
        price: 3800,
        currency: "GHS",
        category: "Electronics",
        rating: 4.7,
        reviewCount: 156,
        image: productImages.laptop3,
        images: [productImages.laptop3],
        description: "17-inch, 32GB RAM, 1TB SSD. High-performance workstation for demanding tasks. Ideal for content creators and developers.",
        specifications: {
            "Screen": "17-inch",
            "RAM": "32GB RAM",
            "Storage": "1TB SSD",
            "Graphics": "Dedicated GPU"
        },
        inStock: true,
        featured: true
    },
    {
        id: "p4",
        title: "Premium Cotton T-Shirt",
        price: 120,
        currency: "GHS",
        category: "Fashion",
        rating: 4.7,
        reviewCount: 203,
        image: placeholderImg,
        images: [placeholderImg, placeholderImg],
        description: "100% organic cotton t-shirt with a comfortable fit. Breathable fabric perfect for everyday wear. Available in multiple colors and sizes.",
        specifications: {
            "Material": "100% Organic Cotton",
            "Fit": "Regular",
            "Care": "Machine washable",
            "Sizes": "S, M, L, XL, XXL"
        },
        inStock: true,
        featured: false
    },
    {
        id: "p5",
        title: "Classic Denim Jeans",
        price: 250,
        currency: "GHS",
        category: "Fashion",
        rating: 4.4,
        reviewCount: 178,
        image: placeholderImg,
        images: [placeholderImg, placeholderImg],
        description: "Timeless denim jeans with a modern fit. Durable construction with stretch for comfort. Perfect for casual and semi-formal occasions.",
        specifications: {
            "Material": "98% Cotton, 2% Elastane",
            "Fit": "Slim Fit",
            "Wash": "Dark Blue",
            "Sizes": "28-38"
        },
        inStock: true,
        featured: false
    },
    {
        id: "p6",
        title: "Running Shoes - AirFlow",
        price: 380,
        currency: "GHS",
        category: "Fashion",
        rating: 4.9,
        reviewCount: 245,
        image: placeholderImg,
        images: [placeholderImg, placeholderImg],
        description: "Lightweight running shoes with superior cushioning and breathability. Engineered mesh upper for maximum airflow. Perfect for runners of all levels.",
        specifications: {
            "Weight": "220g per shoe",
            "Drop": "8mm",
            "Upper": "Engineered Mesh",
            "Sole": "EVA Foam"
        },
        inStock: true,
        featured: true
    },
    {
        id: "p7",
        title: "Leather Backpack",
        price: 420,
        currency: "GHS",
        category: "Fashion",
        rating: 4.6,
        reviewCount: 92,
        image: placeholderImg,
        images: [placeholderImg, placeholderImg],
        description: "Premium leather backpack with multiple compartments. Laptop sleeve fits up to 15.6 inches. Stylish and functional for work or travel.",
        specifications: {
            "Material": "Genuine Leather",
            "Capacity": "25L",
            "Laptop Compartment": "Up to 15.6 inch",
            "Dimensions": "45 x 30 x 15 cm"
        },
        inStock: true,
        featured: false
    },
    {
        id: "p8",
        title: "Modern Table Lamp",
        price: 180,
        currency: "GHS",
        category: "Home",
        rating: 4.5,
        reviewCount: 67,
        image: placeholderImg,
        images: [placeholderImg, placeholderImg],
        description: "Minimalist table lamp with adjustable brightness. Touch control with three lighting modes. Energy-efficient LED technology.",
        specifications: {
            "Light Source": "LED",
            "Power": "12W",
            "Color Temperature": "3000K-6000K",
            "Height": "40cm"
        },
        inStock: true,
        featured: false
    },
    {
        id: "p9",
        title: "Ceramic Coffee Mug Set",
        price: 95,
        currency: "GHS",
        category: "Home",
        rating: 4.7,
        reviewCount: 134,
        image: placeholderImg,
        images: [placeholderImg, placeholderImg],
        description: "Set of 4 handcrafted ceramic mugs. Microwave and dishwasher safe. Perfect for coffee, tea, or hot chocolate.",
        specifications: {
            "Material": "Ceramic",
            "Capacity": "350ml per mug",
            "Set Includes": "4 mugs",
            "Care": "Dishwasher safe"
        },
        inStock: true,
        featured: false
    },
    {
        id: "p10",
        title: "Bamboo Cutting Board",
        price: 75,
        currency: "GHS",
        category: "Home",
        rating: 4.8,
        reviewCount: 98,
        image: placeholderImg,
        images: [placeholderImg, placeholderImg],
        description: "Eco-friendly bamboo cutting board with juice groove. Knife-friendly surface that won't dull blades. Easy to clean and maintain.",
        specifications: {
            "Material": "100% Bamboo",
            "Size": "45 x 30 x 2 cm",
            "Features": "Juice groove, hanging hole",
            "Care": "Hand wash only"
        },
        inStock: true,
        featured: false
    },
    {
        id: "p11",
        title: "Wireless Gaming Mouse",
        price: 320,
        currency: "GHS",
        category: "Electronics",
        rating: 4.7,
        reviewCount: 187,
        image: placeholderImg,
        images: [placeholderImg, placeholderImg],
        description: "High-precision gaming mouse with customizable RGB lighting. Programmable buttons and adjustable DPI up to 16000. Ergonomic design for extended gaming sessions.",
        specifications: {
            "DPI": "Up to 16000",
            "Buttons": "8 programmable",
            "Battery": "70 hours",
            "Connectivity": "2.4GHz wireless"
        },
        inStock: true,
        featured: false
    },
    {
        id: "p12",
        title: "Yoga Mat Premium",
        price: 150,
        currency: "GHS",
        category: "Sports",
        rating: 4.6,
        reviewCount: 112,
        image: placeholderImg,
        images: [placeholderImg, placeholderImg],
        description: "Extra-thick yoga mat with superior grip and cushioning. Non-slip surface for safe practice. Includes carrying strap for easy transport.",
        specifications: {
            "Thickness": "6mm",
            "Material": "TPE (eco-friendly)",
            "Size": "183 x 61 cm",
            "Weight": "1.2kg"
        },
        inStock: true,
        featured: false
    }
];

export const categories = [
    { id: "electronics", name: "Electronics", count: 5 },
    { id: "fashion", name: "Fashion", count: 4 },
    { id: "home", name: "Home", count: 3 },
    { id: "sports", name: "Sports", count: 1 }
];

export const getProductById = (id) => {
    return products.find(p => p.id === id);
};

export const getProductsByCategory = (category) => {
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase());
};

export const getFeaturedProducts = () => {
    return products.filter(p => p.featured);
};

export const searchProducts = (query) => {
    const lowerQuery = query.toLowerCase();
    return products.filter(p =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
};
