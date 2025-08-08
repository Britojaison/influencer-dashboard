"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  ExternalLink,
  ArrowLeft,
  Users,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Play
} from "lucide-react";
import { Campaign, CampaignInfluencerDetail } from "@/types/database";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export default function CampaignManagementPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [influencers, setInfluencers] = useState<CampaignInfluencerDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableExists, setTableExists] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddInfluencerDialogOpen, setIsAddInfluencerDialogOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState<CampaignInfluencerDetail | null>(null);
  const [fetchingMetrics, setFetchingMetrics] = useState(false);
  const [isSummaryEditing, setIsSummaryEditing] = useState(false);
  const [summaryContent, setSummaryContent] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    platform: "instagram" as 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook' | 'linkedin',
    username: "",
    content_type: "",
    post_url: "",
    likes: "",
    comments: "",
    shares: "",
    views: "",
    followers_count: "",
    status: "active" as 'active' | 'inactive' | 'completed',
    notes: "",
  });

  // Load campaign and influencer data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch campaign data
        const campaignResponse = await fetch(`/api/campaigns/${campaignId}`);
        if (!campaignResponse.ok) {
          throw new Error('Failed to fetch campaign');
        }
        const campaignData = await campaignResponse.json();
        setCampaign(campaignData);
        setSummaryContent(campaignData.summary || "");
        
        // Fetch influencers data
        const influencersResponse = await fetch(`/api/campaigns/${campaignId}/influencers`);
        if (influencersResponse.status === 404) {
          // Table doesn't exist
          setTableExists(false);
          setInfluencers([]);
        } else if (influencersResponse.ok) {
          setTableExists(true);
          const influencersData = await influencersResponse.json();
          setInfluencers(influencersData);
        } else {
          throw new Error('Failed to fetch influencers');
        }
      } catch (error) {
        console.error('Error loading campaign data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      loadData();
    }
  }, [campaignId]);

  const filteredInfluencers = influencers.filter((influencer) =>
    influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInfluencer = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/influencers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          likes: parseInt(formData.likes) || 0,
          comments: parseInt(formData.comments) || 0,
          shares: parseInt(formData.shares) || 0,
          views: parseInt(formData.views) || 0,
          followers_count: parseInt(formData.followers_count) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create influencer');
      }

      const newInfluencer = await response.json();
      setInfluencers([newInfluencer, ...influencers]);
      setFormData({
        name: "",
        platform: "instagram",
        username: "",
        content_type: "",
        post_url: "",
        likes: "",
        comments: "",
        shares: "",
        views: "",
        followers_count: "",
        status: "active",
        notes: "",
      });
      setIsAddInfluencerDialogOpen(false);
    } catch (error) {
      console.error('Error creating influencer:', error);
    }
  };

  const handleEditInfluencer = async () => {
    if (!editingInfluencer) return;
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/influencers`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingInfluencer.id,
          ...formData,
          likes: parseInt(formData.likes) || 0,
          comments: parseInt(formData.comments) || 0,
          shares: parseInt(formData.shares) || 0,
          views: parseInt(formData.views) || 0,
          followers_count: parseInt(formData.followers_count) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update influencer');
      }

      const updatedInfluencer = await response.json();
      setInfluencers(influencers.map((inf) =>
        inf.id === editingInfluencer.id ? updatedInfluencer : inf
      ));
      setEditingInfluencer(null);
      setFormData({
        name: "",
        platform: "instagram",
        username: "",
        content_type: "",
        post_url: "",
        likes: "",
        comments: "",
        shares: "",
        views: "",
        followers_count: "",
        status: "active",
        notes: "",
      });
    } catch (error) {
      console.error('Error updating influencer:', error);
    }
  };

  const handleDeleteInfluencer = async (id: string) => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/influencers?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete influencer');
      }

      setInfluencers(influencers.filter((inf) => inf.id !== id));
    } catch (error) {
      console.error('Error deleting influencer:', error);
    }
  };

  const openEditDialog = (influencer: CampaignInfluencerDetail) => {
    setEditingInfluencer(influencer);
    setFormData({
      name: influencer.name,
      platform: influencer.platform,
      username: influencer.username,
      content_type: influencer.content_type || "",
      post_url: influencer.post_url || "",
      likes: influencer.likes.toString(),
      comments: influencer.comments.toString(),
      shares: influencer.shares.toString(),
      views: influencer.views.toString(),

      followers_count: influencer.followers_count.toString(),
      status: influencer.status,
      notes: influencer.notes || "",
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center text-white text-xs">IG</div>;
      case 'tiktok':
        return <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white text-xs">TT</div>;
      case 'youtube':
        return <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs">YT</div>;
      case 'twitter':
        return <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center text-white text-xs">TW</div>;
      default:
        return <div className="w-6 h-6 bg-gray-500 rounded flex items-center justify-center text-white text-xs">{platform.charAt(0).toUpperCase()}</div>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-600">Campaign not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="text-gray-600">{campaign.brand?.name}</p>
          </div>
        </div>
        <Badge className={getStatusColor(campaign.status)}>
          {campaign.status}
        </Badge>
      </div>

      {/* Campaign Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Influencers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{influencers.length}</div>
            <p className="text-xs text-muted-foreground">Active influencers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {influencers.reduce((sum, inf) => sum + inf.likes + inf.comments + inf.shares, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Likes, comments, shares</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Engagement Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {influencers.length > 0 
                ? (influencers.reduce((sum, inf) => sum + inf.likes + inf.comments + inf.shares, 0) / influencers.length).toFixed(0)
                : "0"
              }
            </div>
            <p className="text-xs text-muted-foreground">Average engagement per influencer</p>
          </CardContent>
        </Card>
      </div>

      {/* Influencers Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign Influencers</CardTitle>
              <CardDescription>
                Manage influencers and track their performance
              </CardDescription>
            </div>
            <Dialog open={isAddInfluencerDialogOpen} onOpenChange={setIsAddInfluencerDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={!tableExists}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Influencer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Influencer</DialogTitle>
                  <DialogDescription>
                    Add influencer details and performance metrics.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="col-span-2">
                    <Label htmlFor="post_url">Post URL</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="post_url"
                        value={formData.post_url}
                        onChange={(e) => setFormData({ ...formData, post_url: e.target.value })}
                        placeholder="https://..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={fetchingMetrics || !formData.post_url}
                        onClick={async () => {
                          if (formData.post_url) {
                            try {
                              setFetchingMetrics(true);
                              const response = await fetch('/api/webhook/fetch-post-metrics', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  postUrl: formData.post_url
                                }),
                              });
                              
                              if (response.ok) {
                                const metrics = await response.json();
                                setFormData({
                                  ...formData,
                                  name: metrics.name || formData.name,
                                  username: metrics.username ? `@${metrics.username}` : formData.username,
                                  likes: metrics.likes?.toString() || formData.likes,
                                  comments: metrics.comments?.toString() || formData.comments,
                                  views: metrics.views?.toString() || formData.views,
                                });
                              } else {
                                console.error('Failed to fetch metrics:', response.statusText);
                              }
                            } catch (error) {
                              console.error('Error fetching metrics:', error);
                            } finally {
                              setFetchingMetrics(false);
                            }
                          }
                        }}
                      >
                        {fetchingMetrics ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                            Fetching...
                          </>
                        ) : (
                          'Fetch Metrics'
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="name">Influencer Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter influencer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={formData.platform} onValueChange={(value: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook' | 'linkedin') => setFormData({ ...formData, platform: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="@username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content_type">Content Type</Label>
                    <Input
                      id="content_type"
                      value={formData.content_type}
                      onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                      placeholder="e.g., Photo Post, Video, Story"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'completed') => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="likes">Likes</Label>
                    <Input
                      id="likes"
                      type="number"
                      value={formData.likes}
                      onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Input
                      id="comments"
                      type="number"
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shares">Shares</Label>
                    <Input
                      id="shares"
                      type="number"
                      value={formData.shares}
                      onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="views">Views</Label>
                    <Input
                      id="views"
                      type="number"
                      value={formData.views}
                      onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="followers_count">Followers Count</Label>
                    <Input
                      id="followers_count"
                      type="number"
                      value={formData.followers_count}
                      onChange={(e) => setFormData({ ...formData, followers_count: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddInfluencerDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={editingInfluencer ? handleEditInfluencer : handleCreateInfluencer}>
                    {editingInfluencer ? 'Update Influencer' : 'Add Influencer'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table Setup Warning */}
          {!tableExists && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Database Setup Required
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      The campaign influencers table has not been created yet. Please run the SQL schema in your Supabase database to enable influencer management.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search influencers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={!tableExists}
              />
            </div>
          </div>

          {/* Influencers Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Influencer</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Likes</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Shares</TableHead>
                <TableHead>Views</TableHead>

                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInfluencers.map((influencer) => (
                <TableRow key={influencer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{influencer.name}</div>
                      <div className="text-sm text-gray-500">{influencer.username}</div>
                      <div className="text-xs text-gray-400">{influencer.followers_count.toLocaleString()} followers</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(influencer.platform)}
                      <span className="capitalize">{influencer.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium">{influencer.content_type || "N/A"}</div>
                      {influencer.post_url && (
                        <a
                          href={influencer.post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 text-xs"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Post
                        </a>
                      )}
                    </div>
                  </TableCell>
                                      <TableCell>
                      <div className="flex items-center text-sm">
                        <Heart className="h-3 w-3 mr-1 text-red-500" />
                        {influencer.likes.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MessageCircle className="h-3 w-3 mr-1 text-blue-500" />
                        {influencer.comments.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Share2 className="h-3 w-3 mr-1 text-green-500" />
                        {influencer.shares.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {influencer.views > 0 ? (
                        <div className="flex items-center text-sm">
                          <Play className="h-3 w-3 mr-1 text-purple-500" />
                          {influencer.views.toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>

                  <TableCell>
                    <Badge className={getStatusColor(influencer.status)}>
                      {influencer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(influencer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Influencer</DialogTitle>
                            <DialogDescription>
                              Update influencer information and metrics.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="col-span-2">
                              <Label htmlFor="edit-post_url">Post URL</Label>
                              <div className="flex space-x-2">
                                <Input
                                  id="edit-post_url"
                                  value={formData.post_url}
                                  onChange={(e) => setFormData({ ...formData, post_url: e.target.value })}
                                  placeholder="https://..."
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={fetchingMetrics || !formData.post_url}
                                  onClick={async () => {
                                    if (formData.post_url) {
                                      try {
                                        setFetchingMetrics(true);
                                        const response = await fetch('/api/webhook/fetch-post-metrics', {
                                          method: 'POST',
                                          headers: {
                                            'Content-Type': 'application/json',
                                          },
                                          body: JSON.stringify({
                                            postUrl: formData.post_url
                                          }),
                                        });
                                        
                                        if (response.ok) {
                                          const metrics = await response.json();
                                          setFormData({
                                            ...formData,
                                            name: metrics.name || formData.name,
                                            username: metrics.username ? `@${metrics.username}` : formData.username,
                                            likes: metrics.likes?.toString() || formData.likes,
                                            comments: metrics.comments?.toString() || formData.comments,
                                            views: metrics.views?.toString() || formData.views,
                                          });
                                        } else {
                                          console.error('Failed to fetch metrics:', response.statusText);
                                        }
                                      } catch (error) {
                                        console.error('Error fetching metrics:', error);
                                      } finally {
                                        setFetchingMetrics(false);
                                      }
                                    }
                                  }}
                                >
                                  {fetchingMetrics ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                                      Fetching...
                                    </>
                                  ) : (
                                    'Fetch Metrics'
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="edit-name">Influencer Name</Label>
                              <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter influencer name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-platform">Platform</Label>
                              <Select value={formData.platform} onValueChange={(value: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook' | 'linkedin') => setFormData({ ...formData, platform: value })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="instagram">Instagram</SelectItem>
                                  <SelectItem value="tiktok">TikTok</SelectItem>
                                  <SelectItem value="youtube">YouTube</SelectItem>
                                  <SelectItem value="twitter">Twitter</SelectItem>
                                  <SelectItem value="facebook">Facebook</SelectItem>
                                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-username">Username</Label>
                              <Input
                                id="edit-username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                placeholder="@username"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-content_type">Content Type</Label>
                              <Input
                                id="edit-content_type"
                                value={formData.content_type}
                                onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                                placeholder="e.g., Photo Post, Video, Story"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-status">Status</Label>
                              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'completed') => setFormData({ ...formData, status: value })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="inactive">Inactive</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="edit-likes">Likes</Label>
                              <Input
                                id="edit-likes"
                                type="number"
                                value={formData.likes}
                                onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-comments">Comments</Label>
                              <Input
                                id="edit-comments"
                                type="number"
                                value={formData.comments}
                                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-shares">Shares</Label>
                              <Input
                                id="edit-shares"
                                type="number"
                                value={formData.shares}
                                onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                                placeholder="0"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-views">Views</Label>
                              <Input
                                id="edit-views"
                                type="number"
                                value={formData.views}
                                onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                                placeholder="0"
                              />
                            </div>

                            <div>
                              <Label htmlFor="edit-followers_count">Followers Count</Label>
                              <Input
                                id="edit-followers_count"
                                type="number"
                                value={formData.followers_count}
                                onChange={(e) => setFormData({ ...formData, followers_count: e.target.value })}
                                placeholder="0"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="edit-notes">Notes</Label>
                              <Textarea
                                id="edit-notes"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Additional notes..."
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingInfluencer(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleEditInfluencer}>
                              Update Influencer
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInfluencer(influencer.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {/* Totals Row */}
              <TableRow className="bg-gray-50 font-semibold">
                <TableCell colSpan={3} className="text-center font-bold">
                  TOTALS
                </TableCell>
                <TableCell className="text-center font-bold">
                  {influencers.reduce((sum, inf) => sum + inf.likes, 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {influencers.reduce((sum, inf) => sum + inf.comments, 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {influencers.reduce((sum, inf) => sum + inf.shares, 0).toLocaleString()}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {influencers.reduce((sum, inf) => sum + inf.views, 0).toLocaleString()}
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                            </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Campaign Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign Summary</CardTitle>
              <CardDescription>
                Add a detailed summary of the campaign performance and insights
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSummaryEditing(!isSummaryEditing)}
            >
              {isSummaryEditing ? "Cancel" : "Edit Summary"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isSummaryEditing ? (
            <div className="space-y-4">
              <RichTextEditor
                value={summaryContent}
                onChange={setSummaryContent}
                placeholder="Write a detailed summary of the campaign..."
                className="min-h-[300px]"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSummaryEditing(false);
                    setSummaryContent(campaign?.summary || "");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/campaigns/${campaignId}`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          summary: summaryContent,
                        }),
                      });
                      
                      if (response.ok) {
                        setCampaign(prev => prev ? { ...prev, summary: summaryContent } : null);
                        setIsSummaryEditing(false);
                      } else {
                        console.error('Failed to update summary');
                      }
                    } catch (error) {
                      console.error('Error updating summary:', error);
                    }
                  }}
                >
                  Save Summary
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              {campaign?.summary ? (
                <div dangerouslySetInnerHTML={{ __html: campaign.summary }} />
              ) : (
                <p className="text-gray-500 italic">No summary added yet. Click &quot;Edit Summary&quot; to add one.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 