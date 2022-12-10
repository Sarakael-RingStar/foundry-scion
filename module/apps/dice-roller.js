export class RollForm extends FormApplication {
    constructor(actor, options, object, data) {
        super(object, options);
        this.actor = actor;
        if (data.rollId) {
            this.object = duplicate(this.actor.system.savedRolls[data.rollId]);
            this.object.skipDialog = data.skipDialog || false;
            this.object.isSavedRoll = true;
        }
        else {
            var attirubteFilter = "none";
            this.object.itemDice = data.itemDice || 0;
            this.object.rollType = data.rollType;
            this.object.targetNumber = 8;
            this.object.diceModifier = 0;
            this.object.enhancement = 0;
            this.object.enhancementOnZero = false;
            this.object.difficulty = 0;
            this.object.defenseRoll = false;
            this.object.scale = 0;
    
            this.object.doubleSuccess = 11;
            this.object.doubleSuccesses = false;
            this.object.numberAgain = 10;
            if(data.rollType !== 'base') {
                if(this.actor.type === 'npc') {
                    if (data.pool) {
                        this.object.pool = data.pool;
                    }
                    else {
                        this.object.pool = "primary";
                    }
                }
                else {
                    if (data.skill === "defense") {
                        attirubteFilter = "resistance";
                    }
                    if (data.rollType === 'initiative' && this.actor.type !== "npc") {
                        this.object.attribute = 'cunning';
                    }
                    else {
                        if(data.attribute) {
                            this.object.attribute = data.attribute;
                        }
                        else {
                            this.object.attribute = this._getHighestAttribute(this.actor.system, attirubteFilter);
                        }
                    }
                    if(data.skill) {
                        if (data.skill === "defense") {
                            this.object.skill = "none";
                            this.object.defenseRoll = true;
                        }
                        else if(data.skill === "movement") {
                            this.object.skill = "athletics";
                            this.object.attribute = "might";
                        }
                        else {
                            this.object.skill = data.skill;
                        }
                    }
                    else {
                        this.object.skill = "none";
                    }
                }
                this.object.characterType = this.actor.type;
                if(this.object.characterType === 'scion') {
                    this.object.scionType = this.actor.system.info.tier;
                    if(this.object.scionType === 'demigod') {
                        this.object.targetNumber = 7;
                    }
                }
                else {
                    if(this.actor.system.tier > 1) {
                        this.object.targetNumber = 7;
                    }
                }
            }
            else {
                this.object.dice = 0;
            }
            if(data.rollType) {
                this.object.rollType = data.rollType;
            }
            else {
                this.object.rollType = "skill";
            }
        }
        if(data.rollType !== 'base' && this.object.characterType === 'scion') {
            this.object.specialtyList = this.actor.specialties.filter((specialty) => specialty.system.skill === this.object.skill);
        }
        this.object.divinityDice = this.actor?.system?.divinitydice?.value || 0;
        if(this.object.divinityDice > 0 && this.object.defenseRoll && this.object.numberAgain >= 9) {
            this.object.numberAgain = 9;
        }
        this.object.divinityFailure = true;
      }

      static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
          classes: ["dialog", `${game.settings.get("storypath-fvtt", "sheetStyle")}-background`],
          popOut: true,
          template: "systems/storypath-fvtt/templates/dialogues/skill-roll.html",
          id: "roll-form",
          title: `Roll`,
          width: 350,
          submitOnChange: true,
          closeOnSubmit: false
        });
      }

      _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        // Token Configuration
        if (this.object.rollType !== 'base') {
            const rollButton = {
                label: this.object.id ? game.i18n.localize('STORYPATH.Update') : game.i18n.localize('STORYPATH.Save'),
                class: 'roll-dice',
                icon: 'fas fa-dice-d6',
                onclick: (ev) => {
                    this._saveRoll(this.object);
                },
            };
            buttons = [rollButton, ...buttons];
        }
        return buttons;
    }


      getData() {
        return {
          actor: this.actor,
          data: this.object,
        };
      }

      async roll() {
        if (this.object.skipDialog) {
            await this._roll();
            return true;
        } else {
            var _promiseResolve;
            this.promise = new Promise(function (promiseResolve) {
                _promiseResolve = promiseResolve
            });
            this.resolve = _promiseResolve;
            this.render(true);
            return this.promise;
        }
    }

      async _updateObject(event, formData) {
        mergeObject(this, formData);
      }
      
      activateListeners(html) {
        super.activateListeners(html);

        html.find('#roll-button').click((event) => {
            this._roll();
            this.close();
        });

        html.find('#cancel').click((event) => {
            this.close();
        });

        html.find('.collapsable').click(ev => {
            const li = $(ev.currentTarget).next();
            li.toggle("fast");
        });

        html.on("change", ".update-specialties", ev => {
            this.object.specialtyList = this.actor.specialties.filter((specialty) => specialty.system.skill === this.object.skill);
            this.render();
        });
      }

    _baseSkillDieRoll() {
        let dice = 0;
        if (this.object.rollType === 'base') {
            dice = this.object.dice;
        }
        else {
            if (this.actor.type === 'scion') {
                let attributeDice = 0;
                if(this.object.attribute !== "none") {
                    attributeDice = this.actor.system.attributes[this.object.attribute].value;
                }
                let skillDice = 0;
                if (this.object.rollType == 'itemRoll') {
                    skillDice += this.object.itemDice;
                }

                if (this.object.skill !== "none") {
                    if (this.object.skill === "legend") {
                        skillDice += this.actor.system.legend.total;
                    }
                    else if (this.object.skill === "inheritance") {
                        skillDice += this.actor.system.inheritance.max;
                    }
                    else {
                        skillDice += this.actor.system.skills[this.object.skill].value;
                    }
                }
    
                dice = attributeDice + skillDice;
            }
            else if (this.actor.type === 'npc') {
                let poolDice = 0;
                if (this.object.pool === 'initiative' || this.object.pool === 'threat') {
                    poolDice = this.actor.system[this.object.pool].value;
                }
                else {
                    poolDice = this.actor.system.pools[this.object.pool].value;
                }
                dice = poolDice;
            }
            if (this.actor.type === 'scion' && this.object.specialty) {
                this.object.enhancement++;
            }
            this.object.enhancement += this._addScale();    
        }
    
        if (this.object.diceModifier) {
            dice += this.object.diceModifier;
        }
    
        let roll = new Roll(`${dice}d10x>=${this.object.numberAgain}cs>=${this.object.targetNumber}`).evaluate({ async: false });
        let diceRoll = roll.dice[0].results;
        let getDice = "";
    
        let divinityDiceRolled = 0;

        for (let dice of diceRoll) {
            if (divinityDiceRolled < this.object.divinityDice) {
                if(dice.result >= this.object.targetNumber) {
                    getDice += `<li class="roll die d10 success divinity-success">${dice.result}</li>`;
                    this.object.divinityFailure = false;
                }
                else { getDice += `<li class="roll die d10 divinity-failure">${dice.result}</li>`; }
                divinityDiceRolled++;
            }
            else if (dice.result >= this.object.targetNumber) { getDice += `<li class="roll die d10 success">${dice.result}</li>`; }
            else if (dice.result == 1) { getDice += `<li class="roll die d10 failure">${dice.result}</li>`; }
            else { getDice += `<li class="roll die d10">${dice.result}</li>`; }
        }
    
        let total = roll.total;
        if (this.object.doubleSuccesses) total = total * 2;
        if (this.object.enhancement && (total > 0 || this.object.enhancementOnZero)) total += this.object.enhancement;

        this.object.dice = dice;
        this.object.roll = roll;
        this.object.getDice = getDice;
        this.object.total = total;
    }

    async _roll() {
        this._baseSkillDieRoll();
        let resultString = ``;
        if (this.object.difficulty) {
            if (this.object.total < this.object.difficulty) {
                if(this.object.divinityDice > 0 && this.object.divinityFailure && !this.object.defenseRoll) {
                    resultString = `<h4 class="dice-total">${game.i18n.localize('STORYPATH.Difficulty')}: ${this.object.difficulty}</h4><h4 class="dice-total">${game.i18n.localize('STORYPATH.MortalFailure')}</h4>`;
                }
                else {
                    resultString = `<h4 class="dice-total">${game.i18n.localize('STORYPATH.Difficulty')}: ${this.object.difficulty}</h4><h4 class="dice-total">${game.i18n.localize('STORYPATH.CheckFailed')}</h4>`;
                    for (let dice of this.object.roll.dice[0].results) {
                        if (dice.result === 1 && this.object.total === 0) {
                            resultString = `<h4 class="dice-total">${game.i18n.localize('STORYPATH.Difficulty')}: ${this.object.difficulty}</h4><h4 class="dice-total">${game.i18n.localize('STORYPATH.Botch')}</h4>`;
                        }
                    }
                }
            }
            else {
                const threshholdSuccesses = this.object.total - this.object.difficulty;
                let successString = 'Normal';
                if(this.object.divinityDice > 0 && !this.object.divinityFailure) {
                    successString = 'Catastrophic';
                }
                else if (threshholdSuccesses === 1) {
                    successString = 'Competent';
                }
                else if (threshholdSuccesses === 2) {
                    successString = 'Excellent';
                }
                else if (threshholdSuccesses === 3) {
                    successString = 'Amazing';
                }
                else if (threshholdSuccesses >= 4) {
                    successString = 'Divine';
                }
                resultString = `<h4 class="dice-total">${game.i18n.localize('STORYPATH.Difficulty')}: ${this.object.difficulty}</h4><h4 class="dice-total">${threshholdSuccesses} ${game.i18n.localize('STORYPATH.Threshhold')} ${threshholdSuccesses === 1 ? `${game.i18n.localize('STORYPATH.Success')}` : `${game.i18n.localize('STORYPATH.Successes')}`}</h4><h4 class="dice-total">${successString} ${game.i18n.localize('STORYPATH.Success')}</h4>`;
            }
        }
        let the_content = `
        <div class="chat-card ${game.settings.get("storypath-fvtt", "sheetStyle")}-dice-background">
            <div class="card-content">${game.i18n.localize('STORYPATH.DiceRoll')}</div>
            <div class="card-buttons">
                <div class="flexrow 1">
                    <div>${game.i18n.localize('STORYPATH.DiceRoller')} - ${game.i18n.localize('STORYPATH.NumberofSuccesses')}<div class="dice-roll">
                            <div class="dice-result">
                                <h4 class="dice-formula">${this.object.dice} ${game.i18n.localize('STORYPATH.Dice')} + ${this.object.enhancement} ${game.i18n.localize('STORYPATH.Enhancement')}</h4>
                                <div class="dice-tooltip">
                                    <div class="dice">
                                        <ol class="dice-rolls">${this.object.getDice}</ol>
                                    </div>
                                </div>
                                <h4 class="dice-total">${this.object.total} ${game.i18n.localize('STORYPATH.Successes')}</h4>
                                ${resultString}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        ChatMessage.create({ user: game.user.id, speaker: ChatMessage.getSpeaker({ actor: this.actor }), content: the_content, type: CONST.CHAT_MESSAGE_TYPES.ROLL, roll: this.object.roll });
        if (this.object.rollType === "initiative" || this.object.skill === 'initiative') {
            let combat = game.combat;
            if (combat) {
                let combatant = combat.combatants.find(c => c.actorId == this.actor.id);
                if (combatant) {
                    combat.setInitiative(combatant.id, this.object.total);
                }
            }
        }
    }

    async _saveRoll(rollData) {
        let html = await renderTemplate("systems/storypath-fvtt/templates/dialogues/save-roll.html", { 'name': this.object.name || 'New Roll' });
        new Dialog({
            title: game.i18n.localize('STORYPATH.SaveRoll'),
            content: html,
            default: 'save',
            buttons: {
                save: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Save',
                    default: true,
                    callback: html => {
                        let results = document.getElementById('name').value;
                        let uniqueId = this.object.id || randomID(16);
                        rollData.name = results;
                        rollData.id = uniqueId;
                        rollData.target = null;

                        let updates = {
                            "data.savedRolls": {
                                [uniqueId]: rollData
                            }
                        };
                        this.actor.update(updates);
                        this.saved = true;
                        ui.notifications.notify(`Saved Roll`);
                        return;
                    },
                }
            }
        }).render(true);
    }

    _getHighestAttribute(data, approachFilter) {
        var highestAttributeNumber = 0;
        var highestAttribute;
        for (let [name, attribute] of Object.entries(data.attributes)) {
            if (approachFilter === attribute.approach || approachFilter === "none") {
                if (attribute.value > highestAttributeNumber || highestAttributeNumber === 0) {
                    highestAttributeNumber = attribute.value;
                    highestAttribute = name;
                }
            }
        }
        return highestAttribute;
    }

    _addScale() {
        var numberScale = parseInt(this.object.scale);
        if(numberScale === 6) {
            return 16;
        }
        else if(numberScale === 5) {
            return 12;
        }
        else {
            return numberScale * 2;
        }
    }
}