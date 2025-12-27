// Mock Product Database for Demo Application

export interface Product {
  asin: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  isAccessory?: boolean;
}

// Reference product (the one we're finding competitors for)
export const referenceProduct: Product = {
  asin: 'B0XYZ123',
  title: 'ProBrand Stainless Steel Water Bottle 32oz Insulated',
  price: 29.99,
  rating: 4.2,
  reviews: 1247,
  category: 'Sports & Outdoors > Water Bottles',
};

// Mock database of 50+ products
export const productDatabase: Product[] = [
  // Strong Competitors (should pass all filters)
  {
    asin: 'B0COMP01',
    title: 'HydroFlask 32oz Wide Mouth Vacuum Insulated',
    price: 44.99,
    rating: 4.5,
    reviews: 8932,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP02',
    title: 'Yeti Rambler 26oz Stainless Steel',
    price: 34.99,
    rating: 4.4,
    reviews: 5621,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP03',
    title: 'Stanley Adventure Quencher 30oz',
    price: 35.00,
    rating: 4.3,
    reviews: 4102,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP04',
    title: 'CamelBak Chute Mag 32oz Insulated',
    price: 32.00,
    rating: 4.4,
    reviews: 3456,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP05',
    title: 'Klean Kanteen Classic 27oz',
    price: 26.95,
    rating: 4.3,
    reviews: 2890,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP06',
    title: 'Contigo Autoseal 24oz',
    price: 24.99,
    rating: 4.2,
    reviews: 6234,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP07',
    title: 'Takeya Actives 32oz',
    price: 29.99,
    rating: 4.6,
    reviews: 4521,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP08',
    title: 'S\'well Stainless Steel 25oz',
    price: 35.00,
    rating: 4.1,
    reviews: 2134,
    category: 'Sports & Outdoors > Water Bottles',
  },
  
  // Products that will fail filters
  {
    asin: 'B0FAIL01',
    title: 'Generic Water Bottle 16oz',
    price: 8.99,
    rating: 3.2,
    reviews: 45,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0FAIL02',
    title: 'Budget Plastic Bottle 24oz',
    price: 5.99,
    rating: 2.8,
    reviews: 892,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0FAIL03',
    title: 'Premium Titanium Ultra Bottle 64oz',
    price: 89.99,
    rating: 4.8,
    reviews: 234,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0FAIL04',
    title: 'Luxury Crystal Water Carafe',
    price: 129.00,
    rating: 4.9,
    reviews: 67,
    category: 'Kitchen > Drinkware',
  },
  {
    asin: 'B0FAIL05',
    title: 'Kids Water Bottle 12oz',
    price: 12.99,
    rating: 4.0,
    reviews: 1543,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0FAIL06',
    title: 'Collapsible Silicone Bottle',
    price: 15.99,
    rating: 3.6,
    reviews: 432,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0FAIL07',
    title: 'Smart Water Bottle with LED',
    price: 45.00,
    rating: 3.4,
    reviews: 89,
    category: 'Sports & Outdoors > Water Bottles',
  },
  
  // False positives (accessories, not actual bottles)
  {
    asin: 'B0ACC01',
    title: 'Bottle Cleaning Brush Set - 3 Pack',
    price: 12.99,
    rating: 4.6,
    reviews: 3421,
    category: 'Sports & Outdoors > Bottle Accessories',
    isAccessory: true,
  },
  {
    asin: 'B0ACC02',
    title: 'Replacement Lid for HydroFlask Wide Mouth',
    price: 9.99,
    rating: 4.4,
    reviews: 1892,
    category: 'Sports & Outdoors > Bottle Accessories',
    isAccessory: true,
  },
  {
    asin: 'B0ACC03',
    title: 'Water Bottle Carrier Bag with Strap',
    price: 14.99,
    rating: 4.2,
    reviews: 876,
    category: 'Sports & Outdoors > Bottle Accessories',
    isAccessory: true,
  },
  {
    asin: 'B0ACC04',
    title: 'Insulated Bottle Sleeve Holder',
    price: 11.99,
    rating: 4.0,
    reviews: 654,
    category: 'Sports & Outdoors > Bottle Accessories',
    isAccessory: true,
  },
  {
    asin: 'B0ACC05',
    title: 'Stainless Steel Straw Set for Bottles',
    price: 8.99,
    rating: 4.3,
    reviews: 2341,
    category: 'Sports & Outdoors > Bottle Accessories',
    isAccessory: true,
  },
  
  // Edge cases - related but different products
  {
    asin: 'B0EDGE01',
    title: 'Coffee Travel Mug 16oz Insulated',
    price: 24.99,
    rating: 4.4,
    reviews: 3456,
    category: 'Kitchen > Travel Mugs',
  },
  {
    asin: 'B0EDGE02',
    title: 'Protein Shaker Bottle 28oz',
    price: 19.99,
    rating: 4.2,
    reviews: 5678,
    category: 'Sports & Outdoors > Shaker Bottles',
  },
  {
    asin: 'B0EDGE03',
    title: 'Glass Water Bottle 24oz with Sleeve',
    price: 22.99,
    rating: 4.1,
    reviews: 1234,
    category: 'Sports & Outdoors > Water Bottles',
  },
  
  // More competitors to pad the list
  {
    asin: 'B0COMP09',
    title: 'Thermos Stainless King 24oz',
    price: 27.99,
    rating: 4.3,
    reviews: 3210,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP10',
    title: 'Nalgene Wide Mouth 32oz',
    price: 14.99,
    rating: 4.5,
    reviews: 12543,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP11',
    title: 'RTIC 26oz Water Bottle',
    price: 24.99,
    rating: 4.4,
    reviews: 2876,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP12',
    title: 'Zojirushi Stainless Steel 20oz',
    price: 32.00,
    rating: 4.6,
    reviews: 4532,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP13',
    title: 'Simple Modern Wave 32oz',
    price: 22.99,
    rating: 4.4,
    reviews: 7654,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP14',
    title: 'Iron Flask Sports Water Bottle 32oz',
    price: 21.97,
    rating: 4.5,
    reviews: 34521,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP15',
    title: 'Owala FreeSip 24oz',
    price: 27.99,
    rating: 4.7,
    reviews: 28432,
    category: 'Sports & Outdoors > Water Bottles',
  },
  
  // Low quality products
  {
    asin: 'B0LOW01',
    title: 'Cheap Aluminum Bottle 20oz',
    price: 7.99,
    rating: 2.5,
    reviews: 234,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0LOW02',
    title: 'No-Name Water Container 32oz',
    price: 6.49,
    rating: 2.9,
    reviews: 156,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0LOW03',
    title: 'Disposable Sports Bottles - 6 Pack',
    price: 4.99,
    rating: 3.0,
    reviews: 567,
    category: 'Sports & Outdoors > Water Bottles',
  },
  
  // Premium/outside price range
  {
    asin: 'B0PREM01',
    title: 'LARQ Self-Cleaning Water Bottle 25oz',
    price: 95.00,
    rating: 4.2,
    reviews: 3421,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0PREM02',
    title: 'Ember Temperature Control Bottle',
    price: 149.99,
    rating: 4.0,
    reviews: 892,
    category: 'Sports & Outdoors > Smart Bottles',
  },
  
  // More edge cases and variety
  {
    asin: 'B0COMP16',
    title: 'Hydro Cell Stainless Steel 32oz',
    price: 19.95,
    rating: 4.3,
    reviews: 8765,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP17',
    title: 'FineDine Triple Insulated 25oz',
    price: 16.97,
    rating: 4.2,
    reviews: 5432,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP18',
    title: 'Buzio Insulated Water Bottle 32oz',
    price: 18.99,
    rating: 4.4,
    reviews: 12345,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP19',
    title: 'MIRA Stainless Steel Bottle 24oz',
    price: 17.95,
    rating: 4.3,
    reviews: 6789,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP20',
    title: 'Thermoflask Double Wall 24oz',
    price: 19.99,
    rating: 4.4,
    reviews: 23456,
    category: 'Sports & Outdoors > Water Bottles',
  },
  
  // Few more accessories
  {
    asin: 'B0ACC06',
    title: 'Water Bottle Handle Lid Adapter',
    price: 7.99,
    rating: 4.1,
    reviews: 432,
    category: 'Sports & Outdoors > Bottle Accessories',
    isAccessory: true,
  },
  {
    asin: 'B0ACC07',
    title: 'Bottle Boot Silicone Cover',
    price: 6.99,
    rating: 4.0,
    reviews: 876,
    category: 'Sports & Outdoors > Bottle Accessories',
    isAccessory: true,
  },
  
  // Final products to reach 50+
  {
    asin: 'B0COMP21',
    title: 'EYQ Stainless Steel Water Bottle 32oz',
    price: 15.99,
    rating: 4.1,
    reviews: 4321,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP22',
    title: 'Swig Life 30oz Tumbler',
    price: 32.95,
    rating: 4.5,
    reviews: 2134,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP23',
    title: 'Corkcicle Canteen 25oz',
    price: 32.95,
    rating: 4.3,
    reviews: 3654,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP24',
    title: 'Brita Insulated Filtered 26oz',
    price: 28.99,
    rating: 4.0,
    reviews: 1876,
    category: 'Sports & Outdoors > Water Bottles',
  },
  {
    asin: 'B0COMP25',
    title: 'Healthy Human Stein 21oz',
    price: 24.99,
    rating: 4.4,
    reviews: 2341,
    category: 'Sports & Outdoors > Water Bottles',
  },
];

// Function to simulate keyword-based search
export function searchProducts(keywords: string[], limit: number = 50): Product[] {
  const keywordLower = keywords.map(k => k.toLowerCase());
  
  // Simple relevance scoring based on keyword matches
  const scored = productDatabase.map(product => {
    const titleLower = product.title.toLowerCase();
    const categoryLower = product.category.toLowerCase();
    
    let score = 0;
    for (const keyword of keywordLower) {
      const words = keyword.split(' ');
      for (const word of words) {
        if (titleLower.includes(word)) score += 2;
        if (categoryLower.includes(word)) score += 1;
      }
    }
    
    return { product, score };
  });
  
  // Filter products with any match and sort by score
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.product);
}
