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
import { Environment, TargetUser } from "@prisma/client";
import { formatNumber } from "@/lib/format-number";
import { timeAgo } from "@/lib/time-date";
import { cn } from "@/lib/utils";
import { IconSettings } from "@tabler/icons-react";
import { Activity, Calendar, Loader2, TrendingUp, Users } from "lucide-react";
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

    const envVariant = useMemo(() => {
        switch (env) {
            case "STAGING":
                return "warning";
            case "PRODUCTION":
                return "success";
            case "DEVELOPMENT":
                return "info";
            default:
                return "error";
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

    return (
        <Card
            className={cn(
                "w-full rounded-none",
                roundTop && "rounded-t-2xl",
                roundBottom && "rounded-b-2xl",
            )}
        >
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <div className="flex flex-col lg:flex-row justify-center items-start lg:items-center gap-2">
                        <Link href={`/feature-flags/${slug}`}>
                            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                                {name}
                            </h3>
                        </Link>
                        <Badge
                            variant={flagEnabled ? "destructive" : "secondary"}
                            className={
                                flagEnabled
                                    ? "bg-green-500 text-white transition-all duration-300 lg:hidden"
                                    : "transition-all duration-300 lg:hidden"
                            }
                        >
                            {flagEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Pill>
                            <PillIndicator pulse variant={envVariant} />
                            {env}
                        </Pill>
                        <Badge
                            variant={flagEnabled ? "secondary" : "destructive"}
                            className={
                                flagEnabled
                                    ? "bg-green-500 text-black transition-all duration-300 hidden lg:block"
                                    : "transition-all duration-300 hidden lg:block"
                            }
                        >
                            {flagEnabled ? "Enabled" : "Disabled"}
                        </Badge>
                    </div>
                    <Switch
                        checked={flagEnabled}
                        onCheckedChange={(checked) => {
                            setFlagEnabled(checked);
                            toggleEnabled(checked);
                        }}
                        className="cursor-pointer  data-[state=checked]:bg-[#00D100]"
                    />
                </CardTitle>
                <CardDescription>
                    <p className="leading-7 [&:not(:first-child)]:mt-6">
                        {description}
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 lg:flex justify-start items-center gap-1 lg:gap-2">
                <Pill>
                    <TrendingUp color="#00D100" size={18} />
                    <p>{rolloutPercentage}&#37;</p>
                    <p>Rollout</p>
                </Pill>
                {user.map((item) => (
                    <Pill key={item}>
                        <Users color="white" size={18} />
                        <p>{item.charAt(0).toUpperCase() + item.slice(1)}</p>
                        <p>Users</p>
                    </Pill>
                ))}
                <Pill>
                    <Calendar color="yellow" size={18} />
                    <p>{timeAgo(lastModified)}</p>
                </Pill>
                <Pill>
                    <Activity color="red" size={18} />
                    <p>{formatNumber(evaluations)}</p>
                    <p>Evaluations</p>
                </Pill>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <div className="w-full flex flex-col justify-center items-start gap-2">
                    <div className="w-[80%] lg:w-[60%] flex justify-between items-center">
                        <p>Rollout Percentage</p>
                        <p>{rolloutPercentage}&#37;</p>
                    </div>
                    <Progress
                        value={rolloutPercentage}
                        className="w-[80%] lg:w-[60%]"
                    />
                </div>

                <div className="relative">
                    <IconSettings
                        onClick={() => setSettingsOpen((prev) => !prev)}
                        size={25}
                        className="cursor-pointer text-gray-400"
                    />

                    {/* <ContextMenu>
                    <ContextMenuTrigger >
                        <IconSettings
                            size={25}
                            className="cursor-pointer text-gray-400"
                            />
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                            <ContextMenuItem inset>
                            <div className="w-full flex justify-between items-center gap-2">
                                <p>Edit</p>
                                <Edit />
                                </div>
                                </ContextMenuItem>
                                <ContextMenuItem inset>
                                <div className="w-full flex justify-between items-center gap-2">
                                <p>Edit</p>
                                <Edit />
                                </div>
                                </ContextMenuItem>
                    </ContextMenuContent>
                    </ContextMenu> */}

                    <div className="absolute -top-28 -left-28">
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
            </CardFooter>
        </Card>
    );
};

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
            <div className="w-full p-2.5 bg-primary-foreground rounded-lg border transition-all duration-300">
                {/* <Button variant={'outline'} className="min-w-[100px] my-1">Edit</Button> */}
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
                                className="min-w-[100px] my-1 rounded-md cursor-pointer"
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
