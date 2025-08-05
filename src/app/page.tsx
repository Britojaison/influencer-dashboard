import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  Calendar, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Plus 
} from "lucide-react";
import Link from "next/link";

// Mock data - replace with actual data from Supabase
const stats = [
  {
    title: "Total Brands",
    value: "6",
    icon: BarChart3,
    description: "Active brands",
  },
  {
    title: "Active Campaigns",
    value: "12",
    icon: Calendar,
    description: "Running campaigns",
  },
  {
    title: "Total Influencers",
    value: "48",
    icon: Users,
    description: "Registered influencers",
  },
  {
    title: "Total Engagement",
    value: "2.4M",
    icon: TrendingUp,
    description: "Likes, comments, shares",
  },
];

const recentCampaigns = [
  {
    id: "1",
    name: "Summer Collection Launch",
    brand: "Fashion Brand A",
    status: "active",
    influencers: 8,
    posts: 24,
    engagement: "156K",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
  },
  {
    id: "2",
    name: "Product Launch Campaign",
    brand: "Tech Brand B",
    status: "active",
    influencers: 5,
    posts: 15,
    engagement: "89K",
    startDate: "2024-06-15",
    endDate: "2024-07-15",
  },
  {
    id: "3",
    name: "Holiday Promotion",
    brand: "Lifestyle Brand C",
    status: "completed",
    influencers: 12,
    posts: 36,
    engagement: "234K",
    startDate: "2024-05-01",
    endDate: "2024-05-31",
  },
];

const recentPosts = [
  {
    id: "1",
    influencer: "@fashionista_emma",
    platform: "Instagram",
    likes: 1240,
    comments: 89,
    shares: 23,
    postedAt: "2 hours ago",
  },
  {
    id: "2",
    influencer: "@tech_reviewer",
    platform: "TikTok",
    likes: 8900,
    comments: 234,
    shares: 156,
    postedAt: "4 hours ago",
  },
  {
    id: "3",
    influencer: "@lifestyle_guru",
    platform: "YouTube",
    likes: 5600,
    comments: 189,
    shares: 67,
    postedAt: "1 day ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your campaigns.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>
              Latest campaign activities and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                      <Badge
                        variant={campaign.status === "active" ? "default" : "secondary"}
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{campaign.brand}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{campaign.influencers} influencers</span>
                      <span>{campaign.posts} posts</span>
                      <span>{campaign.engagement} engagement</span>
                    </div>
                  </div>
                  <Link href={`/campaigns/${campaign.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>
              Latest influencer posts and engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{post.influencer}</h3>
                      <Badge variant="outline">{post.platform}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {post.likes.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {post.comments}
                      </span>
                      <span className="flex items-center">
                        <Share2 className="h-3 w-3 mr-1" />
                        {post.shares}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{post.postedAt}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 