# Birthday Quest — Personalized Edition

A romantic, mobile-first, five-chapter birthday mini-quest built for static hosting (GitHub Pages). All scheduled times are **22 November 2026, Jakarta / WIB (UTC+7)**.

## Chapters and release gates
- **00:00** — The Birthday Letter (3 original photos + birthday letter + optional music player)
- **10:00** — The Rose Quest (answer: `5`)
- **13:00** — The Prince's Ride (answers: `Yamaha XSR` or `XSR`; reveals Pakuwon Mall Bekasi)
- **17:00** — The Movie Date (accepts `The Hunger Game` / `The Hunger Games`; reveals map and 3 ticket downloads)
- **22:00** — The Final Chapter (thank-you note and WhatsApp review link)

Chapter access requires the previous chapter's quest to be completed, with the exception of Chapter 1. Navigation chips only show chapters previously visited and currently accessible. Your progress is saved in this browser's local storage.


## Included assets
- `assets/photos/photo1.jpg` — uploaded photo 1
- `assets/photos/photo2.jpg` — uploaded photo 2
- `assets/photos/photo3.jpg` — uploaded photo 3
- `assets/tickets/ticket1.jpg` — uploaded ticket 1
- `assets/tickets/ticket2.jpg` — uploaded ticket 2
- `assets/tickets/ticket3.jpg` — uploaded ticket 3


## Optional soundtrack
The player is user-initiated to comply with browser autoplay restrictions. To use your own licensed/purchased audio file, add it as **`assets/music.mp3`**. The project does not include the copyrighted LANY track.


## Deploy to GitHub Pages
1. Create a repository, e.g. `birthday-quest`.
2. Upload the contents of this folder to the repository root (keep the `assets/` folder).
3. Open **Settings → Pages**.
4. Under Build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for deployment and open the Pages URL.


## Test locally
Run a local static server from this directory, for example:

```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

## Important notes
- Time gates and progress are client-side conveniences, not security controls. A technically savvy visitor can alter browser storage or local time.
- All uploaded photos and ticket images are public once deployed in a public GitHub repository. Do not upload sensitive images or ticket QR/barcodes unless you're comfortable making them publicly accessible. Consider replacing/obscuring barcode and booking details before publishing.
- To reset saved progress, open browser developer tools and run `localStorage.removeItem('birthdayQuest2026')`, then refresh.
- If GitHub Pages is used, every asset in this repository is publicly accessible by URL.
