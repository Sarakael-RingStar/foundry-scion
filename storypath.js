// Import Modules
import { storypath } from "./module/config.js";

import { StorypathActor } from "./module/actor/actor.js";
import { StorypathActorSheet } from "./module/actor/actor-sheet.js";
import { StorypathItem } from "./module/item/item.js";
import { StorypathItemSheet } from "./module/item/item-sheet.js";

import { RollForm } from "./module/apps/dice-roller.js";
import TraitSelector from "./module/apps/trait-selector.js";
import { registerSettings } from "./module/settings.js";
import GroupResourceTracker from "./module/group-resource-tracker.js";

Hooks.once('init', async function () {

  registerSettings();

  game.storypath = {
    applications: {
      TraitSelector,
    },
    entities: {
      StorypathActor,
      StorypathItem,
    },
    config: storypath,
  };

  // /**
  //  * Set an initiative formula for the system
  //  * @type {String}
  //  */
  // CONFIG.Combat.initiative = {
  //   formula: "1d10cs>=7",
  // };

  Combatant.prototype._getInitiativeFormula = function() {
    const actor = this.actor;
    var initDice = 0;
    if (this.actor.type != 'npc') {
      initDice = actor.system.attributes.cunning.value + Math.max(actor.system.skills.close.value, actor.system.skills.firearms.value);
    }
    else {
      initDice = actor.system.initiative.value;
    }
    // let roll = new Roll(``).evaluate({ async: false });
    // let diceRoll = roll.total;
    // let bonus = 0;
    return `${initDice}d10cs>=8`;
  }

  // Define custom Entity classes
  CONFIG.storypath = storypath;
  CONFIG.Actor.documentClass = StorypathActor;
  CONFIG.Item.documentClass = StorypathItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("storypath", StorypathActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("storypath", StorypathItemSheet, { makeDefault: true });

  // Pre-load templates
  loadTemplates([
    "systems/storypath-fvtt/templates/dialogues/skill-base.html",
    "systems/storypath-fvtt/templates/actor/active-effects.html",
    "systems/storypath-fvtt/templates/actor/section-header.html",
    "systems/storypath-fvtt/templates/actor/item-section-header.html",
    "systems/storypath-fvtt/templates/actor/item-points-section-header.html",
  ]);

  // If you need to add Handlebars helpers, here are a few useful examples:
  Handlebars.registerHelper('concat', function () {
    var outStr = '';
    for (var arg in arguments) {
      if (typeof arguments[arg] != 'object') {
        outStr += arguments[arg];
      }
    }
    return outStr;
  });

  Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper('numLoop', function (num, options) {
    let ret = ''

    for (let i = 0, j = num; i < j; i++) {
      ret = ret + options.fn(i)
    }

    return ret
  })
});

Handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('ifNotEquals', function (arg1, arg2, options) {
  return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});

$(document).ready(() => {
  const diceIconSelector = '#chat-controls .chat-control-icon .fa-dice-d20';

  $(document).on('click', diceIconSelector, ev => {
    ev.preventDefault();
    new RollForm(null, {event:ev}, {}, {rollType: 'base'}).render(true);
  });
});

Hooks.once("ready", async function () {
  const showBox = game.settings.get("storypath-fvtt", "showResources");
  if((game.user.isGM && showBox !== "none") || showBox === 'all') {
    const resourceTracker = new GroupResourceTracker();
    resourceTracker.render(true);
  }

  $("#chat-log").on("click", " .item-row", ev => {
    const li = $(ev.currentTarget).next();
    li.toggle("fast");
  });
});