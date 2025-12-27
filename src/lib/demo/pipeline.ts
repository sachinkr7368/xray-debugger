// Competitor Selection Pipeline with X-Ray Integration
// Demonstrates the X-Ray library with a realistic multi-step decision process

import { XRay, saveTrace } from '@/lib/xray';
import type { XRayCandidate, XRayFilter } from '@/lib/xray';
import { referenceProduct, searchProducts, type Product } from './products';

// Configure XRay to save traces
XRay.configure({
  onTrace: async (trace) => {
    await saveTrace(trace);
  },
});

// Step 1: Generate search keywords from product (simulated LLM)
function generateKeywords(product: Product): {
  keywords: string[];
  reasoning: string;
} {
  // Simulate LLM keyword extraction
  const title = product.title.toLowerCase();
  const keywords: string[] = [];
  
  // Extract key terms
  if (title.includes('stainless steel')) {
    keywords.push('stainless steel water bottle');
  }
  if (title.includes('insulated')) {
    keywords.push('insulated water bottle');
    keywords.push('vacuum insulated bottle');
  }
  if (title.includes('32oz') || title.includes('32 oz')) {
    keywords.push('32oz water bottle');
  }
  
  // Add generic fallback
  if (keywords.length === 0) {
    keywords.push('water bottle');
  }
  
  return {
    keywords,
    reasoning: `Extracted key product attributes from title: ${
      title.includes('stainless steel') ? 'material (stainless steel), ' : ''
    }${
      title.includes('insulated') ? 'feature (insulated), ' : ''
    }${
      title.includes('32oz') ? 'capacity (32oz)' : ''
    }`.replace(/, $/, ''),
  };
}

// Step 2: Search for candidates
function searchCandidates(keywords: string[], limit: number = 50): {
  candidates: Product[];
  totalResults: number;
  reasoning: string;
} {
  const candidates = searchProducts(keywords, limit);
  
  // Simulate that there are more results available
  const totalResults = Math.floor(candidates.length * 50 + Math.random() * 1000);
  
  return {
    candidates,
    totalResults,
    reasoning: `Fetched top ${limit} results by relevance; ${totalResults.toLocaleString()} total matches found in database`,
  };
}

// Step 3: Apply filters
interface FilterConfig {
  priceMultiplierMin: number;
  priceMultiplierMax: number;
  minRating: number;
  minReviews: number;
}

function applyFilters(
  candidates: Product[],
  reference: Product,
  config: FilterConfig
): {
  passed: Product[];
  evaluations: XRayCandidate[];
  filters: XRayFilter[];
  reasoning: string;
} {
  const priceMin = reference.price * config.priceMultiplierMin;
  const priceMax = reference.price * config.priceMultiplierMax;
  
  const filters: XRayFilter[] = [
    {
      name: 'price_range',
      rule: `${config.priceMultiplierMin}x - ${config.priceMultiplierMax}x of reference price`,
      value: { min: priceMin, max: priceMax },
    },
    {
      name: 'min_rating',
      rule: `Must be at least ${config.minRating} stars`,
      value: config.minRating,
    },
    {
      name: 'min_reviews',
      rule: `Must have at least ${config.minReviews} reviews`,
      value: config.minReviews,
    },
  ];
  
  const evaluations: XRayCandidate[] = candidates.map(product => {
    const pricePass = product.price >= priceMin && product.price <= priceMax;
    const ratingPass = product.rating >= config.minRating;
    const reviewsPass = product.reviews >= config.minReviews;
    const qualified = pricePass && ratingPass && reviewsPass;
    
    return {
      id: product.asin,
      label: product.title,
      metrics: {
        price: product.price,
        rating: product.rating,
        reviews: product.reviews,
      },
      evaluations: [
        {
          id: 'price_range',
          label: 'Price Range',
          passed: pricePass,
          detail: pricePass
            ? `$${product.price.toFixed(2)} is within $${priceMin.toFixed(2)}-$${priceMax.toFixed(2)}`
            : product.price < priceMin
              ? `$${product.price.toFixed(2)} is below minimum $${priceMin.toFixed(2)}`
              : `$${product.price.toFixed(2)} exceeds maximum $${priceMax.toFixed(2)}`,
          value: product.price,
        },
        {
          id: 'min_rating',
          label: 'Minimum Rating',
          passed: ratingPass,
          detail: ratingPass
            ? `${product.rating}★ >= ${config.minRating}★`
            : `${product.rating}★ < ${config.minRating}★ threshold`,
          value: product.rating,
        },
        {
          id: 'min_reviews',
          label: 'Minimum Reviews',
          passed: reviewsPass,
          detail: reviewsPass
            ? `${product.reviews.toLocaleString()} >= ${config.minReviews}`
            : `${product.reviews} < ${config.minReviews} minimum`,
          value: product.reviews,
        },
      ],
      qualified,
    };
  });
  
  const passed = candidates.filter((_, index) => evaluations[index].qualified);
  const failed = candidates.length - passed.length;
  
  return {
    passed,
    evaluations,
    filters,
    reasoning: `Applied price (${config.priceMultiplierMin}x-${config.priceMultiplierMax}x), rating (≥${config.minRating}★), and review count (≥${config.minReviews}) filters. ${passed.length} passed, ${failed} failed.`,
  };
}

