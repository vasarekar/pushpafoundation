const workProjects = document.querySelector("#projects");

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";

  const mediaFrame = document.createElement("div");
  mediaFrame.className = "project-media";
  const mediaGallery = document.createElement("div");
  mediaGallery.className = "project-media-grid";

  const mediaItems = Array.isArray(project.media) ? project.media : [];
  for (const media of mediaItems) {
    const item = document.createElement("figure");
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
    const caption = media.caption || media.alt;
    if (caption) {
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = caption;
      item.append(figcaption);
    }
    mediaGallery.append(item);
  }

  if (mediaGallery.childElementCount === 0) {
    mediaFrame.setAttribute("aria-label", "Project media coming soon");
  }
  mediaFrame.append(mediaGallery);

  const badge = document.createElement("span");
  badge.className = "project-type";
  badge.textContent = project.isExample ? "Illustrative concept" : "Project";
  mediaFrame.append(badge);

  const info = document.createElement("div");
  info.className = "project-info";
  const title = document.createElement("h3");
  title.className = "project-title";
  title.textContent = project.name;
  const description = document.createElement("p");
  description.className = "project-description";
  description.textContent = project.description;
  info.append(title, description);
  card.append(info, mediaFrame);
  return card;
}

async function loadProjects() {
  try {
    const response = await fetch("./data/projects.json");
    if (!response.ok) {
      throw new Error(`Could not load projects (${response.status}).`);
    }

    const data = await response.json();
    if (!Array.isArray(data.goals)) {
      throw new Error("The project data must include a goals array.");
    }

    const goals = data.goals.map((goal) => {
      const section = document.createElement("section");
      section.className = "work-area";

      const heading = document.createElement("div");
      heading.className = "work-area-heading";
      const title = document.createElement("h3");
      title.textContent = goal.name;
      const description = document.createElement("p");
      description.textContent = goal.description;
      heading.append(title, description);
      section.append(heading);

      if (!Array.isArray(goal.projects)) {
        throw new Error(`The "${goal.name}" goal must include a projects array.`);
      }

      if (goal.projects.length > 0) {
        const grid = document.createElement("div");
        grid.className = "project-grid";
        grid.append(...goal.projects.map(createProjectCard));
        section.append(grid);
      }

      return section;
    });

    workProjects.replaceChildren(...goals);
  } catch (error) {
    console.error("Unable to display project stories.", error);
    workProjects.replaceChildren();
    const errorMessage = document.createElement("p");
    errorMessage.className = "project-status";
    errorMessage.textContent = "Project stories could not be loaded. Please try again later.";
    workProjects.append(errorMessage);
  }
}

document.querySelector("#current-year").textContent = new Date().getFullYear();
loadProjects();

const menuButton = document.querySelector(".menu-button");
const mainNav = document.querySelector(".main-nav");
menuButton?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});
mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const name = `${formData.get("first_name")} ${formData.get("last_name")}`.trim();
  const email = formData.get("email");
  const message = formData.get("message");
  const subject = `Website inquiry from ${name}`;
  const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  const mailto = `mailto:contactpushpafoundation@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailto;
  form.querySelector(".form-success").style.display = "block";
});
