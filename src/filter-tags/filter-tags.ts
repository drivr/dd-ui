﻿namespace ddui {

    interface Tag {
        id: string;
        name: string;
    }

    class FilterTagsComponent {

        filter: FilterModel;
        onSelect: (fieldName: { fieldName: string }) => {};
        onRemove: (fieldName: { fieldName: string }) => {};
        onRemoveAll: () => {};

        tags: Tag[];

        $onChanges(changesObj: { [property: string]: any }) {
            this.tags = [];
            if (changesObj['filter']) {
                var filter = changesObj['filter'].currentValue;
                if (filter) {
                    this.createFilterTags(filter);
                }
            }
        }

        openTag(tag: Tag) {
            this.onSelect({ fieldName: tag.id });
        }

        removeTag(tag: Tag) {
            this.onRemove({ fieldName: tag.id });
            var index = this.tags.indexOf(tag);
            this.tags.splice(index, 1);
        }

        clearAll() {
            this.onRemoveAll();
            this.tags = [];
        }

        private createFilterTags(filter: FilterModel) {

            var definedFieldsNames = Object.keys(filter)
                .filter(key => {
                    var value = filter[key].value;
                    return angular.isDefined(value) && value !== '' && !filter[key].excludeTag;
                });

            for (let fieldName of definedFieldsNames) {
                var field = filter[fieldName];
                this.tags.push({ id: fieldName, name: this.createTagName(fieldName, field.displayName) });
            }
        }

        private createTagName(fieldName: string, displayName: string): string {
            if (displayName) {
                return displayName;
            }

            var parts = fieldName.split(/(?=[A-Z])/).map(x => x.toLocaleLowerCase());
            var firstWorld = parts[0];
            parts[0] = firstWorld.charAt(0).toLocaleUpperCase() + firstWorld.slice(1, firstWorld.length);

            return parts.join(' ');
        }
    }

    var filterTags: ng.IComponentOptions = {
        templateUrl:  ($element, $attrs) => {
            return $attrs.templateUrl || 'template/filter-tags/filter-tags.html';
        },
        controller: FilterTagsComponent,
        bindings: {
            'filter': '<',
            'onSelect': '&',
            'onRemove': '&',
            'onRemoveAll': '&'
        }
    };

    angular.module('dd.ui.filter-tags', []).component('filterTags', filterTags);
}