export function getRatingColor(rating: number): string {
	if (rating < 2) return "text-red-500"
	if (rating < 3) return "text-orange-500"
	if (rating < 4) return "text-yellow-500"
	if (rating < 4.5) return "text-blue-500"
	return "text-green-500"
}

export function getRatingBgColor(rating: number): string {
	if (rating < 2) return "bg-red-100"
	if (rating < 3) return "bg-orange-100"
	if (rating < 4) return "bg-yellow-100"
	if (rating < 4.5) return "bg-blue-100"
	return "bg-green-100"
}
