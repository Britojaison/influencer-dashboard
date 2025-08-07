"use client";

import { useState, useEffect } from "react";
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
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Building2,
  Globe,
  Users
} from "lucide-react";
import { Brand } from "@/types/database";
import { getBrands, createBrand, updateBrand, deleteBrand } from "@/lib/database";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [campaignCounts, setCampaignCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website_url: "",
    industry: "",
  });

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [brandsData, campaignCountsData] = await Promise.all([
          getBrands(),
          fetch('/api/brands/campaign-counts').then(res => res.json())
        ]);
        setBrands(brandsData);
        setCampaignCounts(campaignCountsData);
      } catch (error) {
        console.error('Error loading brands:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBrand = async () => {
    try {
      const newBrand = await createBrand(formData);
      setBrands([newBrand, ...brands]);
      setFormData({
        name: "",
        description: "",
        website_url: "",
        industry: "",
      });
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating brand:', error);
    }
  };

  const handleEditBrand = async () => {
    if (!editingBrand) return;
    try {
      const updatedBrand = await updateBrand(editingBrand.id, formData);
      setBrands(brands.map((brand) =>
        brand.id === editingBrand.id ? updatedBrand : brand
      ));
      setEditingBrand(null);
      setFormData({
        name: "",
        description: "",
        website_url: "",
        industry: "",
      });
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      await deleteBrand(id);
      setBrands(brands.filter((brand) => brand.id !== id));
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || "",
      website_url: brand.website_url || "",
      industry: brand.industry || "",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading brands...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-600">Manage your brand partnerships</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Brand</DialogTitle>
              <DialogDescription>
                Add a new brand to your influencer dashboard.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Brand Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter brand name"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter brand description"
                />
              </div>
              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g., Fashion, Technology"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBrand}>Add Brand</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Brands Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Brands</CardTitle>
          <CardDescription>
            {filteredBrands.length} brand{filteredBrands.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Campaigns</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{brand.name}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {brand.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {brand.industry && (
                      <Badge variant="secondary">{brand.industry}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {brand.website_url && (
                      <a
                        href={brand.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Globe className="h-4 w-4 mr-1" />
                        Visit
                      </a>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{campaignCounts[brand.id] || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(brand)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Brand</DialogTitle>
                            <DialogDescription>
                              Update brand information.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <Label htmlFor="edit-name">Brand Name</Label>
                              <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter brand name"
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor="edit-description">Description</Label>
                              <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter brand description"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-website_url">Website URL</Label>
                              <Input
                                id="edit-website_url"
                                value={formData.website_url}
                                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                placeholder="https://example.com"
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-industry">Industry</Label>
                              <Input
                                id="edit-industry"
                                value={formData.industry}
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                placeholder="e.g., Fashion, Technology"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingBrand(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleEditBrand}>Update Brand</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBrand(brand.id)}
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