// Step 4: LLM relevance check (simulated)
function checkRelevance(
  candidates: Product[],
  reference: Product
): {
  competitors: Product[];
  evaluations: XRayCandidate[];
  reasoning: string;
} {
  const evaluations: XRayCandidate[] = candidates.map(product => {
    // Simulate LLM checking if product is a true competitor
    const isAccessory = product.isAccessory === true;
    const isSameCategory = product.category.includes('Water Bottle');
    const isCompetitor = !isAccessory && isSameCategory;
    
    // Simulate confidence score
    const confidence = isAccessory ? 0.98 : isSameCategory ? 0.92 : 0.75;
    
    return {
      id: product.asin,
      label: product.title,
      metrics: {
        category: product.category,
        isAccessory: isAccessory,
      },
      evaluations: [
        {
          id: 'is_competitor',
          label: 'True Competitor',
          passed: isCompetitor,
          detail: isAccessory
            ? 'Identified as accessory/replacement part'
            : isSameCategory
              ? 'Same product category - valid competitor'
              : 'Different product category',
          value: confidence,
        },
      ],
      qualified: isCompetitor,
    };
  });
  
  const competitors = candidates.filter((_, index) => evaluations[index].qualified);
  const falsePositives = candidates.length - competitors.length;
  
  return {
    competitors,
    evaluations,
    reasoning: `LLM evaluated ${candidates.length} candidates against reference "${reference.title}". Identified ${falsePositives} false positives (accessories, replacement parts, different categories).`,
  };
}

