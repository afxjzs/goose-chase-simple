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
	description:
		"Explore 122 Chicago venues from @DanteTheDon's Barstool Sports article on Chicago bachelor party destinations. Interactive map with photos, ratings, and details.",
	keywords: [
		"Chicago",
		"venues",
		"restaurants",
		"bars",
		"bachelor party",
		"nightlife",
		"dining",
		"map",
	],
	authors: [
		{
			name: "Douglas Rogers",
			url: "https://www.linkedin.com/in/douglasrogers/",
		},
	],
	creator: "Douglas Rogers",
	publisher: "Goose Chase",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://goose-chase-simple.vercel.app"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://goose-chase-simple.vercel.app",
		siteName: "Goose Chase",
		title: "Goose Chase | Chicago Venues",
		description:
			"Explore 122 Chicago venues from @DanteTheDon's Barstool Sports article on Chicago bachelor party destinations. Interactive map with photos, ratings, and details.",
		images: [
			{
				url: "https://goose-chase-simple.vercel.app/goosechase-screenshot-modal.png",
				width: 1200,
				height: 630,
				alt: "Goose Chase - Chicago Venues Modal with Photo and Details",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		site: "@Branch",
		creator: "@Branch",
		title: "Goose Chase | Chicago Venues",
		description:
			"Explore 122 Chicago venues from @DanteTheDon's Barstool Sports article on Chicago bachelor party destinations. Interactive map with photos, ratings, and details.",
		images: [
			"https://goose-chase-simple.vercel.app/goosechase-screenshot-modal.png",
		],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: "your-google-verification-code", // Add your Google Search Console verification code if you have one
	},
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
