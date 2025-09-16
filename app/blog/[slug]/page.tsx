import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error || !post) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  // Convert markdown-style content to HTML (basic conversion)
  const formatContent = (content: string) => {
    return content
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
      .replace(/^\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/^\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(.*)$/gim, '<p class="mb-4">$1</p>')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post.featured_image && (
            <div className="aspect-video relative rounded-lg overflow-hidden mb-8">
              <Image src={post.featured_image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{estimateReadingTime(post.content)} min read</span>
              </div>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>

            <h1 className="text-4xl font-bold mb-4 text-balance">{post.title}</h1>

            {post.excerpt && <p className="text-xl text-muted-foreground mb-6 text-pretty">{post.excerpt}</p>}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t">
            <div className="flex justify-between items-center">
              <Button variant="outline" asChild>
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Link>
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share Article
                </Button>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  )
}
