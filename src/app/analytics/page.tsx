"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Calendar,
  Filter
} from "lucide-react";

// Mock analytics data - replace with actual data from Supabase
const analyticsData = {
  totalEngagement: 2456789,
  totalReach: 12500000,
  totalPosts: 156,
  totalInfluencers: 48,
  engagementRate: 3.2,
  reachGrowth: 12.5,
  engagementGrowth: 8.3,
  postsGrowth: 15.2,
};

const topCampaigns = [
  {
    id: "1",
    name: "Summer Collection Launch",
    brand: "Fashion Brand A",
    engagement: 456789,
    reach: 2300000,
    posts: 24,
    influencers: 8,
  },
  {
    id: "2",
    name: "Product Launch Campaign",
    brand: "Tech Brand B",
    engagement: 234567,
    reach: 1200000,
    posts: 15,
    influencers: 5,
  },
  {
    id: "3",
    name: "Holiday Promotion",
    brand: "Lifestyle Brand C",
    engagement: 189234,
    reach: 980000,
    posts: 18,
    influencers: 6,
  },
];

const topInfluencers = [
  {
    id: "1",
    name: "Emma Johnson",
    followers: 125000,
    engagement: 89000,
    posts: 12,
    engagementRate: 4.2,
  },
  {
    id: "2",
    name: "Alex Chen",
    followers: 89000,
    engagement: 67000,
    posts: 8,
    engagementRate: 3.8,
  },
  {
    id: "3",
    name: "Sarah Williams",
    followers: 156000,
    engagement: 123000,
    posts: 15,
    engagementRate: 5.1,
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Campaign performance and influencer insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select defaultValue="30">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Engagement
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsData.totalEngagement.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{analyticsData.engagementGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reach
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsData.totalReach.toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{analyticsData.reachGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Posts
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsData.totalPosts}
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{analyticsData.postsGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Influencers
            </CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsData.totalInfluencers}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span>Across all campaigns</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Engagement Breakdown</CardTitle>
            <CardDescription>
              Distribution of engagement across different metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Likes</span>
                </div>
                <div className="text-sm text-gray-600">1,234,567</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: "70%" }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Comments</span>
                </div>
                <div className="text-sm text-gray-600">234,567</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "20%" }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Share2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Shares</span>
                </div>
                <div className="text-sm text-gray-600">123,456</div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "10%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>
              Engagement across different social media platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Instagram</span>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">1,567,890</div>
                  <Badge variant="outline" className="text-green-600">+12%</Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">TikTok</span>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">456,789</div>
                  <Badge variant="outline" className="text-green-600">+8%</Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-black h-2 rounded-full" style={{ width: "25%" }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">YouTube</span>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">234,567</div>
                  <Badge variant="outline" className="text-green-600">+5%</Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: "10%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Campaigns and Influencers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Campaigns</CardTitle>
            <CardDescription>
              Campaigns with highest engagement and reach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCampaigns.map((campaign, index) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-gray-500">{campaign.brand}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{campaign.engagement.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">engagement</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Influencers</CardTitle>
            <CardDescription>
              Influencers with highest engagement rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topInfluencers.map((influencer, index) => (
                <div key={influencer.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{influencer.name}</div>
                      <div className="text-sm text-gray-500">{influencer.followers.toLocaleString()} followers</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{influencer.engagementRate}%</div>
                    <div className="text-xs text-gray-500">engagement rate</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 