import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, ArrowLeft, FileText, Globe } from "lucide-react"
import Link from "next/link"

async function getContentData() {
  const cookieStore = cookies()
  const isDevelopment = process.env.NODE_ENV === "development"
  const hasDebugBypass = cookieStore.get("admin_debug_bypass")?.value === "true"
  const isMiddlewareDisabled =
    process.env.DISABLE_MIDDLEWARE === "true" || process.env.NEXT_PUBLIC_DISABLE_MIDDLEWARE === "true"

  if (isDevelopment && (hasDebugBypass || isMiddlewareDisabled)) {
    console.log("[v0] Using admin debug bypass in content page")
    return {
      blogPosts: [],
      pages: [],
    }
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", user.email).single()

  if (!adminUser) {
    redirect("/admin/unauthorized")
  }

  // Get blog posts and pages
  const [blogPostsResult, pagesResult] = await Promise.all([
    supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
    supabase.from("pages").select("*").order("created_at", { ascending: false }),
  ])

  return {
    blogPosts: blogPostsResult.data || [],
    pages: pagesResult.data || [],
  }
}

export default async function ContentManagement() {
  const { blogPosts, pages } = await getContentData()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Management</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage blog posts and website pages</p>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Blog Post
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Write and publish new blog articles</p>
              <Link href="/admin/content/blog/new">
                <Button className="w-full">New Blog Post</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Page
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Create new website pages</p>
              <Link href="/admin/content/pages/new">
                <Button variant="outline" className="w-full bg-transparent">
                  New Page
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Blog Posts Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Blog Posts ({blogPosts.length})
            </h2>
            <Link href="/admin/content/blog/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>

          {blogPosts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
                <p className="text-gray-600 mb-4">Create your first blog post to get started.</p>
                <Link href="/admin/content/blog/new">
                  <Button>Create First Post</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{post.title}</h3>
                          <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Created: {formatDate(post.created_at)}</span>
                          {post.published_at && <span>Published: {formatDate(post.published_at)}</span>}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex gap-1">
                              {post.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {post.tags.length > 3 && <span className="text-xs">+{post.tags.length - 3} more</span>}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {post.status === "published" && (
                          <Link href={`/blog/${post.slug}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/content/blog/edit/${post.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pages Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Pages ({pages.length})
            </h2>
            <Link href="/admin/content/pages/new">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Page
              </Button>
            </Link>
          </div>

          {pages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Globe className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No custom pages yet</h3>
                <p className="text-gray-600 mb-4">Create custom pages for your website.</p>
                <Link href="/admin/content/pages/new">
                  <Button>Create First Page</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pages.map((page) => (
                <Card key={page.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{page.title}</h3>
                          <Badge className={getStatusColor(page.status)}>{page.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Slug: /{page.slug}</span>
                          <span>Created: {formatDate(page.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {page.status === "published" && (
                          <Link href={`/${page.slug}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/content/pages/edit/${page.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
