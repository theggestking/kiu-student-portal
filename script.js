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

const getFormTitle = form => {
    const titleElement = $("h3", form);

    if (titleElement) return titleElement.textContent.trim();
    if (form.classList.contains("open-day-form")) return "Campus Visit Application";
    if (form.classList.contains("assistant-form")) return "Contact Message";
    if (form.classList.contains("verification-form")) return "Student Verification";

    return "Student Request";
};

const collectFormData = form => {
    const formData = new FormData(form);
    const entries = Object.fromEntries(formData.entries());

    const checkedOptions = $$('input[type="radio"]:checked, input[type="checkbox"]:checked', form)
        .map(input => input.value || "confirmed");

    return {
        ...entries,
        checkedOptions
    };
};

const clearFormErrors = form => {
    $$(".field-error", form).forEach(error => error.remove());
    $$(".has-error", form).forEach(input => input.classList.remove("has-error"));
};

const showFieldError = (input, message) => {
    input.classList.add("has-error");

    const error = document.createElement("small");
    error.className = "field-error";
    error.textContent = message;

    input.insertAdjacentElement("afterend", error);
};

const validateForm = form => {
    clearFormErrors(form);

    const requiredFields = $$("input[required], select[required], textarea[required]", form);
    let isValid = true;

    requiredFields.forEach(field => {
        const value = field.type === "checkbox" ? field.checked : field.value.trim();

        if (!value) {
            showFieldError(field, "This field is required.");
            isValid = false;
        }
    });

    const emailInput = $('input[type="email"]', form);

    if (emailInput && emailInput.value.trim()) {
        const email = emailInput.value.trim();
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!isEmailValid) {
            showFieldError(emailInput, "Please enter a valid email address.");
            isValid = false;
        }
    }

    const phoneInput = $('input[type="tel"]', form);

    if (phoneInput && phoneInput.value.trim()) {
        const phone = phoneInput.value.trim();
        const isPhoneValid = /^[0-9+() -]{6,20}$/.test(phone);

        if (!isPhoneValid) {
            showFieldError(phoneInput, "Please enter a valid phone number.");
            isValid = false;
        }
    }

    return isValid;
};

const getSavedSubmissions = storageKey => readFromStorage(storageKey, []);

const saveSubmission = (storageKey, submission) => {
    const previousSubmissions = getSavedSubmissions(storageKey);

    const updatedSubmissions = [
        submission,
        ...previousSubmissions
    ].slice(0, 5);

    saveToStorage(storageKey, updatedSubmissions);

    return updatedSubmissions;
};

const renderSubmissionHistory = (form, submissions) => {
    if (!form || !submissions.length) return;

    let historyBox = form.parentElement.querySelector(".submission-history");

    if (!historyBox) {
        historyBox = document.createElement("div");
        historyBox.className = "submission-history";
        form.insertAdjacentElement("afterend", historyBox);
    }

    const shortList = submissions.slice(0, 3);

    historyBox.innerHTML = `
    <h4>Recently saved submissions</h4>
    <ul>
      ${shortList.map(({ title, createdAt }) => `
        <li>
          <span>${title}</span>
          <small>${createdAt}</small>
        </li>
      `).join("")}
    </ul>
  `;
};

const runAfterDelay = (callback, delay = 300) => {
    setTimeout(callback, delay);
};

const handleStoredFormSubmit = (form, storageKey) => {
    form.addEventListener("submit", event => {
        event.preventDefault();

        const isValid = validateForm(form);

        if (!isValid) {
            showMessage(form, "Please fix the highlighted fields.", "error");
            return;
        }

        const title = getFormTitle(form);
        const formValues = collectFormData(form);

        const submission = {
            id: crypto.randomUUID ? crypto.randomUUID() : createSlug(title, Date.now()),
            title,
            data: formValues,
            createdAt: new Date().toLocaleString()
        };

        const updatedSubmissions = saveSubmission(storageKey, submission);

        showMessage(form, `${title} was saved locally.`, "success");
        renderSubmissionHistory(form, updatedSubmissions);

        runAfterDelay(() => {
            form.reset();
        });
    });
};

const initStudentVerification = () => {
    const verificationForm = $(".verification-form");
    if (!verificationForm) return;

    verificationForm.addEventListener("submit", event => {
        event.preventDefault();

        const emailInput = $("#login-email", verificationForm);
        const passwordInput = $("#login-password", verificationForm);

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        clearFormErrors(verificationForm);

        if (!email.endsWith("@students.kiu.ac.ge") && !email.endsWith("@kiu.edu.ge")) {
            showFieldError(emailInput, "Use a KIU student or KIU email address.");
            showMessage(verificationForm, "Verification failed. KIU email is required.", "error");
            return;
        }

        if (password.length < 4) {
            showFieldError(passwordInput, "Password must contain at least 4 characters.");
            showMessage(verificationForm, "Verification failed. Password is too short.", "error");
            return;
        }

        sessionStorage.setItem("kiu-services-verified", "true");

        showMessage(
            verificationForm,
            "Verification successful. You can now submit student service requests.",
            "success"
        );
    });
};

const initProjectForms = () => {
    const openDayForm = $(".open-day-form");
    const requestForms = $$(".request-form");
    const assistantForm = $(".assistant-form");

    if (openDayForm) {
        handleStoredFormSubmit(openDayForm, "kiu-open-day-applications");
        renderSubmissionHistory(openDayForm, getSavedSubmissions("kiu-open-day-applications"));
    }

    requestForms.forEach(form => {
        handleStoredFormSubmit(form, "kiu-service-requests");
    });

    if (requestForms[0]) {
        renderSubmissionHistory(requestForms[0], getSavedSubmissions("kiu-service-requests"));
    }

    if (assistantForm) {
        handleStoredFormSubmit(assistantForm, "kiu-contact-messages");
        renderSubmissionHistory(assistantForm, getSavedSubmissions("kiu-contact-messages"));
    }

    initStudentVerification();
};

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initSmoothNavigation();
  initSiteSearch();
  initProgramExplorer();
  initProjectForms();

  console.log("Final project JavaScript loaded successfully.");
});