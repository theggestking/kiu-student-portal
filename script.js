// KIU Student Portal - Final Project JavaScript
// This file adds DOM manipulation, event listeners, ES6+ syntax, and localStorage.

"use strict";

const STORAGE_KEYS = {
  theme: "kiu-theme-preference",
  lastSearch: "kiu-last-search"
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

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initSmoothNavigation();
  initSiteSearch();

  console.log("Final project JavaScript loaded successfully.");
});