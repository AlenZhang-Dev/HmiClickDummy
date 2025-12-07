/**
 * 7段数码管段码映射表
 * 
 * 段位定义:
 * A=Top, B=TopRight, C=BottomRight, D=Bottom, E=BottomLeft, F=TopLeft, G=Middle
 * 
 * 可视化:
 *  AAAA
 * F    B
 * F    B
 *  GGGG
 * E    C
 * E    C
 *  DDDD
 */
export const SEGMENT_MAP = {
  ' ': [],
  '0': ['A', 'B', 'C', 'D', 'E', 'F'],
  '1': ['B', 'C'],
  '2': ['A', 'B', 'G', 'E', 'D'],
  '3': ['A', 'B', 'G', 'C', 'D'],
  '4': ['F', 'G', 'B', 'C'],
  '5': ['A', 'F', 'G', 'C', 'D'],
  '6': ['A', 'F', 'G', 'E', 'D', 'C'],
  '7': ['A', 'B', 'C'],
  '8': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  '9': ['A', 'B', 'C', 'D', 'F', 'G'],
  'H': ['F', 'E', 'G', 'B', 'C'], // For Level 0 indicator ('H'igh)
  'C': ['A', 'F', 'E', 'D'], // For Custom Level
};
