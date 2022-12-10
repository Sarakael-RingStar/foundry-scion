import { onManageActiveEffect, prepareActiveEffectCategories } from "../effects.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class StorypathItemSheet extends ItemSheet {

  constructor(...args) {
    super(...args);
    this.options.classes = [...this.options.classes, this.getTypeSpecificCSSClasses()];
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["storypath", "sheet", "item"],
      width: 645,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/storypath-fvtt/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.html`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    if(this.item.type === 'specialty') {
      return `${path}/item-specialty-sheet.html`;
    }
    else if(this.item.type === 'knack') {
      return `${path}/item-knack-sheet.html`;
    }
    else if(this.item.type === 'birthright') {
      return `${path}/item-birthright-sheet.html`;
    }
    else if(this.item.type === 'health') {
      return `${path}/item-health-sheet.html`;
    }
    else if(this.item.type === 'boon') {
      return `${path}/item-boon-sheet.html`;
    }
    else if(this.item.system.points !== undefined) {
      return `${path}/item-points-sheet.html`;
    }
    else {
      return `${path}/item-sheet.html`;
    }
  }

  getTypeSpecificCSSClasses() {
    return `${game.settings.get("storypath-fvtt", "sheetStyle")}-background`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const context = super.getData();
    const itemData = this.item.toObject(false);
    context.system = itemData.system;

    // Prepare Active Effects
    context.effects = prepareActiveEffectCategories(this.item.effects);
    
    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // $('.storypath .window-content').css({ "background": `url(/systems/storypath-fvtt/assets/background-${game.settings.get("storypath-fvtt", "sheetStyle")}.png)`, "background-size": "cover" });

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    html.find(".effect-control").click(ev => {
      if ( this.item.isOwned ) return ui.notifications.warn("Managing Active Effects within an Owned Item is not currently supported and will be added in a subsequent update.");
      onManageActiveEffect(ev, this.item);
    });

    // Roll handlers, click handlers, etc. would go here.
  }
}
