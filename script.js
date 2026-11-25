const projectGrid = document.querySelector("#project-grid");

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  const mediaFrame = document.createElement("div");
  mediaFrame.className = "project-media";

  const mediaItems = Array.isArray(project.media) ? project.media : [];
  for (const media of mediaItems) {
    const item = document.createElement("div");
    item.className = "project-media-item";
    if (media.type === "video") {
      const video = document.createElement("video");
      video.controls = true;
      video.preload = "metadata";
      if (media.poster) video.poster = media.poster;
      const source = document.createElement("source");
      source.src = media.src;
      video.append(source);
      item.append(video);
    } else if (media.type === "image") {
      const image = document.createElement("img");
      image.src = media.src;
      image.alt = media.alt || "";
      image.loading = "lazy";
      item.append(image);
    } else {
      continue;
    }
    mediaFrame.append(item);
  }

  if (mediaFrame.childElementCount === 0) {
    mediaFrame.setAttribute("aria-label", "Project media coming soon");
  }

  const badge = document.createElement("span");
  badge.className = "project-type";
  badge.textContent = project.isExample ? "Illustrative concept" : "Project";
  mediaFrame.append(badge);

  const info = document.createElement("div");
  info.className = "project-info";
  const metadata = document.createElement("div");
  metadata.className = "project-meta";
  const date = document.createElement("span");
  date.textContent = project.date;
  metadata.append(date);

  const title = document.createElement("h3");
  title.textContent = project.name;
  const description = document.createElement("p");
  description.textContent = project.description;
  info.append(metadata, title, description);
  card.append(mediaFrame, info);
  return card;
}

async function loadProjects() {
  try {
    const response = await fetch("./data/projects.json");
    if (!response.ok) {
      throw new Error(`Could not load projects (${response.status}).`);
    }

    const data = await response.json();
    if (!Array.isArray(data.projects)) {
      throw new Error("The project data must include a projects array.");
    }

    if (data.projects.length === 0) {
      projectGrid.innerHTML = "";
      const emptyState = document.createElement("p");
      emptyState.className = "project-status";
      emptyState.textContent = "Project stories are coming soon.";
      projectGrid.append(emptyState);
      return;
    }

    projectGrid.replaceChildren(...data.projects.map(createProjectCard));
  } catch (error) {
    console.error("Unable to display project stories.", error);
    projectGrid.replaceChildren();
    const errorMessage = document.createElement("p");
    errorMessage.className = "project-status";
    errorMessage.textContent = "Project stories could not be loaded. Please try again later.";
    projectGrid.append(errorMessage);
  }
}

document.querySelector("#current-year").textContent = new Date().getFullYear();
loadProjects();
