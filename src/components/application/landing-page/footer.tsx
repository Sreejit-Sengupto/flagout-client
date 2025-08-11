import { Github, FileText, DollarSign, BookOpen, Flag } from "lucide-react";
import { Pixelify_Sans } from "next/font/google";

const pixelSans = Pixelify_Sans({
    variable: "--font-pixel-sans",
    weight: ['400'],
    subsets: ["latin"],
});

export const Footer = () => {
    return (
        <footer className="bg-background border-t border-border py-16">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <p className={`flex justify-center items-center gap-2 lg:gap-3 ${pixelSans.className}`}>
                                <span className=""><Flag fill="white" className="w-6 lg:w-8 h-6 lg:h-8" /></span>
                                <span className="scroll-m-20 text-center text-2xl lg:text-4xl font-extrabold tracking-tight text-balance">flag0ut</span>
                            </p>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed">
                            AI-powered feature flags and experimentation platform for modern developers.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-text-bright font-semibold">Product</h4>
                        <div className="space-y-2">
                            <a href="#features" className="block text-text-muted hover:text-primary transition-colors text-sm">
                                Features
                            </a>
                            <a href="#pricing" className="block text-text-muted hover:text-primary transition-colors text-sm">
                                Pricing
                            </a>
                            <a href="#integrations" className="block text-text-muted hover:text-primary transition-colors text-sm">
                                Integrations
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-text-bright font-semibold">Resources</h4>
                        <div className="space-y-2">
                            <a href="#docs" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm">
                                <FileText className="w-4 h-4" />
                                Documentation
                            </a>
                            <a href="#blog" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm">
                                <BookOpen className="w-4 h-4" />
                                Blog
                            </a>
                            <a href="#github" className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm">
                                <Github className="w-4 h-4" />
                                GitHub
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-text-bright font-semibold">Company</h4>
                        <div className="space-y-2">
                            <a href="#about" className="block text-text-muted hover:text-primary transition-colors text-sm">
                                About
                            </a>
                            <a href="#contact" className="block text-text-muted hover:text-primary transition-colors text-sm">
                                Contact
                            </a>
                            <a href="#careers" className="block text-text-muted hover:text-primary transition-colors text-sm">
                                Careers
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-text-muted text-sm">
                            © 2024 FlagshipAI. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <a href="#privacy" className="text-text-muted hover:text-primary transition-colors text-sm">
                                Privacy Policy
                            </a>
                            <a href="#terms" className="text-text-muted hover:text-primary transition-colors text-sm">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};