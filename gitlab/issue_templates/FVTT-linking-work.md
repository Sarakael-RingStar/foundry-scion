## Entity Linking

- [ ] Create a merge request
- [ ] Replace all text to be linked with links from the updated JSONs
  - jsons are located in the `source` folder for easy access
Follow the guidelines to determine what should be linked
    - [ ] Make sure that a link for a single location occurs no more than once in a paragraph (Ex. A paragraph which discusses alternate Grappling rules should only link to the normal rules once)
    - [ ] Double check that a link for a single location occurs at least once in each section (Ex. A link to a prerequisite Hindrance should occur in every Hindrance that references it, even if those Hindrances are only a few lines apart)
    - [ ] Make sure that every entry for the assigned chapter has been reviewed
    - [ ] Remove any page numbers, or book references and instead simply link to that section.  This sometimes requires slight changes to the verbage to flow.
    - [ ] No headers are linked
    - [ ] No stat blocks are linked
    - [ ] If the section has a linked item/actor, ensure the newly linked HTML is added to the description of that item/actor
    - [ ] If the section is a stat block, power list, or item that has a FVTT Item ensure there is a link line taking you to the item/actor
        - example:
        ```html
        <p>@Compendium[deadlands-blooddrive.blooddrive-actors.BadGuy]{See the actor here}.</p>
        ```
    - [ ] For any item/actor validate that the data in the actor is correct based on the source in your entry (stats, damage, items, skills, ect) - make sure to only use our premium content for skills, edges, and hindrances to ensure we have the proper content.
## Advance Issue

- [ ] Mark the Merge Request as Ready
- [ ] Assign the Merge Request to a maintainer (Project Lead)

## Resource

- [Entity Linking for FVTT](https://docs.google.com/document/d/1fcxHhxii3s2A-UW1Dird8Dh9DAcUDwqunnw_p9uOgqY/edit?usp=sharing)

Fix Bid: $$

/label ~linking
