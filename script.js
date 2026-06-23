// KIU Student Portal - Final Project JavaScript
// This file adds DOM manipulation, event listeners, ES6+ syntax, and localStorage.

"use strict";

const STORAGE_KEYS = {
  theme: "kiu-theme-preference",
  lastSearch: "kiu-last-search",
  programFavorites: "kiu-program-favorites"
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const readFromStorage = (key, fallback = null) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
};

const createSlug = (...parts) =>
  parts
    .join("-")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const showMessage = (targetElement, message, type = "info") => {
  if (!targetElement) return;

  let messageBox = targetElement.querySelector(".js-message");

  if (!messageBox) {
    messageBox = document.createElement("p");
    messageBox.className = "js-message";
    targetElement.appendChild(messageBox);
  }

  messageBox.textContent = message;
  messageBox.dataset.type = type;

  setTimeout(() => {
    messageBox.remove();
  }, 3500);
};

const initThemeToggle = () => {
  const themeToggle = $("#theme-toggle");
  if (!themeToggle) return;

  const savedTheme = readFromStorage(STORAGE_KEYS.theme, "light");

  themeToggle.checked = savedTheme === "dark";

  themeToggle.addEventListener("change", event => {
    const selectedTheme = event.target.checked ? "dark" : "light";
    saveToStorage(STORAGE_KEYS.theme, selectedTheme);
  });
};

const initSmoothNavigation = () => {
  const mobileMenuToggle = $("#mobile-menu-toggle");
  const navLinks = $$('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetSection = $(targetId);

      if (targetSection) {
        event.preventDefault();

        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        if (mobileMenuToggle) {
          mobileMenuToggle.checked = false;
        }
      }
    });
  });
};

const clearSearchHighlights = () => {
  $$(".js-search-highlight").forEach(section => {
    section.classList.remove("js-search-highlight");
  });
};

const initSiteSearch = () => {
  const searchForm = $(".search-form");
  const searchInput = $("#site-search");

  if (!searchForm || !searchInput) return;

  const searchableSections = $$("main section, footer");

  searchForm.addEventListener("submit", event => {
    event.preventDefault();

    const query = searchInput.value.trim().toLowerCase();
    clearSearchHighlights();

    if (!query) {
      showMessage(searchForm, "Please enter a search term.", "warning");
      return;
    }

    saveToStorage(STORAGE_KEYS.lastSearch, query);

    const foundSection = searchableSections.find(section =>
      section.textContent.toLowerCase().includes(query)
    );

    if (!foundSection) {
      showMessage(searchForm, `No results found for "${query}".`, "error");
      return;
    }

    const { id } = foundSection;

    foundSection.classList.add("js-search-highlight");

    foundSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    showMessage(
      searchForm,
      id ? `Found result in #${id}.` : "Found a matching section.",
      "success"
    );
  });
};

const getProgramLevel = card => {
  const contentBlock = card.closest(".program-content");

  if (!contentBlock) return "unknown";
  if (contentBlock.classList.contains("bachelor-content")) return "bachelor";
  if (contentBlock.classList.contains("single-cycle-content")) return "single-cycle";
  if (contentBlock.classList.contains("master-content")) return "master";
  if (contentBlock.classList.contains("doctoral-content")) return "doctoral";

  return "unknown";
};

const getActiveProgramLevel = programsSection => {
  const activeTab = $('input[name="program-level"]:checked', programsSection);
  return activeTab ? activeTab.id.replace("-tab", "") : "bachelor";
};

