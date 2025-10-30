import './globals.css'
import { Lato } from 'next/font/google'
import AIAssistant from '@/components/AIAssistant'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'

const lato = Lato({ 
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'KarWanua - GHG Emission Calculator',
  description: 'KarWanua: Greenhouse Gas Emission Calculator for Waste Management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={lato.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