// Step 5: Rank and select best competitor
function rankAndSelect(
  candidates: Product[],
  reference: Product
): {
  ranked: Array<{
    product: Product;
    rank: number;
    scores: {
      reviewScore: number;
      ratingScore: number;
      priceProximityScore: number;
      totalScore: number;
    };
  }>;
  selected: Product;
  reasoning: string;
} {
  // Calculate scores for each candidate
  const maxReviews = Math.max(...candidates.map(c => c.reviews));
  const maxRating = 5.0;
  
  const scored = candidates.map(product => {
    // Review count score (0-1, higher is better)
    const reviewScore = product.reviews / maxReviews;
    
    // Rating score (0-1, higher is better)
    const ratingScore = (product.rating - 3.0) / (maxRating - 3.0);
    
    // Price proximity score (0-1, closer to reference price is better)
    const priceDiff = Math.abs(product.price - reference.price);
    const maxPriceDiff = reference.price;
    const priceProximityScore = Math.max(0, 1 - (priceDiff / maxPriceDiff));
    
    // Weighted total score
    const totalScore = (
      reviewScore * 0.4 +
      ratingScore * 0.35 +
      priceProximityScore * 0.25
    );
    
    return {
      product,
      scores: {
        reviewScore: Math.round(reviewScore * 100) / 100,
        ratingScore: Math.round(ratingScore * 100) / 100,
        priceProximityScore: Math.round(priceProximityScore * 100) / 100,
        totalScore: Math.round(totalScore * 100) / 100,
      },
    };
  });
  
  // Sort by total score
  scored.sort((a, b) => b.scores.totalScore - a.scores.totalScore);
  
  // Add ranks
  const ranked = scored.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
  
  const selected = ranked[0].product;
  const topScores = ranked[0].scores;
  
  return {
    ranked,
    selected,
    reasoning: `Ranked ${candidates.length} candidates using weighted scoring: review count (40%), rating (35%), price proximity (25%). Selected "${selected.title}" with score ${topScores.totalScore} - ${selected.reviews.toLocaleString()} reviews, ${selected.rating}★, $${selected.price.toFixed(2)}.`,
  };
}

