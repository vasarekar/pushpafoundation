# Pushpa Foundation website

A responsive static website for the Pushpa Foundation. The projects and their
media are loaded from [`data/projects.json`](./data/projects.json); example
stories are explicitly marked as samples and should be replaced with verified
foundation activities before publishing.

## Run locally

The site fetches its project data as JSON, so run it through a local web server
rather than opening `index.html` directly:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

## Add or update a project

Add a project to the `projects` array in `data/projects.json`:

```json
{
  "name": "Project name",
  "date": "Month Year",
  "description": "What the foundation did.",
  "isExample": false,
  "media": [
    {
      "type": "image",
      "src": "https://example.org/photo.jpg",
      "alt": "A description of the photo"
    }
  ]
}
```

For video, use `"type": "video"` and provide a playable video URL as `src`;
an optional `poster` URL is displayed before playback. Multiple media items
can be included and will appear together in the project gallery. Keep
`isExample: true` only for illustrative content. Update the contact email in
`index.html` to an address monitored by the foundation before publishing.
