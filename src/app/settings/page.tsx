"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Save,
  Download,
  Upload
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      campaignUpdates: true,
      influencerActivity: true,
    },
    appearance: {
      theme: "light",
      compactMode: false,
    },
    data: {
      autoBackup: true,
      exportFormat: "csv",
    },
  });

  const handleSettingChange = (category: string, key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
    localStorage.setItem("dashboard-settings", JSON.stringify(settings));
    // You could also save to Supabase here
  };

  const handleExportData = () => {
    // Export functionality
    console.log("Exporting data...");
  };

  const handleImportData = () => {
    // Import functionality
    console.log("Importing data...");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600">Manage your application preferences and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <nav className="space-y-2">
                <a href="#notifications" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </a>
                <a href="#appearance" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                  <Palette className="h-4 w-4" />
                  <span>Appearance</span>
                </a>
                <a href="#data" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                  <Database className="h-4 w-4" />
                  <span>Data Management</span>
                </a>
                <a href="#security" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 text-gray-700">
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </a>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Notifications */}
          <Card id="notifications">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications about campaigns and activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "email", checked)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive browser push notifications</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "push", checked)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <Label htmlFor="campaign-updates">Campaign Updates</Label>
                    <p className="text-sm text-gray-500">Get notified about campaign status changes</p>
                  </div>
                  <Switch
                    id="campaign-updates"
                    checked={settings.notifications.campaignUpdates}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "campaignUpdates", checked)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <Label htmlFor="influencer-activity">Influencer Activity</Label>
                    <p className="text-sm text-gray-500">Get notified about new influencer posts</p>
                  </div>
                  <Switch
                    id="influencer-activity"
                    checked={settings.notifications.influencerActivity}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "influencerActivity", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card id="appearance">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) => handleSettingChange("appearance", "theme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <Label htmlFor="compact-mode">Compact Mode</Label>
                    <p className="text-sm text-gray-500">Use a more compact layout</p>
                  </div>
                  <Switch
                    id="compact-mode"
                    checked={settings.appearance.compactMode}
                    onCheckedChange={(checked) => handleSettingChange("appearance", "compactMode", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card id="data">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Data Management</span>
              </CardTitle>
              <CardDescription>
                Manage your data export, import, and backup settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <div>
                    <Label htmlFor="auto-backup">Auto Backup</Label>
                    <p className="text-sm text-gray-500">Automatically backup your data weekly</p>
                  </div>
                  <Switch
                    id="auto-backup"
                    checked={settings.data.autoBackup}
                    onCheckedChange={(checked) => handleSettingChange("data", "autoBackup", checked)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select
                    value={settings.data.exportFormat}
                    onValueChange={(value) => handleSettingChange("data", "exportFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button onClick={handleExportData} variant="outline" className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button onClick={handleImportData} variant="outline" className="w-full sm:w-auto">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card id="security">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                  />
                </div>
                
                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                </div>
                
                <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 