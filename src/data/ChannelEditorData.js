export const channelEditorData =
{
  channelOrderMap:
  {
    "rgb": {key: "rgb", label: "RGB (Red, Green, Blue)", indexes: [2, 1, 0]}, 
    "rbg": {key: "rbg", label: "RBG (Red, Blue, Green)", indexes: [2, 0, 1]}, 
    "grb": {key: "grb", label: "GRB (Green, Red, Blue)", indexes: [1, 2, 0]},
    "gbr": {key: "gbr", label: "GBR (Green, Blue, Red)", indexes: [0, 2, 1]},
    "brg": {key: "brg", label: "BRG (Blue, Red, Green)", indexes: [1, 0, 2]},
    "bgr": {key: "bgr", label: "BGR (Blue, Green, Red)", indexes: [0, 1, 2]}
  },

  channelSizeMap:
  {
    "2": {key: "2", label: "2 bits (8 bits color)", size: 2},
    "4": {key: "4", label: "4 bits (16 bits color)", size: 4},
    "5": {key: "5", label: "5 bits (16 bits color)", size: 5},
    "8": {key: "8", label: "8 bits (32 bits color)", size: 8}
  },

  colorSizeMap:
  {
    "2": {key: "2", label: "2 bits (8 bits color)", size: 1},
    "4": {key: "4", label: "4 bits (16 bits color)", size: 2},
    "5": {key: "5", label: "5 bits (16 bits color)", size: 2},
    "8": {key: "8", label: "8 bits (32 bits color)", size: 4}
  }
}