"use client";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Pill, PillIndicator } from "@/components/ui/kibo-ui/pill";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Environment, TargetUser } from "@flagout/database";
import { formatNumber } from "@/lib/format-number";
import { timeAgo } from "@/lib/time-date";
import { cn } from "@/lib/utils";
import { IconSettings } from "@tabler/icons-react";
import {
    Activity,
    Calendar,
    ChevronRight,
    Loader2,
    TrendingUp,
    Users,
} from "lucide-react";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { debounce } from "@/lib/debounce";
import { useUserFlagMutations } from "@/lib/tanstack/hooks/feature-flag";
import { usePathname } from "next/navigation";
import { queryKeys } from "@/lib/tanstack/keys";
import { Button } from "@/components/ui/button";
import UpsertFlagDialog from "./create-flag-dialog";
import { showSuccess } from "@/lib/sonner";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

interface TFlagCardProps {
    roundTop: boolean;
    roundBottom: boolean;
    id: string;
    slug: string;
    name: string;
    env: Environment;
    enabled: boolean;
    description: string;
    rolloutPercentage: number;
    user: TargetUser[];
    lastModified: Date;
    evaluations: number;
}

const FeatureFlagCard: React.FC<TFlagCardProps> = ({
    roundTop,
    roundBottom,
    id,
    slug,
    name,
    env,
    enabled,
    description,
    rolloutPercentage,
    user,
    lastModified,
    evaluations,
}) => {
    const [flagEnabled, setFlagEnabled] = useState<boolean>(enabled);

    const envConfig = useMemo(() => {
        switch (env) {
            case "STAGING":
                return {
                    variant: "warning" as const,
                    color: "text-amber-400",
                    bg: "bg-amber-400/10",
                    border: "border-amber-400/20",
                };
            case "PRODUCTION":
                return {
                    variant: "success" as const,
                    color: "text-emerald-400",
                    bg: "bg-emerald-400/10",
                    border: "border-emerald-400/20",
                };
            case "DEVELOPMENT":
                return {
                    variant: "info" as const,
                    color: "text-sky-400",
                    bg: "bg-sky-400/10",
                    border: "border-sky-400/20",
                };
            default:
                return {
                    variant: "error" as const,
                    color: "text-rose-400",
                    bg: "bg-rose-400/10",
                    border: "border-rose-400/20",
                };
        }
    }, [env]);

    const pathname = usePathname();
    const invalidationKeys = useMemo(() => {
        if (pathname.includes("workplace")) {
            return [...queryKeys.userFlags, ...queryKeys.dashboardActivity];
        } else {
            return [...queryKeys.userFlags];
        }
    }, [pathname]);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const { updateFlag } = useUserFlagMutations();
    const toggleEnabled = debounce(async (enabled: boolean) => {
        try {
            await updateFlag.mutateAsync({
                id,
                data: { enabled },
                invalidationKeys,
            });
        } catch (error) {
            console.error(error);
        }
    }, 2000);

    const progressColor = useMemo(() => {
        if (rolloutPercentage >= 80) return "bg-emerald-500";
        if (rolloutPercentage >= 50) return "bg-sky-500";
        if (rolloutPercentage >= 20) return "bg-amber-500";
        return "bg-rose-500";
    }, [rolloutPercentage]);

    return (
        <Card
            className={cn(
                "group/card w-full rounded-none border-x border-b border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:bg-card/80 hover:border-border/80",
                roundTop && "rounded-t-xl border-t",
                roundBottom && "rounded-b-xl",
                !roundTop && !roundBottom && "border-t-0",
            )}
        >
            {/* Header: Name + Env + Toggle */}
            <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <Link
                                href={`/feature-flags/${slug}`}
                                className="group/link inline-flex items-center gap-1.5 hover:gap-2.5 transition-all duration-200"
                            >
                                <h3 className="text-lg font-semibold tracking-tight truncate group-hover/link:text-primary transition-colors">
                                    {name}
                                </h3>
                                <ChevronRight
                                    size={14}
                                    className="opacity-0 group-hover/link:opacity-100 transition-all duration-200 text-muted-foreground shrink-0"
                                />
                            </Link>
                            <div className="flex items-center gap-1.5">
                                <span
                                    className={cn(
                                        "inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border",
                                        envConfig.bg,
                                        envConfig.color,
                                        envConfig.border,
                                    )}
                                >
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span
                                            className={cn(
                                                "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                                                env === "PRODUCTION"
                                                    ? "bg-emerald-400"
                                                    : env === "STAGING"
                                                        ? "bg-amber-400"
                                                        : env === "DEVELOPMENT"
                                                            ? "bg-sky-400"
                                                            : "bg-rose-400",
                                            )}
                                        />
                                        <span
                                            className={cn(
                                                "relative inline-flex rounded-full h-1.5 w-1.5",
                                                env === "PRODUCTION"
                                                    ? "bg-emerald-400"
                                                    : env === "STAGING"
                                                        ? "bg-amber-400"
                                                        : env === "DEVELOPMENT"
                                                            ? "bg-sky-400"
                                                            : "bg-rose-400",
                                            )}
                                        />
                                    </span>
                                    {env}
                                </span>
                                <span
                                    className={cn(
                                        "text-[11px] font-medium px-2 py-0.5 rounded-full border transition-all duration-300",
                                        flagEnabled
                                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                                            : "bg-rose-500/15 text-rose-400 border-rose-500/25",
                                    )}
                                >
                                    {flagEnabled ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Switch
                        checked={flagEnabled}
                        onCheckedChange={(checked) => {
                            setFlagEnabled(checked);
                            toggleEnabled(checked);
                        }}
                        className="cursor-pointer shrink-0 data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-muted"
                    />
                </CardTitle>
                <CardDescription>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2">
                        {description}
                    </p>
                </CardDescription>
            </CardHeader>

            {/* Stats Row */}
            <CardContent className="pb-3 pt-0">
                <div className="flex flex-wrap items-center gap-1.5">
                    <StatChip
                        icon={<TrendingUp size={13} className="text-emerald-400" />}
                        label="Rollout"
                        value={`${rolloutPercentage}%`}
                    />
                    {user.map((item) => (
                        <StatChip
                            key={item}
                            icon={<Users size={13} className="text-violet-400" />}
                            label="Users"
                            value={item.charAt(0).toUpperCase() + item.slice(1)}
                        />
                    ))}
                    <StatChip
                        icon={<Calendar size={13} className="text-amber-400" />}
                        value={timeAgo(lastModified)}
                    />
                    <StatChip
                        icon={<Activity size={13} className="text-rose-400" />}
                        label="Evals"
                        value={formatNumber(evaluations)}
                    />
                </div>
            </CardContent>

            {/* Footer: Progress + Settings */}
            <CardFooter className="pt-0 pb-4">
                <div className="w-full flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-xs text-muted-foreground/70 font-medium">
                                Rollout
                            </span>
                            <span className="text-xs font-semibold tabular-nums">
                                {rolloutPercentage}%
                            </span>
                        </div>
                        <div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-700 ease-out",
                                    progressColor,
                                )}
                                style={{ width: `${rolloutPercentage}%` }}
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setSettingsOpen((prev) => !prev)}
                            className={cn(
                                "p-1.5 rounded-lg transition-all duration-200 text-muted-foreground/50 hover:text-foreground hover:bg-muted/50",
                                settingsOpen && "text-foreground bg-muted/50",
                            )}
                        >
                            <IconSettings size={18} className="transition-transform duration-300 hover:rotate-90" />
                        </button>

                        <div className="absolute -top-28 right-0 z-10">
                            <SettingsMenu
                                open={settingsOpen}
                                setOpen={setSettingsOpen}
                                fieldProps={{
                                    id,
                                    description,
                                    enabled,
                                    env,
                                    name,
                                    rolloutPercentage,
                                    user,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

/**
 * Compact stat chip used in the metadata row
 */
const StatChip = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label?: string;
    value: string | number;
}) => (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground bg-muted/30 hover:bg-muted/50 border border-border/30 rounded-md px-2.5 py-1 transition-colors duration-200">
        {icon}
        <span className="font-medium">{value}</span>
        {label && <span className="text-muted-foreground/60">{label}</span>}
    </span>
);

