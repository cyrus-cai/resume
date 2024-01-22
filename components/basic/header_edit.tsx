import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import * as copy from 'copy-to-clipboard';

import { Separator } from "@/components/ui/separator"
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "../ui/button";

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"


const Header = () => {
    const [currentUrl, setCurrentUrl] = useState('');
    const { toast } = useToast()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, []);

    const notifyCopied = () => toast({
        variant: "default",
        title: "链接已复制",
        description: `${currentUrl}`,
    })

    const handleCopyButtonClicked = () => {
        notifyCopied()
        copy.default(currentUrl)
    }

    return (
        <>
            <div className='w-full p-4 flex flex-row  justify-between'>
                <Toaster />
                <NavigationMenu>
                </NavigationMenu>
                <div className="flex items-center justify-center  space-x-2">
                    <Button variant="outline" onClick={() => window.open(`${currentUrl}/edit`)}>
                        Dashboard
                    </Button>
                    <Button variant="outline" onClick={handleCopyButtonClicked}>
                        Share
                    </Button>
                </div>
            </div>
            <Separator />
        </>
    )
}

export default Header