"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Textarea } from "@/components/ui/textarea"
import { SetStateAction, useEffect, useState } from 'react'
import data from '../../mock';


export default function Home() {
    const [text, setText] = useState("")
    const [textMKD, setTextMKD] = useState("")
    const [isLatest, setIsLatest] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    const [currentUrl, setCurrentUrl] = useState('');
    const [passkey, setPasskey] = useState('');
    const [auth, setAuth] = useState(false)
    const [isDeployActivate, setIsDeployActivate] = useState(false)
    const [hasDeployment, sethasDeployment] = useState(false)

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

    const handleDataToMarkdown = async () => {
        setIsProcessing(true)
        const res = await fetch("/api/parseContent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: text
            }),
        })
        const data = await res.json()
        const MarkDownData = await data.data
        console.log("MarkDownData", MarkDownData)
        setIsProcessing(false)
        setIsLatest(true)
        setTextMKD(MarkDownData)
    }

    const postData = async () => {
        if (!textMKD) {
            console.log('no text')
            return;
        }
        setIsPosting(true)
        const res = await fetch("api/postContent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: currentUrl.replace("edit", ""),
                content: textMKD
            }),
        })
        setIsPosting(false)
        console.log("res", res)
    }

    const RightAreaRenderer = () => {
        //no text
        if (!text) return (
            <div>
                <Button disabled>Update Preview</Button>
                <Markdown remarkPlugins={[remarkGfm]}>{textMKD}</Markdown>
            </div>);

        //text but no formed data
        if (!isLatest && !isProcessing) return (
            <div>
                <Button onClick={handleDataToMarkdown}>Update Preview</Button>
                <Markdown remarkPlugins={[remarkGfm]}>{textMKD}</Markdown>
            </div>
        );

        //text and waiting for formed data
        let leftTime = text.length / 50

        if (isProcessing) return (
            <div>
                <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Preview (大约需要 {leftTime} s)
                </Button>
                <Markdown remarkPlugins={[remarkGfm]}>{textMKD}</Markdown>
            </div>
        );

        //text and formed data
        return (
            <div>
                <Markdown remarkPlugins={[remarkGfm]}>{textMKD}</Markdown>
            </div>
        );
    }

    const handleInput = (e: { target: { value: SetStateAction<string> } }) => {
        setIsLatest(false)
        setText(e.target.value)
    }

    const StateDeployButton = () => {
        if (!isDeployActivate)
            return (
                <Button disabled>
                    Deploy
                </Button>
            )
        if (isPosting) return (
            <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deploying
            </Button>
        )
        return (
            <Button onClick={postData}>Deploy</Button>
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
        setTextMKD(content)
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
            alert("Wrong Passkey")
        }
    }

    return (
        <>
            {!auth &&
                <div className="flex flex-row items-center p-4">
                    <Input className="w-100" placeholder="Enter password" onChange={(e) => { setPasskey(e.target.value) }} />
                    <Button onClick={getAuthState}>auth</Button>
                </div>}
            {auth &&
                <div className="flex h-full flex-col items-center justify-between p-4">
                    <div className="flex flex-row-reverse space-x-2 space-x-reverse w-full">
                        <StateDeployButton />
                        {hasDeployment && <Button variant={"secondary"} onClick={() => window.open(currentUrl.replace("edit", ""))}>View Deployment</Button>}
                    </div>
                    <ResizablePanelGroup
                        direction="horizontal"
                    >
                        <ResizablePanel defaultSize={50}>
                            <div className=" flex-row h-full items-center justify-center p-6 space-y-2">
                                <Textarea className="resize-none" placeholder="Type your message here." onChange={handleInput} />
                            </div>
                        </ResizablePanel>
                        {/* <ResizableHandle withHandle /> */}
                        <ResizablePanel defaultSize={50}>
                            <div className="flex-row h-full items-center justify-center p-6">
                                <RightAreaRenderer />
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            }
        </>

    )
}