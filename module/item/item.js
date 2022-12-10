/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class StorypathItem extends Item {
  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    // Get the Item's data
    const itemData = this.system;
    const actorData = this.actor ? this.actor.system : {};
  }

  async _preCreate(createData, options, userId) {
    this.updateSource({ img: getDefaultImage(createData.type) });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    // Basic template rendering data
    const token = this.actor.token;
    const actorData = this.actor ? this.actor.system : {};
  }
}

function getDefaultImage(type) {
  const defaultImages = {
    'knack': "icons/svg/light.svg",
    'contact': "icons/svg/mystery-man.svg",
    'path': "systems/storypath-fvtt/assets/icons/mountain-road.svg",
    'specialty': "icons/svg/upgrade.svg",
    'quality': "icons/svg/aura.svg",
    'flair': "systems/storypath-fvtt/assets/icons/eclipse-flare.svg",
    'birthright': "icons/svg/chest.svg",
    'boon': "systems/storypath-fvtt/assets/icons/gift-trap.svg",
    'purview': "systems/storypath-fvtt/assets/icons/world.svg",
    'dragon_magic': "systems/storypath-fvtt/assets/icons/world.svg",
    'condition': "icons/svg/daze.svg",
    'calling': "systems/storypath-fvtt/assets/icons/book-aura.svg",
    'health': "icons/svg/regen.svg",
    'fatebinding': "systems/storypath-fvtt/assets/icons/crossed-chains.svg",
    'spell': "systems/storypath-fvtt/assets/icons/magic-swirl.svg",
    'item': "icons/svg/item-bag.svg"
  };
  return defaultImages[type] || CONST.DEFAULT_TOKEN;
}
