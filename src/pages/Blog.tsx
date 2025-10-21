import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string | null;
  category: string;
  published_at: string;
  author_name: string;
  featured: boolean;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Web Design", "SEO", "Marketing", "Case Studies", "Tools & Resources"];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      let query = supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (selectedCategory !== "All") {
        query = query.eq("category", selectedCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching blog posts:", error);
      } else if (data) {
        const featured = data.find(post => post.featured);
        setFeaturedPost(featured || null);
        setPosts(data.filter(post => !post.featured || !featured));
      }
      setLoading(false);
    };

    fetchPosts();
  }, [selectedCategory]);

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Website Strategy & Growth Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert advice on building websites that attract clients, rank on Google, and outperform your competition.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* Featured Post */}
            {featuredPost && selectedCategory === "All" && (
              <Link to={`/blog/${featuredPost.slug}`}>
                <Card className="mb-8 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                  {featuredPost.featured_image_url && (
                    <div className="h-64 overflow-hidden">
                      <img
                        src={featuredPost.featured_image_url}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>{featuredPost.category}</Badge>
                      <Badge variant="secondary">Featured</Badge>
                    </div>
                    <CardTitle className="text-2xl md:text-3xl">{featuredPost.title}</CardTitle>
                    <CardDescription className="text-base">
                      {featuredPost.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{featuredPost.author_name}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(featuredPost.published_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}

            {/* Posts Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No posts found in this category.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      {post.featured_image_url && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <Badge className="w-fit mb-2">{post.category}</Badge>
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{post.author_name}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(post.published_at).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-accent">
              <CardHeader>
                <CardTitle>Get Your Free Website Assessment</CardTitle>
                <CardDescription>
                  See exactly what's holding your website back in under 30 seconds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/assessment">
                  <Button className="w-full" size="lg">
                    Take Assessment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Popular Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.filter(c => c !== "All").map((cat) => (
                  <Button
                    key={cat}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <CardTitle>Stay Updated</CardTitle>
                <CardDescription>
                  Get weekly insights on web design, SEO, and growth strategies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Subscribe to Newsletter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
