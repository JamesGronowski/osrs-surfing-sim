import { osrsAssetUrl, surfAssetUrl } from './osrsAssetBase.js';

/** Vanilla OSRS UI sprites from melkypie/resource-packs (sample-vanilla branch). */
export const OSRS_ASSETS = {
  fixed: {
    windowTop: osrsAssetUrl('fixed_mode/window_frame_edge_top.png'),
    topRightCorner: osrsAssetUrl('fixed_mode/top_right_corner.png'),
    sidePanelBg: osrsAssetUrl('fixed_mode/side_panel_background.png'),
    minimapFrame: osrsAssetUrl('fixed_mode/minimap_and_compass_frame.png'),
    minimapLeft: osrsAssetUrl('fixed_mode/minimap_left_edge.png'),
    minimapRight: osrsAssetUrl('fixed_mode/minimap_right_edge.png'),
    minimapBottom: osrsAssetUrl('fixed_mode/minimap_frame_bottom.png'),
    tabsTop: osrsAssetUrl('fixed_mode/tabs_top_row.png'),
    tabsBottom: osrsAssetUrl('fixed_mode/tabs_row_bottom.png'),
  },
  chatbox: {
    background: osrsAssetUrl('chatbox/background.png'),
    stones: osrsAssetUrl('chatbox/buttons_background_stones.png'),
    button: osrsAssetUrl('chatbox/button.png'),
  },
  tabs: {
    combat: osrsAssetUrl('tab/combat.png'),
    stats: osrsAssetUrl('tab/stats.png'),
    sailing: osrsAssetUrl('tab/sailing.png'),
    inventory: osrsAssetUrl('tab/inventory.png'),
    prayer: osrsAssetUrl('tab/prayer.png'),
    magic: osrsAssetUrl('tab/magic.png'),
    smallMiddle: osrsAssetUrl('tab/small_middle.png'),
    smallMiddleSelected: osrsAssetUrl('tab/small_middle_selected.png'),
    sideBorderTop: osrsAssetUrl('tab/side_border_top.png'),
    sideBorderMiddle: osrsAssetUrl('tab/side_border_middle.png'),
    sideBorderBottom: osrsAssetUrl('tab/side_border_bottom.png'),
  },
  /** Wave-themed movement icons (original art for this project). */
  surf: {
    surfboard: surfAssetUrl('surfboard.svg'),
    paddle: surfAssetUrl('wave_paddle.svg'),
    ride: surfAssetUrl('wave_ride.svg'),
    stop: surfAssetUrl('wave_stop.svg'),
    lieDown: surfAssetUrl('wave_lie_down.svg'),
    panelIcon: surfAssetUrl('wave_panel.svg'),
  },
  sailing: {
    raft: surfAssetUrl('surfboard.svg'),
    setSails: surfAssetUrl('wave_ride.svg'),
    unsetSailsSlow: surfAssetUrl('wave_paddle.svg'),
    unsetSailsFast: surfAssetUrl('wave_stop.svg'),
    reverse: surfAssetUrl('wave_lie_down.svg'),
    sails: surfAssetUrl('wave_paddle.svg'),
    steering: osrsAssetUrl('sailing/steering.png'),
    notSteering: osrsAssetUrl('sailing/not_steering.png'),
    tabStats: osrsAssetUrl('sailing/tab_stats.png'),
    tabFacilities: osrsAssetUrl('sailing/tab_facilities.png'),
    tabCrew: osrsAssetUrl('sailing/tab_crew.png'),
    trim: osrsAssetUrl('sailing/trim.png'),
    viewSailingOptions: surfAssetUrl('wave_panel.svg'),
  },
  skill: {
    agility: osrsAssetUrl('skill/agility.png'),
    sailing: osrsAssetUrl('skill/sailing.png'),
  },
  button: {
    forward: osrsAssetUrl('button/forward_arrow.png'),
    back: osrsAssetUrl('button/back_arrow.png'),
  },
  chevron: {
    up: osrsAssetUrl('chevron/yellow_up_single.png'),
    upDouble: osrsAssetUrl('chevron/yellow_up_double.png'),
    down: osrsAssetUrl('chevron/yellow_down_single.png'),
    downStop: osrsAssetUrl('chevron/yellow_down_stop.png'),
  },
} as const;
