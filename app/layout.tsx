import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sorting Visualizer',
  description: 'The Sorting Visualizer is an interactive web application designed to visually demonstrate various sorting algorithms in action. By animating the sorting process step by step, users can gain a deeper understanding of how different algorithms work and compare their performance in real-time.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
