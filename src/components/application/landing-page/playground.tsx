"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Check, Copy, Sparkles, EyeOff } from "lucide-react";

type UserRole = "PUBLIC" | "BETA" | "INTERNAL" | "PREMIUM";

// Simple hash function for consistent percentage evaluation
const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

const Playground = () => {
    const [flagEnabled, setFlagEnabled] = useState(true);
    const [rolloutPercentage, setRolloutPercentage] = useState([75]);
    const [userRole, setUserRole] = useState<UserRole>("BETA");
    const [userId, setUserId] = useState("user_12345");
    const [copied, setCopied] = useState(false);

    // Compute whether feature should show
    const showFeature = useMemo(() => {
        if (!flagEnabled) return false;
        const userHash = hashString(userId || "anonymous");
        return userHash % 100 < rolloutPercentage[0];
    }, [flagEnabled, rolloutPercentage, userId]);

    // Generate the code snippet
    const codeSnippet = useMemo(() => {
        return `import Flagout from "flag0ut";

const flagoutClient = new Flagout({
    apiKey: "YOUR_API_KEY"
});

// Evaluate the feature flag
const { showFeature } = flagoutClient.evaluate(
    "dark-mode-feature",
    "${userRole}",
    "${userId}"
);

// Conditionally render your feature
if (showFeature) {
    // Show the new feature
}`;
    }, [userRole, userId]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(codeSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [codeSnippet]);

    return (
        <section className="w-full py-16 lg:py-24">
            <div className="container px-4 md:px-6 max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Try it yourself
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Experience feature flags in action. No sign-up required
                        — just toggle, adjust, and see the magic happen.
                    </p>
                </div>

                {/* Main Playground Card */}
                <Card className="p-6 md:p-8 bg-gradient-to-br from-background via-background to-muted/30 border-muted/50">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left: Controls */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold mb-4">
                                Configure your flag
                            </h3>

                            {/* Flag Toggle */}
                            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-muted/50">
                                <div className="space-y-1">
                                    <Label
                                        htmlFor="flag-toggle"
                                        className="text-base font-medium"
                                    >
                                        dark-mode-feature
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
                                        {flagEnabled ? "Enabled" : "Disabled"}
                                    </p>
                                </div>
                                <Switch
                                    id="flag-toggle"
                                    checked={flagEnabled}
                                    onCheckedChange={setFlagEnabled}
                                    className="scale-125"
                                />
                            </div>

                            {/* Percentage Slider */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base">
                                        Rollout Percentage
                                    </Label>
                                    <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                                        {rolloutPercentage[0]}%
                                    </span>
                                </div>
                                <Slider
                                    value={rolloutPercentage}
                                    onValueChange={setRolloutPercentage}
                                    max={100}
                                    min={0}
                                    step={1}
                                    disabled={!flagEnabled}
                                    className="[&_[data-slot=slider-track]]:h-2"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {rolloutPercentage[0]}% of users will see
                                    this feature
                                </p>
                            </div>

                            {/* User Role */}
                            <div className="space-y-2">
                                <Label className="text-base">User Role</Label>
                                <Select
                                    value={userRole}
                                    onValueChange={(v) =>
                                        setUserRole(v as UserRole)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PUBLIC">
                                            PUBLIC
                                        </SelectItem>
                                        <SelectItem value="BETA">
                                            BETA
                                        </SelectItem>
                                        <SelectItem value="INTERNAL">
                                            INTERNAL
                                        </SelectItem>
                                        <SelectItem value="PREMIUM">
                                            PREMIUM
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* User ID */}
                            <div className="space-y-2">
                                <Label className="text-base">User ID</Label>
                                <Input
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    placeholder="Enter a user ID"
                                    className="font-mono"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Try different IDs to see how percentage
                                    rollout works
                                </p>
                            </div>
                        </div>

                        {/* Right: Code & Preview */}
                        <div className="space-y-4">
                            <Tabs defaultValue="code" className="w-full">
                                <TabsList className="w-full">
                                    <TabsTrigger value="code" className="flex-1">
                                        Code
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="preview"
                                        className="flex-1"
                                    >
                                        Preview
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="code" className="mt-4">
                                    <div className="relative">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="absolute top-3 right-3 z-10"
                                            onClick={handleCopy}
                                        >
                                            {copied ? (
                                                <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <pre className="p-4 h-[400px] rounded-lg bg-zinc-950 border border-zinc-800 overflow-auto scrollbar-hide">
                                            <code className="text-sm font-mono text-zinc-100 whitespace-pre">
                                                {codeSnippet}
                                            </code>
                                        </pre>
                                    </div>
                                </TabsContent>

                                <TabsContent value="preview" className="mt-4">
                                    <div
                                        className={`p-8 h-[400px] flex flex-col justify-center rounded-lg border-2 transition-all duration-500 ${showFeature
                                            ? "bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-green-500/50"
                                            : "bg-gradient-to-br from-zinc-500/10 via-zinc-600/10 to-zinc-700/10 border-zinc-500/30"
                                            }`}
                                    >
                                        <div className="flex flex-col items-center justify-center text-center space-y-4">
                                            {showFeature ? (
                                                <>
                                                    <div className="p-4 rounded-full bg-green-500/20">
                                                        <Sparkles className="h-8 w-8 text-green-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-semibold text-green-500">
                                                            Feature Enabled! 🎉
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            This user would see
                                                            the new feature
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="p-4 rounded-full bg-zinc-500/20">
                                                        <EyeOff className="h-8 w-8 text-zinc-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-semibold text-zinc-500">
                                                            Feature Hidden
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {!flagEnabled
                                                                ? "Flag is disabled"
                                                                : "User is outside the rollout percentage"}
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            {/* Result Badge */}
                            <div
                                className={`p-3 rounded-lg text-center text-sm font-medium transition-colors ${showFeature
                                    ? "bg-green-500/10 text-green-500 border border-green-500/30"
                                    : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/30"
                                    }`}
                            >
                                showFeature = {showFeature ? "true" : "false"}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* CTA */}
                <div className="text-center mt-12">
                    <p className="text-muted-foreground mb-4">
                        Ready to ship features without fear?
                    </p>
                    <Button size="lg" asChild>
                        <a href="/register">Get Started for Free</a>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Playground;
