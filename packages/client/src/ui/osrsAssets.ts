/** Vanilla OSRS UI sprites from melkypie/resource-packs (sample-vanilla branch). */
const BASE = '/assets/osrs';

export const OSRS_ASSETS = {
  fixed: {
    windowTop: `${BASE}/fixed_mode/window_frame_edge_top.png`,
    topRightCorner: `${BASE}/fixed_mode/top_right_corner.png`,
    sidePanelBg: `${BASE}/fixed_mode/side_panel_background.png`,
    minimapFrame: `${BASE}/fixed_mode/minimap_and_compass_frame.png`,
    minimapLeft: `${BASE}/fixed_mode/minimap_left_edge.png`,
    minimapRight: `${BASE}/fixed_mode/minimap_right_edge.png`,
    minimapBottom: `${BASE}/fixed_mode/minimap_frame_bottom.png`,
    tabsTop: `${BASE}/fixed_mode/tabs_top_row.png`,
    tabsBottom: `${BASE}/fixed_mode/tabs_row_bottom.png`,
  },
  chatbox: {
    background: `${BASE}/chatbox/background.png`,
    stones: `${BASE}/chatbox/buttons_background_stones.png`,
    button: `${BASE}/chatbox/button.png`,
  },
  tabs: {
    combat: `${BASE}/tab/combat.png`,
    stats: `${BASE}/tab/stats.png`,
    sailing: `${BASE}/tab/sailing.png`,
    inventory: `${BASE}/tab/inventory.png`,
    prayer: `${BASE}/tab/prayer.png`,
    magic: `${BASE}/tab/magic.png`,
    smallMiddle: `${BASE}/tab/small_middle.png`,
    smallMiddleSelected: `${BASE}/tab/small_middle_selected.png`,
    sideBorderTop: `${BASE}/tab/side_border_top.png`,
    sideBorderMiddle: `${BASE}/tab/side_border_middle.png`,
    sideBorderBottom: `${BASE}/tab/side_border_bottom.png`,
  },
  sailing: {
    raft: `${BASE}/sailing/raft.png`,
    setSails: `${BASE}/sailing/set_sails.png`,
    unsetSailsSlow: `${BASE}/sailing/unset_sails_slow.png`,
    unsetSailsFast: `${BASE}/sailing/unset_sails_fast.png`,
    reverse: `${BASE}/sailing/reverse.png`,
    sails: `${BASE}/sailing/sails.png`,
    steering: `${BASE}/sailing/steering.png`,
    notSteering: `${BASE}/sailing/not_steering.png`,
    tabStats: `${BASE}/sailing/tab_stats.png`,
    tabFacilities: `${BASE}/sailing/tab_facilities.png`,
    tabCrew: `${BASE}/sailing/tab_crew.png`,
    trim: `${BASE}/sailing/trim.png`,
    viewSailingOptions: `${BASE}/sailing/view_sailing_options.png`,
  },
  skill: {
    agility: `${BASE}/skill/agility.png`,
    sailing: `${BASE}/skill/sailing.png`,
  },
  button: {
    forward: `${BASE}/button/forward_arrow.png`,
    back: `${BASE}/button/back_arrow.png`,
  },
  chevron: {
    up: `${BASE}/chevron/yellow_up_single.png`,
    down: `${BASE}/chevron/yellow_down_single.png`,
  },
} as const;
