// Google Maps types
interface GoogleMaps {
	maps: {
		Map: new (element: HTMLElement, options: any) => any
		Marker: new (options: any) => any
		InfoWindow: new (options: any) => any
		Size: new (width: number, height: number) => any
		Point: new (x: number, y: number) => any
		ControlPosition: {
			TOP_LEFT: any
			TOP_RIGHT: any
			BOTTOM_LEFT: any
			BOTTOM_RIGHT: any
		}
		MapTypeControlStyle: {
			HORIZONTAL_BAR: any
			DROPDOWN_MENU: any
		}
	}
}

declare global {
	interface Window {
		google: GoogleMaps
	}
}

export {}
