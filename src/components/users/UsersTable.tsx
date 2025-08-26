"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    HiEye,
    HiBan,
    HiUser,
    HiMail,
    HiUserGroup,
    HiCalendar,
    HiShieldExclamation
} from "react-icons/hi";
import { debounce } from "lodash";
import { motion } from "framer-motion";
import { useState } from "react";
import { format } from "date-fns";
import { useUsersStore } from "@/store/useUsersStore";
import { UsersTableSkeleton } from "./UsersTableSkeleton";
import { Pagination } from "./Pagination";
import { UserStatsDialog } from "./UserStatsDialog";
import { RestrictUserDialog } from "./RestrictUserDialog";

export function UsersTable() {
    const { users, listState, pagination, query, setQuery, searchUsers } = useUsersStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [restrictId, setRestrictId] = useState<string | null>(null);
    const [restrictIndex, setRestrictIndex] = useState<number | null>(null);

    // Create a debounced version of search
    const debouncedSearch = debounce(async () => {
        await searchUsers(true);
    }, 500); // 500ms delay

    // Handle input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value.trim());
        debouncedSearch();
    };

    if (listState.loading) return <UsersTableSkeleton />;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden"
        >
            {/* Search Input */}
            <div className="p-4">
                <input
                    type="text"
                    value={query}
                    onChange={handleSearchChange}
                    placeholder="Search users by name or email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            </div>
            <div className="relative overflow-x-auto">
                <Table className="min-w-full text-sm">
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-semibold text-gray-700 px-4 py-3 text-left">
                                <div className="flex items-center gap-2">
                                    <HiUser className="text-gray-500" /> User
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 px-4 py-3 text-left">
                                <div className="flex items-center gap-2">
                                    <HiMail className="text-gray-500" /> Email
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 px-4 py-3 text-left">
                                <div className="flex items-center gap-2">
                                    <HiUserGroup className="text-gray-500" /> Role
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 px-4 py-3 text-left">
                                <div className="flex items-center gap-2">
                                    <HiCalendar className="text-gray-500" /> Joined
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 px-4 py-3 text-left">
                                <div className="flex items-center gap-2">
                                    <HiShieldExclamation className="text-gray-500" /> Restrictions
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 px-4 py-3 text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>


                    <TableBody>
                        {users.map((u, uIdx) => {
                            const absoluteIndex =
                                (pagination.page - 1) * pagination.limit + uIdx;

                            return (
                                <TableRow
                                    key={u._id}
                                    className="hover:bg-indigo-50 transition-all duration-300 cursor-pointer"
                                >
                                    <TableCell className="font-medium text-gray-900 py-3 px-4">
                                        {u.name}
                                    </TableCell>
                                    <TableCell className="text-gray-600 py-3 px-4">{u.email}</TableCell>
                                    <TableCell className="py-3 px-4">
                                        <Badge
                                            className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${u.role === "admin"
                                                ? "bg-gradient-to-r from-purple-200 to-purple-300 text-purple-800"
                                                : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {u.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-500 py-3 px-4">
                                        {format(new Date(u.createdAt), "PP")}
                                    </TableCell>
                                    <TableCell className="py-3 px-4 flex flex-wrap gap-1">
                                        {u.restrictions?.length ? (
                                            u.restrictions.map((r, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant="outline"
                                                    className="border-gray-300 text-gray-600 text-xs rounded-full px-2 py-0.5"
                                                >
                                                    {r.type}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-gray-400 text-xs">None</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right py-3 px-4">
                                        <div className="inline-flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setSelectedId(u._id)}
                                                className="hover:bg-indigo-100 text-indigo-600 transition-colors"
                                            >
                                                <HiEye className="h-5 w-5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setRestrictId(u._id);
                                                    setRestrictIndex(absoluteIndex);
                                                }}
                                                className="hover:bg-rose-100 text-rose-500 transition-colors"
                                            >
                                                <HiBan className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <Pagination />

            <UserStatsDialog
                userId={selectedId}
                onOpenChange={(o) => !o && setSelectedId(null)}
            />
            <RestrictUserDialog
                userId={restrictId}
                restrictionIndex={restrictIndex || -1}
                onOpenChange={(o) => !o && setRestrictId(null)}
            />
        </motion.div>
    );
}
