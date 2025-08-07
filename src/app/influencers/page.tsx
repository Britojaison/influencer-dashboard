"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Instagram, Twitter, Youtube, Facebook, Linkedin } from "lucide-react";
import { CampaignInfluencerDetail } from "@/types/database";

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<CampaignInfluencerDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/influencers');
        if (response.ok) {
          const data = await response.json();
          setInfluencers(data);
        }
      } catch (error) {
        console.error('Error loading influencers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredInfluencers = influencers.filter((influencer) =>
    influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    influencer.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'tiktok':
        return <div className="w-4 h-4 bg-black rounded flex items-center justify-center text-white text-xs">TT</div>;
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-500" />;
      case 'twitter':
        return <Twitter className="h-4 w-4 text-blue-400" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-blue-700" />;
      default:
        return <div className="w-4 h-4 bg-gray-500 rounded flex items-center justify-center text-white text-xs">{platform.charAt(0).toUpperCase()}</div>;
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
          <p className="mt-2 text-gray-600">Loading influencers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Influencers</h1>
        <p className="text-gray-600">All influencers across all campaigns</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search influencers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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
                <TableHead>Platform</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Followers</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInfluencers.map((influencer) => (
                <TableRow key={influencer.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{influencer.name || "N/A"}</div>
                      <div className="text-sm text-gray-500">{influencer.content_type || "N/A"}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(influencer.platform)}
                      <span className="capitalize">{influencer.platform}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {influencer.username || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {influencer.followers_count ? influencer.followers_count.toLocaleString() : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(influencer.status)}>
                      {influencer.status}
                    </Badge>
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