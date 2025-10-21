import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, ArrowLeft, Share2, ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  category: string;
  tags: string[] | null;
  published_at: string;
  author_name: string;
  author_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  affiliate_disclosure: string | null;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) {
        console.error("Error fetching blog post:", error);
      } else if (data) {
        setPost(data);
        
        // Fetch related posts
        const { data: related } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("category", data.category)
          .eq("status", "published")
          .neq("slug", slug)
          .limit(3);

        if (related) setRelatedPosts(related);
      }

      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Post Not Found</CardTitle>
            <CardDescription>The blog post you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero with Featured Image */}
      {post.featured_image_url && (
        <div className="relative h-96 overflow-hidden">
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Button */}
        <Link to="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                {post.author_image_url && <AvatarImage src={post.author_image_url} alt={post.author_name} />}
                <AvatarFallback>{post.author_name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{post.author_name}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <span>{new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <Separator orientation="vertical" className="h-6" />
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {getReadTime(post.content)} min read
            </span>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm" onClick={sharePost}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Affiliate Disclosure */}
        {post.affiliate_disclosure && (
          <Card className="mb-8 bg-accent/10 border-accent">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{post.affiliate_disclosure}</p>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* CTA Card in Content */}
        <Card className="my-12 bg-gradient-to-br from-primary/10 to-accent/10 border-accent">
          <CardHeader>
            <CardTitle>Ready to Improve Your Website?</CardTitle>
            <CardDescription>
              Get a free assessment of your website and see exactly what needs fixing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/assessment">
              <Button size="lg">
                Take Free Assessment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Author Bio */}
        <Card className="mb-12 bg-secondary/20">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Avatar className="h-16 w-16">
                {post.author_image_url && <AvatarImage src={post.author_image_url} alt={post.author_name} />}
                <AvatarFallback>{post.author_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg mb-1">{post.author_name}</h3>
                <p className="text-sm text-muted-foreground">
                  Web strategy expert helping businesses build websites that attract clients and drive growth.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link key={related.id} to={`/blog/${related.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {related.featured_image_url && (
                      <div className="h-40 overflow-hidden">
                        <img
                          src={related.featured_image_url}
                          alt={related.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <Badge className="w-fit mb-2">{related.category}</Badge>
                      <CardTitle className="line-clamp-2 text-lg">{related.title}</CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
