class Sidebar {
    constructor(/**HTMLElement*/ container, /**GraphPlot*/ graphPlot, /**DataSource*/ dataSource) {
        this.container = container;
        this.graphPlot = graphPlot;
        this.dataSource = dataSource;

        this.yearDisplayEl = container.querySelector(".year-display");
        this.yearSliderEl = container.querySelector(".year-slider");
        this.wholeYearToggleEl = container.querySelector(".whole-year-toggle");

        this.monthControlEl = container.querySelector(".month-control");
        this.monthDisplayEl = container.querySelector(".month-display");
        this.monthSliderEl = container.querySelector(".month-slider");
        this.wholeMonthToggleEl = container.querySelector(".whole-month-toggle");

        this.dayControlEl = container.querySelector(".day-control");
        this.dayDisplayEl = container.querySelector(".day-display");
        this.daySliderEl = container.querySelector(".day-slider");

        const inputEls = [
            this.wholeYearToggleEl,
            this.wholeMonthToggleEl,
            this.yearSliderEl,
            this.monthSliderEl,
            this.daySliderEl
        ];
        const syncView = this.syncView.bind(this);
        for (const el of inputEls) {
            // See https://stackoverflow.com/a/19067260 about input vs change
            el.addEventListener("input", syncView);
        }
        syncView();
    }

    syncView() {
        const data = this.loadViewData();
        this.updateView(data).catch(console.error);
    }

    loadViewData() {
        return {
            wholeYear: this.wholeYearToggleEl.checked,
            wholeMonth: this.wholeMonthToggleEl.checked,
            dateComponents: [
                parseInt(this.yearSliderEl.value),
                parseInt(this.monthSliderEl.value),
                parseInt(this.daySliderEl.value)
            ]
        };
    }

    async updateView({wholeYear, wholeMonth, dateComponents}) {
        hideIf(this.monthControlEl, wholeYear);
        hideIf(this.dayControlEl, wholeYear || wholeMonth);

        const date = new Date(...dateComponents);
        this.yearDisplayEl.textContent = formatYear(date);
        this.monthDisplayEl.textContent = formatMonth(date);
        this.dayDisplayEl.textContent = formatDay(date);

        const minDateComponents = getDateComponents(this.dataSource.minDate);
        const maxDateComponents = getDateComponents(this.dataSource.maxDate);
        const [clampedDate, mins, maxs] = Sidebar.computeBounds(
            dateComponents,
            minDateComponents,
            maxDateComponents
        );

        console.log([dateComponents, clampedDate, mins, maxs]);
        this.updateSliders(mins, "min");
        this.updateSliders(maxs, "max");
        this.updateSliders(clampedDate, "value");

        const [from, to] = Sidebar.getTimeRange(wholeYear, wholeMonth, clampedDate);
        const data = await this.dataSource.load(new Date(...from), new Date(...to));
        this.graphPlot.updateData(data);
    }

    updateSliders([year, month, day], attr) {
        this.yearSliderEl[attr] = year;
        this.monthSliderEl[attr] = month;
        this.daySliderEl[attr] = day;
    }

    static computeBounds(date, minDate, maxDate) {
        const [year, month, _] = date;
        const [minYear, minMonth, minDay] = minDate;
        const [maxYear, maxMonth, maxDay] = maxDate;
        const mins = [
            minYear,
            minYear === year ? minMonth : 0,
            minYear === year && minMonth === month ? minDay : 1
        ];
        const maxs = [
            minYear,
            maxYear === year ? maxMonth : 11,
            maxYear === year && maxMonth === month ? maxDay : daysInMonth(year, month)
        ];
        const clampedDate = d3.zip(date, mins, maxs).map(args => clamp(...args));
        return [clampedDate, mins, maxs];
    }

    static getTimeRange(wholeYear, wholeMonth, [year, month, day]) {
        if (wholeYear) return [[year, 0, 1], [year, 11, daysInMonth(year, 11)]];
        if (wholeMonth) return [[year, month, 1], [year, month + 1, 1]];
        return [[year, month, day], [year, month, day + 1]];
    }
}
