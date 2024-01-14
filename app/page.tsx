'use client'

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'lucide-react'
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

  const handleCopyButtonClicked = () => {
    copy.default(currentUrl)
    alert("link copied")
  }


  return (
    <div className="flex h-full flex-col items-center justify-between p-4">
      <div className="flex flex-row-reverse space-x-2 space-x-reverse w-full">
        <Button variant="outline" size="icon" onClick={handleCopyButtonClicked}>
          <Link />
        </Button>
      </div>
      <div className="flex-row h-full items-center justify-center p-6">
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      </div>
    </div>

  )
}