const SettingsMenu = ({
    open,
    setOpen,
    fieldProps,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    fieldProps: Partial<TFlagCardProps>;
}) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

    const { deleteFlag } = useUserFlagMutations();
    const handleDeleteFlag = async () => {
        try {
            await deleteFlag.mutateAsync(fieldProps.id ?? "");
            showSuccess("Flag Deleted");
        } catch (error) {
            console.error(error);
        } finally {
            setOpen(false);
            setOpenDeleteDialog(false);
        }
    };

    return (
        open && (
            <div className="w-auto min-w-[140px] p-1.5 bg-popover/95 backdrop-blur-md rounded-lg border border-border/50 shadow-xl shadow-black/20 animate-in fade-in-0 zoom-in-95 duration-200">
                <UpsertFlagDialog
                    id={fieldProps.id ?? ""}
                    setCloseContextMenu={setOpen}
                    flagName={fieldProps.name}
                    enabled={fieldProps.enabled}
                    flagDescription={fieldProps.description}
                    rollout={fieldProps.rolloutPercentage}
                    targetUsers={fieldProps.user}
                    env={fieldProps.env}
                />
                <Dialog
                    open={openDeleteDialog}
                    onOpenChange={setOpenDeleteDialog}
                >
                    <form onSubmit={handleDeleteFlag}>
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                className="w-full justify-start text-xs h-8 my-0.5 rounded-md cursor-pointer"
                                size="sm"
                            >
                                Delete
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>
                                    Delete {fieldProps.name} Flag
                                </DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this flag?
                                    The change cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    variant={"destructive"}
                                    className="cursor-pointer"
                                    disabled={deleteFlag.isPending}
                                    onClick={handleDeleteFlag}
                                >
                                    {deleteFlag.isPending ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        "Delete Flag"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
            </div>
        )
    );
};

export default FeatureFlagCard;
