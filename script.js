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
    messageBox.setAttribute("role", type === "error" ? "alert" : "status");
    messageBox.setAttribute("aria-live", type === "error" ? "assertive" : "polite");

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

const SEARCH_RESULT_LABELS = {
    home: "Home",
    about: "About the Portal",
    "about-kiu": "About KIU",
    "campus-life": "Campus Life",
    "campus-weather": "Campus Weather",
    programs: "Academic Programs",
    "open-day": "Campus Visit",
    services: "Student Services",
    events: "Events",
    news: "News",
    gallery: "Video Gallery",
    contact: "Contact Information"
};

const initSiteSearch = () => {
    const searchForm = $(".search-form");
    const searchInput = $("#site-search");

    if (!searchForm || !searchInput) return;

    const searchClearButton = $(".search-clear-button", searchForm);
    const searchableSections = $$("main section, footer");
    const updateSearchClearButton = () => {
        if (searchClearButton) {
            searchClearButton.hidden = !searchInput.value.trim();
        }
    };

    searchInput.addEventListener("input", () => {
        updateSearchClearButton();

        if (!searchInput.value.trim()) {
            clearSearchHighlights();
            $(".js-message", searchForm)?.remove();
        }
    });

    searchClearButton?.addEventListener("click", () => {
        searchInput.value = "";
        searchInput.focus();
        clearSearchHighlights();
        $(".js-message", searchForm)?.remove();
        updateSearchClearButton();
    });

    searchForm.addEventListener("submit", event => {
        event.preventDefault();

        const query = searchInput.value.trim().toLowerCase();
        clearSearchHighlights();

        if (!query) {
            showMessage(searchForm, "Type a word to search the portal.", "warning");
            return;
        }

        saveToStorage(STORAGE_KEYS.lastSearch, query);

        const foundSection = searchableSections.find(section =>
            section.textContent.toLowerCase().includes(query)
        );

        if (!foundSection) {
            showMessage(
                searchForm,
                `No section matches "${query}". Try programs, weather, services, or contact.`,
                "error"
            );
            return;
        }

        const { id } = foundSection;

        foundSection.classList.add("js-search-highlight");

        foundSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        const sectionName = SEARCH_RESULT_LABELS[id] || "a matching section";

        showMessage(
            searchForm,
            `Jumped to ${sectionName}.`,
            "success"
        );
    });

    updateSearchClearButton();
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

const PROGRAM_LEVEL_LABELS = {
    bachelor: "Bachelor",
    "single-cycle": "Single-Cycle",
    master: "Master",
    doctoral: "Doctoral"
};

const getActiveProgramLevel = programsSection => {
    const activeTab = $('input[name="program-level"]:checked', programsSection);
    return activeTab ? activeTab.id.replace("-tab", "") : "bachelor";
};

const getActiveProgramContent = programsSection => {
    const activeLevel = getActiveProgramLevel(programsSection);
    return $(`.${activeLevel}-content`, programsSection);
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
          <div class="program-search-panel">
            <div class="program-tool-group">
              <label for="program-filter-search">Search programs</label>
              <div class="program-search-field">
                <input id="program-filter-search" type="search" placeholder="Try computer science, law, design">
                <button class="program-search-clear-button" type="button" aria-label="Clear program search" hidden>×</button>
              </div>
            </div>
          </div>

          <div class="program-tool-actions">
            <label class="program-favorites-filter">
              <input id="program-favorites-only" type="checkbox">
              <span>Saved only</span>
            </label>

            <p class="program-result-count" aria-live="polite"></p>
          </div>
        </div>
      `
        );
    }

    const programContentBlocks = $$(".program-content", programsSection);

    programContentBlocks.forEach(contentBlock => {
        if ($(".program-empty-state-js", contentBlock)) return;

        contentBlock.insertAdjacentHTML(
            "beforeend",
            `
        <div class="program-empty-state-js" aria-live="polite">
          <h3>No programs found</h3>
          <p>Try another search term or turn off the saved-only filter.</p>
        </div>
      `
        );
    });

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
    const programSearchClearButton = $(".program-search-clear-button", programsSection);
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
        const rawQuery = programSearch.value.trim();
        const query = rawQuery.toLowerCase();
        const showFavoritesOnly = favoritesOnly.checked;
        const activeLevel = getActiveProgramLevel(programsSection);
        const activeLabel = PROGRAM_LEVEL_LABELS[activeLevel] || "this tab";

        if (programSearchClearButton) {
            programSearchClearButton.hidden = !rawQuery;
        }

        let visibleCount = 0;
        let activeTotal = 0;
        let savedInActiveLevel = 0;

        programs.forEach(({ id, level, element }) => {
            const matchesActiveTab = level === activeLevel;
            const matchesSearch = element.dataset.programSearch.includes(query);
            const matchesFavoriteFilter = !showFavoritesOnly || favoritePrograms.includes(id);

            const shouldShow = matchesSearch && matchesFavoriteFilter;

            element.classList.toggle("is-hidden-by-js", !shouldShow);

            if (matchesActiveTab) {
                activeTotal += 1;

                if (favoritePrograms.includes(id)) {
                    savedInActiveLevel += 1;
                }
            }

            if (matchesActiveTab && shouldShow) {
                visibleCount += 1;
            }
        });

        const isFiltering = Boolean(query || showFavoritesOnly);
        const activeContent = getActiveProgramContent(programsSection);
        const activeEmptyState = activeContent
            ? $(".program-empty-state-js", activeContent)
            : null;

        $$(".program-empty-state-js", programsSection).forEach(emptyState => {
            emptyState.classList.remove("is-active");
        });

        $$(".empty-program-state", programsSection).forEach(emptyState => {
            emptyState.classList.toggle("is-hidden-by-js", isFiltering);
        });

        if (activeEmptyState && isFiltering && visibleCount === 0) {
            const emptyTitle = $("h3", activeEmptyState);
            const emptyText = $("p", activeEmptyState);

            if (showFavoritesOnly && !savedInActiveLevel && !query) {
                emptyTitle.textContent = `No saved programs in ${activeLabel} yet`;
                emptyText.textContent = "Use the star on a program card to save it here.";
            } else if (showFavoritesOnly && query) {
                emptyTitle.textContent = `No saved matches for "${rawQuery}"`;
                emptyText.textContent = "Try a different keyword or turn off the saved-only filter.";
            } else {
                emptyTitle.textContent = `No matches for "${rawQuery}"`;
                emptyText.textContent = "Try another keyword such as computer, law, design, or clear the search.";
            }

            activeEmptyState.classList.add("is-active");
        }

        if (showFavoritesOnly && query) {
            resultCount.textContent =
                `Showing ${visibleCount} saved match${visibleCount === 1 ? "" : "es"} in ${activeLabel}.`;
            return;
        }

        if (showFavoritesOnly) {
            resultCount.textContent = visibleCount
                ? `Showing ${visibleCount} saved program${visibleCount === 1 ? "" : "s"} in ${activeLabel}.`
                : `No saved programs in ${activeLabel} yet.`;
            return;
        }

        if (query) {
            resultCount.textContent =
                `Showing ${visibleCount} match${visibleCount === 1 ? "" : "es"} in ${activeLabel}.`;
            return;
        }

        resultCount.textContent = activeTotal
            ? `${activeTotal} program${activeTotal === 1 ? "" : "s"} in ${activeLabel}.`
            : `${activeLabel} details coming soon.`;
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
    programSearchClearButton?.addEventListener("click", () => {
        programSearch.value = "";
        programSearch.focus();
        applyProgramFilters();
    });
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

const copyTextFallback = text =>
    new Promise((resolve, reject) => {
        const temporaryInput = document.createElement("textarea");

        temporaryInput.value = text;
        temporaryInput.setAttribute("readonly", "");
        temporaryInput.style.position = "fixed";
        temporaryInput.style.left = "-9999px";

        document.body.appendChild(temporaryInput);
        temporaryInput.select();

        try {
            const wasCopied = document.execCommand("copy");

            if (wasCopied) {
                resolve();
            } else {
                reject(new Error("Copy command was not successful."));
            }
        } catch (error) {
            reject(error);
        } finally {
            temporaryInput.remove();
        }
    });

const copyTextToClipboard = async text => {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return;
        } catch {
            await copyTextFallback(text);
            return;
        }
    }

    await copyTextFallback(text);
};

const initContactCopy = () => {
    const contactButtons = $$(".copy-contact-button");

    contactButtons.forEach(button => {
        const statusText = $(".contact-copy-text", button);
        const defaultStatus = statusText?.textContent || "Copy";

        button.addEventListener("click", async () => {
            const copyValue = button.dataset.copyValue;
            const copyLabel = button.dataset.copyLabel || "contact information";

            if (!copyValue || !statusText) return;

            button.classList.remove("is-copy-error");
            button.disabled = true;

            try {
                await copyTextToClipboard(copyValue);

                statusText.textContent = "Copied";
                button.classList.add("is-copied");
                button.setAttribute("aria-label", `${copyLabel} copied`);

                setTimeout(() => {
                    statusText.textContent = defaultStatus;
                    button.classList.remove("is-copied");
                    button.removeAttribute("aria-label");
                    button.disabled = false;
                }, 1800);
            } catch (error) {
                statusText.textContent = "Try again";
                button.classList.add("is-copy-error");
                button.disabled = false;
                console.error(error);

                setTimeout(() => {
                    statusText.textContent = defaultStatus;
                    button.classList.remove("is-copy-error");
                }, 2200);
            }
        });
    });
};

const CAMPUS_LOCATION = {
    city: "Kutaisi",
    country: "Georgia",
    latitude: 42.2679,
    longitude: 42.6946
};

const WEATHER_CODE_LABELS = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm"
};

const getWeatherDescription = code =>
    WEATHER_CODE_LABELS[code] || "Weather condition unavailable";

const buildWeatherUrl = ({ latitude, longitude }) => {
    const baseUrl = "https://api.open-meteo.com/v1/forecast";

    const params = new URLSearchParams({
        latitude,
        longitude,
        current: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "weather_code",
            "wind_speed_10m"
        ].join(","),
        timezone: "auto"
    });

    return `${baseUrl}?${params.toString()}`;
};

const fetchCampusWeather = url =>
    new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    reject(new Error("Weather API request failed."));
                    return null;
                }

                return response.json();
            })
            .then(data => {
                if (data) resolve(data);
            })
            .catch(error => reject(error));
    });

const createCampusWeatherTip = (apparentTemperature, callback) => {
    setTimeout(() => {
        if (apparentTemperature >= 30) {
            callback("Campus tip: It feels hot. Carry water before heading across campus.");
            return;
        }

        if (apparentTemperature <= 8) {
            callback("Campus tip: It feels cold. Wear warm clothes before going outside.");
            return;
        }

        callback("Campus tip: Weather looks comfortable for lectures, study breaks, and campus walks.");
    }, 400);
};

const renderCampusWeather = weatherData => {
    const weatherCard = $("#campus-weather-card");
    if (!weatherCard) return;

    const {
        current,
        current_units: units
    } = weatherData;

    const {
        temperature_2m,
        apparent_temperature,
        relative_humidity_2m,
        weather_code,
        wind_speed_10m,
        time
    } = current;

    weatherCard.innerHTML = `
    <div class="weather-main">
      <span class="weather-location">${CAMPUS_LOCATION.city}, ${CAMPUS_LOCATION.country}</span>
      <strong>${Math.round(temperature_2m)}${units.temperature_2m}</strong>
      <p>${getWeatherDescription(weather_code)}</p>
    </div>

    <div class="weather-details">
      <div>
        <span>Feels like</span>
        <strong>${Math.round(apparent_temperature)}${units.apparent_temperature}</strong>
      </div>

      <div>
        <span>Humidity</span>
        <strong>${relative_humidity_2m}${units.relative_humidity_2m}</strong>
      </div>

      <div>
        <span>Wind</span>
        <strong>${wind_speed_10m} ${units.wind_speed_10m}</strong>
      </div>
    </div>

    <p class="weather-time">Last updated: ${new Date(time).toLocaleString()}</p>
    <p class="weather-tip" id="campus-weather-tip">Preparing campus tip...</p>
  `;

    createCampusWeatherTip(apparent_temperature, tip => {
        const tipElement = $("#campus-weather-tip");
        if (tipElement) {
            tipElement.textContent = tip;
        }
    });
};

const renderCampusWeatherError = message => {
    const weatherCard = $("#campus-weather-card");
    if (!weatherCard) return;

    weatherCard.innerHTML = `
    <p class="weather-error">${message}</p>
  `;
};

const loadCampusWeather = async () => {
    const weatherCard = $("#campus-weather-card");
    const refreshButton = $("#weather-refresh-btn");

    if (!weatherCard || !refreshButton) return;

    try {
        refreshButton.disabled = true;
        refreshButton.textContent = "Updating...";

        weatherCard.innerHTML = `
      <p class="weather-loading">Checking the latest campus weather...</p>
    `;

        const apiUrl = buildWeatherUrl(CAMPUS_LOCATION);
        const weatherData = await fetchCampusWeather(apiUrl);

        renderCampusWeather(weatherData);
    } catch (error) {
        renderCampusWeatherError(
            "We could not update the campus weather right now. Please try again in a moment."
        );
        console.error(error);
    } finally {
        refreshButton.disabled = false;
        refreshButton.textContent = "Refresh Weather";
    }
};

const initCampusWeather = () => {
    const refreshButton = $("#weather-refresh-btn");
    if (!refreshButton) return;

    refreshButton.addEventListener("click", loadCampusWeather);
    loadCampusWeather();
};

document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initSmoothNavigation();
    initSiteSearch();
    initProgramExplorer();
    initProjectForms();
    initContactCopy();
    initCampusWeather();

    console.log("Final project JavaScript loaded successfully.");
});
