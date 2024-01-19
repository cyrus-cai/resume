"use client"
import React, { SetStateAction, useEffect, useState } from 'react'

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

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import Header from "@/components/basic/header"
import { useChat } from 'ai/react';


export default function Home() {
    const [text, setText] = useState("")
    const [textMKD, setTextMKD] = useState("")
    const [deployed, setDeployed] = useState("")

    const [isLatest, setIsLatest] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    const [currentUrl, setCurrentUrl] = useState('');
    const [passkey, setPasskey] = useState('');
    const [auth, setAuth] = useState(false)
    const [isDeployActivate, setIsDeployActivate] = useState(false)
    const [hasDeployment, sethasDeployment] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [listenDeploy, setListenDeploy] = useState(false)
    const { toast } = useToast()

    const { messages, input, handleInputChange, handleSubmit, setMessages, stop, isLoading } = useChat();


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
        setIsPosting(false)
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

        sethasDeployment(true)
        const content = data.content
        console.log("content", content)
        setIsDeployActivate(true)
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
        if (!textMKD) {
            return (
                <Button disabled={isLoading} onClick={handleDataPost} className="mr-2 flex-row">
                    确认部署
                </Button>
            );
        }

        if (isPosting) {
            return (
                <Button disabled className="mr-2 flex-row">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </Button>
            );
        } else {
            return (
                <Button onClick={handleDataPost} className="mr-2 flex-row">
                    确认部署
                </Button>
            );
        }
    }

    const handleDeployButtonClicked = () => {
        setListenDeploy(!listenDeploy)
        setIsDialogOpen(true)
    }

    return (
        <>
            {!auth &&
                <div
                    className="flex flex-row-reverse items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                    <Toaster />
                    <div className="flex-1 flex flex-col items-center justify-center space-y-80">
                        <div className="opacity-0">Placeholder</div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">欢迎使用</h1>
                            <p className="text-gray-600 dark:text-gray-400">welcome to mresume </p>
                        </div>
                        <div className="font-medium text-gray-400 flex items-center">mresume
                            <div className="rounded-full h-4 w-4 bg-blue-600 ml-1" />
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
                            {/* <Button variant="link" onClick={notifyWherePasscode}>忘记密钥</Button> */}
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
                                <div className='flex flex-row-reverse'>
                                    <DialogTrigger>
                                        <Button type="submit" >
                                            <TriangleUpIcon className="pt-0.5 h-10 w-8" />
                                            部署
                                        </Button>
                                    </DialogTrigger>
                                </div>

                                <div className=" flex-row h-full w-full items-center justify-center py-2 space-y-2 bg-slate-50">
                                    <Textarea className="resize-none" placeholder="粘贴纯文本简历" value={input} onChange={handleInputChange} />
                                </div>
                            </div>
                        </form>

                    </Dialog>
                </div>
            }
        </>

    )
}
