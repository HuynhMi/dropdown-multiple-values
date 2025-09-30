class SelectDropdwon {
    constructor({ selectorWrapper, allOptions = [] }) {
        this.selectorWrapper = selectorWrapper;
        //selector
        this.tagWrapperEl = document.querySelector(
            `${selectorWrapper} .select-tag`
        );

        this.inputEl = document.querySelector(
            `${selectorWrapper} .select-search`
        );

        this.listDropdownEl = document.querySelector(
            `${selectorWrapper} .select-dropdown-list`
        );
        this.removAllEl = document.querySelector(
            `${selectorWrapper} .remove-all`
        );

        //state
        this.allOptions = allOptions;
        this.selected = [];
        this.search = '';
        this.isOpen = false;
        this.searchList = [];
        this.init();
    }

    init() {
        this.fillDropdown();
        this.fillTags();
        this.handleSearch();
        this.handleRemoveAll();
    }

    fillTags() {
        const hasSelected = this.selected.length > 0;
        this.tagWrapperEl.innerHTML = hasSelected
            ? this.selected
                  .map((it) => `<li class="item">${it.label}</li>`)
                  .join(' ')
            : 'Pick your report';
        this.removAllEl.style.display = hasSelected ? 'block' : 'none';
    }

    fillDropdown() {
        const list = this.allOptions.filter((it) => !it.isSelected);
        const isSearching = this.search;
        const list_search = list.filter((it) => it.isSearching);
        const searchResult = isSearching && list_search.length;
        const html = isSearching
            ? searchResult
                ? list_search.map((it) => `<li>${it.label}</li>`).join('')
                : 'No search found'
            : `${
                  list.length > 0
                      ? '<li class="select-all item">Select All</li>'
                      : ''
              }${list.map((it) => `<li>${it.label}</li>`).join('')}`;
        this.listDropdownEl.innerHTML = html;
        this.handlePickItem();
        this.handleSelectAll();
    }

    handleSearch() {
        this.inputEl.addEventListener('input', (e) => {
            this.search = e.target.value;
            const regex = new RegExp(this.search, 'i');
            this.allOptions = this.allOptions.map((it) => ({
                ...it,
                isSearching: it.label.search(regex) > -1,
            }));
            this.fillDropdown();
        });
    }

    handlePickItem() {
        const els = [
            ...this.listDropdownEl.querySelectorAll('li:not(.select-all)'),
        ];
        els.forEach((it) => {
            it.addEventListener('click', (e) => {
                const item_selected = this.allOptions.filter(
                    (it) => it.label == e.target.textContent
                )[0];
                this.selected.push(item_selected);

                this.allOptions = this.allOptions.map((it) =>
                    it.label == e.target.textContent
                        ? { ...it, isSelected: true }
                        : { ...it }
                );

                this.fillTags();
                this.fillDropdown();
            });
        });
    }
    handleRemoveItem() {
        const els = [...this.tagWrapperEl.querySelectorAll('li')];
        els.forEach((it) => {
            it.addEventListener('click', (e) => {
                this.selected = this.selected.filter(
                    (it) => it.label != e.target.textContent
                );
                this.allOptions = this.allOptions.map((it) =>
                    it.label == e.target.textContent
                        ? { ...it, isSelected: false }
                        : { ...it }
                );

                this.fillTags();
                this.fillDropdown();
            });
        });
    }

    handleSelectAll() {
        const el = this.listDropdownEl.querySelector('.select-all');
        if (el) {
            el.addEventListener('click', () => {
                this.selected = this.allOptions;
                this.allOptions = this.allOptions.map((it) => ({
                    ...it,
                    isSelected: true,
                }));
                this.fillDropdown();
                this.fillTags();
            });
        }
    }

    handleRemoveAll() {
        if (this.removAllEl) {
            this.removAllEl.addEventListener('click', () => {
                this.selected = [];
                this.allOptions = this.allOptions.map((it) => ({
                    ...it,
                    isSelected: false,
                }));
                this.fillDropdown();
                this.fillTags();
            });
        }
    }

    getSelected() {
        return this.selected;
    }
}
