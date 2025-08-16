import type { Metadata } from "next"
import { Cardo, Josefin_Sans } from "next/font/google"
import "./globals.css"

const cardo = Cardo({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-cardo",
	display: "swap",
})

const josefinSans = Josefin_Sans({
	subsets: ["latin"],
	weight: ["300", "400", "600"],
	variable: "--font-josefin-sans",
	display: "swap",
})

export const metadata: Metadata = {
	title: "Goose Chase | Chicago Venues",
	description: "Interactive map of Chicago venues and restaurants",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			{/* Google Analytics - Only in production */}
			{process.env.NODE_ENV === "production" && (
				<>
					<script
						async
						src="https://www.googletagmanager.com/gtag/js?id=G-JXRC6SNZ0B"
					/>
					<script
						dangerouslySetInnerHTML={{
							__html: `
								window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());
								gtag('config', 'G-JXRC6SNZ0B');
							`,
						}}
					/>
				</>
			)}
			<body
				className={`${cardo.variable} ${josefinSans.variable} font-sans antialiased`}
			>
				{children}
			</body>
		</html>
	)
}
