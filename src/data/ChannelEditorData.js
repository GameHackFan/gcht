const channelEditorData =
{
	channelOrderMap:
	{
		"rgb": {label: "RGB (Red, Green, Blue)", indexes: [2, 1, 0]}, 
		"rbg": {label: "RBG (Red, Blue, Green)", indexes: [2, 0, 1]}, 
		"grb": {label: "GRB (Green, Red, Blue)", indexes: [1, 2, 0]},
		"gbr": {label: "GBR (Green, Blue, Red)", indexes: [0, 2, 1]},
		"brg": {label: "BRG (Blue, Red, Green)", indexes: [1, 0, 2]},
		"bgr": {label: "BGR (Blue, Green, Red)", indexes: [0, 1, 2]}
	},

	channelSizeMap:
	{
		"2": {label: "2 bits (8 bits color)", size: 2},
		"4": {label: "4 bits (16 bits color)", size: 4},
		"5": {label: "5 bits (16 bits color)", size: 5},
		"8": {label: "8 bits (32 bits color)", size: 8}
	},

	colorSizeMap:
	{
		"2": {label: "2 bits (8 bits color)", size: 1},
		"4": {label: "4 bits (16 bits color)", size: 2},
		"5": {label: "5 bits (16 bits color)", size: 2},
		"8": {label: "8 bits (32 bits color)", size: 4}
	}
}


export default channelEditorData;
