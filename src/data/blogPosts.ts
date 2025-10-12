import blogCleaningTipsImage from '@/assets/blog-cleaning-tips.jpg';
import blogSpringCleaningImage from '@/assets/blog-spring-cleaning.jpg';
import blogEcoProductsImage from '@/assets/blog-eco-products.jpg';
import { Sparkles, Home, Droplets } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  fullContent: string[];
  category: string;
  icon?: any;
  image: string;
  date: string;
  readTime: string;
  featured?: boolean;
  author?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'cleaning-mistakes',
    title: '6 Cleaning Mistakes That Can Frustrate Your Cleaning Efforts',
    excerpt: 'One-time cleaning services understand the frustration that comes with dust invading the tranquility of a pristine home. This unwelcome guest finds its way into every corner, making your cleaning efforts feel futile.',
    content: 'One-time cleaning services understand the frustration that comes with dust invading the tranquility of a pristine home. This unwelcome guest finds its way into every corner, making your cleaning efforts feel futile.',
    fullContent: [
      'One-time cleaning services understand the frustration that comes with dust invading the tranquility of a pristine home. This unwelcome guest finds its way into every corner, making your cleaning efforts feel futile.',
      'In this comprehensive guide, we\'ll explore the most common cleaning mistakes that homeowners make and how to avoid them for a truly spotless home.',
      '## Mistake #1: Using Too Much Cleaning Product',
      'Many people believe that more cleaning product equals better results. However, using excessive amounts can actually leave residue on surfaces, attracting more dirt and making your home dirtier faster.',
      '**Solution:** Follow the manufacturer\'s instructions and use the recommended amount. In many cases, less is more.',
      '## Mistake #2: Not Letting Cleaners Sit',
      'Spraying and immediately wiping doesn\'t give the cleaning product enough time to break down dirt and grime.',
      '**Solution:** Let the cleaning solution sit for 3-5 minutes before wiping. This allows the chemicals to work their magic.',
      '## Mistake #3: Using Dirty Cleaning Tools',
      'Cleaning with a dirty mop or sponge just spreads bacteria and grime around your home.',
      '**Solution:** Wash or replace your cleaning tools regularly. Microfiber cloths should be washed after each use, and mop heads should be cleaned weekly.',
      '## Mistake #4: Cleaning Windows on Sunny Days',
      'Direct sunlight causes cleaning solutions to dry too quickly, leaving streaks on your windows.',
      '**Solution:** Clean windows on cloudy days or when the windows are in shade.',
      '## Mistake #5: Neglecting Regular Maintenance',
      'Waiting until your home is visibly dirty before cleaning makes the job much harder.',
      '**Solution:** Establish a regular cleaning schedule. Daily quick cleans and weekly deep cleans prevent buildup.',
      '## Mistake #6: Using the Wrong Products for Surfaces',
      'Different surfaces require different cleaning approaches. Using the wrong product can damage surfaces or be ineffective.',
      '**Solution:** Research the proper cleaning methods for each surface in your home. When in doubt, test in an inconspicuous area first.',
      '## Conclusion',
      'By avoiding these common mistakes, you\'ll find that maintaining a clean home becomes much easier and more effective. Remember, professional cleaning services like Shalean are always here to help when you need expert assistance.'
    ],
    category: 'Cleaning Tips',
    icon: Sparkles,
    image: blogCleaningTipsImage,
    date: 'March 15, 2025',
    readTime: '8 min read',
    featured: true,
    author: 'Shalean Team'
  },
  {
    id: 'cleaning-frequency',
    title: 'How Often Should You Get Your House Cleaned?',
    excerpt: 'Whether it\'s to give your home a fresh, clean feeling or enjoy great company during any given moment of the day, there are plenty of reasons to get your house professionally cleaned.',
    content: 'Whether it\'s to give your home a fresh, clean feeling or enjoy great company during any given moment of the day, there are plenty of reasons to get your house professionally cleaned.',
    fullContent: [
      'Whether it\'s to give your home a fresh, clean feeling or enjoy great company during any given moment of the day, there are plenty of reasons to get your house professionally cleaned.',
      'The frequency of professional cleaning depends on various factors including your lifestyle, family size, pets, and personal preferences.',
      '## Weekly Cleaning',
      'Weekly professional cleaning is ideal for:',
      '- Busy families with children',
      '- Households with multiple pets',
      '- People with allergies or respiratory issues',
      '- Those who entertain frequently',
      '**Benefits:** Maintains a consistently clean home, reduces allergens, and saves you significant time each week.',
      '## Bi-Weekly Cleaning',
      'Bi-weekly cleaning works well for:',
      '- Working professionals',
      '- Couples without children',
      '- Smaller homes or apartments',
      '- Those who maintain daily tidying routines',
      '**Benefits:** Balances cost with cleanliness, keeps your home fresh, and handles the tasks you don\'t have time for.',
      '## Monthly Cleaning',
      'Monthly professional cleaning is suitable for:',
      '- Single individuals in small spaces',
      '- Very organized households',
      '- Those who enjoy regular cleaning themselves',
      '- Budget-conscious homeowners',
      '**Benefits:** Handles deep cleaning tasks, tackles hard-to-reach areas, and provides a thorough refresh.',
      '## Seasonal Deep Cleaning',
      'In addition to regular cleaning, consider seasonal deep cleaning:',
      '- Spring cleaning: Refresh after winter',
      '- Fall cleaning: Prepare for the holidays',
      '- Post-party cleaning: Restore your home after events',
      '- Move-in/out cleaning: Start fresh or prepare for new occupants',
      '## Factors to Consider',
      '### Lifestyle',
      'How much time do you spend at home? The more you\'re home, the more frequently you may need cleaning.',
      '### Health Concerns',
      'Allergies, asthma, or immune system issues may require more frequent professional cleaning.',
      '### Budget',
      'While professional cleaning is an investment, it can save money in the long run by maintaining your home\'s condition.',
      '### Personal Standards',
      'Some people are comfortable with less frequent cleaning, while others prefer a consistently spotless environment.',
      '## Conclusion',
      'There\'s no one-size-fits-all answer to how often you should get your house cleaned professionally. Start with a frequency that feels right for you, and adjust as needed. At Shalean, we offer flexible scheduling to meet your unique needs.'
    ],
    category: 'Home Care',
    icon: Home,
    image: blogSpringCleaningImage,
    date: 'March 10, 2025',
    readTime: '7 min read',
    featured: true,
    author: 'Shalean Team'
  },
  {
    id: 'professional-mopping',
    title: 'Professional Mopping Tips',
    excerpt: 'Mopping is a common chore for many people in the home or office. It is an effortless house cleaning task that can remove dirt, grime, and germs from surfaces. However, it can be frustrating to get the best results.',
    content: 'Mopping is a common chore for many people in the home or office. It is an effortless house cleaning task that can remove dirt, grime, and germs from surfaces. However, it can be frustrating to get the best results.',
    fullContent: [
      'Mopping is a common chore for many people in the home or office. It is an effortless house cleaning task that can remove dirt, grime, and germs from surfaces. However, it can be frustrating to get the best results.',
      'Professional cleaners know that mopping is both an art and a science. Follow these expert tips to achieve streak-free, gleaming floors every time.',
      '## Preparation is Key',
      'Before you even touch the mop, proper preparation ensures better results:',
      '1. **Sweep or vacuum first:** Remove loose dirt, dust, and debris. Mopping over dirt just spreads it around.',
      '2. **Move furniture:** Clear the area to access all floor space.',
      '3. **Spot treat stains:** Pre-treat stubborn spots before mopping.',
      '4. **Check your mop:** Ensure it\'s clean and in good condition.',
      '## Choose the Right Mop',
      'Different mops serve different purposes:',
      '### Microfiber Mops',
      '- Best for: Most hard floors',
      '- Benefits: Highly absorbent, trap dirt effectively, eco-friendly',
      '- Great for regular maintenance',
      '### String Mops',
      '- Best for: Large areas, heavy-duty cleaning',
      '- Benefits: Durable, affordable',
      '- Ideal for commercial spaces',
      '### Spray Mops',
      '- Best for: Quick clean-ups, small spaces',
      '- Benefits: Convenient, precise solution control',
      '- Perfect for daily touch-ups',
      '### Steam Mops',
      '- Best for: Sealed hard floors, sanitizing',
      '- Benefits: Chemical-free, kills bacteria',
      '- Excellent for homes with children or pets',
      '## The Right Cleaning Solution',
      'Using the correct cleaning solution for your floor type is crucial:',
      '- **Tile:** All-purpose cleaner or vinegar solution',
      '- **Hardwood:** Wood-specific cleaner (minimal water)',
      '- **Laminate:** Laminate floor cleaner (never too wet)',
      '- **Vinyl:** Mild detergent or specialized vinyl cleaner',
      '- **Stone:** pH-neutral cleaner (avoid acidic solutions)',
      '**Pro Tip:** Always test new cleaning solutions in an inconspicuous area first.',
      '## Professional Mopping Technique',
      '### Step 1: Start with Clean Water',
      'Use two buckets: one for cleaning solution, one for rinsing. Change water frequently.',
      '### Step 2: Wring Out Excess Water',
      'Your mop should be damp, not soaking wet. Excess water can damage floors and leave streaks.',
      '### Step 3: Use the Figure-8 Pattern',
      'Move the mop in a figure-8 motion. This technique covers more area and is more efficient than back-and-forth motions.',
      '### Step 4: Work in Sections',
      'Divide the room into sections and complete one before moving to the next.',
      '### Step 5: Rinse and Repeat',
      'Rinse your mop frequently in the clean water bucket to avoid spreading dirty water.',
      '### Step 6: Dry Mop',
      'After mopping, go over the floor with a dry mop or towel to prevent water spots.',
      '## Common Mopping Mistakes to Avoid',
      '1. **Using too much water:** Can damage floors and promote mold growth',
      '2. **Dirty mop head:** Spreads bacteria instead of removing it',
      '3. **Wrong cleaning solution:** Can damage floor finish',
      '4. **Mopping corners last:** Dirt gets trapped in corners',
      '5. **Not rinsing the mop:** Leaves residue on floors',
      '## Mop Maintenance',
      'Proper mop care extends its life and ensures cleaner floors:',
      '- Rinse thoroughly after each use',
      '- Wash mop heads in hot water weekly',
      '- Hang to dry completely (prevents mold)',
      '- Replace mop heads every 2-3 months',
      '- Store in a dry, ventilated area',
      '## When to Call Professionals',
      'While regular mopping is manageable, professional cleaning services offer benefits:',
      '- Industrial-grade equipment',
      '- Expert knowledge of floor types',
      '- Deep cleaning capabilities',
      '- Time savings for busy households',
      '- Consistent, professional results',
      '## Conclusion',
      'Mastering the art of mopping takes practice, but these professional tips will help you achieve cleaner floors with less effort. Remember, the key is preparation, the right tools, and proper technique. When you need expert-level results or simply want your time back, Shalean\'s professional cleaners are here to help.'
    ],
    category: 'Professional Tips',
    icon: Droplets,
    image: blogEcoProductsImage,
    date: 'March 5, 2025',
    readTime: '10 min read',
    featured: false,
    author: 'Shalean Team'
  }
];

export const getFeaturedPosts = () => blogPosts.filter(post => post.featured);

export const getPostById = (id: string) => blogPosts.find(post => post.id === id);

export const getRecentPosts = (limit: number = 3) => blogPosts.slice(0, limit);

