// BatchSnapshotSkeleton.tsx
"use client";

import React from "react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function BatchSnapshotSkeleton() {
    // More visible shimmer: gradient that changes for light / dark mode + rounded corners
    const shimmer =
        "animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-md";

    return (
        <div className="py-8 px-6 max-w-7xl mx-auto space-y-6">
            <header>
                <div className="flex items-center justify-between gap-4">
                    <div className="w-2/3 space-y-2">
                        <div className={`h-6 w-3/5 ${shimmer}`} />
                        <div className={`h-4 w-1/3 ${shimmer}`} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Badge variant="secondary">Semesters: —</Badge>
                        <div className="flex gap-2">
                            <div className={`h-8 w-20 ${shimmer}`} />
                            <div className={`h-8 w-20 ${shimmer}`} />
                            <div className={`h-8 w-20 ${shimmer}`} />
                        </div>
                    </div>
                </div>
            </header>

            <Separator />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className={`h-5 w-40 ${shimmer}`} />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <div className={`h-4 w-24 ${shimmer}`} />
                                    <div className={`h-4 w-8 ${shimmer}`} />
                                </div>
                                <div className="flex justify-between">
                                    <div className={`h-4 w-28 ${shimmer}`} />
                                    <div className={`h-4 w-8 ${shimmer}`} />
                                </div>
                                <div className="flex justify-between">
                                    <div className={`h-4 w-28 ${shimmer}`} />
                                    <div className={`h-4 w-8 ${shimmer}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className={`h-5 w-48 ${shimmer}`} />
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="mt-3 space-y-2">
                                <div className={`h-8 w-full ${shimmer}`} />
                                <div className={`h-8 w-full ${shimmer}`} />
                                <div className={`h-8 w-full ${shimmer}`} />
                            </div>
                        </CardContent>

                        <CardFooter>
                            <div className={`h-4 w-48 ${shimmer}`} />
                        </CardFooter>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className={`h-5 w-28 ${shimmer}`} />
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <Tabs defaultValue="1">
                                <TabsList>
                                    <TabsTrigger value="1">
                                        <div className={`h-6 w-20 ${shimmer}`} />
                                    </TabsTrigger>
                                    <TabsTrigger value="2">
                                        <div className={`h-6 w-20 ${shimmer}`} />
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="1">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-2">
                                                <div className={`h-5 w-40 ${shimmer}`} />
                                                <div className={`h-4 w-40 ${shimmer}`} />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <div className="space-y-2">
                                                    <div className={`h-10 w-full ${shimmer}`} />
                                                    <div className={`h-10 w-full ${shimmer}`} />
                                                </div>
                                            </div>

                                            <div>
                                                <div className={`h-8 w-full ${shimmer}`} />
                                                <div className={`h-8 w-full ${shimmer}`} />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className={`h-5 w-64 ${shimmer}`} />
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <div className="space-y-2">
                                <div className={`h-8 w-full ${shimmer}`} />
                                <div className={`h-8 w-full ${shimmer}`} />
                                <div className={`h-8 w-full ${shimmer}`} />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
