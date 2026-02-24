# Omaha Dashboard Challenge - Ziggy Asset Management


🚀 See project: [Ziggy Portfolio Insights](https://omaha-insights-ziggy.netlify.app/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/88351e33-dba4-409f-b0aa-7f3fb4f3d3eb/deploy-status)](https://app.netlify.com/projects/omaha-insights-ziggy/deploys)

## Project Overview

**Ziggy Asset Management** manages a portfolio of twenty major companies (including Apple, Amazon, Meta, and Microsoft). The objective of this project is to build a **client-facing dashboard** that provides investors with a clear and insightful view of their portfolio through data visualization.

The final submission must be **production-ready**.


---
---
## 📌 Requirements

<details>
	<summary><strong>1. Functionality</strong></summary>

	- Users must be able to **select exactly 3 graphs** to be displayed on the dashboard.
	- Selection is made from a total list of **6 available graphs**.
</details>

<details>
	<summary><strong>2. Graph Types</strong></summary>

	The six available graphs are divided into two distinct categories:

	- **Spot Metrics (3 graphs):** Must be rendered as **horizontal bar charts**.
	- **Historical Metrics (3 graphs):** Must be rendered as **line charts**.
</details>

<details>
	<summary><strong>3. Data & Tech Stack</strong></summary>

	- **Data Source:** All data is located in the `data.json` file.
	- **Framework:** [Next.js](https://nextjs.org/) (utilizing its full range of features).
	- **Libraries:** You are free to use any UI or charting library of your choice (e.g., Tailwind CSS, Lucide, Recharts, Chart.js, Tremor).
</details>

<details>
	<summary><strong>4. Layout</strong></summary>

	You have complete creative freedom regarding the UI/UX. A suggested layout is a side panel for selection and a main grid for the graphs, but this is not a strict requirement.
</details>

<details>
	<summary><strong>Test Information</strong></summary>

	- **Estimated Time**: This test should take approximately 2 hours, but you're free to take more or less time — we'll discuss it together afterwards.
	- **Going Further:** If you finish early and want to add extra features or improvements, feel free to do so! We're interested in seeing how you approach enhancements.
	- **Support:** If you have any questions during the test, don't hesitate to ask. We're here to help clarify any requirements.
</details>

<details>
	<summary><strong>Disclaimer</strong></summary>

	This technical test is strictly part of a recruitment process. The resulting code will not be used in production, reused internally, or used for any commercial or personal gain.
</details>

---

## 💻 Development & Notes
<details>
    <summary> Run the project </summary>
    <pre>pnpm install</pre>
    <pre>pnpm dev</pre>
</details>

### Project Decisions
#### Estimated to more than 2 hours
- should **understand the domain and provided data** (research)
- should decide what libraries to use for chart requirements
- should brainstorm a cohesive UI/UX based on requirements
- should decide what metrics to use and manipulate data accordingly
- should present **3 charts**, implying knowledge of different chart component signatures
- should be **production** ready (polished client interface + deployment)


#### Thoughts during development
- requirements focus on front-end
- metrics choices: (3 criteria x 2 displays)
	- properties: `RAGR` `economic_profil` `rcr_perc_harm`
	- each displayed either as:
		- `latest` from the dataset to **observe a snapshot**
		- `historical`, aggregating data across all `fiscal_year`

- UI/UX: 
	- Routing to use more Next.js features
	- **Emulation** of data fetching even though data is local
    - Dashboard side panel with descriptions and checkboxes
	- Dashboard main panel with 3 graphs (from selection or placeholder)
	- [DX] 2 chart display types: managed through a mutualized and reusable
	component relying on data and config
    - Contextualize app: adding a coherent landing page and navigation to dashboard
    - Persisting selection in localStorage


**Questions**
- data presents duplicate `companies.name` values such as `Sony`
	- `Are data valid?`
	- proposed solution: display each company entry, even when names are duplicated
	- extra: data remains visually valid, with UX improvement by exposing shared `id` in the tooltip
	- ideally: I would double-check with someone the purpose of duplicates


**What could be improved**

Aknowledging the base estimation described in the instructions,
decisions have been made to have a decent project focused on frontend.

But elements that can be improved:
- list companies to show which companies are involved
- add filter features by company
- cover additional metrics, bound to deeper domain understanding