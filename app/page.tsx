'use client'

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Share } from 'lucide-react'
import * as copy from 'copy-to-clipboard';
import Header from "@/components/basic/header_edit"

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


  return (
    <>
      <Header />
      <div className="flex h-full flex-col items-center justify-between p-4">
        <div className="flex-row h-full items-center justify-center p-6">
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          <Separator className='mt-12 mb-4' />
          <div className='flex w-full text-gray-300 items-center justify-between'>
            {/* <p className='font-medium'>
              2024 mResume
            </p>
            <div className='flex space-x-2 items-center justify-center'>
              <p className='text-gray-400 text-s font-mono'>
                Click,Deploy yours.
              </p>
              <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fhello-world"><img src="https://vercel.com/button" alt="Deploy with Vercel" /></a>
            </div> */}
          </div>
        </div>
      </div>

    </>

  )
}
