/** OSRS fixed classic client dimensions (765×503). */
export const FIXED_FRAME_WIDTH = 765;
export const FIXED_FRAME_HEIGHT = 503;
export const WINDOW_TOP_HEIGHT = 4;
export const VIEWPORT_WIDTH = 512;
export const VIEWPORT_HEIGHT = 334;
export const SIDEBAR_WIDTH = 253;
export const CHAT_MESSAGES_HEIGHT = 142;
export const CHAT_STONES_HEIGHT = 23;
export const CHAT_HEIGHT = CHAT_MESSAGES_HEIGHT + CHAT_STONES_HEIGHT;
export const CLIENT_GRID_HEIGHT = VIEWPORT_HEIGHT + CHAT_HEIGHT;

export const MINIMAP_HEIGHT = 164;
export const MINIMAP_LEFT_EDGE_WIDTH = 29;
export const MINIMAP_RIGHT_EDGE_WIDTH = 48;
export const MINIMAP_FRAME_WIDTH = 172;
export const MINIMAP_FRAME_HEIGHT = 156;
export const MINIMAP_BOTTOM_HEIGHT = 8;
export const MINIMAP_FRAME_LEFT = MINIMAP_LEFT_EDGE_WIDTH;
export const MINIMAP_MAP_SIZE = 146;
/** Map inset within the frame sprite (hole is shifted right for the compass lobe). */
export const MINIMAP_MAP_INSET_X = 13;
export const MINIMAP_MAP_TOP = 8;
export const MINIMAP_MAP_LEFT = MINIMAP_FRAME_LEFT + MINIMAP_MAP_INSET_X;
export const MINIMAP_COMPASS_LEFT = MINIMAP_FRAME_LEFT + 6;
export const MINIMAP_COMPASS_TOP = 6;
export const MINIMAP_COMPASS_SIZE = 28;
export const MINIMAP_BOTTOM_WIDTH = 249;
export const MINIMAP_BOTTOM_LEFT = (SIDEBAR_WIDTH - MINIMAP_BOTTOM_WIDTH) / 2;

export const TAB_STRIP_WIDTH = 249;
export const TAB_STRIP_LEFT = (SIDEBAR_WIDTH - TAB_STRIP_WIDTH) / 2;
export const TAB_BAR_HEIGHT = 37;
export const TAB_BAR_ROWS = 2;
export const TAB_SLOT_COUNT = 7;

export const SIDE_PANEL_WIDTH = 190;
export const SIDE_PANEL_HEIGHT = 261;
export const SIDE_PANEL_LEFT = (SIDEBAR_WIDTH - SIDE_PANEL_WIDTH) / 2;

export const SIDEBAR_BODY_HEIGHT =
  CLIENT_GRID_HEIGHT - MINIMAP_HEIGHT - TAB_BAR_HEIGHT * TAB_BAR_ROWS;

/** Camera yaw (rad) when north is up on screen — used for compass snap. */
export const CAMERA_YAW_NORTH = Math.PI / 2;
