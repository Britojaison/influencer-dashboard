"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Share2, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2 as ShareIcon,
  ExternalLink,
  Instagram,
  Twitter,
  Youtube,
  Calendar,
  Users,
  DollarSign,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Campaign, Post, Influencer } from "@/types/database";

// Mock data - replace with actual data from Supabase
const mockCampaign: Campaign = {
  id: "1",
  brand_id: "1",
  name: "Summer Collection Launch",
  description: "Launch campaign for the new summer collection featuring our latest fashion line with influencer partnerships across multiple platforms.",
  start_date: "2024-06-01",
  end_date: "2024-08-31",
  status: "active",
  budget: 50000,
  created_at: "2024-05-15T10:00:00Z",
  updated_at: "2024-06-01T15:30:00Z",
  brand: { id: "1", name: "Fashion Brand A", created_at: "", updated_at: "" },
};

const mockInfluencers: Influencer[] = [
  {
    id: "1",
    name: "Emma Johnson",
    email: "emma@example.com",
    social_media_handles: { instagram: "@fashionista_emma" },
    followers_count: 125000,
    engagement_rate: 4.2,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    name: "Alex Chen",
    email: "alex@example.com",
    social_media_handles: { instagram: "@tech_reviewer" },
    followers_count: 89000,
    engagement_rate: 3.8,
    created_at: "",
    updated_at: "",
  },
];

