import packageInfo from '@/package.json';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils"
import { ArrowBigUpDash } from 'lucide-react';
import Image from "next/image";
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



const latestversion = async () => {
    const res = await fetch('/api/fetchUpdate', {
        method: 'POST',
    })
    const data = await res.json()

    if (!data) {
        return
    }

    const latestVersion = data.data.version
    const link = data.data.jumpLink

    console.log(latestVersion, link)

    return { latestVersion, link }
}

const isLatestVersion = async () => {
    const { latestVersion } = await latestversion() ?? { latestVersion: '', link: '' };
    const current = packageInfo.version
    if (latestVersion === current) {
        return true
    }
    return false
}

const Header = () => {
    const [currentUrl, setCurrentUrl] = useState('');
    const [isLatest, setIsLatest] = useState(true);
    const [latestVersion, setLatestVersion] = useState('');
    const [link, setLink] = useState('');

    useEffect(() => {
        async function checkVersion() {
            const result = await isLatestVersion();
            const { latestVersion, link } = await latestversion() ?? { latestVersion: '', link: '' };
            setLatestVersion(latestVersion);
            setLink(link);
            setIsLatest(result);
        }
        checkVersion();
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, []);

    const deployURL = currentUrl.replace("edit", "")
    const [showUpdate, setShowUpdate] = useState(true)

    return (
        <>
            <div className='w-full p-4 flex flex-row items-center justify-between'>
                <DropdownMenuLabel className="flex items-center space-x-1">
                    {/* <p>mResume</p> */}
                    <Image
                        src="/logo.svg"
                        alt="2222"
                        width={24}
                        height={24}
                    />
                </DropdownMenuLabel>

                <DropdownMenu onOpenChange={() => { setShowUpdate(!showUpdate) }}>
                    <DropdownMenuTrigger>
                        <div className='flex -space-x-2'>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>MR</AvatarFallback>
                            </Avatar>
                            {
                                !isLatest && showUpdate &&
                                <div className='p-0.5 bg-red-500 rounded-full z-10 h-fit -space-x-4'>
                                    <ArrowBigUpDash className=' h-4 w-4 text-white' />
                                </div>
                            }
                            {/* <div className={`p-0.5 bg-red-500 rounded-full z-10 h-fit -space-x-4 ${!isLatest && showUpdate}`}>
                                <ArrowBigUpDash className=' h-4 w-4 text-white' />
                            </div> */}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className="flex items-center space-x-1">
                            <p>mResume</p>
                            <Image
                                src="/logo.svg"
                                alt="2222"
                                width={16}
                                height={16}
                            />
                            <br />

                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => window.open(deployURL)}>我的部署</DropdownMenuItem>

                        <Separator className="my-1" />
                        <div className='flex items-center'>
                            {!isLatest &&
                                <DropdownMenuItem className='flex w-full justify-between' onClick={() => window.open(link)}>
                                    <p className='font-mono text-gray-500'>
                                        {latestVersion}可用
                                    </p>
                                    <div className='p-0.5 bg-red-500 rounded-full'>
                                        <ArrowBigUpDash className=' h-4 w-4 text-white' />
                                    </div>
                                </DropdownMenuItem>
                            }
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Separator />
        </>
    )
}

export default Header