"use client";
import { generateDescription } from "@/app/actions/gen-ai";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { showError, showSuccess } from "@/lib/sonner";
import { useUserFlagMutations } from "@/lib/tanstack/hooks/feature-flag";
import { useCreateProjectMutation } from "@/lib/tanstack/hooks/projects";
import { queryKeys } from "@/lib/tanstack/keys";
import { cn } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
    Brain,
    Check,
    ChevronsUpDown,
    Loader2,
    PlusCircle,
} from "lucide-react";
import React, {
    Dispatch,
    ReactNode,
    SetStateAction,
    useEffect,
    useState,
} from "react";

interface TFlagProps {
    id?: string;
    setCloseContextMenu?: Dispatch<SetStateAction<boolean>>;
    children?: ReactNode;
    enabled?: boolean;
    rollout?: number;
    targetUsers?: ("ALL" | "INTERNAL" | "BETA" | "PREMIUM")[];
    env?: string;
    flagName?: string;
    flagDescription?: string;
    project?: {
        id: string;
        name: string;
    };
    availableProjects?: {
        id: string;
        name: string;
    }[];
}

const UpsertFlagDialog = ({
    id,
    setCloseContextMenu,
    children,
    enabled,
    env,
    flagDescription,
    flagName,
    rollout,
    targetUsers,
    project,
    availableProjects,
}: TFlagProps) => {
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

    const [open, setOpen] = useState(false);
    const [flagEnabled, setFlagEnabled] = useState<boolean>(enabled ?? false);
    const [sliderValue, setSliderValue] = useState<number[]>([rollout ?? 21]);
    const [targets, setTargets] = useState<
        ("ALL" | "INTERNAL" | "BETA" | "PREMIUM")[]
    >(targetUsers ?? ["ALL"]);
    const [environment, setEnvironment] = useState({
        open: false,
        value: env ?? "",
    });
    const [textData, setTextData] = useState({
        name: flagName ?? "",
        description: flagDescription ?? "",
    });
    const [suggestionLoading, setSuggestionLoading] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState("");

    // mutations
    const { createFlag, updateFlag } = useUserFlagMutations();

    // const createFlagMutation = createFlag({
    // name: textData.name,
    // description: textData.description,
    // enabled: flagEnabled,
    // environment: environment.value as
    //     | "DEVELOPMENT"
    //     | "PRODUCTION"
    //     | "STAGING",
    // rolloutPercentage: sliderValue[0],
    // targeting: targets,
    // });

    useEffect(() => {
        const projectFromLclStr =
            localStorage.getItem("selected-project") ?? "";
        setSelectedProject(projectFromLclStr);
    }, []);

    const handleUpdateFlag = async () => {
        try {
            await updateFlag.mutateAsync({
                id: id ?? "",
                data: {
                    description: textData.description,
                    enabled: flagEnabled,
                    environment: environment.value as
                        | "DEVELOPMENT"
                        | "PRODUCTION"
                        | "STAGING",
                    name: textData.name,
                    rolloutPercentage: sliderValue[0],
                    targeting: targets,
                },
                invalidationKeys: [...queryKeys.userFlags],
            });
            showSuccess("Flag updated. The changes will reflect soon.");
        } catch (error) {
            console.error(error);
        } finally {
            // close edit modal
            setOpen(false);

            // close context menu
            if (setCloseContextMenu) {
                setCloseContextMenu(false);
            }
        }
    };

    const handleCreateFlag = async () => {
        if (!environment.value || !textData.description || !textData.name) {
            alert("All fields are required");
            return;
        }
        try {
            await createFlag.mutateAsync({
                name: textData.name,
                description: textData.description,
                enabled: flagEnabled,
                environment: environment.value as
                    | "DEVELOPMENT"
                    | "PRODUCTION"
                    | "STAGING",
                rolloutPercentage: sliderValue[0],
                targeting: targets,
                projectId: project ? project.id : selectedProject,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setOpen(false);
        }
    };

    const handleGenerateDescriptionFromAI = async () => {
        try {
            setSuggestionLoading(true);
            if (textData.name) {
                const suggestion = await generateDescription(textData.name);
                setTextData((prev) => ({
                    ...prev,
                    description: suggestion as string,
                }));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSuggestionLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form onSubmit={handleCreateFlag}>
                <DialogTrigger asChild className="w-full rounded-none">
                    {/* <Button variant="outline">Create Flag</Button> */}
                    {flagName ? (
                        <Button
                            variant={"outline"}
                            className="min-w-[100px] my-1 rounded-md cursor-pointer"
                        >
                            Edit
                        </Button>
                    ) : (
                        // <Button
                        //     className="flex justify-start items-center h-full gap-2 bg-gray-800 px-4 py-2 rounded-tl-2xl hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                        // >
                        //     <div className="flex flex-col justify-center items-start">
                        //         <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight text-white">
                        //             Create Flag
                        //         </h3>
                        //         <p className="leading-7 text-gray-400">
                        //             Add a new feature flag
                        //         </p>
                        //     </div>
                        // </Button>
                        children
                    )}
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
                            <Label htmlFor="name">Select a project</Label>
                            {project && (
                                <Select value={project.id}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Projects</SelectLabel>
                                            <SelectItem value={project.id}>
                                                {project.name}
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                            {availableProjects && (
                                <Select
                                    value={selectedProject}
                                    onValueChange={setSelectedProject}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>
                                                Available Projects
                                            </SelectLabel>
                                            {availableProjects.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={item.id}
                                                >
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                            {/* <SelectItem value={project.id}>{project.name}</SelectItem> */}
                                        </SelectGroup>
                                        <SelectGroup className="flex justify-between items-center">
                                            <SelectLabel>
                                                Create new Project
                                            </SelectLabel>
                                            <CreateProjectDialog />
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name-inpt"
                                placeholder="Super awesome feature"
                                value={textData.name}
                                onChange={(e) => {
                                    e.preventDefault();
                                    setTextData((prev) => ({
                                        ...prev,
                                        name: e.target.value,
                                    }));
                                }}
                            />
                        </div>

                        <div className="relative grid gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="descr-inpt"
                                placeholder="Rollout this awesome feature to beta users.."
                                rows={5}
                                className="max-h-[150px]"
                                value={textData.description}
                                onChange={(e) => {
                                    e.preventDefault();
                                    setTextData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }));
                                }}
                            />
                            <Button
                                onClick={handleGenerateDescriptionFromAI}
                                className="absolute bottom-1 right-1 cursor-pointer"
                                variant={"link"}
                                disabled={suggestionLoading}
                            >
                                {suggestionLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <Brain color="green" />
                                )}
                            </Button>
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
                                    setEnvironment((prev) => ({
                                        ...prev,
                                        open,
                                    }))
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
                        {flagName ? (
                            <Button
                                type="submit"
                                className="cursor-pointer"
                                onClick={handleUpdateFlag}
                                disabled={updateFlag.isPending}
                            >
                                {updateFlag.isPending ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Update Flag"
                                )}
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="cursor-pointer"
                                onClick={handleCreateFlag}
                                disabled={createFlag.isPending}
                            >
                                {createFlag.isPending ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Create Flag"
                                )}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};

const CreateProjectDialog = () => {
    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);

    const createProjectMutation = useCreateProjectMutation();

    const handleCreateProject = async () => {
        try {
            const response = await createProjectMutation.mutateAsync(name);
            if (response) {
                showSuccess("Project created");
            }
        } catch (error) {
            if (error instanceof Error) {
                showError(error.message);
            }
        } finally {
            setOpen(false);
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="cursor-pointer">
                        <PlusCircle />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Project</DialogTitle>
                        <DialogDescription>
                            Create a new project here.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input
                                id="name-1"
                                name="name"
                                value={name}
                                onChange={(e) => {
                                    e.preventDefault();
                                    setName(e.target.value);
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleCreateProject}>
                            {createProjectMutation.isPending ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                "Create"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};

export default UpsertFlagDialog;
