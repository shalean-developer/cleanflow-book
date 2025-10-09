import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import blogCleaningTipsImage from '@/assets/blog-cleaning-tips.jpg';
import blogSpringCleaningImage from '@/assets/blog-spring-cleaning.jpg';
import blogEcoProductsImage from '@/assets/blog-eco-products.jpg';

const Blog = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      title: '10 Tips for Maintaining a Clean Home',
      excerpt: 'Simple daily habits that make a big difference in keeping your home spotless between professional cleanings.',
      content: 'Discover practical strategies to maintain a consistently clean home with minimal effort.',
      date: 'March 15, 2025',
      category: 'Tips & Tricks',
      image: blogCleaningTipsImage,
      readTime: '5 min read',
      featured: true
    },
    {
      title: 'Spring Cleaning Checklist',
      excerpt: 'Your complete guide to refreshing every corner of your home this season with our comprehensive checklist.',
      content: 'From deep cleaning carpets to organizing closets, we cover everything you need for a thorough spring refresh.',
      date: 'March 10, 2025',
      category: 'Guides',
      image: blogSpringCleaningImage,
      readTime: '8 min read',
      featured: true
    },
    {
      title: 'Eco-Friendly Cleaning Products We Love',
      excerpt: 'Discover our favorite green cleaning solutions that are safe for your family and effective on dirt and grime.',
      content: 'Learn about sustainable cleaning products that protect the environment without compromising on cleanliness.',
      date: 'March 5, 2025',
      category: 'Products',
      image: blogEcoProductsImage,
      readTime: '6 min read',
      featured: false
    },
    {
      title: 'How to Prepare for a Professional Cleaning',
      excerpt: 'Maximize the value of your professional cleaning service with these simple preparation tips.',
      content: 'Get the most out of your cleaning appointment by following our expert recommendations.',
      date: 'February 28, 2025',
      category: 'Tips & Tricks',
      image: blogCleaningTipsImage,
      readTime: '4 min read',
      featured: false
    },
    {
      title: 'Deep Cleaning vs. Regular Cleaning: What\'s the Difference?',
      excerpt: 'Understand the key differences between regular and deep cleaning to choose the right service for your needs.',
      content: 'We break down what each service includes and when you should schedule each type.',
      date: 'February 20, 2025',
      category: 'Guides',
      image: blogSpringCleaningImage,
      readTime: '7 min read',
      featured: false
    },
    {
      title: 'The Benefits of Regular Professional Cleaning',
      excerpt: 'Learn how consistent professional cleaning services improve your home environment and quality of life.',
      content: 'From health benefits to time savings, discover why regular professional cleaning is worth the investment.',
      date: 'February 15, 2025',
      category: 'Tips & Tricks',
      image: blogEcoProductsImage,
      readTime: '5 min read',
      featured: false
    }
  ];

  const categories = ['All', 'Tips & Tricks', 'Guides', 'Products'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-xl cursor-pointer" onClick={() => navigate('/')}>
              <img src="/favicon.png" alt="Shalean Logo" className="w-6 h-6" />
              <span>Shalean</span>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="inline-flex items-center gap-2 px-4 py-2" variant="outline">
              <BookOpen className="w-4 h-4" />
              Cleaning Tips & Insights
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold">
              Our <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert tips, guides, and insights to help you maintain a cleaner, healthier home
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {categories.map((category, i) => (
              <Button
                key={i}
                variant={i === 0 ? 'default' : 'outline'}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Featured Articles</h2>
            <p className="text-muted-foreground">Our most popular and helpful content</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {blogPosts.filter(post => post.featured).map((post, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-xl transition-all border-2 hover:border-primary/20 group cursor-pointer">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4">{post.category}</Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-base">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0 h-auto">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">All Articles</h2>
            <p className="text-muted-foreground">Browse our complete collection of cleaning guides and tips</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogPosts.map((post, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Read More
                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto text-center border-2">
            <CardHeader>
              <CardTitle className="text-3xl">Stay Updated</CardTitle>
              <CardDescription className="text-base">
                Subscribe to our newsletter for the latest cleaning tips and exclusive offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button className="whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Blog;
