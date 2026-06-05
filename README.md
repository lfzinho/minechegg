# CHEGG

CHEGG is a small browser tactics game inspired by chess movement, Minecraft mobs, mana, and deck-built spawn eggs.

Play it here: https://lfzinho.github.io/minechegg/

Rules reference:
- Original Google Doc: https://docs.google.com/document/d/1TM736HhNsh2nz8l3L-a6PuWAVxbnBSF__NB7qX7Wdlw/edit?tab=t.0
- Local PDF: [CHEGG - Official Rules - How to Play.pdf](CHEGG%20-%20Official%20Rules%20-%20How%20to%20Play.pdf)

## Modes

- **Hot-seat:** two players share one computer and pass the screen between turns.
- **Correspondence:** players exchange opaque CHEGG codes manually, with matches saved in the browser through `localStorage`.

## Development

This is a static site. To run it locally, serve the folder and open `index.html`.

```bash
python -m http.server 4173
```

Then open `http://localhost:4173/`.