const mockPosts: Post[] = [
  {
    id: "1",
    campaign_influencer_id: "1",
    platform: "instagram",
    post_url: "https://instagram.com/p/ABC123",
    post_id: "ABC123",
    caption: "Loving the new summer collection! 🌞 #SummerStyle #FashionBrandA",
    likes: 1240,
    comments: 89,
    shares: 23,
    views: 5600,
    posted_at: "2024-06-15T10:00:00Z",
    created_at: "2024-06-15T10:00:00Z",
    updated_at: "2024-06-15T10:00:00Z",
    campaign_influencer: {
      id: "1",
      campaign_id: "1",
      influencer_id: "1",
      status: "completed",
      rate: 2500,
      created_at: "",
      updated_at: "",
      campaign: mockCampaign,
      influencer: mockInfluencers[0],
    },
  },
  {
    id: "2",
    campaign_influencer_id: "2",
    platform: "instagram",
    post_url: "https://instagram.com/p/DEF456",
    post_id: "DEF456",
    caption: "Check out this amazing summer look! 🔥 #SummerFashion #BrandA",
    likes: 890,
    comments: 45,
    shares: 12,
    views: 3200,
    posted_at: "2024-06-16T14:30:00Z",
    created_at: "2024-06-16T14:30:00Z",
    updated_at: "2024-06-16T14:30:00Z",
    campaign_influencer: {
      id: "2",
      campaign_id: "1",
      influencer_id: "2",
      status: "completed",
      rate: 1800,
      created_at: "",
      updated_at: "",
      campaign: mockCampaign,
      influencer: mockInfluencers[1],
    },
  },
];

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    influencer_id: "",
    platform: "instagram" as const,
    post_url: "",
    caption: "",
    likes: "",
    comments: "",
    shares: "",
    views: "",
    posted_at: "",
  });

  const handleCreatePost = () => {
    const newPost: Post = {
      id: Date.now().toString(),
      campaign_influencer_id: formData.influencer_id,
      platform: formData.platform,
      post_url: formData.post_url,
      caption: formData.caption,
      likes: parseInt(formData.likes) || 0,
      comments: parseInt(formData.comments) || 0,
      shares: parseInt(formData.shares) || 0,
      views: parseInt(formData.views) || 0,
      posted_at: formData.posted_at,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      campaign_influencer: {
        id: formData.influencer_id,
        campaign_id: params.id,
        influencer_id: formData.influencer_id,
        status: "completed",
        created_at: "",
        updated_at: "",
        campaign: mockCampaign,
        influencer: mockInfluencers.find(i => i.id === formData.influencer_id),
      },
    };
    setPosts([...posts, newPost]);
    setFormData({
      influencer_id: "",
      platform: "instagram",
      post_url: "",
      caption: "",
      likes: "",
      comments: "",
      shares: "",
      views: "",
      posted_at: "",
    });
    setIsCreatePostDialogOpen(false);
  };

  const handleEditPost = () => {
    if (!editingPost) return;
    const updatedPosts = posts.map((post) =>
      post.id === editingPost.id
        ? {
            ...post,
            post_url: formData.post_url,
            caption: formData.caption,
            likes: parseInt(formData.likes) || 0,
            comments: parseInt(formData.comments) || 0,
            shares: parseInt(formData.shares) || 0,
            views: parseInt(formData.views) || 0,
            posted_at: formData.posted_at,
            updated_at: new Date().toISOString(),
          }
        : post
    );
    setPosts(updatedPosts);
    setEditingPost(null);
    setFormData({
      influencer_id: "",
      platform: "instagram",
      post_url: "",
      caption: "",
      likes: "",
      comments: "",
      shares: "",
      views: "",
      posted_at: "",
    });
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setFormData({
      influencer_id: post.campaign_influencer?.influencer_id || "",
      platform: post.platform,
      post_url: post.post_url,
      caption: post.caption || "",
      likes: post.likes.toString(),
      comments: post.comments.toString(),
      shares: post.shares.toString(),
      views: post.views?.toString() || "",
      posted_at: post.posted_at,
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const totalEngagement = posts.reduce((sum, post) => sum + post.likes + post.comments + post.shares, 0);
  const totalReach = posts.reduce((sum, post) => sum + (post.views || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/campaigns">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{mockCampaign.name}</h1>
            <p className="text-gray-600">{mockCampaign.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Campaign
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Post
          </Button>
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <p className="text-2xl font-bold">
                  {format(new Date(mockCampaign.start_date), "MMM dd")} - {format(new Date(mockCampaign.end_date), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Influencers</p>
                <p className="text-2xl font-bold">{mockInfluencers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Budget</p>
                <p className="text-2xl font-bold">${mockCampaign.budget?.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Engagement</p>
                <p className="text-2xl font-bold">{totalEngagement.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign Posts</CardTitle>
              <CardDescription>
                Manage influencer posts and track engagement metrics
              </CardDescription>
            </div>
            <Dialog open={isCreatePostDialogOpen} onOpenChange={setIsCreatePostDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Post</DialogTitle>
                  <DialogDescription>
                    Add a new influencer post to this campaign.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="influencer">Influencer</Label>
                    <Select value={formData.influencer_id} onValueChange={(value) => setFormData({ ...formData, influencer_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select influencer" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockInfluencers.map((influencer) => (
                          <SelectItem key={influencer.id} value={influencer.id}>
                            {influencer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={formData.platform} onValueChange={(value: any) => setFormData({ ...formData, platform: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="post_url">Post URL</Label>
                    <Input
                      id="post_url"
                      value={formData.post_url}
                      onChange={(e) => setFormData({ ...formData, post_url: e.target.value })}
                      placeholder="Enter post URL"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="caption">Caption</Label>
                    <Textarea
                      id="caption"
                      value={formData.caption}
                      onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                      placeholder="Enter post caption"
                    />
                  </div>
                  <div>
                    <Label htmlFor="likes">Likes</Label>
                    <Input
                      id="likes"
                      type="number"
                      value={formData.likes}
                      onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                      placeholder="Number of likes"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Input
                      id="comments"
                      type="number"
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      placeholder="Number of comments"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shares">Shares</Label>
                    <Input
                      id="shares"
                      type="number"
                      value={formData.shares}
                      onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                      placeholder="Number of shares"
                    />
                  </div>
                  <div>
                    <Label htmlFor="views">Views</Label>
                    <Input
                      id="views"
                      type="number"
                      value={formData.views}
                      onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                      placeholder="Number of views"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="posted_at">Posted Date</Label>
                    <Input
                      id="posted_at"
                      type="datetime-local"
                      value={formData.posted_at}
                      onChange={(e) => setFormData({ ...formData, posted_at: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreatePostDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePost}>Add Post</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Influencer</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`/avatars/${post.campaign_influencer?.influencer_id}.png`} />
                        <AvatarFallback>
                          {post.campaign_influencer?.influencer?.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{post.campaign_influencer?.influencer?.name}</div>
                        <div className="text-sm text-gray-500">{post.campaign_influencer?.influencer?.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(post.platform)}
                      <Badge variant="outline">{post.platform}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm font-medium truncate">
                        <a
                          href={post.post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                        >
                          <span>View Post</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {post.caption}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm">
                        <Heart className="h-3 w-3 text-red-500" />
                        <span>{post.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MessageCircle className="h-3 w-3 text-blue-500" />
                        <span>{post.comments.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <ShareIcon className="h-3 w-3 text-green-500" />
                        <span>{post.shares.toLocaleString()}</span>
                      </div>
                      {post.views && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Eye className="h-3 w-3 text-gray-500" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {format(new Date(post.posted_at), "MMM dd, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Post</DialogTitle>
                            <DialogDescription>
                              Update post information and engagement metrics.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <Label htmlFor="edit-post_url">Post URL</Label>
                              <Input
                                id="edit-post_url"
                                value={formData.post_url}
                                onChange={(e) => setFormData({ ...formData, post_url: e.target.value })}
                                placeholder="Enter post URL"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="edit-caption">Caption</Label>
                              <Textarea
                                id="edit-caption"
                                value={formData.caption}
                                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                                placeholder="Enter post caption"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-likes">Likes</Label>
                              <Input
                                id="edit-likes"
                                type="number"
                                value={formData.likes}
                                onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                                placeholder="Number of likes"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-comments">Comments</Label>
                              <Input
                                id="edit-comments"
                                type="number"
                                value={formData.comments}
                                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                placeholder="Number of comments"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-shares">Shares</Label>
                              <Input
                                id="edit-shares"
                                type="number"
                                value={formData.shares}
                                onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                                placeholder="Number of shares"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-views">Views</Label>
                              <Input
                                id="edit-views"
                                type="number"
                                value={formData.views}
                                onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                                placeholder="Number of views"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="edit-posted_at">Posted Date</Label>
                              <Input
                                id="edit-posted_at"
                                type="datetime-local"
                                value={formData.posted_at}
                                onChange={(e) => setFormData({ ...formData, posted_at: e.target.value })}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingPost(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleEditPost}>Update Post</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 