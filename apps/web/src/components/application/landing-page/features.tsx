import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

const features = [
    {
        title: "Feature Flag Management",
        description:
            "Create feature flags, easily update them, monitor. Everything easily accessible from our intuitive dashboard.",
    },
    {
        title: "Percentage-based Rollouts",
        description:
            "Gradually release features to a specific percentage of your users. This allows you to test new features with a small subset of users before rolling them out to everyone.",
    },
    {
        title: "Role-based Targeting",
        description:
            "Target specific user segments like BETA, INTERNAL, or PREMIUM users. This allows you to release features to specific groups of users.",
    },
    {
        title: "Kill Switch",
        description:
            "Instantly disable a feature for users without even touching the code. All you need to do is toggle the switch.",
    },
    {
        title: "Metrics and Activities",
        description:
            "Keep track of all the changes made to your feature flags. Understand how your flags are perfomings using the metrics and the recent activity features.",
    },
    {
        title: "AI based Recommendation",
        description:
            "Get useful actionable steps for your flags from AI based on the performance metrics of your flag.",
    },
];

const Features = () => {
    return (
        <main
            id="features"
            className="container px-5 py-20 min-h-[100dvh] flex flex-col justify-center items-center mx-auto"
        >
            <section className="mx-auto w-full flex flex-col justify-center items-center">
                <p className="scroll-m-20 border-b pb-2 text-2xl lg:text-3xl font-semibold tracking-tight first:mt-0 flex justify-center items-center gap-3">
                    <span>Features</span>
                </p>
                <p className="mt-2 mb-4 max-w-2xl text-center text-gray-400">
                    All the powerfull features that we are providing for you to
                    easily integrate and manage your features.
                    <span className="text-pink-700"> More to come....</span>
                </p>
            </section>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {features.map((feature) => (
                    <div
                        key={feature.title}
                        className="bg-primary-foreground p-6 rounded-lg"
                    >
                        <h3 className="text-xl font-bold mb-2 text-pink-600">
                            {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Features;

export const FAQ = () => {
    return (
        <main
            id="faq"
            className="container p-5 flex flex-col justify-center items-center mx-auto"
        >
            <h2 className="text-3xl md:text-4xl font-bold text-center text-pink-700 border-b pb-2">
                Frequently Asked Questions
            </h2>

            <Accordion
                type="single"
                collapsible
                className="w-full md:w-3/4 lg:w-2/3 mx-auto mt-12"
            >
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                        What is the tech stack used in this project?
                    </AccordionTrigger>
                    <AccordionContent>
                        The tech stack includes Next.js, Tailwind CSS,
                        shadcn/ui, Clerk for authentication, PostgreSQL as the
                        database, Prisma as the ORM, TanStack Query and Axios
                        for API communication, and Zod for schema validation.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger>
                        How can I contribute to this project?
                    </AccordionTrigger>
                    <AccordionContent>
                        To contribute, you can fork the project, create a new
                        feature branch, commit your changes, push to the branch,
                        and then open a pull request.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger>
                        How do I get started with the project locally?
                    </AccordionTrigger>
                    <AccordionContent>
                        To get started, you need to have Node.js, npm/yarn, and
                        PostgreSQL installed. Then you can clone the repository,
                        install the dependencies, set up the environment
                        variables, run the database migrations, and finally run
                        the development server.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </main>
    );
};
