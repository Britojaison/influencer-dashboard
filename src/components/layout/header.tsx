"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  type: 'campaign' | 'brand' | 'influencer';
  title: string;
  subtitle: string;
  url: string;
}

interface Campaign {
  id: string;
  name: string;
  description?: string;
  brands?: {
    name: string;
  };
}

interface Brand {
  id: string;
  name: string;
  description?: string;
  industry?: string;
}

interface Influencer {
  id: string;
  name?: string;
  username?: string;
  platform?: string;
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debug search results
  useEffect(() => {
    console.log('Search results updated:', searchResults.length);
    console.log('Search term:', searchTerm);
    console.log('Loading:', loading);
    console.log('Error:', error);
  }, [searchResults, searchTerm, loading, error]);

  // Search functionality
  const performSearch = async (query: string) => {
    console.log('Searching for:', query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setError(null);
      console.log('Empty query, clearing results');
      return;
    }

    // Test fallback for debugging
    if (query.toLowerCase() === 'test') {
      console.log('Showing test results');
      setSearchResults([
        {
          id: 'test-campaign-1',
          type: 'campaign',
          title: 'Test Campaign',
          subtitle: 'Test Brand',
          url: '/campaigns/test'
        },
        {
          id: 'test-brand-1',
          type: 'brand',
          title: 'Test Brand',
          subtitle: 'Test Industry',
          url: '/brands'
        },
        {
          id: 'test-influencer-1',
          type: 'influencer',
          title: 'Test Influencer',
          subtitle: 'Instagram • @testuser',
          url: '/influencers'
        }
      ]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching campaigns...');
      // Search campaigns
      const campaignsResponse = await fetch('/api/campaigns');
      if (!campaignsResponse.ok) throw new Error('Failed to fetch campaigns');
      const campaigns: Campaign[] = await campaignsResponse.json();
      console.log('Campaigns fetched:', campaigns.length);
      
      console.log('Fetching brands...');
      // Search brands
      const brandsResponse = await fetch('/api/brands');
      if (!brandsResponse.ok) throw new Error('Failed to fetch brands');
      const brands: Brand[] = await brandsResponse.json();
      console.log('Brands fetched:', brands.length);
      
      console.log('Fetching influencers...');
      // Search influencers
      const influencersResponse = await fetch('/api/influencers');
      if (!influencersResponse.ok) throw new Error('Failed to fetch influencers');
      const influencers: Influencer[] = await influencersResponse.json();
      console.log('Influencers fetched:', influencers.length);

      const results: SearchResult[] = [];

      // Filter campaigns
      campaigns.forEach((campaign: Campaign) => {
        const nameMatch = campaign.name.toLowerCase().includes(query.toLowerCase());
        const descMatch = campaign.description?.toLowerCase().includes(query.toLowerCase());
        
        if (nameMatch || descMatch) {
          console.log('Campaign match:', campaign.name);
          results.push({
            id: campaign.id,
            type: 'campaign',
            title: campaign.name,
            subtitle: campaign.brands?.name || 'No brand',
            url: `/campaigns/${campaign.id}`
          });
        }
      });

      // Filter brands
      brands.forEach((brand: Brand) => {
        const nameMatch = brand.name.toLowerCase().includes(query.toLowerCase());
        const descMatch = brand.description?.toLowerCase().includes(query.toLowerCase());
        
        if (nameMatch || descMatch) {
          console.log('Brand match:', brand.name);
          results.push({
            id: brand.id,
            type: 'brand',
            title: brand.name,
            subtitle: brand.industry || 'No industry',
            url: '/brands'
          });
        }
      });

      // Filter influencers
      influencers.forEach((influencer: Influencer) => {
        const nameMatch = influencer.name?.toLowerCase().includes(query.toLowerCase());
        const usernameMatch = influencer.username?.toLowerCase().includes(query.toLowerCase());
        const platformMatch = influencer.platform?.toLowerCase().includes(query.toLowerCase());
        
        if (nameMatch || usernameMatch || platformMatch) {
          console.log('Influencer match:', influencer.name);
          results.push({
            id: influencer.id,
            type: 'influencer',
            title: influencer.name || 'Unknown',
            subtitle: `${influencer.platform} • ${influencer.username || 'No username'}`,
            url: '/influencers'
          });
        }
      });

      console.log('Total results found:', results.length);
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleResultClick = (result: SearchResult) => {
    router.push(result.url);
    setSearchOpen(false);
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchOpen(false);
      setSearchTerm("");
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchOpen(true);
  };

  const handleInputFocus = () => {
    setSearchOpen(true);
  };

  const handlePopoverOpenChange = (open: boolean) => {
    setSearchOpen(open);
    if (!open) {
      // Keep the input focused when popover closes
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'campaign':
        return '📊';
      case 'brand':
        return '🏢';
      case 'influencer':
        return '👤';
      default:
        return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'campaign':
        return 'text-blue-600';
      case 'brand':
        return 'text-green-600';
      case 'influencer':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Spacer for hamburger menu on mobile */}
          <div className="w-12 lg:hidden"></div>
          
          <div className="relative">
            <Popover open={searchOpen} onOpenChange={handlePopoverOpenChange}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    ref={inputRef}
                    placeholder="Search campaigns, influencers..."
                    className="pl-10 w-60 sm:w-80"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={handleInputClick}
                    onFocus={handleInputFocus}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 sm:w-96 p-0" align="start" side="bottom" sideOffset={4}>
                <Command>
                  <CommandInput 
                    placeholder="Search campaigns, brands, influencers..."
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandList>
                    {/* Debug info */}
                    {searchTerm && (
                      <div className="p-2 text-xs text-gray-400 border-b">
                        Debug: Searching for &quot;{searchTerm}&quot; | Results: {searchResults.length} | Loading: {loading.toString()}
                      </div>
                    )}
                    
                    {loading && (
                      <div className="p-4 text-center text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mx-auto mb-2"></div>
                        Searching...
                      </div>
                    )}
                    {error && (
                      <div className="p-4 text-center text-sm text-red-500">
                        {error}
                      </div>
                    )}
                    {!loading && !error && searchResults.length === 0 && searchTerm && (
                      <CommandEmpty>No results found for &quot;{searchTerm}&quot;</CommandEmpty>
                    )}
                    {!loading && !error && searchResults.length > 0 && (
                      <div className="p-4">
                        <div className="text-sm font-medium mb-2">Found {searchResults.length} results:</div>
                        {searchResults.map((result) => (
                          <div
                            key={result.id}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
                            onClick={() => handleResultClick(result)}
                          >
                            <span className={getTypeColor(result.type)}>{getTypeIcon(result.type)}</span>
                            <div className="flex-1">
                              <div className="font-medium">{result.title}</div>
                              <div className="text-sm text-gray-500">{result.subtitle}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/next.svg" alt="@user" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin User</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@company.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 