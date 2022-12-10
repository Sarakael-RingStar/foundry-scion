/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class StorypathActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.system;
    const data = actorData.system;
    const flags = actorData.flags;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'scion') this._prepareCharacterData(actorData);
    if (actorData.type === 'npc') this._prepareNpcData(actorData);
  }

  async _preCreate(createData, options, userId) {
    if (!createData.img) {
      this.updateSource({ img: getDefaultImage(createData.type), token: {img: getDefaultImage(createData.type)} });
    }
    if (createData.items)
      return
    if (createData.type === 'scion') {
      const itemData = [{
        name: "Bruised",
        type: "health",
        img: "icons/svg/regen.svg",
        data: {
          level: 1
        }
      },
      {
        name: "Bruised",
        type: "health",
        img: "icons/svg/regen.svg",
        data: {
          level: 1
        }
      },
      {
        name: "Injured",
        type: "health",
        img: "icons/svg/regen.svg",
        data: {
          level: 2
        }
      },
      {
        name: "Injured",
        type: "health",
        img: "icons/svg/regen.svg",
        data: {
          level: 2
        }
      },
      {
        name: "Maimed",
        type: "health",
        img: "icons/svg/regen.svg",
        data: {
          level: 4
        }
      },
      ];

      this.updateSource({ items: itemData });
    }
  }

  async _preUpdate(updateData, options, user) {
    await super._preUpdate(updateData, options, user)
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    const data = actorData.system;
    let totalHealth = 0;
    let currentPenalty = 0;
    let currentStatus = "Healthy"
    this._prepareBaseActorData(data);
    for (let [key, health_level] of Object.entries(data.health.levels)) {
      if ((data.health.bashing + data.health.lethal + data.health.aggravated) > totalHealth) {
        currentPenalty = health_level.penalty;
        currentStatus = health_level.status;
      }
      totalHealth += health_level.value;
    }
    data.health.total = totalHealth;
    if ((data.health.bashing + data.health.lethal + data.health.aggravated) > data.health.total) {
      data.health.aggravated = data.health.total - data.health.lethal
      if (data.health.aggravated <= 0) {
        data.health.aggravated = 0
        data.health.lethal = data.health.total
      }
    }

    if (actorData.type !== "npc") {
      data.experience.remaining = data.experience.gained - data.experience.spent;
    }
    data.health.penalty = currentPenalty;
    data.health.status = currentStatus;
  }

  _prepareNpcData(actorData) {
    const data = actorData.system;
    this._prepareBaseActorData(data);
    let currentPenalty = 0;
    if ((data.health.lethal + data.health.aggravated) >= Math.floor(data.health.levels / 2)) {
      currentPenalty = 2;
    }
    data.health.penalty = currentPenalty;
  }

  _prepareBaseActorData(data) {
  }
}

function getDefaultImage(type) {
  const defaultImages = {
    'npc': "icons/svg/skull.svg"
  };
  return defaultImages[type] || CONST.DEFAULT_TOKEN;
}
