"use client"

interface PhotoAttributionProps {
	html?: string
	className?: string
}

export default function PhotoAttribution({ html, className = "" }: PhotoAttributionProps) {
	if (!html) return null

	return (
		<div 
			className={`mt-2 text-xs text-gray-500 ${className}`}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	)
}
