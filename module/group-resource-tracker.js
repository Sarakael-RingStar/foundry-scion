/**
 * A specialized form used to pop out the editor.
 * @extends {FormApplication}
 *
 * OPTIONS:
 *
 *
 */
export default class GroupResourceTracker extends Application {
  constructor(object = {}, options = {}) {
    super({
      template: "systems/storypath-fvtt/templates/group-resource-tracker.html",
      popOut: false,
    });
  }

  getData() {
    // Get current value
    let groupResources = { tension: game.settings.get("storypath-fvtt", "tension"), momentum: game.settings.get("storypath-fvtt", "momentum"), collateral: game.settings.get("storypath-fvtt", "collateral") };

    // Return data
    return {
      groupResources,
      isGM: game.user.isGM,
    };
  }

  syncData() {
    game.socket.emit("system.storypath-fvtt", 'plus');
  }

  activateListeners(html) {
    html.find(".plus").click(async (event) => {
      const type = event.currentTarget.dataset.type;
      var currentResource = game.settings.get("storypath-fvtt", type) || 0;
      currentResource++;
      await game.settings.set('storypath-fvtt', type, currentResource);
      game.socket.emit("system.storypath-fvtt", 'plus');
      this.syncData();
      this.render();
    });

    html.find(".minus").click(async (event) => {
      const type = event.currentTarget.dataset.type;
      var currentResource = game.settings.get("storypath-fvtt", type) || 0;
      if (currentResource > 0) {
        currentResource--;
        await game.settings.set('storypath-fvtt', type, currentResource);
      }
      game.socket.emit("system.storypath-fvtt", 'minus');
      this.render();
    });

    game.socket.on("system.storypath-fvtt", (arg1) => {
      console.log(arg1);
      this.render();
    });
  }
}