const initProgramExplorer = () => {
  const programsSection = $("#programs");
  if (!programsSection) return;

  const tabLabels = $(".tab-labels", programsSection);
  const programCards = $$(".program-card", programsSection);
  const levelTabs = $$('input[name="program-level"]', programsSection);

  if (!tabLabels || !programCards.length) return;

  if (!$(".program-tools", programsSection)) {
    tabLabels.insertAdjacentHTML(
      "afterend",
      `
        <div class="program-tools" aria-label="Program filtering tools">
          <div class="program-tool-group">
            <label for="program-filter-search">Search programs</label>
            <input id="program-filter-search" type="search" placeholder="Example: computer, law, design">
          </div>

          <label class="program-favorites-filter">
            <input id="program-favorites-only" type="checkbox">
            Show saved programs only
          </label>

          <p class="program-result-count" aria-live="polite"></p>
        </div>
      `
    );
  }

  let favoritePrograms = readFromStorage(STORAGE_KEYS.programFavorites, []);

  const programs = programCards.map((card, index) => {
    const titleElement = $("h3", card);
    const descriptionElement = $("p", card);
    const degreeElement = $("span", card);

    const title = titleElement?.textContent.trim() || `Program ${index + 1}`;
    const description = descriptionElement?.textContent.trim() || "";
    const degree = degreeElement?.textContent.trim() || "";
    const level = getProgramLevel(card);
    const id = createSlug(level, degree, title);

    const program = {
      id,
      title,
      description,
      degree,
      level,
      element: card
    };

    card.dataset.programId = id;
    card.dataset.programSearch = `${title} ${description} ${degree} ${level}`.toLowerCase();

    if (!$(".program-favorite-btn", card)) {
      card.insertAdjacentHTML(
        "beforeend",
        `
          <button class="program-favorite-btn" type="button" data-program-id="${id}" aria-label="Save ${title}">
            ☆
          </button>
        `
      );
    }

    return program;
  });

  const programSearch = $("#program-filter-search", programsSection);
  const favoritesOnly = $("#program-favorites-only", programsSection);
  const resultCount = $(".program-result-count", programsSection);

  const renderFavoriteButtons = () => {
    const favoriteSet = new Set(favoritePrograms);

    programs.forEach(({ id, element }) => {
      const favoriteButton = $(".program-favorite-btn", element);
      const isFavorite = favoriteSet.has(id);

      if (!favoriteButton) return;

      favoriteButton.textContent = isFavorite ? "★" : "☆";
      favoriteButton.classList.toggle("is-favorite", isFavorite);
      favoriteButton.setAttribute(
        "aria-label",
        isFavorite ? "Remove from saved programs" : "Save this program"
      );
    });
  };

  const applyProgramFilters = () => {
    const query = programSearch.value.trim().toLowerCase();
    const showFavoritesOnly = favoritesOnly.checked;
    const activeLevel = getActiveProgramLevel(programsSection);

    let visibleCount = 0;

    programs.forEach(({ id, level, element }) => {
      const matchesActiveTab = level === activeLevel;
      const matchesSearch = element.dataset.programSearch.includes(query);
      const matchesFavoriteFilter = !showFavoritesOnly || favoritePrograms.includes(id);

      const shouldShow = matchesSearch && matchesFavoriteFilter;

      element.classList.toggle("is-hidden-by-js", !shouldShow);

      if (matchesActiveTab && shouldShow) {
        visibleCount += 1;
      }
    });

    resultCount.textContent = query || showFavoritesOnly
      ? `${visibleCount} matching program${visibleCount === 1 ? "" : "s"} in this tab.`
      : "";
  };

  programsSection.addEventListener("click", event => {
    const favoriteButton = event.target.closest(".program-favorite-btn");
    if (!favoriteButton) return;

    const { programId } = favoriteButton.dataset;

    favoritePrograms = favoritePrograms.includes(programId)
      ? favoritePrograms.filter(id => id !== programId)
      : [...favoritePrograms, programId];

    saveToStorage(STORAGE_KEYS.programFavorites, favoritePrograms);

    renderFavoriteButtons();
    applyProgramFilters();
  });

  programSearch.addEventListener("input", applyProgramFilters);
  favoritesOnly.addEventListener("change", applyProgramFilters);

  levelTabs.forEach(tab => {
    tab.addEventListener("change", applyProgramFilters);
  });

  renderFavoriteButtons();
  applyProgramFilters();
};

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initSmoothNavigation();
  initSiteSearch();
  initProgramExplorer();

  console.log("Final project JavaScript loaded successfully.");
});