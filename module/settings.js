export function registerSettings() {
  game.settings.register('storypath-fvtt', 'tension', {
    name: game.i18n.localize('STORYPATH.Tension'),
    hint: game.i18n.localize('STORYPATH.TensionDescription'),
    default: 0,
    scope: 'world',
    type: Number,
    config: false,
  });

  game.settings.register('storypath-fvtt', 'momentum', {
    name: game.i18n.localize('STORYPATH.Momentum'),
    default: 0,
    scope: 'world',
    type: Number,
    config: false,
  });

  game.settings.register('storypath-fvtt', 'collateral', {
    name: game.i18n.localize('STORYPATH.Collateral'),
    default: 0,
    scope: 'world',
    type: Number,
    config: false,
  });

  game.settings.register("storypath-fvtt", "showResources", {
    name: "STORYPATH.ShowResources",
    hint: "STORYPATH.ShowResourcesHint",
    scope: "world",
    config: true,
    default: "st",
    type: String,
    choices: {
      "all": "STORYPATH.AllPlayers",
      "st": "STORYPATH.SGOnly",
      "none": "STORYPATH.HideBox",
    },
    onChange: (choice) => {
      window.location.reload();
    },
  });

  game.settings.register("storypath-fvtt", "sheetStyle", {
    name: "STORYPATH.SheetStyle",
    hint: "STORYPATH.SheetStyleDescription",
    scope: "world",
    config: true,
    default: "origin",
    type: String,
    choices: {
      "origin": "STORYPATH.Origin",
      "hero": "STORYPATH.Hero",
      // "demigod": "STORYPATH.Demigod",
    },
    onChange: (choice) => {
      window.location.reload();
    },
  });
}