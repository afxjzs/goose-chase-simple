"use client"

interface PhotoAttributionProps {
	html?: string
	className?: string
}

export default function PhotoAttribution({
	html,
	className = "",
}: PhotoAttributionProps) {
	if (!html) return null

	return (
		<div
			className={`mt-2 text-xs text-text-muted font-sans ${className}`}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	)
}
