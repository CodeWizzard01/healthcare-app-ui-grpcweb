import './globals.css'

export const metadata = {
  title: 'Healthcare App',
  description: 'A modern healthcare application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark-theme">
      <body>
        {children}
      </body>
    </html>
  )
}
