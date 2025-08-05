"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Edit, Trash2, Search, Filter, Instagram, Twitter, Youtube, ExternalLink } from "lucide-react";
import { Influencer } from "@/types/database";

// Mock data - replace with actual data from Supabase
const mockInfluencers: Influencer[] = [
  {
    id: "1",
    name: "Emma Johnson",
    email: "emma@example.com",
    phone: "+1 (555) 123-4567",
    social_media_handles: {
      instagram: "@fashionista_emma",
      tiktok: "@emma_fashion",
      youtube: "@emma_lifestyle",
      twitter: "@emma_johnson",
    },
    followers_count: 125000,
    engagement_rate: 4.2,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-06-01T15:30:00Z",
  },
  {
    id: "2",
    name: "Alex Chen",
    email: "alex@example.com",
    phone: "+1 (555) 987-6543",
    social_media_handles: {
      instagram: "@tech_reviewer",
      tiktok: "@alex_tech",
      youtube: "@alex_chen_tech",
      twitter: "@alex_chen",
    },
    followers_count: 89000,
    engagement_rate: 3.8,
    created_at: "2024-02-20T14:00:00Z",
    updated_at: "2024-05-28T09:15:00Z",
  },
  {
    id: "3",
    name: "Sarah Williams",
    email: "sarah@example.com",
    phone: "+1 (555) 456-7890",
    social_media_handles: {
      instagram: "@lifestyle_guru",
      tiktok: "@sarah_lifestyle",
      youtube: "@sarah_williams",
      twitter: "@sarah_will",
    },
    followers_count: 156000,
    engagement_rate: 5.1,
    created_at: "2024-03-10T11:00:00Z",
    updated_at: "2024-06-05T16:45:00Z",
  },
];

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>(mockInfluencers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingInfluencer, setEditingInfluencer] = useState<Influencer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    twitter: "",
    followers_count: "",
    engagement_rate: "",
  });

  const filteredInfluencers = influencers.filter((influencer) =>
    influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInfluencer = () => {
    const newInfluencer: Influencer = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      social_media_handles: {
        instagram: formData.instagram || undefined,
        tiktok: formData.tiktok || undefined,
        youtube: formData.youtube || undefined,
        twitter: formData.twitter || undefined,
      },
      followers_count: formData.followers_count ? parseInt(formData.followers_count) : undefined,
      engagement_rate: formData.engagement_rate ? parseFloat(formData.engagement_rate) : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setInfluencers([...influencers, newInfluencer]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      instagram: "",
      tiktok: "",
      youtube: "",
      twitter: "",
      followers_count: "",
      engagement_rate: "",
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditInfluencer = () => {
    if (!editingInfluencer) return;
    const updatedInfluencers = influencers.map((influencer) =>
      influencer.id === editingInfluencer.id
        ? {
            ...influencer,
            name: formData.name,
            email: formData.email,
            phone: formData.phone || undefined,
            social_media_handles: {
              instagram: formData.instagram || undefined,
              tiktok: formData.tiktok || undefined,
              youtube: formData.youtube || undefined,
              twitter: formData.twitter || undefined,
            },
            followers_count: formData.followers_count ? parseInt(formData.followers_count) : undefined,
            engagement_rate: formData.engagement_rate ? parseFloat(formData.engagement_rate) : undefined,
            updated_at: new Date().toISOString(),
          }
        : influencer
    );
    setInfluencers(updatedInfluencers);
    setEditingInfluencer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      instagram: "",
      tiktok: "",
      youtube: "",
      twitter: "",
      followers_count: "",
      engagement_rate: "",
    });
  };

  const handleDeleteInfluencer = (id: string) => {
    setInfluencers(influencers.filter((influencer) => influencer.id !== id));
  };

  const openEditDialog = (influencer: Influencer) => {
    setEditingInfluencer(influencer);
    setFormData({
      name: influencer.name,
      email: influencer.email,
      phone: influencer.phone || "",
      instagram: influencer.social_media_handles.instagram || "",
      tiktok: influencer.social_media_handles.tiktok || "",
      youtube: influencer.social_media_handles.youtube || "",
      twitter: influencer.social_media_handles.twitter || "",
      followers_count: influencer.followers_count?.toString() || "",
      engagement_rate: influencer.engagement_rate?.toString() || "",
    });
  };

  const getSocialMediaIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "tiktok":
        return <span className="text-sm font-bold">TikTok</span>;
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Influencers</h1>
          <p className="text-gray-600">Manage your influencer network and partnerships</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Influencer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Influencer</DialogTitle>
              <DialogDescription>
                Add a new influencer to your network.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram Handle</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@username"
                />
              </div>
              <div>
                <Label htmlFor="tiktok">TikTok Handle</Label>
                <Input
                  id="tiktok"
                  value={formData.tiktok}
                  onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                  placeholder="@username"
                />
              </div>
              <div>
                <Label htmlFor="youtube">YouTube Channel</Label>
                <Input
                  id="youtube"
                  value={formData.youtube}
                  onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                  placeholder="Channel name"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter Handle</Label>
                <Input
                  id="twitter"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  placeholder="@username"
                />
              </div>
              <div>
                <Label htmlFor="followers_count">Followers Count</Label>
                <Input
                  id="followers_count"
                  type="number"
                  value={formData.followers_count}
                  onChange={(e) => setFormData({ ...formData, followers_count: e.target.value })}
                  placeholder="Total followers"
                />
              </div>
              <div>
                <Label htmlFor="engagement_rate">Engagement Rate (%)</Label>
                <Input
                  id="engagement_rate"
                  type="number"
                  step="0.1"
                  value={formData.engagement_rate}
                  onChange={(e) => setFormData({ ...formData, engagement_rate: e.target.value })}
                  placeholder="Engagement rate"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateInfluencer}>Add Influencer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search influencers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Influencers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Influencers</CardTitle>
          <CardDescription>
            {filteredInfluencers.length} influencer{filteredInfluencers.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Influencer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Social Media</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Campaigns</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInfluencers.map((influencer) => (
                <TableRow key={influencer.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`/avatars/${influencer.id}.png`} />
                        <AvatarFallback>
                          {influencer.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{influencer.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{influencer.email}</div>
                      {influencer.phone && (
                        <div className="text-gray-500">{influencer.phone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {Object.entries(influencer.social_media_handles).map(([platform, handle]) => {
                        if (!handle) return null;
                        return (
                          <a
                            key={platform}
                            href={`https://${platform}.com/${handle.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                          >
                            {getSocialMediaIcon(platform)}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {influencer.followers_count?.toLocaleString() || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {influencer.engagement_rate ? `${influencer.engagement_rate}%` : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">5 campaigns</Badge>
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
                              Update influencer information.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <Label htmlFor="edit-name">Full Name</Label>
                              <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter full name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-email">Email</Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Enter email address"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-phone">Phone</Label>
                              <Input
                                id="edit-phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Enter phone number"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-instagram">Instagram Handle</Label>
                              <Input
                                id="edit-instagram"
                                value={formData.instagram}
                                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                placeholder="@username"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-tiktok">TikTok Handle</Label>
                              <Input
                                id="edit-tiktok"
                                value={formData.tiktok}
                                onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                                placeholder="@username"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-youtube">YouTube Channel</Label>
                              <Input
                                id="edit-youtube"
                                value={formData.youtube}
                                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                                placeholder="Channel name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-twitter">Twitter Handle</Label>
                              <Input
                                id="edit-twitter"
                                value={formData.twitter}
                                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                placeholder="@username"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-followers_count">Followers Count</Label>
                              <Input
                                id="edit-followers_count"
                                type="number"
                                value={formData.followers_count}
                                onChange={(e) => setFormData({ ...formData, followers_count: e.target.value })}
                                placeholder="Total followers"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-engagement_rate">Engagement Rate (%)</Label>
                              <Input
                                id="edit-engagement_rate"
                                type="number"
                                step="0.1"
                                value={formData.engagement_rate}
                                onChange={(e) => setFormData({ ...formData, engagement_rate: e.target.value })}
                                placeholder="Engagement rate"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingInfluencer(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleEditInfluencer}>Update Influencer</Button>
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 