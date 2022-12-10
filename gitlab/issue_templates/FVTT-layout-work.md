## Layout

- [ ] Create a merge request
- [ ] Ensure each folder is in the right order. Use a  numbered list so it is sorted correctly.  ex: `01 Introduction`
- [ ] Break down each chapter and section into individual HTML files that will turn into corrosponding Journal Entries.
  - Ensure you begin each file with a numbered list so it is sorted correctly.  ex: `01 Credits.html`
- [ ] Attempt to follow the **TOC** in the PDF as best you can to determine layout.
- [ ] Refer to the Style guide found in `styles/guide.md` to property format your HTML
- [ ] Apply floats to align the images to mimic the source text layout, though due to the screen resolution items may need to shift slightly
- [ ] Verify all images reference the full module path since everything is based off the `dataPath`. ex: `modules/swade-core-rules/assets/art/CoolGraphic.webp`
- [ ] Verify all images are in webp format that you reference
- [ ] Remove any images that reference boarders and background graphics as that is handled by CSS
- [ ] Create a `keywords` folder for your section and duplicate any sub sections that should be searchable. ex: break out `Shaken` from `Damage Effects` to ensure a search for `Shaken` returns a result.
  - Make sure these keyword sections link back to the full html section they come from.
  - Ensure each html file has the correct `<article class="">` section wrapping it.
- [ ] Adjust HTML to ensure that all journal entries are well laid out, and mimic source text layout

## Advance the Issue

- [ ] Mark the Merge Request as Ready
- [ ] Assign the Merge Request to a maintainer (The Project Lead)

## Resource

- [HTML Layout for FVTT](https://docs.google.com/document/d/1nG-tXasPuhawms20b0maV5xBZGUGlh12PewXeMxa_j0/edit?usp=sharing)

Fix Bid: $$

/label ~layout
