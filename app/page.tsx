'use client'

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Share, Figma } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast';
import * as copy from 'copy-to-clipboard';

export default function Home() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [content, setContent] = useState('Content Loading')

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

  const getData = async () => {
    const res = await fetch("api/fetchContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: currentUrl,
      }),
    })
    const data = await res.json()

    if (!data) {
      setContent("no deployment")
      return
    }

    const content = data.content
    console.log("content", content)
    setContent(content)
  }

  const notifyCopied = () => toast.success(
    `链接已复制
  ${currentUrl}
  `);

  const handleCopyButtonClicked = () => {
    notifyCopied()
    copy.default(currentUrl)
  }

  return (
    <div className="flex h-full flex-col items-center justify-between p-4">
      <Toaster />
      <div className="flex flex-row-reverse space-x-2 space-x-reverse w-full">
        <Button variant="outline" size="icon" onClick={handleCopyButtonClicked}>
          <Share />
        </Button>
      </div>
      <div className="flex-row h-full items-center justify-center p-6">
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        <Separator className='mt-12 mb-4' />
        <div className='flex w-full text-gray-300 items-center justify-between'>
          <p className='font-medium'>
            2024 mResume
          </p>
          <div className='flex space-x-2 items-center justify-center'>
            <p className='text-gray-400 text-s font-mono'>
              Click,Deploy yours.
            </p>
            {/* <Button variant="secondary" onClick={() => window.open("https://www.figma.com/community/file/1323193282285809885/magic-resume-cv-the-next-generation-of-resume")}>
              <Figma className='mr-2 h-4 w-4' />
              Create
            </Button> */}
            <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fhello-world"><img src="https://vercel.com/button" alt="Deploy with Vercel" /></a>
          </div>
        </div>
      </div>
    </div>

  )
}
