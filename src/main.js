import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const remoteUrl = (window.__MENDIX_REMOTE_URL__ || __DEFAULT_MENDIX_REMOTE_URL__).replace(/\/+$/, "");

const metrics = [
    { label: "Open onboarding cases", value: "42", detail: "6 awaiting document validation" },
    { label: "Broker SLA", value: "97.4%", detail: "Above target for the week" },
    { label: "Avg. completion time", value: "1d 4h", detail: "Down 11% month-on-month" },
];

const timeline = [
    "Partner intake batch uploaded from CRM.",
    "Compliance checks prepared for review.",
    "Embedded Mendix workspace ready for manual assessment.",
];

const app = document.getElementById("app");

if (!app) {
    throw new Error("App root not found");
}

app.innerHTML = `
    <div class="page-shell">
        <aside class="sidebar">
            <div>
                <p class="eyebrow">Harborline Partners</p>
                <h1>Partner Enablement</h1>
                <p class="muted sidebar-copy">A framework-free dashboard shell around an embedded Mendix workspace.</p>
            </div>

            <div class="nav-card">
                <span class="nav-label nav-active">Broker onboarding</span>
                <span class="nav-label">Risk checks</span>
                <span class="nav-label">Portfolio migration</span>
            </div>

            <section class="activity-card">
                <h2>Pipeline updates</h2>
                ${timeline.map(item => `<p>${item}</p>`).join("")}
            </section>
        </aside>

        <main class="content">
            <header class="hero-card">
                <div>
                    <p class="eyebrow">Vanilla JS Host Demo</p>
                    <h2>Partner onboarding workspace</h2>
                    <p class="hero-copy lead mb-0">
                        This host page uses plain HTML, CSS, and JavaScript to frame an embedded Mendix workflow in a realistic internal dashboard.
                    </p>
                </div>
                <div class="status-panel">
                    <span class="status-dot"></span>
                    <div>
                        <strong id="runtime-status">Loading embedded Mendix app...</strong>
                        <p class="small mb-0">Expected remote bundle: <code>${remoteUrl}/dist/embedded-index.js</code></p>
                    </div>
                </div>
            </header>

            <section class="metrics-grid" aria-label="Operational metrics">
                ${metrics
                    .map(
                        metric => `
                            <article class="metric-card">
                                <p>${metric.label}</p>
                                <strong>${metric.value}</strong>
                                <span>${metric.detail}</span>
                            </article>
                        `
                    )
                    .join("")}
            </section>

            <section class="workspace-card">
                <div class="workspace-header">
                    <div>
                        <p class="eyebrow">Embedded app region</p>
                        <h3>Mendix workspace</h3>
                    </div>
                    <span class="badge rounded-pill text-bg-primary">Sandbox runtime</span>
                </div>

                <div id="error-banner" class="error-banner d-none" role="alert"></div>

                <div class="embedded-stage">
                    <div id="embedded-mendix-host" class="embedded-host" data-testid="embedded-mendix-host"></div>
                </div>
            </section>
        </main>
    </div>
`;

const runtimeStatus = document.getElementById("runtime-status");
const errorBanner = document.getElementById("error-banner");
const embeddedHost = document.getElementById("embedded-mendix-host");

let unmount = () => undefined;

const setStatus = message => {
    if (runtimeStatus) {
        runtimeStatus.textContent = message;
    }
};

const showError = message => {
    if (!errorBanner) {
        return;
    }

    errorBanner.textContent = message;
    errorBanner.classList.remove("d-none");
};

const clearError = () => {
    if (!errorBanner) {
        return;
    }

    errorBanner.textContent = "";
    errorBanner.classList.add("d-none");
};

const mountEmbeddedApp = async () => {
    try {
        const embeddedModule = await import(`${remoteUrl}/dist/embedded-index.js`);

        document.body.setAttribute("data-demo-theme", "partner-ops");

        unmount = await embeddedModule.render(embeddedHost, {
            remoteUrl: `${remoteUrl}/`,
            minHeight: "620px",
            parameters: {
                Name: "Vanilla JavaScript"
            },
        });

        clearError();
        setStatus("Embedded Mendix app connected");
    } catch (error) {
        console.error(error);
        showError(`Unable to load the embedded Mendix bundle from ${remoteUrl}/dist/embedded-index.js.`);
        setStatus("Waiting for Mendix runtime");
    }
};

window.addEventListener("beforeunload", () => {
    unmount();
});

void mountEmbeddedApp();
