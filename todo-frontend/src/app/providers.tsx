'use client'

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </>
  }
  return (
    <NextUIProvider>
      <ThemeProvider
      attribute='class'
      defaultTheme='light'
      themes={['light','dark']}
      >
        {children}
      </ThemeProvider>
    </NextUIProvider>
  )
}
