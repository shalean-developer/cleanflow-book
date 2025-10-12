import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, BookOpen, Home as HomeIcon } from 'lucide-react';
import { getPostById, getRecentPosts } from '@/data/blogPosts';
import { useEffect } from 'react';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = id ? getPostById(id) : null;
  const recentPosts = getRecentPosts(3).filter(p => p.id !== id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 px-4">
          <div className="text-6xl">📝</div>
          <h1 className="text-3xl font-bold">Blog Post Not Found</h1>
          <p className="text-muted-foreground text-lg">
            Sorry, we couldn't find the blog post you're looking for.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/blog')} variant="default">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
            <Button onClick={() => navigate('/')} variant="outline">
              <HomeIcon className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section with Image */}
      <section className="relative">
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <div className="max-w-4xl">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/blog')}
                  className="mb-6 text-white hover:text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
                
                <Badge className="mb-4 bg-primary text-white border-0">
                  {post.icon && <post.icon className="w-3 h-3 mr-1.5" />}
                  {post.category}
                </Badge>
                
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                  {post.author && (
                    <span className="flex items-center gap-2">
                      By {post.author}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
            {/* Main Content */}
            <article className="lg:col-span-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 md:p-12">
                  <div className="prose prose-lg max-w-none">
                    {post.fullContent.map((paragraph, index) => {
                      // Check if it's a heading
                      if (paragraph.startsWith('## ')) {
                        return (
                          <h2 key={index} className="text-2xl md:text-3xl font-bold mt-8 mb-4 text-foreground">
                            {paragraph.replace('## ', '')}
                          </h2>
                        );
                      }
                      // Check if it's a subheading
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h3 key={index} className="text-xl md:text-2xl font-semibold mt-6 mb-3 text-foreground">
                            {paragraph.replace('### ', '')}
                          </h3>
                        );
                      }
                      // Check if it's bold text
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return (
                          <p key={index} className="text-base md:text-lg leading-relaxed mb-4 font-semibold text-foreground">
                            {paragraph.replace(/\*\*/g, '')}
                          </p>
                        );
                      }
                      // Check if it contains bold inline text
                      if (paragraph.includes('**')) {
                        const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                        return (
                          <p key={index} className="text-base md:text-lg leading-relaxed mb-4 text-muted-foreground">
                            {parts.map((part, i) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={i} className="font-semibold text-foreground">{part.replace(/\*\*/g, '')}</strong>;
                              }
                              return part;
                            })}
                          </p>
                        );
                      }
                      // Check if it's a list item
                      if (paragraph.startsWith('- ')) {
                        return (
                          <li key={index} className="text-base md:text-lg leading-relaxed mb-2 ml-6 text-muted-foreground">
                            {paragraph.replace('- ', '')}
                          </li>
                        );
                      }
                      // Check if it's a numbered list item
                      if (/^\d+\./.test(paragraph)) {
                        return (
                          <li key={index} className="text-base md:text-lg leading-relaxed mb-2 ml-6 list-decimal text-muted-foreground">
                            {paragraph.replace(/^\d+\.\s*/, '')}
                          </li>
                        );
                      }
                      // Regular paragraph
                      return (
                        <p key={index} className="text-base md:text-lg leading-relaxed mb-6 text-muted-foreground">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* Article Footer */}
                  <div className="mt-12 pt-8 border-t">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Found this helpful?</p>
                        <p className="text-lg font-semibold">Share this article</p>
                      </div>
                      <Button onClick={() => navigate('/booking/service/select')}>
                        Book a Cleaning Service
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* CTA Card */}
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <BookOpen className="w-12 h-12 text-primary mb-3" />
                      <h3 className="text-xl font-bold mb-2">Need Professional Help?</h3>
                      <p className="text-muted-foreground text-sm">
                        Let our expert team handle your cleaning needs while you focus on what matters most.
                      </p>
                    </div>
                    <Button className="w-full" onClick={() => navigate('/booking/service/select')}>
                      Book Now
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full mt-2"
                      onClick={() => navigate('/booking/quote')}
                    >
                      Get a Quote
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Posts */}
                {recentPosts.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-4">Recent Articles</h3>
                      <div className="space-y-4">
                        {recentPosts.map((recentPost) => (
                          <Link
                            key={recentPost.id}
                            to={`/blog/${recentPost.id}`}
                            className="block group"
                          >
                            <div className="flex gap-3">
                              <img 
                                src={recentPost.image} 
                                alt={recentPost.title}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                                  {recentPost.title}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {recentPost.readTime}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Button 
                        variant="link" 
                        className="w-full mt-4 p-0"
                        onClick={() => navigate('/blog')}
                      >
                        View All Articles →
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Categories */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-4">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                        Cleaning Tips
                      </Badge>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                        Home Care
                      </Badge>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                        Professional Tips
                      </Badge>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white transition-colors">
                        Guides
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;