// Main pipeline function
export async function runCompetitorSelectionPipeline(): Promise<{
  traceId: string;
  selectedCompetitor: Product;
}> {
  const reference = referenceProduct;
  
  // Start X-Ray trace
  const trace = XRay.trace(
    'Competitor Selection',
    `Finding best competitor for: ${reference.title}`
  ).metadata({
    referenceProduct: {
      asin: reference.asin,
      title: reference.title,
      price: reference.price,
      rating: reference.rating,
      reviews: reference.reviews,
    },
  });
  
  // Step 1: Keyword Generation
  const keywordResult = generateKeywords(reference);
  trace.step('Keyword Generation', 'llm')
    .input({
      product_title: reference.title,
      category: reference.category,
    }, 'Reference product for keyword extraction')
    .output({
      keywords: keywordResult.keywords,
      model: 'gpt-4 (simulated)',
      keyword_count: keywordResult.keywords.length,
    }, 'Generated search keywords')
    .reasoning(keywordResult.reasoning)
    .metadata({ model: 'gpt-4', temperature: 0.3 })
    .end();
  
  // Step 2: Candidate Search
  const searchResult = searchCandidates(keywordResult.keywords, 50);
  trace.step('Candidate Search', 'search')
    .input({
      keywords: keywordResult.keywords,
      limit: 50,
    }, 'Search parameters')
    .output({
      total_results: searchResult.totalResults,
      candidates_fetched: searchResult.candidates.length,
      sample_candidates: searchResult.candidates.slice(0, 5).map(p => ({
        asin: p.asin,
        title: p.title,
        price: p.price,
        rating: p.rating,
        reviews: p.reviews,
      })),
    }, `Found ${searchResult.candidates.length} candidates`)
    .reasoning(searchResult.reasoning)
    .end();
  
  // Step 3: Apply Filters
  const filterConfig: FilterConfig = {
    priceMultiplierMin: 0.5,
    priceMultiplierMax: 2.0,
    minRating: 3.8,
    minReviews: 100,
  };
  
  const filterResult = applyFilters(searchResult.candidates, reference, filterConfig);
  trace.step('Apply Filters', 'filter')
    .input({
      candidates_count: searchResult.candidates.length,
      reference_product: {
        asin: reference.asin,
        title: reference.title,
        price: reference.price,
        rating: reference.rating,
        reviews: reference.reviews,
      },
    }, 'Candidates and reference for filtering')
    .output({
      total_evaluated: searchResult.candidates.length,
      passed: filterResult.passed.length,
      failed: searchResult.candidates.length - filterResult.passed.length,
    }, `${filterResult.passed.length} candidates passed all filters`)
    .filters(filterResult.filters)
    .candidates(filterResult.evaluations)
    .reasoning(filterResult.reasoning)
    .end();
  
  // Step 4: LLM Relevance Check
  const relevanceResult = checkRelevance(filterResult.passed, reference);
  trace.step('LLM Relevance Check', 'llm')
    .input({
      candidates_count: filterResult.passed.length,
      reference_product: {
        asin: reference.asin,
        title: reference.title,
        category: reference.category,
      },
      model: 'gpt-4',
    }, 'Filtered candidates for relevance evaluation')
    .output({
      total_evaluated: filterResult.passed.length,
      confirmed_competitors: relevanceResult.competitors.length,
      false_positives_removed: filterResult.passed.length - relevanceResult.competitors.length,
    }, `${relevanceResult.competitors.length} true competitors identified`)
    .candidates(relevanceResult.evaluations)
    .reasoning(relevanceResult.reasoning)
    .metadata({
      prompt_template: 'Given the reference product, determine if each candidate is a true competitor (same product type) or a false positive (accessory, replacement part, bundle, etc.)',
    })
    .end();
  
  // Step 5: Rank & Select
  const rankResult = rankAndSelect(relevanceResult.competitors, reference);
  trace.step('Rank & Select', 'rank')
    .input({
      candidates_count: relevanceResult.competitors.length,
      reference_product: {
        asin: reference.asin,
        title: reference.title,
        price: reference.price,
        rating: reference.rating,
        reviews: reference.reviews,
      },
      ranking_criteria: {
        primary: 'review_count (40%)',
        secondary: 'rating (35%)',
        tertiary: 'price_proximity (25%)',
      },
    }, 'Candidates for final ranking')
    .output({
      selected_competitor: {
        asin: rankResult.selected.asin,
        title: rankResult.selected.title,
        price: rankResult.selected.price,
        rating: rankResult.selected.rating,
        reviews: rankResult.selected.reviews,
      },
      ranking: rankResult.ranked.slice(0, 5).map(r => ({
        rank: r.rank,
        asin: r.product.asin,
        title: r.product.title,
        scores: r.scores,
      })),
    }, `Selected: ${rankResult.selected.title}`)
    .candidates(
      rankResult.ranked.map(r => ({
        id: r.product.asin,
        label: r.product.title,
        metrics: {
          price: r.product.price,
          rating: r.product.rating,
          reviews: r.product.reviews,
        },
        evaluations: [
          {
            id: 'review_score',
            label: 'Review Score',
            passed: true,
            detail: `${r.scores.reviewScore} (weight: 40%)`,
            value: r.scores.reviewScore,
          },
          {
            id: 'rating_score',
            label: 'Rating Score',
            passed: true,
            detail: `${r.scores.ratingScore} (weight: 35%)`,
            value: r.scores.ratingScore,
          },
          {
            id: 'price_proximity_score',
            label: 'Price Proximity',
            passed: true,
            detail: `${r.scores.priceProximityScore} (weight: 25%)`,
            value: r.scores.priceProximityScore,
          },
        ],
        qualified: true,
        selected: r.rank === 1,
      }))
    )
    .reasoning(rankResult.reasoning)
    .end();
  
  // End trace
  const finalTrace = await trace.end({
    success: true,
    summary: `Successfully selected competitor: ${rankResult.selected.title}`,
    data: {
      selected_competitor: {
        asin: rankResult.selected.asin,
        title: rankResult.selected.title,
        price: rankResult.selected.price,
        rating: rankResult.selected.rating,
        reviews: rankResult.selected.reviews,
      },
      pipeline_stats: {
        initial_candidates: searchResult.candidates.length,
        after_filters: filterResult.passed.length,
        after_relevance_check: relevanceResult.competitors.length,
        final_selection: 1,
      },
    },
  });
  
  return {
    traceId: finalTrace.id,
    selectedCompetitor: rankResult.selected,
  };
}
