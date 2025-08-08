"use client";

import { useState, useEffect } from "react";
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
  Plus,
  IndianRupee
} from "lucide-react";
import Link from "next/link";
import { getDashboardStats, getCampaigns } from "@/lib/database";
import { DashboardStats, Campaign } from "@/types/database";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_brands: 0,
    total_campaigns: 0,
    active_campaigns: 0,
    completed_campaigns: 0,
    total_budget: 0,
    average_roi: 0
  });
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardStats, campaignsData] = await Promise.all([
          getDashboardStats(),
          getCampaigns()
        ]);
        setStats(dashboardStats);
        setRecentCampaigns(campaignsData.slice(0, 3)); // Show only 3 most recent campaigns
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const dashboardStats = [
    {
      title: "Total Brands",
      value: stats.total_brands.toString(),
      icon: BarChart3,
      description: "Active brands",
    },
    {
      title: "Active Campaigns",
      value: stats.active_campaigns.toString(),
      icon: Calendar,
      description: "Running campaigns",
    },
    {
      title: "Total Budget",
      value: formatCurrency(stats.total_budget),
      icon: IndianRupee,
      description: "Campaign budgets",
    },
    {
      title: "Avg. ROI",
      value: formatPercentage(stats.average_roi),
      icon: TrendingUp,
      description: "Return on investment",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your campaigns.</p>
        </div>
        <Link href="/campaigns">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
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
              {recentCampaigns.length > 0 ? (
                recentCampaigns.map((campaign) => (
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
                      <p className="text-sm text-gray-500">{campaign.brand?.name}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{campaign.budget ? formatCurrency(campaign.budget) : "No budget set"}</span>
                        <span>{new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Link href={`/campaigns/${campaign.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No campaigns yet</p>
                  <p className="text-sm">Create your first campaign to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link href="/campaigns">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Manage Campaigns</h3>
                      <p className="text-sm text-gray-500">View and edit all campaigns</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </Link>

              <Link href="/brands">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Manage Brands</h3>
                      <p className="text-sm text-gray-500">Add and edit brand profiles</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </Link>


            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 