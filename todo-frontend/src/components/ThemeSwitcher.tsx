'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Switch } from '@nextui-org/switch'
import { MoonIcon, SunIcon } from 'lucide-react'

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    function handleTheme() {
        if (theme === 'light') {
            setTheme('dark')
        } else {
            setTheme('light')
        }
    }

    return (
        <div className="absolute top-4 right-4 p-10">
            <div className='flex gap-4'>
                <Switch size='lg'
                startContent={<SunIcon />}
                endContent={<MoonIcon/>}
                onClick={handleTheme}>
                    {theme}
                </Switch>
            </div>
        </div>
    )
}