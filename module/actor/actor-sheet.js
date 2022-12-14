// import {
//   DiceRollerDialogue
// } from "./dialogue-diceRoller.js";
import { RollForm } from "../apps/dice-roller.js";
import TraitSelector from "../apps/trait-selector.js";
import { onManageActiveEffect, prepareActiveEffectCategories } from "../effects.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class StorypathActorSheet extends ActorSheet {

  constructor(...args) {
    super(...args);

    if (this.object.type === "npc") {
      this.options.width = this.position.width = 614;
      this.options.height = this.position.height = 867;
    };

    this.options.classes = [...this.options.classes, this.getTypeSpecificCSSClasses()];

    this._filters = {
      effects: new Set()
    }
  }

  /**
 * Get the correct HTML template path to use for rendering this particular sheet
 * @type {String}
 */
  get template() {
    if (this.actor.type === "npc") return "systems/storypath-fvtt/templates/actor/npc-sheet.html";
    if (this.actor.type === "scion") return "systems/storypath-fvtt/templates/actor/scion-sheet.html";
    return "systems/storypath-fvtt/templates/actor/scion-sheet.html";
  }

  /**
 * Extend and override the sheet header buttons
 * @override
 */
  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    // Token Configuration
    const canConfigure = game.user.isGM || this.actor.isOwner;
    if (this.options.editable && canConfigure) {
      const helpButton = {
        label: game.i18n.localize('STORYPATH.Help'),
        class: 'help-dialogue',
        icon: 'fas fa-question',
        onclick: () => this.helpDialogue(),
      };
      buttons = [helpButton, ...buttons];
      if (this.actor.type != 'npc') {
        const colorButton = {
          label: game.i18n.localize('STORYPATH.DotColors'),
          class: 'set-color',
          icon: 'fas fa-palette',
          onclick: (ev) => this.pickColor(ev),
        };
        buttons = [colorButton, ...buttons];
      }
      const rollButton = {
        label: game.i18n.localize('STORYPATH.Roll'),
        class: 'roll-dice',
        icon: 'fas fa-dice-d10',
        onclick: (ev) => new RollForm(this.actor, { event: ev }, {}, { rollType: 'base' }).render(true),
      };
      buttons = [rollButton, ...buttons];
    }
    return buttons;
  }

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["storypath", "sheet", "actor"],
      template: "systems/storypath-fvtt/templates/actor/scion-sheet.html",
      width: 875,
      height: 1110,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }]
    });
  }

  getTypeSpecificCSSClasses() {
    return `${game.settings.get("storypath-fvtt", "sheetStyle")}-background`;
  }
  /* -------------------------------------------- */

  /** @override */
  getData() {
    const context = super.getData();
    context.dtypes = ["String", "Number", "Boolean"];

    const actorData = this.actor.toObject(false);
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Update traits
    this._prepareTraits(context.system.traits);

    this.actor.headerImg = `systems/storypath-fvtt/assets/${game.settings.get("storypath-fvtt", "sheetStyle")}-header.png`;
    this.actor.headerImgSmall = `systems/storypath-fvtt/assets/${game.settings.get("storypath-fvtt", "sheetStyle")}-small-header.png`;

    // Prepare items.
    if (this.actor.type === 'scion') {
      this._prepareCharacterItems(context);
    }
    if (this.actor.type === 'npc') {
      this._prepareCharacterItems(context);
    }

    context.effects = prepareActiveEffectCategories(this.document.effects);

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;

    // Initialize containers.
    const gear = [];
    const paths = [];
    const callings = [];
    const knacks = [];
    const birthrights = [];
    const boons = [];
    const purviews = [];
    const dragon_magic = [];
    const contacts = [];
    const conditions = [];
    const fatebindings = [];
    const specialties = [];
    const qualities = [];
    const flairs = [];
    const health = [];
    const spells = [];

    // Iterate through items, allocating to containers
    for (let i of sheetData.items) {
      i.img = i.img || DEFAULT_TOKEN;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      else if (i.type === 'path') {
        paths.push(i);
      }
      else if (i.type === 'calling') {
        callings.push(i);
      }
      else if (i.type === 'birthright') {
        birthrights.push(i);
      }
      else if (i.type === 'boon') {
        boons.push(i);
      }
      else if (i.type === 'purview') {
        purviews.push(i);
      }
      else if (i.type === 'dragon_magic') {
        dragon_magic.push(i);
      }
      else if (i.type === 'knack') {
        knacks.push(i);
      }
      else if (i.type === 'contact') {
        contacts.push(i);
      }
      else if (i.type === 'specialty') {
        specialties.push(i);
      }
      else if (i.type === 'condition') {
        conditions.push(i);
      }
      else if (i.type === 'fatebinding') {
        fatebindings.push(i);
      }
      else if (i.type === 'quality') {
        qualities.push(i);
      }
      else if (i.type === 'flair') {
        flairs.push(i);
      }
      else if (i.type === 'health') {
        health.push(i);
      }
      else if (i.type === 'spell') {
        spells.push(i);
      }
    }

    // Assign and return
    actorData.gear = gear;
    actorData.paths = paths;
    actorData.callings = callings;
    actorData.knacks = knacks;
    actorData.birthrights = birthrights;
    actorData.boons = boons;
    actorData.purviews = purviews;
    actorData.dragon_magic = dragon_magic;
    actorData.contacts = contacts;
    actorData.specialties = specialties;
    actorData.conditions = conditions;
    actorData.fatebindings = fatebindings;
    actorData.qualities = qualities;
    actorData.flairs = flairs;
    actorData.health = health;
    actorData.spells = spells;
  }

  /**
 * Prepare the data structure for traits data like languages
 * @param {object} traits   The raw traits data object from the actor data
 * @private
 */
  _prepareTraits(traits) {
    const map = {
      "languages": CONFIG.storypath.languages,
    };
    for (let [t, choices] of Object.entries(map)) {
      const trait = traits[t];
      if (!trait) continue;
      let values = [];
      if (trait.value) {
        values = trait.value instanceof Array ? trait.value : [trait.value];
      }
      trait.selected = values.reduce((obj, t) => {
        obj[t] = choices[t];
        return obj;
      }, {});

      // Add custom entry
      if (trait.custom) {
        trait.custom.split(";").forEach((c, i) => trait.selected[`custom${i + 1}`] = c.trim());
      }
      trait.cssClass = !isEmpty(trait.selected) ? "" : "inactive";
    }
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    this._setupDotCounters(html)
    this._setupSquareCounters(html)



    // $('.storypath .window-content').css({ "background": `url(/systems/storypath-fvtt/assets/background-${game.settings.get("storypath-fvtt", "sheetStyle")}.png)`, "background-size": "cover" });

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // if (this.actor.type === 'scion') {
    //   $('.storypath .window-content').css({ "background": `url(/systems/storypath-fvtt/assets/background-${this.actor.system.info.tier}.png)` });
    // }

    // if (this.actor.type === 'npc') {
    //   $('.storypath .window-content').css({ "background": `url(/systems/storypath-fvtt/assets/background-npc.png)` });
    // }

    html.find('.trait-selector').click(this._onTraitSelector.bind(this));

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    html.find('.resource-value > .single-resource-value-step').click(this._onSingleDotCounterChange.bind(this))
    html.find('.resource-value > .resource-value-step').click(this._onDotCounterChange.bind(this))
    html.find('.resource-value > .resource-value-empty').click(this._onDotCounterEmpty.bind(this))
    html.find('.resource-counter > .resource-counter-step').click(this._onSquareCounterChange.bind(this))

    html.find('.augment-attribute').click(this._toggleAugment.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      ev.stopPropagation();
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      let applyChanges = false;
      new Dialog({
        title: 'Delete?',
        content: 'Are you sure you want to delete this item?',
        buttons: {
          delete: {
            icon: '<i class="fas fa-check"></i>',
            label: 'Delete',
            callback: () => applyChanges = true
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: 'Cancel'
          },
        },
        default: "delete",
        close: html => {
          if (applyChanges) {
            const li = $(ev.currentTarget).parents(".item");
            this.actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);
            li.slideUp(200, () => this.render(false));
          }
        }
      }).render(true);
    });

    html.find('#calculate-health').mousedown(ev => {
      this.calculateHealth();
    });

    html.find('#rollSkill').mousedown(ev => {
      new RollForm(this.actor, { event: ev }, {}, {}).render(true);
    });

    html.find('#rollInitiative').mousedown(ev => {
      new RollForm(this.actor, { event: ev }, {}, { skill: 'close', rollType: 'initiative' }).render(true);
    });

    html.find('.roll-skill').mousedown(ev => {
      var skill = $(ev.target).attr("data-skill");
      new RollForm(this.actor, { event: ev }, {}, { skill: skill }).render(true);
    });

    html.find('.roll-pool').mousedown(ev => {
      var pool = $(ev.target).attr("data-pool");
      new RollForm(this.actor, { event: ev }, {}, { pool: pool }).render(true);
    });


    html.find('.item-roll').mousedown(ev => {
      let li = $(event.currentTarget).parents(".item");
      let item = this.actor.items.get(li.data("item-id"));
      new RollForm(this.actor, { event: ev }, {}, { attribute: 'none', skill: 'none', rollType: 'itemRoll', itemDice: item.system.points }).render(true);
    });


    html.find('.item-chat').click(ev => {
      this._displayCard(ev);
    });

    html.find('.item-row').click(ev => {
      const li = $(ev.currentTarget).next();
      li.toggle("fast");
    });

    html.find('.quick-roll').click(ev => {
      let li = $(event.currentTarget).parents(".item");
      new RollForm(this.actor, { event: ev }, {}, { rollId: li.data("item-id"), skipDialog: true }).roll();
    });

    html.find('.saved-roll').click(ev => {
      let li = $(event.currentTarget).parents(".item");
      new RollForm(this.actor, { event: ev }, {}, { rollId: li.data("item-id") }).render(true);
    });

    html.find('.delete-saved-roll').click(ev => {
      let li = $(event.currentTarget).parents(".item");
      var key = li.data("item-id");
      const rollDeleteString = "system.savedRolls.-=" + key;

      let deleteConfirm = new Dialog({
        title: "Delete",
        content: "Delete Saved Roll?",
        buttons: {
          Yes: {
            icon: '<i class="fa fa-check"></i>',
            label: "Delete",
            callback: dlg => {
              this.actor.update({ [rollDeleteString]: null });
              ui.notifications.notify(`Saved Roll Deleted`);
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: "Cancel"
          },
        },
        default: 'Yes'
      });
      deleteConfirm.render(true);
    });

    $(document.getElementById('chat-log')).on('click', '.chat-card', (ev) => {
      const li = $(ev.currentTarget).next();
      li.toggle("fast");
    });

    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    html.find('.rollable').click(this._onRoll.bind(this));

    html.find('.item-wounded').on('click', async (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const itemID = li.data('itemId');
      const item = this.actor.items.get(itemID);
      await this.actor.updateEmbeddedDocuments('Item', [
        {
          _id: itemID,
          system: {
            wounded: !item.system.wounded,
          },
        }
      ]);
    });

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  async helpDialogue() {
    let confirmed = false;
    const template = "systems/storypath-fvtt/templates/dialogues/help-dialogue.html"
    const html = await renderTemplate(template);
    new Dialog({
      title: `Help`,
      content: html,
      buttons: {
        cancel: { label: "Close", callback: () => confirmed = false }
      }
    }).render(true);
  }

  async pickColor(event) {
    event.preventDefault();
    let confirmed = false;
    const actorData = duplicate(this.actor);
    const data = actorData.system;
    const template = "systems/storypath-fvtt/templates/dialogues/color-picker.html"
    const html = await renderTemplate(template, { 'color': data.details.color });
    new Dialog({
      title: `Pick Color`,
      content: html,
      buttons: {
        roll: { label: "Save", callback: () => confirmed = true },
        cancel: { label: "Cancel", callback: () => confirmed = false }
      },
      close: html => {
        if (confirmed) {
          let color = html.find('#color').val();
          if (isColor(color)) {
            data.details.color = color;
            this.actor.update(actorData);
          }
        }
      }
    }).render(true);
  }

  async calculateHealth() {
    let confirmed = false;
    const actorData = duplicate(this.actor);
    const data = actorData.system;
    let template;
    let html;

    if (actorData.type === 'npc') {
      template = "systems/storypath-fvtt/templates/dialogues/calculate-npc-health.html";
      html = await renderTemplate(template, { 'health': data.health.levels });
    }
    else {
      template = "systems/storypath-fvtt/templates/dialogues/calculate-health.html";
      html = await renderTemplate(template, { 'armor': data.health.levels.zero.value, 'bruised': data.health.levels.one.value, 'injured': data.health.levels.two.value, 'maimed': data.health.levels.four.value });
    }
    new Dialog({
      title: `Calculate Health`,
      content: html,
      buttons: {
        roll: { label: "Save", callback: () => confirmed = true },
        cancel: { label: "Cancel", callback: () => confirmed = false }
      },
      close: html => {
        if (confirmed) {
          data.health.bashing = 0;
          data.health.lethal = 0;
          data.health.aggravated = 0;
          if (actorData.type === 'npc') {
            let health = parseInt(html.find('#health').val()) || 0;
            data.health.levels = health;
          }
          else {
            let armor = parseInt(html.find('#armor').val()) || 0;
            let bruised = parseInt(html.find('#bruised').val()) || 0;
            let injured = parseInt(html.find('#injured').val()) || 0;
            let maimed = parseInt(html.find('#maimed').val()) || 0;
            data.health.levels.zero.value = armor;
            data.health.levels.one.value = bruised;
            data.health.levels.two.value = injured;
            data.health.levels.four.value = maimed;
          }
          this.actor.update(actorData);
        }
      }
    }).render(true);
  }

  _onSquareCounterChange(event) {
    event.preventDefault()
    const element = event.currentTarget
    const index = Number(element.dataset.index)
    const oldState = element.dataset.state || ''
    const parent = $(element.parentNode)
    const data = parent[0].dataset
    const states = parseCounterStates(data.states)
    const fields = data.name.split('.')
    const steps = parent.find('.resource-counter-step')
    const fulls = Number(data[states['-']]) || 0
    const halfs = Number(data[states['/']]) || 0
    const crosses = Number(data[states['x']]) || 0

    if (index < 0 || index > steps.length) {
      return
    }

    const allStates = ['', ...Object.keys(states)]
    const currentState = allStates.indexOf(oldState)
    if (currentState < 0) {
      return
    }

    const newState = allStates[(currentState + 1) % allStates.length]
    steps[index].dataset.state = newState

    if ((oldState !== '' && oldState !== '-') || (oldState !== '')) {
      data[states[oldState]] = Number(data[states[oldState]]) - 1
    }

    // If the step was removed we also need to subtract from the maximum.
    if (oldState !== '' && newState === '') {
      data[states['-']] = Number(data[states['-']]) - 1
    }

    if (newState !== '') {
      data[states[newState]] = Number(data[states[newState]]) + Math.max(index + 1 - fulls - halfs - crosses, 1)
    }

    const newValue = Object.values(states).reduce(function (obj, k) {
      obj[k] = Number(data[k]) || 0
      return obj
    }, {})

    this._assignToActorField(fields, newValue)
  }

  _onDotCounterChange(event) {
    event.preventDefault()
    const actorData = duplicate(this.actor)
    const element = event.currentTarget
    const dataset = element.dataset
    const index = Number(dataset.index)
    const parent = $(element.parentNode)
    const fieldStrings = parent[0].dataset.name
    const fields = fieldStrings.split('.')
    const steps = parent.find('.resource-value-step')
    if (index < 0 || index > steps.length) {
      return
    }

    steps.removeClass('active')
    steps.each(function (i) {
      if (i <= index) {
        // $(this).addClass('active')
        $(this).css("background-color", actorData.system.details.color);
      }
    })
    this._assignToActorField(fields, index + 1)
  }

  _onSingleDotCounterChange() {
    event.preventDefault()
    const actorData = duplicate(this.actor)
    const element = event.currentTarget
    const dataset = element.dataset
    const index = Number(dataset.index)
    const parent = $(element.parentNode)
    const fieldStrings = parent[0].dataset.name
    const fields = fieldStrings.split('.')
    const steps = parent.find('.single-resource-value-step')
    if (index < 0 || index > steps.length) {
      return
    }

    steps.removeClass('active')
    steps.each(function (i) {
      if (i == index) {
        // $(this).addClass('active')
        $(this).css("background-color", actorData.system.details.color);
      }
    })
    this._assignToActorField(fields, index + 1)
  }

  _assignToActorField(fields, value) {
    const actorData = duplicate(this.actor)
    // update actor owned items
    if (fields.length === 2 && fields[0] === 'items') {
      for (const i of actorData.items) {
        if (fields[1] === i._id) {
          i.system.points = value
          break
        }
      }
    } else {
      const lastField = fields.pop()
      if (fields.reduce((data, field) => data[field], actorData)[lastField] === 1 && value === 1) {
        fields.reduce((data, field) => data[field], actorData)[lastField] = 0;
      }
      else {
        fields.reduce((data, field) => data[field], actorData)[lastField] = value
      }
    }
    this.actor.update(actorData)
  }

  _onDotCounterEmpty(event) {
    event.preventDefault()
    const actorData = duplicate(this.actor)
    const element = event.currentTarget
    const parent = $(element.parentNode)
    const fieldStrings = parent[0].dataset.name
    const fields = fieldStrings.split('.')
    const steps = parent.find('.resource-value-empty')

    steps.removeClass('active')
    this._assignToActorField(fields, 0)
  }

  _setupDotCounters(html) {
    const actorData = duplicate(this.actor)
    html.find('.resource-value').each(function () {
      const value = Number(this.dataset.value);
      $(this).find('.resource-value-step').each(function (i) {
        if (i + 1 <= value) {
          $(this).addClass('active')
          $(this).css("background-color", actorData.system.details.color);
        }
      })
      $(this).find('.single-resource-value-step').each(function (i) {
        if (i + 1 == value) {
          $(this).addClass('active')
          $(this).css("background-color", actorData.system.details.color);
        }
      })
    })
    html.find('.resource-value-static').each(function () {
      const value = Number(this.dataset.value)
      $(this).find('.resource-value-static-step').each(function (i) {
        if (i + 1 <= value) {
          $(this).addClass('active')
          $(this).css("background-color", actorData.system.details.color);
        }
      })
    })
  }

  _setupSquareCounters(html) {
    html.find('.resource-counter').each(function () {
      const data = this.dataset;
      const states = parseCounterStates(data.states);

      const halfs = Number(data[states['/']]) || 0;
      const crossed = Number(data[states.x]) || 0;
      const stars = Number(data[states['*']]) || 0;

      const values = new Array(halfs + crossed + stars);

      values.fill('/', 0, halfs);
      values.fill('x', halfs, halfs + crossed);
      values.fill('*', halfs + crossed, halfs + crossed + stars);

      $(this).find('.resource-counter-step').each(function () {
        this.dataset.state = ''
        if (this.dataset.index < values.length) {
          this.dataset.state = values[this.dataset.index];
        }
      })
    })
  }

  _toggleAugment(event) {
    event.preventDefault()
    const element = event.currentTarget
    const attribute = element.dataset.name
    const actorData = duplicate(this.actor)
    var augStatus = actorData.system.attributes[attribute].aug;
    actorData.system.attributes[attribute].aug = !augStatus;
    this.actor.update(actorData);
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    event.stopPropagation();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return this.actor.createEmbeddedDocuments("Item", [itemData])
  }

  /**
 * Handle spawning the TraitSelector application which allows a checkbox of multiple trait options
 * @param {Event} event   The click event which originated the selection
 * @private
 */
  _onTraitSelector(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const label = a.parentElement.querySelector("label");
    const choices = CONFIG.storypath[a.dataset.options];
    const options = { name: a.dataset.target, title: label.innerText, choices };
    return new TraitSelector(this.actor, options).render(true)
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.roll) {
      let roll = new Roll(dataset.roll, this.actor.system);
      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label
      });
    }
  }

  /**
* Display the chat card for an Item as a Chat Message
* @param {object} options          Options which configure the display of the item chat card
* @param {string} rollMode         The message visibility mode to apply to the created card
* @param {boolean} createMessage   Whether to automatically create a ChatMessage entity (if true), or only return
*                                  the prepared message data (if false)
*/
  async _displayCard(event) {
    event.preventDefault();
    event.stopPropagation();
    // Render the chat card template
    let li = $(event.currentTarget).parents(".item");
    let item = this.actor.items.get(li.data("item-id"));
    const token = this.actor.token;
    const templateData = {
      actor: this.actor,
      tokenId: token?.uuid || null,
      item: item.data,
      labels: this.labels,
    };
    const html = await renderTemplate("systems/storypath-fvtt/templates/chat/item-card.html", templateData);

    // Create the ChatMessage data object
    const chatData = {
      user: game.user.id,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      content: html,
      speaker: ChatMessage.getSpeaker({ actor: this.actor, token }),
    };


    // Create the Chat Message or return its data
    return ChatMessage.create(chatData);
  }
}


function parseCounterStates(states) {
  return states.split(',').reduce((obj, state) => {
    const [k, v] = state.split(':')
    obj[k] = v
    return obj
  }, {})
}

function isColor(strColor) {
  const s = new Option().style;
  s.color = strColor;
  return s.color !== '';
}
