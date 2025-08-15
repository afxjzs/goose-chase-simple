export function getRatingColor(rating: number): string {
	if (rating < 2) return "text-red-600"
	if (rating < 3) return "text-orange-600" 
	if (rating < 4) return "text-amber-600"
	if (rating < 4.5) return "text-green-600"
	return "text-green-700"
}

export function getRatingBgColor(rating: number): string {
	if (rating < 2) return "bg-red-100"
	if (rating < 3) return "bg-orange-100"
	if (rating < 4) return "bg-amber-100" 
	if (rating < 4.5) return "bg-green-100"
	return "bg-green-200"
}
