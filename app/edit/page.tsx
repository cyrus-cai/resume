"use client"
import React, { SetStateAction, useEffect, useState } from 'react'
import { useChat } from 'ai/react';
import Header from "@/components/basic/header"

import { Loader2 } from "lucide-react"
import { TriangleUpIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ResizablePanel, ResizablePanelGroup, } from "@/components/ui/resizable"

import { Dialog, DialogContent, DialogHeader, DialogTrigger, } from "@/components/ui/dialog"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'





export default function Home() {
    const [text, setText] = useState("")
    // const [textMKD, setTextMKD] = useState("")
    const [deployed, setDeployed] = useState("")

    const [isLatest, setIsLatest] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    const [currentUrl, setCurrentUrl] = useState('');
    const [passkey, setPasskey] = useState('');
    const [auth, setAuth] = useState(false)
    // const [isDeployActivate, setIsDeployActivate] = useState(false)
    // const [hasDeployment, sethasDeployment] = useState(false)
    const [isDeploymentSuccessful, setIsDeploymentSuccessful] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [listenDeploy, setListenDeploy] = useState(false)
    const { toast } = useToast()

    const { messages, input, handleInputChange, handleSubmit, setMessages, stop, isLoading } = useChat();
    const deployURL = currentUrl.replace("edit", "")

    const notifyWrongPasscode = () => toast({
        variant: "destructive",
        title: "Passcode 错误",
        description: "请前往 Vercel 环境变量中查看或修改密钥",
    })

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setCurrentUrl(window.location.href);
        }
    }, []);

    useEffect(() => {
        getData()
    },
        [currentUrl]
    )

    useEffect(() => {
        if (isDialogOpen) {
            console.log("dialog open")
        }
    }, [isDialogOpen, listenDeploy])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                getAuthState()
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [passkey]);

    const handleDataPost = async () => {
        let finalContent = '';
        messages.forEach(m => {
            if (m.role === 'assistant') {
                finalContent += m.content + '\n'; // 添加换行符以分隔消息
            }
        });
        setIsPosting(true)
        const res = await fetch("api/postContent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: currentUrl.replace("edit", ""),
                content: finalContent
            }),
        })
        if (res) {
            setIsPosting(false)
            setIsDeploymentSuccessful(true)
        }
        console.log("res", res)
    }

    const DeployedRenderer = () => {
        //no text
        if (!text) return (
            <div>
                <Markdown remarkPlugins={[remarkGfm]}>{deployed}</Markdown>
            </div>);

        //text but no formed data
        if (!isLatest && !isProcessing) return (
            <div>
                <Markdown remarkPlugins={[remarkGfm]}>{deployed}</Markdown>
            </div>
        );

        //text and waiting for formed data

        if (isProcessing) return (
            <div>
                <Markdown remarkPlugins={[remarkGfm]}>{deployed}</Markdown>
            </div>
        );

        //text and formed data
        return (
            <div>
                <Markdown remarkPlugins={[remarkGfm]}>{deployed}</Markdown>
            </div>
        );
    }

    const CurrentRenderer = () => {
        return (
            <div className="flex flex-col w-full max-w-md py-12 mx-auto stretch">
                {messages.map(m => (
                    <div key={m.id} className="whitespace-pre-wrap">
                        <Markdown remarkPlugins={[remarkGfm]}>
                            {m.role === 'assistant' ? m.content : ""}
                        </Markdown>
                    </div>
                ))}
            </div>
        )
    }


    const getData = async () => {
        const res = await fetch("api/fetchContent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: currentUrl.replace("edit", ""),
            }),
        })
        const data = await res.json()

        if (!data) {
            return
        }
        const content = data.content
        console.log("content", content)
        setDeployed(content)
    }

    const getAuthState = async () => {
        const res = await fetch("api/fetchAuth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                passkey: passkey,
            }),
        })
        const data = await res.json()
        if (data === 1) {
            setAuth(true)
        }
        if (data === 0) {
            notifyWrongPasscode()
        }
    }

    const ConfigConfirmDeployButtonClicked = () => {

        if (!isPosting && !isDeploymentSuccessful) {
            console.log("text but not posting")
            return (
                <Button disabled={isLoading} onClick={handleDataPost} className="mr-2 flex-row">
                    确认部署
                </Button>
            );
        }

        if (isPosting) {
            console.log("posting")
            return (
                <Button disabled className="mr-2 flex-row">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </Button>
            );
        }

        if (!isPosting && isDeploymentSuccessful) {
            console.log("deployed")
            return (
                <Button variant='ghost' disabled={isLoading} onClick={() => window.open(deployURL)} className="mr-2 flex-row">
                    查看部署
                </Button>
            );
        }
    }

    return (
        <>
            {!auth &&
                <div
                    className="flex flex-row-reverse items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                    <Toaster />
                    <div className="flex-1 flex flex-col items-center justify-center space-y-80 ">
                        <div className="opacity-0">Placeholder</div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">欢迎使用</h1>
                            <p className="text-gray-600 dark:text-gray-400">welcome to mresume </p>
                        </div>
                        <div className="font-medium text-gray-400 flex items-center space-x-1">
                            <p>
                                mresume
                            </p>
                            <Image
                                src="/logo.svg"
                                alt="2222"
                                width={16}
                                height={16}
                            />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="passkey">密钥</Label>
                                <Input className="w-full" placeholder="键入密钥" type="password" onChange={(e) => {
                                    setPasskey(e.target.value)
                                }} />
                            </div>
                            <Button onClick={getAuthState} className="mr-2">登录</Button>
                        </div>
                    </div>
                </div>
            }

            {auth &&
                <div className="flex h-full flex-col items-center justify-between">
                    <Header />
                    <Dialog>
                        <DialogContent>
                            <DialogHeader>
                                <div className='flex flex-row-reverse'>
                                    <ConfigConfirmDeployButtonClicked />
                                </div>
                                <ResizablePanelGroup
                                    direction="horizontal"
                                    className='space-x-6'
                                >
                                    <ResizablePanel defaultSize={50}>
                                        <div
                                            className="flex-row h-full items-center justify-center p-4 bg-slate-50 rounded-lg text-gray-400">
                                            <Badge variant="outline" className='mb-2'>线上简历</Badge>
                                            <DeployedRenderer />
                                        </div>
                                    </ResizablePanel>
                                    <ResizablePanel defaultSize={50}>
                                        <div className=" flex-row h-full p-4">
                                            <Badge variant="outline" className='mb-2'>新简历</Badge>
                                            <CurrentRenderer />
                                        </div>
                                    </ResizablePanel>
                                </ResizablePanelGroup>
                            </DialogHeader>
                        </DialogContent>

                        <form onSubmit={handleSubmit} className='w-full'>
                            <div className="flex flex-col space-x-2 space-x-reverse py-4 px-4 bg-slate-50">
                                <div className='flex flex-row-reverse w-full justify-between items-center'>
                                    <DialogTrigger>
                                        <Button type="submit" disabled={!input} onClick={() => setMessages([])}>
                                            <TriangleUpIcon className="pt-0.5 h-10 w-8" />
                                            部署
                                        </Button>
                                    </DialogTrigger>
                                    <HoverCard>
                                        <div className='flex items-center justify-center text-gray-300'>
                                            mresume works best with
                                            <HoverCardTrigger asChild>
                                                <Button variant="link">@MagicResume</Button>
                                            </HoverCardTrigger>
                                        </div>
                                        <HoverCardContent className="w-80">
                                            <div className="flex justify-between space-x-4">
                                                <Image
                                                    src="/logo.svg"
                                                    alt="2222"
                                                    width={32}
                                                    height={32}
                                                />
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-semibold">@MagicResume</h4>
                                                    <p className="text-sm">
                                                        The React Framework – created and maintained by @vercel.
                                                    </p>
                                                    <div className="flex items-center pt-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            Joined December 2021
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </div>
                                <div className=" flex-row h-full w-full items-center justify-center py-2 space-y-2 bg-slate-50">
                                    <Textarea className="resize-none" placeholder="粘贴纯文本简历" value={input} onChange={handleInputChange} />
                                    p</div>
                            </div>
                        </form >

                    </Dialog >
                </div >
            }
        </>

    )
}
