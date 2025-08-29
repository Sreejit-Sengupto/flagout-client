"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateFlagMutation } from "@/lib/tanstack/hooks/feature-flag";
import { cn } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import React, { useState } from "react";

const CreateFlagDialog = () => {
    const checkboxItems = [
        {
            id: "all",
            label: "All",
            value: "ALL",
        },
        {
            id: "internal",
            label: "Internal",
            value: "INTERNAL",
        },
        {
            id: "beta",
            label: "Beta",
            value: "BETA",
        },
        {
            id: "premium",
            label: "Premium",
            value: "PREMIUM",
        },
    ];

    const enviroments = [
        {
            value: "DEVELOPMENT",
            label: "Development",
        },
        {
            value: "PRODUCTION",
            label: "Production",
        },
        {
            value: "STAGING",
            label: "Staging",
        },
    ];

    const [open, setOpen] = useState(false)
    const [flagEnabled, setFlagEnabled] = useState<boolean>(false);
    const [sliderValue, setSliderValue] = useState<number[]>([21]);
    const [targets, setTargets] = useState<
        ("ALL" | "INTERNAL" | "BETA" | "PREMIUM")[]
    >(["ALL"]);
    const [environment, setEnvironment] = useState({
        open: false,
        value: "",
    });
    const [textData, setTextData] = useState({
        name: "",
        description: ""
    })

    const createFlagMutation = useCreateFlagMutation({ name: textData.name, description: textData.description, enabled: flagEnabled, environment: environment.value as "DEVELOPMENT" | "PRODUCTION" | "STAGING", rolloutPercentage: sliderValue[0], targeting: targets })

    const handleCreateFlag = async () => {
        if (!environment.value || !textData.description || !textData.name) {
            alert("All fields are required")
            return
        }
        try {
            await createFlagMutation.mutateAsync()
        } catch (error) {
            console.error(error);
        } finally {
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form onSubmit={handleCreateFlag}>
                <DialogTrigger asChild className="w-full rounded-none">
                    {/* <Button variant="outline">Create Flag</Button> */}
                    <Button
                        // href={"#"}
                        className="flex justify-start items-center h-full gap-2 bg-gray-800 px-4 py-2 rounded-tl-2xl hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                    // onClick={() => setOpen(true)}
                    >
                        <div className="flex flex-col justify-center items-start">
                            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-white">
                                Create Flag
                            </h3>
                            <p className="leading-7 text-gray-400">
                                Add a new feature flag
                            </p>
                        </div>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Feature Flag</DialogTitle>
                        <DialogDescription>
                            Create new feature flag to progressively rollout
                            your new feature.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-10">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name-inpt"
                                placeholder="Super awesome feature"
                                value={textData.name}
                                onChange={(e) => {
                                    e.preventDefault()
                                    setTextData(prev => ({ ...prev, name: e.target.value }))
                                }}
                            />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="descr-inpt"
                                placeholder="Rollout this awesome feature to beta users.."
                                rows={5}
                                className="max-h-[150px]"
                                value={textData.description}
                                onChange={(e) => {
                                    e.preventDefault()
                                    setTextData(prev => ({ ...prev, description: e.target.value }))
                                }}
                            />
                        </div>

                        <div className="w-full grid grid-cols-2 gap-3 place-items-start">
                            <Badge
                                variant={
                                    flagEnabled ? "secondary" : "destructive"
                                }
                                className={
                                    flagEnabled
                                        ? "bg-green-500 text-black transition-all duration-300"
                                        : "transition-all duration-300"
                                }
                            >
                                {flagEnabled ? "Enabled" : "Disabled"}
                            </Badge>
                            <Switch
                                checked={flagEnabled}
                                onCheckedChange={setFlagEnabled}
                                className="cursor-pointer  data-[state=checked]:bg-[#00D100] ml-auto"
                            />
                        </div>

                        <div className="w-full grid gap-3">
                            <Popover
                                open={environment.open}
                                onOpenChange={(open) =>
                                    setEnvironment((prev) => ({ ...prev, open }))
                                }
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={environment.open}
                                        className="w-full justify-between"
                                    >
                                        {environment.value
                                            ? enviroments.find(
                                                (envs) =>
                                                    envs.value ===
                                                    environment.value,
                                            )?.label
                                            : "Select enviroment"}
                                        <ChevronsUpDown className="opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command className="w-full">
                                        <CommandList className="w-full">
                                            <CommandEmpty>
                                                No framework found.
                                            </CommandEmpty>
                                            <CommandGroup className="w-full">
                                                {enviroments.map((item) => (
                                                    <CommandItem
                                                        key={item.value}
                                                        value={item.value}
                                                        onSelect={(
                                                            currentValue,
                                                        ) => {
                                                            setEnvironment(
                                                                currentValue ===
                                                                    environment.value
                                                                    ? {
                                                                        open: false,
                                                                        value: "",
                                                                    }
                                                                    : {
                                                                        open: false,
                                                                        value: currentValue,
                                                                    },
                                                            );
                                                        }}
                                                    >
                                                        {item.label}
                                                        <Check
                                                            className={cn(
                                                                "ml-auto",
                                                                environment.value ===
                                                                    item.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0",
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="grid gap-3">
                            <Label
                                htmlFor="username-1"
                                className="flex justify-between items-center"
                            >
                                <p>Rollout Percentage</p>
                                <p>{sliderValue}%</p>
                            </Label>
                            <Slider
                                defaultValue={[21]}
                                max={100}
                                step={1}
                                value={sliderValue}
                                onValueChange={setSliderValue}
                            />
                        </div>

                        <div className="grid gap-3">
                            <Label
                                htmlFor="username-1"
                                className="flex justify-between items-center"
                            >
                                Target(s)
                            </Label>
                            <div className="flex justify-start items-center gap-3">
                                {checkboxItems.map((item) => (
                                    <div
                                        className="flex justify-start items-center gap-1"
                                        key={item.id}
                                    >
                                        <Checkbox
                                            checked={targets.includes(
                                                item.value as
                                                | "ALL"
                                                | "INTERNAL"
                                                | "BETA"
                                                | "PREMIUM",
                                            )}
                                            onCheckedChange={(checked) => {
                                                const val = item.value as
                                                    | "ALL"
                                                    | "INTERNAL"
                                                    | "BETA"
                                                    | "PREMIUM";
                                                if (val === "ALL") {
                                                    setTargets(["ALL"]);
                                                } else {
                                                    setTargets(
                                                        (prev) =>
                                                            checked
                                                                ? [
                                                                    ...prev.filter(
                                                                        (
                                                                            item,
                                                                        ) =>
                                                                            item !==
                                                                            "ALL",
                                                                    ),
                                                                    val,
                                                                ] // add if checked
                                                                : prev.filter(
                                                                    (t) =>
                                                                        t !==
                                                                        val,
                                                                ), // remove if unchecked
                                                    );
                                                }
                                            }}
                                            className="cursor-pointer"
                                        />
                                        <Label>{item.label}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-8">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" className="cursor-pointer" onClick={handleCreateFlag} disabled={createFlagMutation.isPending}>
                            {createFlagMutation.isPending ? <Loader2 className="animate-spin" /> : "Create Flag"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default CreateFlagDialog;
